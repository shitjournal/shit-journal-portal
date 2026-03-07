# 前端测试说明

这个项目目前使用两层前端测试方案：

- `Vitest + React Testing Library + user-event + MSW`
- `Cypress Component Testing`

两者是分工协作关系，不是互相替代。

## 测试栈

### 单元测试与组件测试

- 测试运行器：`Vitest`
- DOM 环境：`jsdom`
- 渲染与断言：`@testing-library/react` + `@testing-library/jest-dom`
- 用户交互模拟：`@testing-library/user-event`
- 接口模拟：`MSW`，运行在 `msw/node`

这一层适合覆盖：

- 条件渲染
- 表单交互
- loading、empty、error 状态
- 带路由的组件行为
- API 成功与失败分支

### 真实浏览器组件测试

- 测试运行器：`Cypress Component Testing`
- 挂载工具：`@cypress/react`
- 执行环境：Cypress 真实浏览器组件运行器

这一层适合覆盖：

- 对浏览器环境敏感的交互
- 可见性和可点击性问题
- 滚动、焦点、视口相关行为
- 由 CSS 或布局引起的交互回归

## 相关文件

- 测试初始化：[`src/test/setup.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/test/setup.ts)
- 测试渲染辅助：[`src/test/renderWithProviders.tsx`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/test/renderWithProviders.tsx)
- MSW Node 服务：[`src/mocks/node.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/mocks/node.ts)
- 共享 mock handlers：[`src/mocks/handlers.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/mocks/handlers.ts)
- 共享 mock 数据：[`src/mocks/data.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/mocks/data.ts)
- Cypress 组件测试支持文件：[`cypress/support/component.tsx`](/Users/bukolosier/Desktop/github/shit-journal-portal/cypress/support/component.tsx)
- Cypress 配置：[`cypress.config.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/cypress.config.ts)

## 运行命令

安装依赖：

```bash
npm install
```

启动 Vitest 监听模式：

```bash
npm run test:unit
```

执行一次 Vitest：

```bash
npm run test:unit:run
```

打开 Cypress 组件测试界面：

```bash
npm run test:ct
```

以无头模式运行 Cypress 组件测试：

```bash
npm run test:ct:run
```

当前默认的 `npm test` 只执行单元测试：

```bash
npm test
```

## 当前配置行为

### Vitest

[`vite.config.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/vite.config.ts) 中配置了：

- `environment: 'jsdom'`
- `setupFiles: ['./src/test/setup.ts']`
- `globals: true`
- `css: true`

[`src/test/setup.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/test/setup.ts) 当前会在测试过程中做这些事：

- 在整个测试套件开始前启动 MSW Node 服务
- 每个测试结束后重置 mock 数据库状态
- 清空 `localStorage` 和 `sessionStorage`
- 恢复 spy 和 mock
- 对 `window.scrollTo` 做 stub

### Cypress CT

[`cypress/support/component.tsx`](/Users/bukolosier/Desktop/github/shit-journal-portal/cypress/support/component.tsx) 当前会在每个组件测试前：

- 把视口统一设置为 `1280x900`
- 清空 `localStorage` 和 `sessionStorage`
- 重置共享 mock 数据

这里固定较大视口是有意为之，用来避免组件在 Cypress 预览区域中因为视口过小而出现“元素存在但按钮被裁切，导致无法点击”的假失败。

## 当前示例测试

现有 Vitest 示例：

- [`src/pages/LoginPage.test.tsx`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/pages/LoginPage.test.tsx)
- [`src/pages/preprints/PreprintListPage.test.tsx`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/pages/preprints/PreprintListPage.test.tsx)

现有 Cypress 组件测试示例：

- [`cypress/component/CookieConsent.cy.tsx`](/Users/bukolosier/Desktop/github/shit-journal-portal/cypress/component/CookieConsent.cy.tsx)
- [`cypress/component/PreprintCard.cy.tsx`](/Users/bukolosier/Desktop/github/shit-journal-portal/cypress/component/PreprintCard.cy.tsx)

## Mock 策略

`MSW` 是前端本地开发和 Vitest 接口模拟共用的 mock 来源。

关键点如下：

- mock handlers 放在 [`src/mocks/handlers.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/mocks/handlers.ts)
- mock 数据放在 [`src/mocks/data.ts`](/Users/bukolosier/Desktop/github/shit-journal-portal/src/mocks/data.ts)
- `resetMockDb()` 用于在每次测试之间恢复内存中的初始数据

当前 Cypress 这一层主要负责真实浏览器中的组件交互验证，并没有在组件测试里启动浏览器版 service worker。这是有意的设计，用来让 Cypress CT 更稳定，专注处理真实浏览器交互问题，而不是重复承担一遍 API mock 联调。

## 推荐使用方式

下面这些场景优先用 `Vitest`：

- 新增 UI 逻辑
- 表单和路由流转测试
- 快速验证 API 驱动状态

下面这些场景更适合补 `Cypress CT`：

- 问题只会在真实浏览器里出现
- 点击、可见性、滚动、焦点很关键
- `jsdom` 的行为不够可信

推荐的本地流程：

1. 先写或先改 `Vitest` 测试
2. 只有在浏览器行为敏感时，再补 `Cypress CT` 用例
3. 运行 `npm run test:unit:run`
4. 如果涉及交互细节，再运行 `npm run test:ct:run` 做最终验证

## 当前限制

- `npx tsc --noEmit` 仍可能报 Supabase Edge Functions 的 `Deno` 类型问题，这和前端测试骨架本身无关
- Cypress CT 目前覆盖的是组件测试，不是完整端到端导航
- 如果组件强依赖接口状态，优先用共享的 MSW handlers 在 Vitest 里覆盖这条路径，再考虑是否需要补浏览器级验证
