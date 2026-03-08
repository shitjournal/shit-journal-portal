# 🚽 S.H.I.T. Journal Frontend (S.H.I.T. 社区治理学术期刊)

> "A Decentralized, Anti-Bureaucratic Academic Experiment."
> （一场去中心化、反官僚主义的学术社会实验。）

本项目为 S.H.I.T. 期刊的官方前端交互界面，基于 React 构建。致力于为学术界的“排泄者（创作者）”与“嗅探兽（评审人）”提供一个纯粹的平台。

## ✨ Core Features (核心特性)

* **🪨 The Latrine & The Stone (旱厕与构石)**: 独创的“旱厕”盲评预印本池与“构石”高分沉淀区展示逻辑。
* **🎭 Dual Tag System (双轨信仰)**: 支持 `学术整活 (Hardcore)` 与 `纯享脑洞 (Meme)` 两种纯粹的学术表达。
* **🛡️ Robust Data Sanitization**: 针对历史存量数据（Pandas 脏数据、NaN 幽灵字符串）进行严格的强类型过滤与降级渲染。
* **📊 Editor Dashboard**: 为社区治理者提供极其清爽的预审、退回、强制学科覆写的高级工作台。

## 📘 Frontend Docs

运行方式、Mock API 与真实接口切换、以及本地调试账号说明见 [`doc/FRONTEND_DEVELOPMENT.md`](./doc/FRONTEND_DEVELOPMENT.md)。

前端单元测试、组件测试、`Vitest + React Testing Library + user-event + MSW`、以及 `Cypress Component Testing` 的说明见 [`doc/FRONTEND_TESTING.md`](./doc/FRONTEND_TESTING.md)。
拉取最新 OpenAPI、更新本地 [`openapi.json`](./openapi.json)、以及生成 Mock 覆盖文档的说明见 [`doc/MOCK_API_COVERAGE.md`](./doc/MOCK_API_COVERAGE.md)。
