# 兼容性与覆盖面审计：dsh-yizi-themes 0.5.2 ↔ DeepSeek Harness 0.2.1-rc.3

- 审计对象：`deepseek-ai/deepseek-harness` 标签 `dsh-v0.2.1-rc.3`（对照 `dsh-v0.2.1-rc.2`，本地源码 fetch 于 `E:\mycode\deepseek-harness`）；桌面版安装包 `deepseek-harness-0.2.1-rc.3-win-x64.exe`（更新已下载待重启生效）。
- 方法：只读比对源码标签；插件侧用「全量 CSS 变量求差集」审计覆盖面（rc.3 全部客户端 CSS 的 381 个 `var(--…)` 引用 ↔ 插件定义的 84 个变量）。
- 结论：**兼容性 P0 无问题**；主题覆盖面发现 1 组 P1 品牌蓝残留与若干 P2 缺口，全部已在 **0.5.2** 的 `brand-overrides` 别名块内补齐（纯插件侧，无核心改动）。

## 1. rc.2 → rc.3 更新内容（仅 6 个提交）

| 提交 | 内容 | 对插件的影响 |
|---|---|---|
| 5ff29190ed | feat(ui): 导航条目自定义（#6247，新增 `ui-entry-customization` 包） | 新增 3 个**纯增量** list 槽：`sidebar.panellist.actions`、`conversation.session.header.views.actions`、`sidebar.right.tab.guide.actions`；侧栏面板列表 / 会话头 View 标签条 / 右栏 guide 各加一个「更多」菜单（`PanelMoreMenu` / `ViewsMoreMenu`，用新图标 `IconAppsAddOutlineRegular` 与既有 alias token + `currentColor`，自动跟随主题） |
| 39d2903841 | fix(ui): 导航 pins 与选中态分离 + 菜单图标（#6883） | 内存态 pin 存储；无 API 变化 |
| 675164957a | feat(analytics): 导航埋点（#6600） | 无 UI 表面变化 |
| c48f8523f2 | feat(llm): DeepSeek API-key 路由 `/models` 列表（#6944） | 后端，无关 |
| d02ea370ee / 1f81c047fc | release 0.2.1-rc.3 | 全包版本号 bump |

## 2. 兼容性判定（逐项核实 rc.3 源码）

| 项 | rc.3 状态 | 判定 |
|---|---|---|
| 插件所用 6 个槽位（`sidebar.brand.mark/name`、`conversation.hero.brand.mark`、`settings.general.item`、`conversation.session.header.utilities`、`conversation.session.header.corner`） | 槽位契约只增不改（slot-catalog diff 逐条核对，source 行号位移） | 兼容 |
| 运行时依赖模块（`dsh-client-store`、`-ui-primitives`、`react`、`react-dom/client`、`react/jsx-runtime`） | `store` / `locale` / `ui-slots` / `ui-theme` / `ui-settings-general` 仅 package.json 变动，零代码改动 | 兼容 |
| 图标导出（`FishLogo`、`IconDark/LightOutline*`） | `icons/index.tsx` 仅**新增** `IconAppsAddOutline*`，无删改 | 兼容 |
| hero DOM（`EmptyHero.tsx` / `HeroShell.module.css`，fishHitbox / titleGroup / previewBadge） | 未变 → 0.5.1 的 `headlineTextTarget()` P1 修复与 SVG 指纹选择器继续有效 | 兼容 |
| 浮层锚点（`data-conversation-header-corner`、`data-sidebar-right-open/panel`、`--dsh-windows-titlebar-height`） | 全部存在且语义不变 | 兼容 |
| 运行态文字（「深度求索中，用时…」） | `.running { color: var(--dsw-alias-label-deep-diving); --dsw-alias-label-shimmer: var(--dsw-alias-label-deep-diving-shimmer) }`（ChatView.module.css）+ `TextShimmer` 高光 `var(--dsw-alias-label-shimmer)`；0.5.1 已映射三 token，元素级重绑只是转指、不阻断 body 继承 | 兼容（0.5.1 即生效） |
| 会话头 View 标签条重构（`.tabs > .viewTabs`，标签外包 Tooltip > `span.tabLabel`，88px 省略号，可换行） | 插件 CSS 从不定向标签条 DOM 结构（全走 token） | 兼容 |
| 侧栏面板列表 gap 4px→2px、新增「更多」按钮 | 复用 `css.panelRow` 类 + 主题 token | 兼容 |
| 设计令牌 | `ui-theme` 包零代码改动，74 个在用 token 定义不变 | 兼容 |

## 3. 覆盖面审计：核心在用、插件未覆盖的变量（0.5.2 已补齐）

### P1 — 品牌蓝残留（已补）

| 变量 | 核心值 | 用户可见表面 | 0.5.2 映射 |
|---|---|---|---|
| `--dsw-alias-link` | `--dsw-static-deepseek-500/400` | workspace、workflow-run、deliverables、插件市场、web-search 设置、primitives 的链接 | → `brand-primary` |
| `--dsw-static-deepseek-400/450/500` | 品牌蓝静态 | Toast 动作按钮（Toast.module.css:62）、FileTypeIcon 默认墨色 | → `brand-primary`（body 级重映射，连带重推导核心 color-mix；ANSI/语义用独立 `blue-*`/`neutral-*` 色阶，不受影响） |
| `--dsw-menu-surface-fill` | rgba(248,249,250,.58) / rgba(67,69,74,.45) | 所有弹出菜单/下拉毛玻璃底 | → `bg-overlay` 60% 透明混合 |
| `--dsw-alias-menu-group-header-fill` | rgba(248,249,250,.94) / rgba(48,49,54,.94) | 菜单分组标题条 | → `bg-layer-2` 94% |
| `--dsw-alias-button-tool-bar-fill/-hover` | rgba(84,85,87,.5/.6) | 聊天消息悬停工具条 | → `label-tertiary` 50%/60% |
| `--dsw-alias-bg-document-preview` / `-bg-document-selection` / `-label-document-preview` | 静态 neutral-bluish + blue-500 40% | 右侧文档预览面板底/选区/文字 | → `bg-layer-2` / 品牌色 40% 选区 / `label-secondary` |
| `--dsw-alias-onboarding-accent` 等 4 项 | #3964fe 等字面量（onboarding.css） | 首次启动引导向导 | → `brand-primary` 与 bg 层 |

### P2 — 状态/语义与前向声明令牌（已补）

- `--dsw-alias-state-warn-label`（→ warn-primary）、`--dsw-alias-state-idle-primary`（→ label-dimmed）、`--dsw-alias-label-error`（→ error-primary）、`--dsw-alias-interactive-bg-hover-danger`（亮 8% / 暗 15% 两档）。
- `--dsw-alias-label-primary-foreground` / `-label-primary-inverted`（主按钮填充、附件 chip、`BrandWordmark` 上的文字）→ 各主题 `--dsw-alias-brand-primary-invert` 配对墨色；`--dsw-alias-border-inverted` 亮透明 / 暗 label 8%。
- 核心声明未定义（前向声明）令牌：`--dsw-alias-bg-l1/l2`、`--dsw-alias-bg-layer-4`、`--dsw-alias-fill-l1/l2/tertiary/tsp-secondary`、`--dsw-alias-label-quaternary`、`--dsw-alias-separator-primary` → 主题既有层级（核心此处原本渲染透明/中性 fallback；定义后终端侧栏、任务列表、子代理设置表单、附件卡片获得主题分层）。
- ContextMeter「消息」类分段：`--meter-tint` 在元素级钉死 `--dsw-static-blue-450`（ContextMeter.module.css:122-131，body 值不可达）→ 新增 `body[class*="theme-"] [class*="colorMessages"]` 哈希后缀钩子（CSS-module 保留源类名后缀；system 灰 / tools 紫保持语义色）。

### 刻意不覆盖（维持既有决策）

- `--dsw-alias-bg-mask-1/-drop`：中性遮罩。
- ANSI 终端色（`ansi.ts` 的 `blue-400/500/600`）、`file-diff-*`、FileTypeIcon 的 amber/green/red/violet：语义色。
- TrajectoryTable 蓝渐变（`--dsw-static-blue-500`，无稳定钩子）、HoverCard 预览底（`.card` 元素级本地定义 `#2C2C2E`，body 值不可达且无稳定钩子）。
- 启动屏 `--dsh-boot-*`：核心 `boot-theme.ts` 首屏注入，插件晚于首屏加载，不可行。
- onboarding 三组渐变 stops（`--dsw-gradient-onboarding-*`）：一次性首屏视觉，暂保持核心值。

### 修复（0.5.1 引入的映射 bug）

- `--dsw-alias-toast-label` 0.5.1 派生自 `--dsw-alias-label-primary-inverted`；但 Toast 表面**两种模式都是深色**（Toast.module.css 注释：always-dark toast surface），该令牌暗色下解析为 neutral-bluish-800（深灰）→ 暗色 Toast 文字对比度约 2:1。0.5.2 改为核心同语义的恒亮白 `var(--dsw-static-neutral-bluish-00)`（核心 toast-label 两种模式均为 white）。

## 4. 级联安全性

- 插件全部样式在**单个** `<style>` 内由 `document.head.append` 注入（`src/client/index.ts` `injectThemeSheets()`），晚于核心样式表；主题 palette（`body.theme-<id>` / `body.theme-<id>[data-ds-dark-theme]`）→ 行样式 → brand-overrides 依次拼接，brand-overrides 最后。
- 核心 alias 定义在 `body{}`（0,0,1）与 `body[data-ds-dark-theme]{}`（0,1,1）；插件 `body[class*="theme-"]`（0,1,1）同特异性后到者胜 → 亮暗都赢；暗色特例块 `body[class*="theme-"][data-ds-dark-theme]`（0,2,1）稳赢。
- `body[class*="theme-"]` 作用域保证官方 `default` 配色（无 theme- class）完全不受影响。

## 5. 部署提示

- 桌面版 rc.3 更新包下载后需**重启应用**生效；更新后建议肉眼回归：空白页浮层定位、侧栏品牌区、会话头控件、View 标签条、超链接颜色、Toast、消息悬停工具条、文档预览、ContextMeter「消息」分段。
- 应用内插件需 ≥ 0.5.2：`~/.dsh/profiles/desktop/node_modules/dsh-yizi-themes/package.json` 的 `version` 字段。0.5.0 及更早版本在 0.2.1 核心上运行态文字（`TextShimmer`）本就不会主题化。
