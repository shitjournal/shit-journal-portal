# 前端真实接口联调修复记录（2026-03-09）

本文档记录 2026-03-09 围绕“切换真实接口后联调异常”的前端修复，重点覆盖作者仪表盘与搜索页两个受影响区域。

## 1. 本次修复范围

本轮修复包含以下问题：

- 本地开发环境仍在使用 `MSW`，未真正联调线上接口
- 搜索页请求真实接口时，`limit` 超过后端允许上限，返回 `422`
- 仪表盘“我的评价”在真实接口下无法正常显示
- 本地 `MSW` 与真实接口在文章列表字段上存在差异，容易掩盖联调问题

## 2. 真实接口切换

本地联调已改为默认走真实接口：

- 本地 `.env.local` 改为 `VITE_ENABLE_MSW=false`
- `VITE_API_BASE_URL` 仍指向 `https://api.shitjournal.org`

说明：

- 该环境文件通常不提交到仓库，但本次联调过程中已按真实接口模式验证本地行为
- 若后续需要切回 Mock，只需把 `VITE_ENABLE_MSW` 再改回 `true`

## 3. 搜索页修复

### 3.1 问题原因

搜索页原先为了前端分页体验，固定以较大的抓取上限请求搜索接口；但真实后端的 `/api/search/article` 对 `limit` 有严格校验，上限为 `30`。因此切到真实接口后，会直接报：

- `Input should be less than or equal to 30`

### 3.2 修复内容

- 在搜索模块中增加统一常量 `SEARCH_API_MAX_LIMIT = 30`
- 搜索页改为使用该常量，不再直接请求 `100`
- API 层对搜索请求增加 clamp 逻辑，即使其他页面错误传入更大的 `limit`，也会自动收敛到后端允许范围

涉及文件：

- `src/lib/search.ts`
- `src/lib/api.ts`
- `src/pages/SearchPage.tsx`

### 3.3 回归测试

新增搜索页回归测试，模拟真实后端在 `limit > 30` 时返回 `422`，确保前端不会再触发该错误。

涉及文件：

- `src/pages/SearchPage.test.tsx`

## 4. 仪表盘“我的评价”修复

### 4.1 问题原因

“我的评价”并非简单的请求失败，而是**真实接口返回结构与前端此前只兼容的 mock 结构不一致**。

此前前端主要只兼容以下几类列表响应键：

- `data`
- `items`
- `articles`

但真实接口可能返回：

- `ratings`
- `rated_articles`
- `results`
- 或者每条记录为 `{ article: {...}, score, created_at }` 这种带嵌套文章对象的形态

在这种情况下，前端会把接口结果错误地解读为空数组，于是页面直接落入：

- `No rated articles yet. / 还没有评价过文章`

### 4.2 修复内容

在 API 层新增“我的评价”响应标准化逻辑：

- 兼容 `ratings`、`rated_articles`、`results` 等多种根键
- 兼容嵌套结构中的 `article`、`paper`、`manuscript`、`preprint` 等常见字段
- 从 `score` / `my_score` 中统一提取用户评分
- 从 `created_at` / `rated_at` / `updated_at` 中统一提取评价时间

同时保留之前的兜底能力：

- 若 `/api/users/me/ratings` 缺失或返回 `404/405`，仍可退回到公开分区列表，按 `my_score` 聚合用户已评价文章

此外，对仪表盘页补充了显式错误态，避免接口异常时静默显示空白结果。

涉及文件：

- `src/lib/api.ts`
- `src/pages/dashboard/AuthorDashboard.tsx`

### 4.3 回归测试

围绕“我的评价”补充了两类回归测试：

- 当 `/api/users/me/ratings` 不存在时，能回退到公开文章列表聚合显示
- 当接口返回 `ratings: [{ article, score }]` 这类真实包装结构时，仍能正常展示评价列表

涉及文件：

- `src/pages/dashboard/AuthorDashboard.test.tsx`

## 5. Mock 对齐修复

为了避免本地 Mock 再次掩盖真实接口问题，对 `MSW` 的文章列表 mock 做了同步修正：

- `/api/articles/` 在已登录状态下也会返回当前用户的 `my_score`

这样本地组件测试和真实后端在关键字段上更一致。

涉及文件：

- `src/mocks/handlers.ts`

## 6. 验证结果

已完成以下验证：

- `npm run test:unit:run -- src/pages/SearchPage.test.tsx`
- `npm run test:unit:run -- src/pages/dashboard/AuthorDashboard.test.tsx`
- `npm run test:unit:run`
- `npm run build`

当前结果：

- 单元测试全部通过
- 构建通过

## 7. 结论

本轮问题的本质不是单点 bug，而是 **Mock 结构、真实接口结构、前端解包逻辑三者不一致** 导致的联调偏差。

修复后：

- 搜索页已兼容真实后端的 `limit` 约束
- 仪表盘“我的评价”已兼容真实接口常见返回结构
- Mock 与真实接口关键字段差异已收敛

如果后续后端再稳定发布收藏接口，建议按同样方式补齐“我的收藏”的真实响应兼容层与回归测试。
