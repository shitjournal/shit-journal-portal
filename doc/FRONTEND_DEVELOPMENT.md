# Frontend Development Guide

## Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

默认会启动 Vite 本地开发环境。构建和预览命令：

```bash
npm run build
npm run preview
```

同步线上 OpenAPI 并生成 mock 覆盖文档：

```bash
npm run sync:openapi
```

这个命令会：

* 从 `https://api.shitjournal.org/openapi.json` 拉取最新接口定义并覆盖根目录 [`openapi.json`](/Users/bukolosier/Desktop/github/shit-journal-portal/openapi.json)
* 基于 [`src/mocks/handlers.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/mocks/handlers.ts) 生成 mock 覆盖文档 [`doc/MOCK_API_COVERAGE.md`](/Users/bukolosier/Desktop/github/shit-journal-portal/doc/MOCK_API_COVERAGE.md)

## API Environment Switching

本项目现在支持两种接口模式：

* **Mock API**: 由 `MSW` 在浏览器中拦截请求，适合前期前端开发、联调、演示。
* **Real API**: 直接请求真实后端，适合后期测试环境联调和接入正式服务。

核心环境变量：

* `VITE_API_BASE_URL`: 真实接口基础地址
* `VITE_ENABLE_MSW`: 是否启用 MSW mock，`true` 表示启用，`false` 表示关闭

示例配置见 [`.env.example`](/Users/bukolosier/Desktop/github/shit-journal-portal/.env.example)：

```env
VITE_API_BASE_URL=https://api.shitjournal.org
VITE_ENABLE_MSW=false
```

### Use Mock API

在项目根目录创建或修改 `.env.local`：

```env
VITE_API_BASE_URL=https://api.shitjournal.org
VITE_ENABLE_MSW=true
```

然后重新启动开发服务器：

```bash
npm run dev
```

启用后，前端请求会被 [`public/mockServiceWorker.js`](/Users/bukolosier/Desktop/github/shit-journal-portal/public/mockServiceWorker.js) 和 [`src/mocks/handlers.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/mocks/handlers.ts) 接管，不会真正打到线上 API。

### Use Real API / Test API

关闭 MSW，并把 `VITE_API_BASE_URL` 指向你要连接的环境：

```env
VITE_API_BASE_URL=https://api.shitjournal.org
VITE_ENABLE_MSW=false
```

如果你有独立测试环境，可以改成：

```env
VITE_API_BASE_URL=https://your-test-api.example.com
VITE_ENABLE_MSW=false
```

修改后同样需要重启 `npm run dev`。

## Mock Environment Notes

Mock 数据定义在：

* [`src/mocks/data.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/mocks/data.ts)
* [`src/mocks/handlers.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/mocks/handlers.ts)

当前 mock 已覆盖的主要场景：

* 登录 / 注册 / 忘记密码
* 当前用户信息
* 我的投稿列表
* Preprint 列表与详情
* 评论、点赞、举报
* 通知列表与未读数
* 投稿上传
* 编辑审核台
* 管理员用户管理、反馈、恢复操作

Mock 登录账号：

* `bukolosier@gmail.com` / `mock123456`
* `editor@shitjournal.org` / `mock123456`
* `admin@shitjournal.org` / `mock123456`
* `author@shitjournal.org` / `mock123456`

## Testing

本项目当前的测试分层如下：

* `Vitest + React Testing Library + user-event + MSW`
  用于快速本地单元/组件测试，重点验证交互逻辑、渲染状态、路由跳转和 API mock 行为。
* `Cypress Component Testing`
  用于真实浏览器中的组件验证，重点覆盖浏览器敏感交互，不重复承担全部 API/mock 联调职责。

可用命令：

```bash
npm run test
npm run test:unit
npm run test:unit:run
npm run test:ct
npm run test:ct:run
```

说明：

* `test` 等同于 `test:unit:run`
* `test:unit` 启动 Vitest watch
* `test:unit:run` 执行一次 Vitest
* `test:ct` 打开 Cypress Component Testing 交互界面
* `test:ct:run` 以 headless 方式执行 Cypress Component Testing

关键文件：

* [`vite.config.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/vite.config.ts)
* [`src/test/setup.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/test/setup.ts)
* [`src/test/renderWithProviders.tsx`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/test/renderWithProviders.tsx)
* [`src/mocks/node.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/mocks/node.ts)
* [`cypress.config.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/cypress.config.ts)
* [`cypress/support/component.tsx`](/Users/bukolosier/Desktop/github/shit-journal-portal/cypress/support/component.tsx)

## Notes

* `.env.local` 适合本地开发使用，通常不提交到 Git。
* MSW 只在开发环境且 `VITE_ENABLE_MSW=true` 时启用。
* 当前项目的前端构建 `npm run build` 可通过；如果执行 `npx tsc --noEmit`，仍会看到 `supabase/functions` 下与 `Deno` 类型相关的历史报错，这和前端 mock/真实接口切换无关。
