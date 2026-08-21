# 版本日志 / Changelog

## 0.3.1 — 2026-08-21

> 修复设置面板文本输入框的 IME「跳字」：拼音打到一半字母被提交成实字。

### 修复：自定义品牌文本框输入跳字（拼音半路被提交）

- **现象**：品牌字样 / 徽章字样 / 新会话标题（以及 Logo、品牌映射等所有文本输入）输入中文时，每次按键都"跳字"——拼音还没选字，字母就被当成最终文本提交进输入框。
- **根因**：输入框是受控组件，`value` 来自行 store；每次按键 `setCustomBrand` 都会发起一次**异步** `settingsScope.set` 写入。每次写入落定时，设置镜像会发布一次快照，触发 `settingsScope.subscribe` 回调，回调里 `readSettings()` 重新读取的是**刚刚落定的那次写入**的值——在快速连续输入（尤其 IME 拼音组合期间）它**滞后**于用户当前光标处的值，于是该过期值被重新 push 进行 store → 受控输入框被强制回填旧值 → 浏览器把正在进行的拼音组合**冲掉/提前提交**，字母就"进去了"。
- **修复**：在 `setCustomBrand` 记录**在途写入计数** `pendingBrandWrites`，写入落定（resolve/reject）时递减；`settingsScope.subscribe` 回调在 `pendingBrandWrites > 0` 时**跳过重新采纳**（只做初始加载、外部变更、以及所有写入落定后的采纳）。输入路径不再有"过期值回填"，IME 组合全程不被打断。该修复对全部文本输入（含 Logo、品牌映射）一并生效。
- 保留全部既有行为：每键实时预览、每键持久化、外部变更/刷新后采纳。

---

## 0.3.0 — 2026-08-21

> 适配 Harness v0.1.0-rc.8：品牌改用官方 brand 槽位渲染（升级免疫），修复左上角程序名 / 徽章 / 新会话欢迎语自定义失效。

### 背景：rc.8 的侧边栏品牌不再使用旧 DOM

- rc.5 侧边栏品牌是单个 `BrandWordmark`（`viewBox="0 0 182 24"`，内含鱼形 + "DEEPSEEK" 字样 + "HARNESS" 徽章底板）。插件旧版用 viewBox 指纹定位该 SVG 并注入自定义字样/徽章。
- rc.8 把品牌改为**槽位组合**：`sidebar.brand.mark`（展开与收起共用的 logo 槽）+ `sidebar.brand.name`（展开的字样槽）；旧 `182 24` SVG 不再出现在侧边栏，故「左上角程序名 / 徽章」定位失效。新会话欢迎语（hero 标题）本应仍能命中，但因旧版整块 DOM 注入在新结构下与槽位渲染冲突，一并重写。

### 修复（现代路径 = 官方扩展面，升级免疫）

- **改用官方 brand 槽位**：插件注册 `sidebar.brand.mark` / `sidebar.brand.name` / `conversation.hero.brand.mark` 三个槽位，分别渲染自定义 Logo、字样+徽章、新会话 hero 鱼标。槽位是 Harness 为"部署品牌"设计的稳定扩展点，不依赖内部 DOM / 哈希类名，**后续 Harness 升级只要保留槽位契约即可继续工作**。
- **响应式**：新增 `brand-store`（`useSyncExternalStore` 数据源），设置面板改 Logo/字样/徽章时，侧边栏与 hero 立即实时更新。
- **hero 欢迎语**：仍用 DOM 文本写入（该文案无槽位），但定位锚点改为**插件自己渲染的 `[data-yizi-hero-mark]` 元素**（不再依赖核心鱼标 viewBox），结构更稳。
- **未自定义时的默认观感**：名称槽始终渲染 "DEEPSEEK + HARNESS"（插件默认品牌，恢复 rc.5 侧边栏的官方观感；rc.8 标准构建默认是 "DSH Local Build" 占位）。
- **浮动控件**（新会话页右上角）检测 hero 改用 `[data-yizi-hero-mark]`，与槽位渲染的 logo 兼容。
- **旧版兜底**：无品牌槽位的核心（如 npm 发布的 rc.5）仍走原有 viewBox DOM 注入路径（`applyBrand` 按 `isModernBrandPath()` 自动分流）；槽位激活时自动清除旧路径产物，避免重复渲染。

### 构建

- `prepare.mjs`：tsdown 解析不再硬编码单一路径——按 `$DSH_HARNESS` → 已知检出路径的顺序查找，找不到时报错并给出指引。

### 验证

- 在 rc.8（v0.1.0-rc.8）运行的 Harness 上实机验证：侧边栏 Logo、左上角字样、徽章、新会话欢迎语自定义均恢复可用，主题皮肤与自定义 SVG 显示不受影响。

---

## 0.2.4 — 2026-08-16

> 品牌色跟随修复 + 品牌映射默认禁用（含输入保护）。

### 修复：品牌色跟随（执行状态等）

- **背景**：插件注入的 brand-overrides.css 原本用 CSS-Module 字面类名（`.turnStatus`、`.dsw-yizi-theme-enabled` 前缀等），但应用内类名是构建哈希的、且启用类从未被添加——**整份覆盖表在干净 Harness 上完全无效**（机器 1 能生效是因为其核心源码被直接改过，属工作区残留）。已按稳定 DOM 钩子重写（data 属性 / role / SVG viewBox 指纹），任意构建都能命中。
- **执行状态 shimmer（"Deep diving…"）**：`[data-chat-flow=""] [role="status"][aria-live="polite"]` 背景渐变改用 `--dsw-alias-brand-primary`，随主题与明暗自动变；
- **状态点（ongoing）**：`[data-state="ongoing"]` 的 `--dsh-state-ongoing` 改用主题色；
- **新会话 hero**：鱼标与标题文案改主题色（`span:has(> svg[viewBox…][width=34])` + 相邻 span）；
- **侧边栏品牌 / 收起 rail**：`button:has(> svg[viewBox="0 0 182 24"])` 与 `button:has(> svg[…][width="24"])` 改主题色。
- 移除全部失效的 `.dsw-yizi-theme-enabled` 规则；ContextMeter / TrajectoryTable 因无稳定非哈希钩子，暂不覆盖（注释说明）。
- 验证：jsdom 按真实组件 DOM 形状验证 9 项选择器匹配全部通过（含 `:has` 结构与宽度区分）。

### 变更：品牌映射默认禁用 + 输入保护

- **品牌映射默认禁用**：`mappingEnabled` / `customBrand.mappings.enabled` 默认值保持 `false`，关闭时不做任何替换（设置面板、输入框、界面文案均不受影响）。
- **可编辑元素保护**：即使开启映射，替换也跳过 `input` / `textarea` / `contenteditable` 内的文本——用户输入的内容原样保留，不会被自动改写。
- 说明：品牌映射是基于关键词的全局替换，语义上无法区分"产品自称"与"用户讨论 DeepSeek 本尊"等场景，存在误导风险；故默认关闭，待明确语义后另行设计。

---

## 0.2.3 — 2026-08-16

> 设置面板去重：不再重复原生"浅色/深色/跟随系统"模式块。

### 变更

- **设置 → 通用 外观行从"主题"直接开始**：删除插件外观行里与原生重复的明暗模式块（原生行或右上角切换已提供），保留主题网格 + 自定义品牌（Logo/字样/徽章/标题/品牌映射）。顺带清理未用的图标导入与 locale 键。

---

## 0.2.2 — 2026-08-16

> 修复 0.2.1 引入的设置页回归：外观设置项（主题网格 / 自定义品牌 / 品牌映射）整体消失。

### 修复

- **设置 → 通用 中外观设置项消失**：根因是重构风格主题后端时，`injected()` 仍引用已不存在的裸变量 `setThemeId`，设置行注册时抛 `ReferenceError: setThemeId is not defined`，slot 崩溃导致整个外观项不渲染（头部主题切换不受影响）。
- 顺带修正 tsc 检查发现的潜在类型错误：`ThemeDefinition` 从 `themes-list` 导入（原误从 `theme-settings` 导入）、`defaultEntry` 补 `desc` 字段、主题下拉移除未定义的 `desc` 渲染。

---

## 0.2.1 — 2026-08-16

> **兼容干净 Harness（未打补丁的官方源码 / npm 发布的 rc.5）**：风格主题现在开箱即用。

### 背景

"风格主题"维度（`setThemeId` / `theme` 设置字段 / 主题注册表 / `body.theme-<id>` 切换）**并非 Harness 官方源码自带**——它是早期 v1 patch 方案给核心加的功能。因此插件在**干净源码 / npm rc.5** 上换主题会报 `runtime.setThemeId is not a function`（点击静默失败）。

### 变更

- 新增**风格主题后端**（`src/client/theme-backend.ts`），自动探测核心能力：
  - **核心路径**：核心有 `setThemeId`（打过 v1 patch 或含该特性的 fork）→ 读写走核心，持久化到 `settings.yaml`，class 由核心 presenter 切换（原行为不变）；
  - **插件路径**：核心没有 `setThemeId`（官方源码 / npm rc.5）→ 插件自管：主题 id 存 `localStorage`，自行切换 `body.theme-<id>` class（配合插件注入的主题 CSS），本地事件通知刷新选择器/网格；明暗切换仍走核心 preference。
- 主题选择器、主题网格、浮动按钮在两种核心上都可用。
- 设置了 localStorage 可用性兜底（隐私模式降级为会话内有效）与 boot 时恢复已存主题。

### 修复

- 干净 Harness 上切换主题无反应（`runtime.setThemeId is not a function`）。

---

## 0.2.0 — 2026-08-16

> 品牌自定义体系完善 + 新会话体验 + 稳定性修复。此版本起改为**标准 Cordis 插件**（`dsh plugin --profile web add` 安装），不再以 patch 方式修改 Harness 源码。

### 新增

- **左上角品牌自定义应用**：设置 → 外观 → 自定义中填写的 logo / 品牌字样 / 徽章字样 / 新会话标题，实时应用到界面：
  - 展开侧边栏：logo + 品牌字样 + 徽章（替换默认鲸鱼字标）；
  - 收起侧边栏（rail）：logo 替换默认鱼标；
  - 新会话页：logo 替换 hero 鱼标，标题替换默认文案（hero 图标直接复用 logo 设置，不再单独设置）。
- **品牌色跟随主题与明暗**：品牌字样、徽章背景、logo 容器统一使用 `--dsw-alias-brand-primary`，随 19 个风格主题与明暗模式自动切换。
- **新会话浮动控件**：空白新会话（无对话内容）时，右上角以浮动按钮形式显示主题选择器与明暗切换；进入真实会话后自动让位给头部槽位按钮。
- **Logo SVG 主题色提示**：Logo 输入框下方新增浅色小字说明，指导把 SVG 硬编码颜色替换为 `fill="var(--dsw-alias-brand-primary)"` 或 `fill="currentColor"`。
- **自定义调色板图标**：主题选择器按钮图标改为插件自带的调色板 SVG（平台图标集无调色板类图标）。

### 变更

- **设置持久化走核心 `ui-theme` 命名空间**：Harness 的 api-proxy 只向浏览器暴露白名单内的 settings 命名空间（新增 Settings 注册不会自动可读写），因此自定义品牌数据持久化到核心 `ui-theme.customBrand` 分节（`$DSH_HOME/settings.yaml`），随主题偏好一起保存。
- **删除「新会话图标」独立设置项**：hero 图标统一复用 Logo SVG。
- 头部控件槽位由 `conversation.session.header.actions` 移到 `conversation.session.header.utilities`（标题行最右端，会话日志按钮右侧）。
- 品牌 DOM 应用改为 **React 安全模式**：只隐藏原节点 + 插入兄弟节点 + 孤儿清理，绝不摘除 React 管理的节点（修复折叠侧边栏后重新展开导致侧边栏空白的问题）。

### 修复

- 设置页输入框无法输入/删除：根因是命名空间未注册导致每次写 RPC 被拒，现已持久化到白名单内的 `ui-theme` 命名空间，且编辑即时推送行 store。
- 明暗切换只能单向（亮→暗）：接入 `useSyncExternalStore` + `theme/change` 订阅。
- 侧边栏折叠后重新打开空白：React 节点被 `replaceWith` 摘除导致 React 提交阶段 `removeChild` 崩溃，改为隐藏原节点 + 兄弟插入。

### 已知边界

- 双写者 revision 冲突：同时"点击主题卡片/模式块"和"在品牌输入框打字"的一瞬，可能有一次写入被 revision 冲突丢弃（自恢复，重输即可）。
- 品牌字段恢复默认（清空）会还原内置渲染。

---

## 0.1.0 — 2026-08-16（初始）

> 首个版本：将 19 个 YiziMarkdown 风格主题移植为 Harness 标准 Cordis 插件。

- 19 个风格主题（学术蓝 / 极光 / 赛博朋克 / Facebook / 液态玻璃 / 荔枝红 / 杂志感 / 黑客帝国 / 极简风 / 薄荷冰沙 / 莫兰迪 / 自然风 / 故宫朱砂 / 落日熔金 / 科技感 / 复古打字机 / 蒸汽波 / 活力橙 / 紫罗兰），每个主题含亮/暗双套 token。
- 会话头部右上角主题选择器 + 明暗切换（`header.utilities` 槽位）。
- 设置 → 外观：主题网格 + 自定义品牌板块（logo / 品牌字样 / 徽章 / 新会话图标 / 标题 / 品牌映射）。
- 提示词品牌映射：输出时替换 "DeepSeek / 深度求索 / Harness / DeepSeek Harness"。
- 打包结构：`dist/index.js`（host 半区）+ `dist/client.js`（浏览器半区，`__ModuleLoader__` 封装）+ `cordis.patch.yml`（bundle patch）。
