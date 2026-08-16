# 版本日志 / Changelog

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
