# 开发日志 / Development Log

`dsh-yizi-themes` 的开发过程记录：关键决策、踩坑与原理。按时间倒序。

---

## 2026-08-16 · v0.2.1–v0.2.3：兼容干净 Harness

### 真相澄清：风格主题本就不在官方源码里

- 此前一直以为"风格主题"是 Harness 官方功能，直到在第二台机器（干净源码 / npm 发布的 rc.5）上测试：换主题报 `runtime.setThemeId is not a function`。
- 用户指正后确认：**`setThemeId` / `theme` 设置字段 / 主题注册表 / `body.theme-<id>` 切换，是早期 v1 patch 方案给核心加的**，官方源码没有；机器 1 能用是因为还残留着 patch。
- 结论：插件不能依赖核心的这套 API，必须自己实现。

### 风格主题后端（theme-backend.ts）

- 统一抽象，自动探测核心能力：
  - **核心路径**（有 `setThemeId`，如打过 patch / 含该特性的构建）：读写走核心，持久化到 `settings.yaml`，class 由核心 presenter 切换；
  - **插件路径**（干净 Harness）：主题 id 存 `localStorage`（`dsh-yizi-themes:themeId`），自行切换 `body.theme-<id>`，本地事件发射器通知刷新；明暗仍走核心 preference。
- `getTheme` 快照做了身份缓存（useSyncExternalStore 要求快照稳定）。
- jsdom 18 项测试覆盖两条路径：持久化、class 应用/切换/清除、通知、快照稳定、preference 联动、reassert。

### 0.2.2 回归：设置行消失

- 症状：头部主题切换正常，但设置 → 通用 的外观设置项整体消失。
- 报错：`ReferenceError: setThemeId is not defined at injected(...)`。
- 根因：重构后端时漏改 `injected()`，仍引用已不存在的裸变量 `setThemeId`（tsdown 不做类型检查，运行时才炸）。
- 教训：**给构建补了 tsc 类型检查**（`tsconfig.json`），还顺手修掉 3 个潜在类型错误（`ThemeDefinition` 导入源、`defaultEntry` 缺 `desc`、主题下拉渲染不存在的 `desc`）。

### 0.2.3：设置面板去重

- 用户反馈设置面板出现两组相同的外观（原生 + 插件各一组明暗模式块）。
- 删除插件外观行里重复的明暗模式块，直接从"主题"网格开始（原生行或右上角切换已覆盖明暗）。

---

## 2026-08-16 · v0.2.0 收尾

### 品牌自定义闭环

- **持久化打通的关键发现**：设置一直写不进去，排查到根因不在插件，而在 Harness 的 api-proxy —— `packages/host/apiproxy/src/api-proxy.ts` 用**硬编码白名单**决定浏览器可读写哪些 settings 命名空间（`locale` / `permission` / `ui-conversation` / `ui-theme` 等）。"新增一个 Settings 注册并不会让它可远程读写"是刻意设计（源码注释明说 plugin 自暴露是 deferred work）。按"不改 Harness 源码"的约束，最终方案是把自定义品牌数据写入**核心 `ui-theme` 命名空间的 `customBrand` 字段**（schema 本来就带该字段，只是 core 界面从未使用），用 `decode` 把 `{preference, theme, customBrand}` 窄化为品牌部分。
- **输入框不可编辑的真相**：受控输入框读行 store，而 store 只在 `theme/change` 时同步；命名空间未注册又让每次写 RPC 被拒 → 值永远弹回。修复 = host 端不再注册自己的命名空间，客户端写入白名单内的 `ui-theme`，且每次编辑后立即把新值推进 store。

### React 安全 DOM 注入（最重要的教训）

- **事故**：侧边栏折叠后重新展开 → 整个侧边栏空白。
- **根因**：此前用 `element.replaceWith(...)` 直接替换 React 渲染的节点。React 的 fiber 仍持有原节点引用，折叠时整个按钮卸载没事，展开时 React 要逐个 `removeChild` 已被摘除的节点 → `NotFoundError` → React 提交阶段崩溃。
- **铁律**：**绝不摘除/移动/删除 React 管理的 DOM 节点**。现在的模式：
  1. 用内联 `style.display='none'` 隐藏原节点（这些组件从不传 style prop，React 不会改回去）；
  2. 把自己的节点作为**兄弟**插入原节点之后（React 不管理它创建的节点，卸载时随子树消失）；
  3. **孤儿清理**：原节点被 React 移除后，下一轮自动清掉遗留兄弟；重新挂载后自动收敛。
  4. 按目标做内容签名，配置变更时只重建自己的节点（幂等、不抖动）。

### 新会话浮动控件

- 会话头在 blank 态整体隐藏，槽位按钮随之消失；hero 态又没有可用的顶栏槽位。
- 方案：第二个 React root（`react-dom/client`，平台模块表内），`position:fixed` 右上角，渲染同一个 `HeaderControls`；用 **hero 鱼标是否存在于 DOM** 作为"空白新会话"信号控制显隐（hero 存在 ⇔ 头部隐藏 ⇔ 显示浮动按钮；进入会话后 hero 卸载 ⇔ 隐藏，让位给槽位按钮，两组永不共存）。

### 其他

- 主题按钮图标：平台图标集（62 个）无调色板类图标，自绘 `PaletteIcon`（16×16、`currentColor` 单色、描边调色盘 + 4 个颜料点）。
- hero 图标复用 logo 设置，删除独立 heroIcon 字段（类型、默认值、UI、文案全链路清理）。
- Logo 输入框下加主题色替换提示（浅色小字）。

---

## 2026-08-16 · v0.1.0 初始构建

### 从 patch 覆盖 → 标准 Cordis 插件

- 早期方案是 `patch/` 覆盖 Harness 源码 + 安装脚本（`install.sh` / `install.ps1` / `MANIFEST.json`），第三方评审建议不要改 Harness 包源码，转为标准 Cordis 插件。
- 插件 = host（Node 半区 `dist/index.js`）+ 浏览器半区（`dist/client.js`）。
- **浏览器 bundle 的三明治封装**（对齐官方 clientBundle 预设）：
  ```
  banner: window.__ModuleLoader__.load({ id: 'dsh-yizi-themes', factory: (require) => {
  intro:  var module = { exports: {} }; var exports = module.exports;
  footer: return module.exports; } });
  ```
- **平台模块表**（`packages/client/web/src/platform.ts`）：client bundle 的 `require()` 只能落在表内（react / react-dom / primitives / runtime / slots …），否则 loader 报 "missed the module table"。为此移除了 clsx，自写 `cx()`。
- **pack 陷阱**：`pnpm pack` 对 workspace 协议报错，用 `npm pack`（产出正确的 `package/dist/` 布局）。
- **同版本 tgz 陷阱**：同版本 tgz 内容变了再 `add`，pnpm 报 `Already up to date` 不更新 —— 必须 `remove` 后再 `add`（升版本号则单次 `add` 即可）。
- 头部按钮：注册到 `conversation.session.header.actions` 后发现它在标题旁（左侧），而会话日志按钮在 `header.utilities`（最右）——槽位是两套，最终改到 utilities。
- 明暗切换单向：接入 `useSyncExternalStore` + `theme/change` 订阅后双向可用。

### 主题机制

- 19 个主题以 `body.theme-<id>` 的 `--dsw-alias-*` 覆盖注入（`src/client/themes.ts` 由 `scripts/gen-themes.mjs` 从 CSS 生成 TS 字符串），与 core 注册的主题 id 一一对应。
- 明暗双套由 `body[data-ds-dark-theme]` 切换。

---

## 踩坑清单（速查）

| 现象 | 根因 | 解法 |
|---|---|---|
| 设置不持久化 / 输入框不可编辑 | api-proxy 白名单外命名空间被拒 | 写入核心 `ui-theme.customBrand` |
| 侧边栏折叠后展开空白 | replaceWith 摘除 React 节点 → removeChild 崩溃 | 隐藏原节点 + 兄弟插入 + 孤儿清理 |
| 同版本 add 不更新 | pnpm 认为依赖已满足 | remove → add，或升版本号 |
| client bundle 报 requires 超出平台表 | 依赖了表外模块（如 clsx） | 内联或自实现 |
| `exports is not defined` | client bundle 缺 `intro` 三明治 | 补 intro 声明 |
| locale 命名空间冲突 | 与 core 共用 `settings.theme` | 改用 `yizi.theme` |
