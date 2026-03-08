# 搜索功能说明

这份文档用于帮助协作者快速理解当前项目的搜索功能实现、相关文件位置，以及本地联调和测试方式。

## 功能概览

当前搜索功能包含两部分：

- 头部黑色展开搜索框
- `/search` 搜索结果页

主要能力如下：

- 支持按 `全站`、`文章标题`、`作者昵称`、`标签` 四种范围搜索
- 支持标签快捷搜索，目前内置：
  - `纯享整活 / Meme`
  - `硬核学术 / Hardcore`
- 标签搜索支持中英文模糊匹配
  - `me` 可以命中 `meme`
  - `硬核` 可以命中 `硬核学术`
- 搜索结果页按 `10` 条一页分页
- 分页样式与 `preprints` 页保持一致
- 当用户已经位于 `/search` 页面时，不再额外渲染全局黑色搜索浮层，避免出现叠层

## 使用方式

### 1. 从头部打开搜索

桌面端和移动端头部都提供搜索按钮。

- 非 `/search` 页面：
  - 点击搜索按钮会展开黑色搜索框
  - 再次点击会收起黑色搜索框
- `/search` 页面：
  - 点击头部搜索按钮不会再打开第二层黑框
  - 页面只保留搜索结果页自身的搜索区域

### 2. 提交搜索

可以通过以下方式进入搜索结果页：

- 在黑色搜索浮层中输入关键词并点击搜索
- 在黑色搜索浮层中点击标签快捷按钮
- 在 `/search` 页面顶部重新输入关键词并点击搜索
- 在 `/search` 页面点击标签快捷按钮

### 3. 搜索参数

当前搜索页使用的 URL 参数：

- `q`：搜索关键词
- `type`：搜索范围，可选值为 `anywhere`、`article`、`author`、`tag`
- `page`：分页页码，从 `1` 开始

示例：

```text
/search?q=meme&type=tag&page=2
```

## 分页规则

- 搜索结果页固定每页显示 `10` 条
- 分页 UI 使用 `Prev / 当前页 / 总页数 / Next`
- 当前分页逻辑是前端分页
- 搜索页会先拉取足够多的结果，再在前端按页切片显示

当前实现中，搜索页会以较大的抓取上限获取结果，然后在前端分页，便于先完成搜索体验和本地 mock 调试。

## 标签搜索规则

标签搜索目前依赖前端别名映射和模糊匹配。

已配置的标签别名位于 `src/lib/search.ts`，例如：

- `meme`
  - `meme`
  - `memes`
  - `纯享整活`
  - `整活`
  - `抽象整活`
- `hardcore`
  - `hardcore`
  - `硬核`
  - `硬核学术`
  - `学术`
  - `硬核研究`

如果后续要增加更多标签搜索能力，优先修改：

- `src/lib/search.ts`
- `src/lib/api.ts`

## 相关文件

### 页面与交互

- `src/components/layout/MainHeader.tsx`
  - 主头部搜索按钮入口
- `src/components/layout/StickyHeader.tsx`
  - 吸顶头部搜索按钮入口
- `src/components/layout/Layout.tsx`
  - 控制全局搜索浮层开关
  - 负责避免 `/search` 页搜索浮层叠层
- `src/components/search/SearchOverlay.tsx`
  - 黑色展开搜索浮层
- `src/pages/SearchPage.tsx`
  - 搜索结果页

### 路由与配置

- `src/App.tsx`
  - 定义 `/search` 路由
- `src/lib/search.ts`
  - 搜索范围配置
  - 标签快捷入口
  - 标签别名
  - URL 参数生成
- `src/lib/api.ts`
  - 搜索 API 封装
  - 标签搜索聚合逻辑

### Mock 与测试

- `src/mocks/handlers.ts`
  - `GET /api/search/article` 的 MSW mock
- `src/mocks/data.ts`
  - 搜索相关 mock 文章数据
  - 包含分页测试用的额外 mock 数据
- `src/components/search/SearchOverlay.test.tsx`
  - 测试黑色搜索浮层
- `src/pages/SearchPage.test.tsx`
  - 测试搜索结果页、标签搜索、分页
- `src/components/layout/HeaderSearchButtons.test.tsx`
  - 测试头部搜索按钮触发逻辑
- `src/components/layout/Layout.test.tsx`
  - 测试搜索浮层开关与 `/search` 页防叠层逻辑

## Mock 数据说明

为了方便本地验证搜索分页，项目已经在 `src/mocks/data.ts` 中补充了搜索专用文章数据。

当前重点覆盖两类标签：

- `meme`
- `hardcore`

这样在本地使用标签搜索时，结果数会超过单页数量，方便测试：

- 分页跳转
- 翻页按钮启用/禁用状态
- 不同页结果切换

## 本地测试命令

启动本地开发环境：

```bash
npm run dev
```

运行一次单元测试：

```bash
npm run test:unit:run
```

如果你只是在改搜索功能，建议重点关注以下测试文件：

- `src/components/search/SearchOverlay.test.tsx`
- `src/pages/SearchPage.test.tsx`
- `src/components/layout/Layout.test.tsx`
- `src/components/layout/HeaderSearchButtons.test.tsx`

## 维护建议

- 如果要新增搜索范围，先更新 `src/lib/search.ts` 中的 `SearchScope` 和选项列表
- 如果后端搜索接口支持真正分页，再把 `src/pages/SearchPage.tsx` 的前端分页改为服务端分页
- 如果要增加新的标签快捷入口，保持 `QUICK_TAG_SEARCHES` 与 `TAG_SEARCH_ALIASES` 同步更新
- 如果调整头部搜索交互，务必同时检查 `Layout.tsx`，避免再次引入浮层叠加问题
