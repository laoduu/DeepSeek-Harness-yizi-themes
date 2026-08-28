# 开发日志 / Development Log

`dsh-yizi-themes` 的开发过程记录：关键决策、踩坑与原理。按时间倒序。

---

## 2026-08-28 · v0.4.0：适配新版 Harness（移除 client-runtime 包）

### 现象

Harness 升级到 dsh-v0.1.2-alpha.1 后，web 启动报：
`failed to import loader entry 80bfc56c (dsh-yizi-themes): client-modules: require("@deepseek-ai/dsh-client-runtime/client") missed the module table`。

### 根因：官方删除了 `@deepseek-ai/dsh-client-runtime` 包

- Harness 提交 `be531688f3 refactor(client): migrate consumers and remove Runtime`（2026-08-23）把客户端运行时拆解：
  - `defineStore` / `EngineStoreHandle` → 迁入 `@deepseek-ai/dsh-client-store`（同名同签名，`packages/client/store`）；
  - `ClientContext` 类型 → 迁回 `@deepseek-ai/cordis`；
  - 从 `packages/bundle/web-app/cordis.patch.yml` 的 client-modules 表删除 `client-runtime` 行。
- 插件的 `dsh.client.inject` 仍声明 `@deepseek-ai/dsh-client-runtime`，web 前端构建 client-modules 表时没有这个包 → `require` 落到模块表外 → 加载失败。
- 教训：**第三方插件对 Harness 客户端 API 的每个依赖都是"官方扩展面"的候选**——依赖被官方重新组织时，插件要么随官方迁移，要么锁定旧 Harness 版本。

### 修复：迁移到新基线

- `src/client/settings-store.ts`：`import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client'` → `from '@deepseek-ai/dsh-client-store'`（API 完全一致，零行为变化）。
- `src/client/index.ts`：`ClientContext` 改从 `@deepseek-ai/cordis` 导入（官方 ui-theme 同款写法）。
- `package.json`：inject 列表、peer/dev deps 里 runtime → store。store 是平台基线（`packages/client/web/src/platform.ts` 的 `PLATFORM_MODULES`），官方规范要求放 devDependencies，不进 peerDependencies。
- `prepare.mjs`：browser bundle 的 `external` / `noExternal` 列表同步迁移（此前 runtime 是 external=模块表提供，store 同为表内基线）。

### 验证

- 重新 `prepare.mjs` 构建 → 新 `dist/client.js` 零 runtime 引用、含 `dsh-client-store`。
- `npm pack` → 新 tgz，`dsh plugin remove` + `add` 重装。
- 重启 `dsh web`：插件正常加载，主题切换与自定义品牌可用，服务端日志无错误。
- 浏览器实测：`/plugins/dsh-yizi-themes/client.js` 含 `dsh-client-store`、不含 `dsh-client-runtime`。

### 兼容性边界

- **0.4.0 只适配 dsh-v0.1.2-alpha.1+**（依赖已删除的 runtime 无法在旧版跑）；0.3.x 仍适用于旧版 Harness（rc.8）。

---

### 现象

品牌字样 / 徽章字样 / 新会话标题三个文本框输入中文时，拼音打到一半字母就被提交成实字（"跳字"）。Logo、品牌映射等所有文本输入同样受影响。

### 根因：受控输入框 × 异步写入回声

- 输入框是受控组件：`value` = 行 store 的 `customBrand`，`onChange` → `setCustomBrand` → 每次按键**同步**更新 store（这没问题），但同时发起**异步** `settingsScope.set` 持久化。
- 关键：每次异步写入落定时，设置镜像 `acceptView` 会发布一次快照 → `settingsScope.subscribe` 回调触发 → `readSettings()` 重新读出**刚刚落定的那次写入**的值 → push 进行 store。
- 快速连续输入（IME 拼音组合尤其密集）时，落定的写入值**滞后**于用户当前光标的值 → store 被回填成过期值 → React 把输入框 DOM 强制设回旧值 → 浏览器把进行中的拼音组合**冲掉/提前提交** → 字母"进去了"。
- 也就是说：问题不在"同步 push"（值一致时 React 不会碰 DOM），而在"异步回声把过期值推回来"。

### 修复：在途写入计数（pendingBrandWrites）

- `setCustomBrand` 每次写入前 `pendingBrandWrites += 1`，落定（resolve/reject）后 `-1`；
- `settingsScope.subscribe` 回调在 `pendingBrandWrites > 0` 时**跳过重新采纳**——只做初始加载、外部变更、以及所有写入落定后的采纳。
- 输入路径从此不再有"过期值回填"，IME 组合全程不被打断；所有既有行为（每键实时预览、每键持久化、外部变更采纳）不变。
- 时序细节：写入落定时 `acceptView` **同步**触发订阅回调，此时 `pendingBrandWrites` 尚未递减（`.finally` 在整条 set() promise 落定后才跑），所以该次采纳恰好被跳过；最后的写入落定后 store 里已是用户最新值，无需再采纳。

---

## 2026-08-21 · v0.3.0：适配 rc.8 品牌槽位（升级免疫）

### rc.8 把侧边栏品牌从"单个 SVG"改成了"槽位组合"

- rc.5 侧边栏品牌 = 一个 `BrandWordmark` SVG（`viewBox="0 0 182 24"`，内含鱼形 + "DEEPSEEK" 字样路径 + "HARNESS" 徽章底板）。插件旧版用该 viewBox 指纹定位并注入自定义字样/徽章，靠 MutationObserver 反复应用。
- rc.8 重构为：`button.brand > span.brandIdentity > (span.brandMark [槽 `sidebar.brand.mark`，fallback FishLogo 24] + span.brandName [槽 `sidebar.brand.name`，fallback "DSH Local Build" + commit])`；rail 也是 `span.railMark [槽 `sidebar.brand.mark`]`；hero 则是 `span.fishHitbox [槽 `conversation.hero.brand.mark`，fallback FishLogo 34]` + `span.headlineText`。
- 结论：`182 24` SVG 从侧边栏消失 → 旧版"左上角字样/徽章"定位失效；hero 鱼标 viewBox 仍在 → 自定义 logo 能显示，但整块 DOM 注入在新结构下与槽位渲染冲突，欢迎语也随之失效。

### 方案：注册官方品牌槽位（升级免疫）

- **为什么选槽位**：`sidebar.brand.mark` / `sidebar.brand.name` / `conversation.hero.brand.mark` 是 Harness 为"部署品牌"设计的扩展面（`ui-brand-official` 在 official 构建里正是这么干的）。注册它们 = 官方支持的定制方式，不依赖内部 DOM/哈希类名，**升级只要保留槽位契约就继续工作**。
- **响应式**：新增 `brand-store`（`useSyncExternalStore` 数据源），设置面板改 Logo/字样/徽章时槽位组件实时重渲染。
- **单一槽位必须"占位"**：读 `scoped-slots.tsx` 发现 single 槽位注册后即使返回 null 也不会 fallback 到 shell 的 fallback——所以 mark 槽位在未设 logo 时自行渲染 `FishLogo`（保持默认观感），name 槽位始终渲染 "DEEPSEEK + HARNESS"（恢复 rc.5 的官方观感，rc.8 标准构建默认是 "DSH Local Build" 占位）。
- **hero 欢迎语没有槽位**：`t('hero.headline')` 是 locale 字符串，且 `locale.register` 对已占用的 conversation 命名空间会抛 "already has locale"，无法覆盖。保留 DOM 文本写入，但定位锚点改成**我们自己渲染的 `[data-yizi-hero-mark]`**（其父的 slot 锚点 div → fishHitbox span → nextElementSibling = 标题），不再依赖核心鱼标 viewBox。
- **旧版兜底 + 启动竞态**：无槽位的 rc.5 仍走原 viewBox 注入；槽位激活时 `markModernBrandPath()` 后立即 `cleanupLegacyBrandDom()`（清掉竞态期间产生的旧注入产物，避免重复 logo）。
- **FloatingControls 联动**：新会话浮动按钮的 hero 检测从"鱼标 viewBox"改为同时认 `[data-yizi-hero-mark]`。

### 构建

- `prepare.mjs` 原来硬编码 `C:/Users/Administrator/deepseek-harness/node_modules/tsdown/...`（原作者机器路径），本机为 `E:/mycode/deepseek-harness` → 改为按 `$DSH_HARNESS` → 已知检出路径查找，找不到报错并给指引。

---

## 2026-08-16 · v0.2.4：品牌色真正跟随 + 品牌映射按下

### 品牌色覆盖表为什么一直没生效

- 用户反馈"Deep diving…"执行状态没跟随主题色。排查发现：注入的 `brand-overrides.css` 用的选择器是 **CSS-Module 字面类名**（`.turnStatus`、`.dsw-yizi-theme-enabled` 前缀等），但应用内类名是构建哈希的（如 `Md3f7G_turnStatus`），且 `dsw-yizi-theme-enabled` 这个启用类**从来没有任何代码添加**——整份表在干净 Harness 上是死代码。
- 机器 1 之所以"生效"，是因为其核心 CSS Module 被早期 patch 直接改过（工作区残留）。
- **教训**：插件注入的 CSS 必须锚定**稳定 DOM 钩子**（data 属性 / role / SVG viewBox 指纹），不能依赖哈希类名。
- 重写后选择器：`[data-chat-flow=""] [role="status"][aria-live="polite"]`（执行状态）、`[data-state="ongoing"]`（状态点）、`span:has(> svg[viewBox…][width=34])`（hero 鱼标+标题）、`button:has(> svg[viewBox="0 0 182 24"])`（侧边栏品牌）、`button:has(> svg[…][width=24])`（收起 rail）。

### 品牌映射功能按下（默认禁用）

- 用户反馈：开启映射后整个界面（设置面板标签、输入框）的 DeepSeek 相关词全被替换，打字都会被改写——这不是功能初衷。
- 反思结论：**基于关键词的全局替换在任何作用域都站不住**——UI 文案是固定说明、输入是用户真实内容、提示词不能骗模型、输出替换会误导用户（问 DeepSeek 答出来的却是别的品牌）。
- 处理：默认禁用（默认值本就是 false），并加**可编辑元素保护**（永不改写 input/textarea/contenteditable 内的文本）；待明确语义后再另行设计。

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
