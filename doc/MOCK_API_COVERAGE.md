# Mock API Coverage

这个文件由 `npm run sync:openapi` 自动生成，用来帮助协作者同时理解两件事：

- 当前项目的 `openapi.json` 是如何从线上 OpenAPI 同步下来的
- 当前 `MSW` mock 对线上接口的覆盖情况如何，还有哪些接口未覆盖

## How To Use

在仓库根目录执行：

```bash
npm run sync:openapi
```

这个命令会执行以下动作：

- 从 `https://api.shitjournal.org/openapi.json` 拉取最新 OpenAPI 规范
- 默认通过代理 `http://127.0.0.1:7897` 发起请求
- 覆盖根目录的 `openapi.json`
- 读取 `src/mocks/handlers.ts`，分析当前 MSW handler
- 重新生成当前文件 `doc/MOCK_API_COVERAGE.md`

## Optional Environment Variables

- `OPENAPI_URL`: 覆盖默认的线上 OpenAPI 地址
- `OPENAPI_PROXY`: 覆盖默认代理，默认值是 `http://127.0.0.1:7897`；如果明确传空字符串，则禁用代理
- `OPENAPI_FETCH_TIMEOUT_MS`: 覆盖请求超时，默认 `20000` 毫秒
- `OPENAPI_SOURCE_FILE`: 从本地文件读取 OpenAPI，而不是走网络。主要用于本地调试脚本，不建议团队日常使用

## Troubleshooting

- 如果命令报 `OpenAPI fetch timed out`，说明接口地址在当前网络环境下响应过慢或不可达，可以先检查网络、代理或后端服务状态后重试
- 如果命令报 `fetch failed`，通常是当前环境无法连到目标域名、TLS 握手失败或请求被拦截
- 如果只是想验证脚本逻辑，可以临时执行 `OPENAPI_SOURCE_FILE=openapi.json node scripts/sync-openapi-and-generate-mock-docs.mjs`

## Generated Metadata

Generated at: `2026-03-08T03:53:07.275Z`
OpenAPI source: `https://api.shitjournal.org/openapi.json`
OpenAPI proxy: `http://127.0.0.1:7897`
Spec title: `S.H.I.T. Journal API`
Spec version: `2.0`

## Summary

- Total OpenAPI operations: 39
- Mocked by MSW: 36
- Missing mock handlers: 3

## Endpoint Coverage

| Status | Method | Path | Tag | Summary | Mock Handler |
| --- | --- | --- | --- | --- | --- |
| mocked | GET | /api/admin/ | Admin | 获取用户反馈列表 | */api/admin/ |
| mocked | DELETE | /api/admin/articles/{article_id} | Admin | 删除(隐藏)文章 | */api/admin/articles/:articleId |
| mocked | GET | /api/admin/articles/{article_id} | Admin | 获取文章详细信息 | */api/admin/articles/:articleId |
| mocked | PUT | /api/admin/articles/{article_id}/review | Admin | 审核文章并更改状态 | */api/admin/articles/:articleId/review |
| mocked | GET | /api/admin/articles/status | Admin | 获取特定状态的文章列表 | */api/admin/articles/status |
| mocked | GET | /api/admin/comments | Admin | 后台查看/管理评论池 | */api/admin/comments |
| mocked | DELETE | /api/admin/comments/{comment_id} | Admin | 屏蔽违规评论 | */api/admin/comments/:commentId |
| mocked | GET | /api/admin/users | Admin | 查看所有注册用户 | */api/admin/users |
| mocked | PUT | /api/admin/users/{user_id}/role | Admin | 修改用户权限角色 | */api/admin/users/:userId/role |
| mocked | GET | /api/articles/ | Articles | 分页获取分区文章列表 | */api/articles/ |
| mocked | DELETE | /api/articles/{article_id} | Articles | 作者软删除文章 | */api/articles/:articleId |
| mocked | GET | /api/articles/{article_id} | Articles | 获取单个文章详情与评论 | */api/articles/:articleId |
| mocked | PUT | /api/articles/{article_id}/file | Articles | 重新上传文章PDF | */api/articles/:articleId/file |
| mocked | PUT | /api/articles/{article_id}/info | Articles | 修改文章信息（仅限打回修改状态） | */api/articles/:articleId/info |
| mocked | POST | /api/articles/{article_id}/report | Articles | 举报违规文章 | */api/articles/:articleId/report |
| mocked | GET | /api/articles/count | Articles | 获取文章总数 | */api/articles/count |
| mocked | POST | /api/articles/upload | Articles | 上传新文章PDF | */api/articles/upload |
| mocked | POST | /api/auth/forgot-password | Authentication | 忘记/重置密码 | */api/auth/forgot-password |
| mocked | POST | /api/auth/login | Authentication | 用户登录获取 Token | */api/auth/login |
| mocked | POST | /api/auth/register | Authentication | 用户注册 | */api/auth/register |
| mocked | POST | /api/auth/send-code | Authentication | 发送邮箱验证码 | */api/auth/send-code |
| mocked | GET | /api/feedback/me | Feedback | 检查当前用户是否已提交反馈 | */api/feedback/me |
| mocked | POST | /api/feedback/submit | Feedback | 提交用户反馈 | */api/feedback/submit |
| mocked | POST | /api/interactions/comment | Interactions | 发表评论 | */api/interactions/comment |
| mocked | POST | /api/interactions/comment/{comment_id}/like | Interactions | 评论点赞/取消点赞 | */api/interactions/comment/:commentId/like |
| mocked | DELETE | /api/interactions/comments/{comment_id} | Interactions | 删除评论 | */api/interactions/comments/:commentId |
| mocked | POST | /api/interactions/comments/{comment_id}/report | Interactions | 举报评论 | */api/interactions/comments/:commentId/report |
| mocked | POST | /api/interactions/rate | Interactions | 文章打分 | */api/interactions/rate |
| mocked | GET | /api/maintainance/ | Maintainance | 获取系统维护状态 | */api/maintainance/ |
| mocked | GET | /api/notifications/ | Notifications | 获取我的通知列表 | */api/notifications/ |
| mocked | PUT | /api/notifications/{notif_id}/read | Notifications | 单条标记为已读 | */api/notifications/:notificationId/read |
| mocked | PUT | /api/notifications/read-all | Notifications | 全部标记为已读 | */api/notifications/read-all |
| mocked | GET | /api/notifications/unread-count | Notifications | 获取未读消息总数 | */api/notifications/unread-count |
| missing | GET | /api/search/article | Search | 全局综合搜索 | - |
| missing | GET | /api/health | System | Health Check | - |
| missing | POST | /api/users/badges/batch | Users | 批量查询用户徽章状态 | - |
| mocked | GET | /api/users/me | Users | 获取当前登录用户资料与徽章 | */api/users/me |
| mocked | PUT | /api/users/me | Users | 修改个人资料 | */api/users/me |
| mocked | GET | /api/users/me/articles | Users | 获取我投稿的所有文章 | */api/users/me/articles |

## Missing Mock Handlers

| Method | Path | Tag | Summary |
| --- | --- | --- | --- |
| GET | /api/search/article | Search | 全局综合搜索 |
| GET | /api/health | System | Health Check |
| POST | /api/users/badges/batch | Users | 批量查询用户徽章状态 |

