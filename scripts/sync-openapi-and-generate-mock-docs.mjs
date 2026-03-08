import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProxyAgent } from 'undici';

/**
 * OpenAPI 同步与 Mock 覆盖文档生成脚本。
 *
 * 主要职责：
 * 1. 从线上 OpenAPI 地址拉取最新接口规范，默认走本地代理 `http://127.0.0.1:7897`
 * 2. 覆盖仓库根目录的 `openapi.json`
 * 3. 读取 `src/mocks/handlers.ts` 中现有的 MSW handlers
 * 4. 对比 OpenAPI 接口与 mock 覆盖情况
 * 5. 生成 `doc/MOCK_API_COVERAGE.md`，供协作者快速了解脚本用途和当前 mock 缺口
 *
 * 常用命令：
 * - `npm run sync:openapi`
 *
 * 可选环境变量：
 * - `OPENAPI_URL`：覆盖默认 OpenAPI 地址
 * - `OPENAPI_PROXY`：覆盖默认代理；传空字符串可禁用代理
 * - `OPENAPI_FETCH_TIMEOUT_MS`：覆盖请求超时
 * - `OPENAPI_SOURCE_FILE`：从本地文件读取 OpenAPI，方便调试脚本
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const OPENAPI_URL = process.env.OPENAPI_URL?.trim() || 'https://api.shitjournal.org/openapi.json';
const OPENAPI_SOURCE_FILE = process.env.OPENAPI_SOURCE_FILE?.trim();
const DEFAULT_OPENAPI_PROXY = 'http://127.0.0.1:7897';
const OPENAPI_PROXY = process.env.OPENAPI_PROXY === ''
  ? ''
  : process.env.OPENAPI_PROXY?.trim() || DEFAULT_OPENAPI_PROXY;
const OPENAPI_PATH = path.join(rootDir, 'openapi.json');
const HANDLERS_PATH = path.join(rootDir, 'src', 'mocks', 'handlers.ts');
const DOCS_DIR = path.join(rootDir, 'doc');
const MOCK_DOC_PATH = path.join(DOCS_DIR, 'MOCK_API_COVERAGE.md');
const FETCH_TIMEOUT_MS = Number(process.env.OPENAPI_FETCH_TIMEOUT_MS || 20000);

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

/**
 * 读取 OpenAPI 规范。
 *
 * 优先级：
 * 1. 如果配置了 `OPENAPI_SOURCE_FILE`，直接从本地文件读取
 * 2. 否则从线上地址拉取，并按配置决定是否通过代理访问
 */
async function fetchOpenApiSpec() {
  if (OPENAPI_SOURCE_FILE) {
    const sourcePath = path.resolve(rootDir, OPENAPI_SOURCE_FILE);
    const contents = await readFile(sourcePath, 'utf8');
    return JSON.parse(contents);
  }

  const proxyAgent = OPENAPI_PROXY ? new ProxyAgent(OPENAPI_PROXY) : undefined;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAPI_URL, {
      headers: {
        Accept: 'application/json',
      },
      dispatcher: proxyAgent,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`OpenAPI fetch failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`OpenAPI fetch timed out after ${FETCH_TIMEOUT_MS}ms`);
    }
    if (error instanceof Error && OPENAPI_PROXY) {
      throw new Error(`OpenAPI fetch failed via proxy ${OPENAPI_PROXY}: ${error.message}`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    await proxyAgent?.close();
  }
}

/**
 * 统一标准化接口路径，减少 OpenAPI 与 MSW 写法差异带来的比较误差。
 *
 * 例如：
 * - 通配前缀路径如 `* /api/articles/:articleId` 会被标准化成 `/api/articles/{articleId}`
 * - `https://host/api/articles/1` -> `/api/articles/1`
 */
function normalizePath(pathname) {
  if (!pathname) return '/';

  let normalized = pathname.trim();

  if (normalized.startsWith('*/')) {
    normalized = normalized.slice(1);
  } else if (/^https?:\/\//.test(normalized)) {
    normalized = new URL(normalized).pathname;
  }

  normalized = normalized.replace(/:([A-Za-z0-9_]+)/g, '{$1}');

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  normalized = normalized.replace(/\/{2,}/g, '/');

  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

/**
 * 为同一条路径生成可比较的变体集合。
 *
 * 主要解决尾部斜杠差异，例如：
 * - `/api/articles`
 * - `/api/articles/`
 */
function createPathVariants(pathname) {
  const normalized = normalizePath(pathname);
  return new Set(
    normalized === '/'
      ? ['/']
      : [normalized, `${normalized}/`].map(item => item.replace(/\/{2,}/g, '/')),
  );
}

/**
 * 生成路径签名，把动态参数名抹平，只保留路径结构。
 *
 * 这样可以让：
 * - `/api/articles/{article_id}`
 * - `/api/articles/{articleId}`
 * - `/api/articles/:articleId`
 *
 * 最终都落到同一种结构上进行比对。
 */
function createPathSignature(pathname) {
  return normalizePath(pathname).replace(/\{[^/]+\}/g, '{}');
}

/**
 * 从 `src/mocks/handlers.ts` 中提取所有 MSW handler 的方法和路径信息。
 */
function parseMockHandlers(handlersSource) {
  const matcher = /http\.(get|post|put|patch|delete|options|head)\(\s*'([^']+)'/g;
  const handlers = [];

  for (const match of handlersSource.matchAll(matcher)) {
    const method = match[1].toUpperCase();
    const rawPath = match[2];
    handlers.push({
      method,
      rawPath,
      normalizedPath: normalizePath(rawPath),
      signature: createPathSignature(rawPath),
    });
  }

  return handlers;
}

/**
 * 用 OpenAPI 规范逐条对比 mock handlers，生成接口覆盖结果。
 */
function buildCoverage(spec, mockHandlers) {
  const operations = [];

  for (const [openApiPath, pathItem] of Object.entries(spec.paths || {})) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem?.[method];
      if (!operation) continue;

      const normalizedOpenApiPath = normalizePath(openApiPath);
      const signatures = new Set(
        [...createPathVariants(normalizedOpenApiPath)].map(createPathSignature),
      );
      const matchedHandler = mockHandlers.find(handler =>
        handler.method === method.toUpperCase() && signatures.has(handler.signature),
      );

      operations.push({
        tag: operation.tags?.[0] || 'Untagged',
        summary: operation.summary || operation.operationId || '(no summary)',
        method: method.toUpperCase(),
        openApiPath,
        normalizedOpenApiPath,
        operationId: operation.operationId || '',
        mocked: Boolean(matchedHandler),
        mockPath: matchedHandler?.rawPath || '',
      });
    }
  }

  return operations.sort((left, right) => {
    if (left.tag !== right.tag) return left.tag.localeCompare(right.tag);
    if (left.openApiPath !== right.openApiPath) return left.openApiPath.localeCompare(right.openApiPath);
    return left.method.localeCompare(right.method);
  });
}

/**
 * 处理 Markdown 表格中的特殊字符，避免破坏表格结构。
 */
function escapeTableCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

/**
 * 根据覆盖结果生成最终的 Markdown 文档内容。
 *
 * 文档包含三部分：
 * 1. 协作者使用说明
 * 2. 本次生成的元数据
 * 3. 接口覆盖总览与缺失清单
 */
function buildMarkdown(spec, operations) {
  const total = operations.length;
  const mocked = operations.filter(operation => operation.mocked).length;
  const uncovered = total - mocked;
  const generatedAt = new Date().toISOString();

  const lines = [
    '# Mock API Coverage',
    '',
    '这个文件由 `npm run sync:openapi` 自动生成，用来帮助协作者同时理解两件事：',
    '',
    '- 当前项目的 `openapi.json` 是如何从线上 OpenAPI 同步下来的',
    '- 当前 `MSW` mock 对线上接口的覆盖情况如何，还有哪些接口未覆盖',
    '',
    '## How To Use',
    '',
    '在仓库根目录执行：',
    '',
    '```bash',
    'npm run sync:openapi',
    '```',
    '',
    '这个命令会执行以下动作：',
    '',
    `- 从 \`${OPENAPI_URL}\` 拉取最新 OpenAPI 规范`,
    `- 默认通过代理 \`${OPENAPI_PROXY || '(disabled)'}\` 发起请求`,
    `- 覆盖根目录的 \`openapi.json\``,
    `- 读取 \`src/mocks/handlers.ts\`，分析当前 MSW handler`,
    `- 重新生成当前文件 \`doc/MOCK_API_COVERAGE.md\``,
    '',
    '## Optional Environment Variables',
    '',
    '- `OPENAPI_URL`: 覆盖默认的线上 OpenAPI 地址',
    `- \`OPENAPI_PROXY\`: 覆盖默认代理，默认值是 \`${DEFAULT_OPENAPI_PROXY}\`；如果明确传空字符串，则禁用代理`,
    '- `OPENAPI_FETCH_TIMEOUT_MS`: 覆盖请求超时，默认 `20000` 毫秒',
    '- `OPENAPI_SOURCE_FILE`: 从本地文件读取 OpenAPI，而不是走网络。主要用于本地调试脚本，不建议团队日常使用',
    '',
    '## Troubleshooting',
    '',
    '- 如果命令报 `OpenAPI fetch timed out`，说明接口地址在当前网络环境下响应过慢或不可达，可以先检查网络、代理或后端服务状态后重试',
    '- 如果命令报 `fetch failed`，通常是当前环境无法连到目标域名、TLS 握手失败或请求被拦截',
    '- 如果只是想验证脚本逻辑，可以临时执行 `OPENAPI_SOURCE_FILE=openapi.json node scripts/sync-openapi-and-generate-mock-docs.mjs`',
    '',
    '## Generated Metadata',
    '',
    `Generated at: \`${generatedAt}\``,
    `OpenAPI source: \`${OPENAPI_SOURCE_FILE || OPENAPI_URL}\``,
    `OpenAPI proxy: \`${OPENAPI_PROXY || '(disabled)'}\``,
    `Spec title: \`${spec.info?.title || 'Unknown API'}\``,
    `Spec version: \`${spec.info?.version || 'unknown'}\``,
    '',
    '## Summary',
    '',
    `- Total OpenAPI operations: ${total}`,
    `- Mocked by MSW: ${mocked}`,
    `- Missing mock handlers: ${uncovered}`,
    '',
    '## Endpoint Coverage',
    '',
    '| Status | Method | Path | Tag | Summary | Mock Handler |',
    '| --- | --- | --- | --- | --- | --- |',
  ];

  for (const operation of operations) {
    lines.push(
      `| ${operation.mocked ? 'mocked' : 'missing'} | ${operation.method} | ${escapeTableCell(operation.openApiPath)} | ${escapeTableCell(operation.tag)} | ${escapeTableCell(operation.summary)} | ${escapeTableCell(operation.mockPath || '-')} |`,
    );
  }

  const missingOperations = operations.filter(operation => !operation.mocked);
  lines.push('', '## Missing Mock Handlers', '');

  if (missingOperations.length === 0) {
    lines.push('All OpenAPI operations currently have matching MSW handlers.');
  } else {
    lines.push('| Method | Path | Tag | Summary |');
    lines.push('| --- | --- | --- | --- |');
    for (const operation of missingOperations) {
      lines.push(
        `| ${operation.method} | ${escapeTableCell(operation.openApiPath)} | ${escapeTableCell(operation.tag)} | ${escapeTableCell(operation.summary)} |`,
      );
    }
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}

/**
 * 主流程入口：
 * 1. 拉取或读取 OpenAPI
 * 2. 解析现有 mock handlers
 * 3. 计算覆盖率
 * 4. 写入 `openapi.json` 和 `doc/MOCK_API_COVERAGE.md`
 */
async function main() {
  const spec = await fetchOpenApiSpec();
  const handlersSource = await readFile(HANDLERS_PATH, 'utf8');
  const mockHandlers = parseMockHandlers(handlersSource);
  const operations = buildCoverage(spec, mockHandlers);
  const markdown = buildMarkdown(spec, operations);

  await mkdir(DOCS_DIR, { recursive: true });
  await writeFile(OPENAPI_PATH, `${JSON.stringify(spec, null, 2)}\n`, 'utf8');
  await writeFile(MOCK_DOC_PATH, markdown, 'utf8');

  const mocked = operations.filter(operation => operation.mocked).length;
  const uncovered = operations.length - mocked;

  console.log(`Synced openapi.json from ${OPENAPI_SOURCE_FILE || OPENAPI_URL}`);
  console.log(`Generated ${path.relative(rootDir, MOCK_DOC_PATH)}`);
  console.log(`Coverage: ${mocked}/${operations.length} operations mocked, ${uncovered} missing`);
}

/**
 * 统一处理脚本执行期异常，并以非零退出码结束进程。
 */
main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
