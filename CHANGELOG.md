# 版本日志 / Changelog

## 0.5.5 — 2026-10-28

> 两个**纯官方扩展面**的新功能：`/theme` 斜杠命令（输入框直接切换主题/明暗）+ 运行时自检「诊断」面板。零新增脆弱钩子；不含 ui-commands 的核心自动跳过命令注册，不影响激活。

### 新增：`/theme` 斜杠命令（popupSelect）

- **官方接口依据**：核心 `ui-commands` 的 contribution 注册面（`ctx.commandUi.register`），与 `/model`、`/permission` 同一机制。在输入框敲 `/theme` 打开共享弹层：`fuzzy-label` 搜索，两组选项——**风格主题**（默认 + 19 套，当前项预高亮）与**明暗模式**（跟随系统 / 浅色 / 深色）。
- **实现**：`theme-commands.ts` 通过 `ctx.inject(['commandUi'], …)` 注册（cordis 中这是独立子 fiber：服务缺失时永远 PENDING、回调不执行、**外层插件照常激活**——老核心零风险；所有支持代核心 ≥ v0.1.2-alpha.1 均已内置 ui-commands）。选项数据由插件 theme-backend 现读现答；`onSelect` 分流：`pref:*` → `runtime.setTheme`，其余 → `setThemeId`。
- 命令行图标复用插件自绘调色板 SVG（抽出为共享 `PaletteIcon.tsx`）。

### 新增：运行时自检面板（设置 → 外观 → 诊断）

- **8 项检查**（纯浏览器侧读取，无核心内部接口，检查本身也是升级免疫的）：样式表注入、主题状态（id/preference/路径）、品牌槽位渲染、切换入口、平台图标解析、命令服务、localStorage 文档、**令牌覆盖扫描**。
- **令牌覆盖扫描** = COMPAT-0.2.1-rc.3.md 审计的在线版：遍历除插件样式表外的全部 `document.styleSheets`，收集 `var(--dsw-…)` 引用与定义，求差得「插件覆盖数」与「全仓未定义令牌」（按引用频次排序，前 24 个以 chip 展示）——未来的补全覆盖点当场可见。
- 按需运行（点「运行体检」），不随渲染执行；状态色用核心语义令牌（`state-success-primary` / `state-warn-label` / `label-error`，带回退）。

---

## 0.5.4 — 2026-10-26

> 修复：品牌尺寸放大后**侧边栏品牌区底部被裁切**——放开核心对品牌行的固定几何（非破坏式覆盖，官方槽位契约不变）。

### 修复：放大比例时侧边栏品牌被裁切（0.5.3 遗留）

- **根因**：0.5.3 的缩放只作用于槽位占位组件内部，而核心侧边栏对周边几何钉死了固定值——品牌行 `.logoRow` 固定 60px 高（折叠导轨 36px）且 `overflow: hidden`、品牌身份/字标容器固定 24px、品牌按钮本体 `overflow: hidden`（24px 内容盒）。倍率超过约 1.8 时内容高于 24px/44px，即被这些盒子裁掉底部。
- **修复方式（插件规范·非破坏式）**：在插件自有覆盖样式表（`brand-overrides`，末置注入、同等优先级取胜）中新增"品牌缩放空间"规则组，仅放开上述四个盒子（高度随内容、关闭裁剪），全部锚定在插件**自有** `[data-yizi-logo]` / `[data-yizi-brand-name]` 数据钩子上（`:has()` 直接子代链），不触碰任何核心源码与类名：
  - 品牌按钮 `overflow: visible`；
  - 字标容器 / 品牌身份容器 `height: auto`（核心钉死 24px）；
  - 品牌行（宽态 + 折叠导轨）`overflow: visible` + `min-height` 保持 60px/36px 节奏——行只在内容真正变高时才长高，100% 缩放时布局与核心逐像素一致。
- **兼容性**：规则仅在插件占位组件渲染时生效（锚点即插件自有元素）；卸载插件后无残留。新会话 Hero 区核心本就 `overflow: visible`、行高自适应，无需处理。

---

## 0.5.3 — 2026-10-26

> 新功能：**品牌尺寸整体缩放**——左上角 Logo、品牌字样与徽章按同一倍率缩放（75%–200%）。

### 新增：品牌尺寸滑块（设置 → 外观 → 自定义 → 品牌尺寸）

- **官方接口依据**：品牌展示走 Harness 官方槽位契约——`sidebar.brand.mark` / `conversation.hero.brand.mark` 由宿主传入 REQUESTED 像素尺寸（侧栏 24、新会话 34），占位组件按 `倍率 × 宿主尺寸` 渲染；`sidebar.brand.name` 的契约原文即 "the occupant owns its own content and width"（占位组件拥有内容与宽度），字号缩放完全在官方扩展面内。官方本无品牌尺寸设置项（全仓库无 `logoSize`/`brandSize` 等令牌），此为插件层标准实现。
- **实现**：`CustomBrandConfig` 新增 `scale` 字段（默认 1，钳制 0.75–2.0），持久化在浏览器 `localStorage` 的 `dsh-yizi-themes:brand` 文档中；三个槽位占位组件（侧栏 Logo、字标 + 徽章、新会话 Hero Logo）响应式读取，拖动滑块**即时生效**，无需重启。
- **缩放范围**：Logo（fish 与自定义 SVG 同规则）、字标字号（18px 基准）、徽章字号/内边距/圆角（10px 基准）、字标与徽章间距同步缩放；侧栏品牌行内容区高 44px，200% 时 48px 徽章行仍可完整显示。
- **兼容性**：老版本文档缺失 `scale` 字段时按默认 1 处理；类型错误/越界值钳制回默认，不会破坏渲染。无自定义 Logo 时 fish 同样可缩放。

---

## 0.5.2 — 2026-10-26

> 主题覆盖面补全（对照 **DeepSeek Harness 0.2.1-rc.3** 全量 CSS 变量审计）；并确认对 0.2.1-rc.3 桌面版完美适配（rc.2 → rc.3 仅有新增，无破坏性变更）。完整审计见 `docs/COMPAT-0.2.1-rc.3.md`。

### 兼容性：0.2.1-rc.3 审计结论（P0 无问题，无需改动）

- rc.3 相对 rc.2 仅 6 个提交：导航条目自定义（新增 `sidebar.panellist.actions` / `conversation.session.header.views.actions` / `sidebar.right.tab.guide.actions` 三个纯新增 list 槽 + More 菜单）、导航 pins/菜单图标修复、导航埋点、LLM `/models` 列表。
- 本插件运行时依赖包（`dsh-client-store` / `-ui-primitives` / `-ui-theme` / `-ui-slots` / `-locale` / `-ui-settings` / react 18.3.1）**仅版本号变动，零代码改动**；`icons` 导出只增不减（新增 `IconAppsAddOutline*`）；hero DOM（`EmptyHero`/`HeroShell`）、侧边栏品牌区、右栏 `data-sidebar-right-open/panel`、`data-conversation-header-corner`、`--dsh-windows-titlebar-height` 全部未变。
- 0.5.1 已把运行态文字（「深度求索中，用时…」→ `RunningStatus` + `TextShimmer`）的 `--dsw-alias-label-deep-diving(-shimmer)` / `--dsw-alias-label-shimmer` 全部映射，rc.3 下直接生效；若升级后仍见官方蓝，请确认应用内安装的插件版本 ≥ 0.5.1（`~/.dsh/profiles/desktop/node_modules/dsh-yizi-themes`）。

### 补全 1（P1）：全量令牌审计发现的品牌蓝残留

- **方法**：提取 rc.3 全部客户端 CSS 的 381 个 `var(--…)` 引用，与本插件定义的 84 个变量求差集，剔除非色彩指标与核心内部推导项，逐项映射到 UI 表面。
- **`--dsw-alias-link`**（核心 = 静态 DeepSeek 蓝）：workspace / workflow-run / deliverables / 插件市场 / web-search 设置 / primitives 的全部超链接 → 现映射到 `--dsw-alias-brand-primary`。
- **`--dsw-static-deepseek-400/450/500`** 被组件**直接**消费：Toast 动作按钮文字、FileTypeIcon 默认文件图标墨色 → 在 body 级重映射到主题品牌色（连带让核心所有基于它们的 `color-mix` 派生自动跟随主题）。ANSI 终端色 / 语义状态色用的是独立的 `blue-*` / `neutral-*` 色阶，不受影响。
- **菜单/浮层表面**：`--dsw-menu-surface-fill`（核心钉死 rgba(248,249,250,.58)/rgba(67,69,74,.45) 毛玻璃）、`--dsw-alias-menu-group-header-fill`（分组标题条）、`--dsw-alias-tooltip-key-bg`（tooltip 键位提示底）、`--dsw-alias-button-tool-bar-fill/-hover`（聊天消息悬停工具条，核心钉死 rgba(84,85,87,…)）→ 全部从主题 bg 层 / label 层派生。
- **文档预览面板**：`--dsw-alias-bg-document-preview` / `-bg-document-selection` / `-label-document-preview`（核心钉死静态 neutral-bluish + blue-500 选区）→ 主题 bg 层 + 品牌色选区。
- **Onboarding 引导向导**：`--dsw-alias-onboarding-accent`（核心钉死 #3964fe）等四项 → 主题品牌色与 bg 层（三组渐变 stops 为一次性首屏视觉，暂保持核心值）。

### 补全 2（P2）：状态/语义与「声明未定义」令牌

- 状态语义补齐：`--dsw-alias-state-warn-label`（amber-600 → 主题 warn 色）、`--dsw-alias-state-idle-primary`（StateDot 空闲点 → 主题 dimmed）、`--dsw-alias-label-error`、`--dsw-alias-interactive-bg-hover-danger`（危险 hover，亮 8% / 暗 15% 两档）。
- 填充面文字：`--dsw-alias-label-primary-foreground` / `--dsw-alias-label-primary-inverted`（主按钮填充、附件 chip、BrandWordmark 上的文字）→ 各主题自带的 `--dsw-alias-brand-primary-invert` 配对墨色；`--dsw-alias-border-inverted` 亮色保持透明、暗色取 label 8%。
- 核心声明未定义（前向声明）令牌：`--dsw-alias-bg-l1/l2`、`--dsw-alias-bg-layer-4`、`--dsw-alias-fill-l1/l2/tertiary/tsp-secondary`、`--dsw-alias-label-quaternary`、`--dsw-alias-separator-primary` → 映射到主题既有层级，终端侧栏、任务列表、子代理设置表单、附件卡片获得主题分层（核心此处原本渲染透明/中性 fallback）。
- **ContextMeter「消息」类分段**：`--meter-tint` 在元素级钉死 `--dsw-static-blue-450`，body 级映射不可达；新增 `body[class*="theme-"] [class*="colorMessages"]` 哈希后缀钩子改指主题品牌色（system 灰 / tools 紫保持语义色）。
- 刻意不覆盖（维持 0.5.1 结论）：`bg-mask-*` 遮罩、ANSI 终端色、`file-diff-*`、TrajectoryTable 蓝渐变（无稳定钩子）、HoverCard 预览底（元素级本地定义 `#2C2C2E`，无稳定钩子）、启动屏 `--dsh-boot-*`（核心首屏注入，插件晚于首屏加载，不可行）。

### 修复：暗色模式下 Toast 文字对比度（0.5.1 映射 bug）

- 0.5.1 把 `--dsw-alias-toast-label` 派生自 `--dsw-alias-label-primary-inverted`；但 Toast 表面**两种模式下都是深色**（核心注释：always-dark toast surface），而该令牌在暗色下解析为深灰（neutral-bluish-800）→ 暗色 Toast 文字对比度仅约 2:1。
- 本版改为核心同语义的恒亮白 `var(--dsw-static-neutral-bluish-00)`（核心 `toast-label` 两种模式均为 white）。

---

## 0.5.1 — 2026-10-22

> 适配 **DeepSeek Harness 0.2.1-rc.2**：只读兼容审计确认槽位 / 主题服务 / 模块表 / 设计令牌均未破坏（P0 无问题）；本版修复审计发现的 P1/P2 问题，并修好 Windows 桌面版新会话页浮动主题菜单的两处定位冲突。完整审计见 `docs/COMPAT-0.2.1-rc.2.md`。

### 修复 1：新会话（hero）右上角主题菜单被窗口按钮遮挡

- **现象**：会话内主题菜单正常挂在 `conversation.session.header.utilities` 槽位；但空白 / 新会话页的会话头被隐藏，插件改用的 fixed 浮层只有 `top:12px`，正好落在 Windows 桌面版 `titleBarOverlay` 的原生标题栏条带（40px）里，被最小化 / 最大化 / 关闭按钮压住且点击被窗口按钮吞掉。
- **根因**：桌面版主窗口用 `titleBarOverlay`（`height: 40`）把原生 caption 叠在网页顶部；preload 在 `html` 上写 `data-windows-titlebar` 与 `--dsh-windows-titlebar-height: 40px`，框架据此下移内容，而插件浮层没有把这段 chrome 高度算进去。
- **修复**：`src/client/FloatingControls.tsx` 的浮层改为 `top: calc(var(--dsh-windows-titlebar-height, 0px) + 12px)`，并对宿主加 `-webkit-app-region: no-drag`。变量只由桌面 preload 定义，因此纯 Web / macOS 仍保持原来的 12px 偏移，不受影响。

### 修复 2：新会话浮动菜单与「打开侧边栏」按钮 / 展开后的右栏重叠

- **现象**：浮层抬到 caption 之下后，与空白会话里仍然渲染的右栏展开按钮（`conversation.session.header.corner` 槽的唯一占用者，即右上角「打开侧边栏」）踩在同一块区域；把侧边栏展开后，展开按钮卸载（「shown 时不渲染」），浮层又遮住了右栏面板顶部的内容。
- **根因①**：空白会话隐藏了标题行，但 `headerCorner` 座位照常渲染，按钮贴着内容区右缘（header 右内边距 28px + `margin-right:-16px`）；插件浮层固定在 `right:28px`，两者横向重叠。
- **根因②**：右栏展开后 `[data-conversation-header-corner]` 座位变空，浮层回落到 28px；而右栏是贴右边界的绝对定位列（`[data-sidebar-right-open]`），于是浮层压在面板自己的顶部 chrome（折叠 / 全屏按钮）与内容上。展开只切换面板上的**属性**（无节点插入、面板宽度在折叠时已是最终值、内容靠 transform 滑入），`MutationObserver` 与 `ResizeObserver` 都不会察觉。
- **修复**：浮层在每次 `sync()` 时把「右上角障碍物」统一量测——`[data-conversation-header-corner]` 座位（折叠时的展开按钮）与 `[data-sidebar-right-open]` 面板（展开时的右栏）取最左边界，把浮层 `right` 抬到该边界左侧 8px（无边界时 28px）。另加三个触发器：`window resize`、面板 `ResizeObserver`（拖拽改宽）、以及只监听 `data-sidebar-right-open` / `data-sidebar-right-panel` 两个属性的 `MutationObserver`（展开 / 折叠 / 全屏切换）。右栏全屏（宽度≈满屏）时没有可放位置，浮层自动隐藏；离开全屏或折叠后恢复。
- **验证**：按 0.2.1 的 header / 右栏几何模拟（1500px 视口）：修复前浮层右缘 1876 > 座位左缘 1864（重叠）；修复后右缘 1856、间隙 8px。展开（仅属性变化）→ 右缘 448（面板左 1060）；拖宽到 640px → 右缘 648；全屏 → 隐藏；折叠 → 回到 48；hero 消失后即使面板改宽也保持隐藏。

### 修复 3（P1）：自定义「新会话标题」会删掉核心 hero 的「预览」徽章

- **现象**：0.2.1 把 hero 标题文本与 `preview` 徽章包进同一个 `span.titleGroup`（`span: 标题文本` + `span.previewBadge: 预览`）。插件旧的 DOM 写入把整个 titleGroup 当标题节点，`textContent = 自定义标题` 会**删掉徽章**；恢复默认标题时又把拼接文本「探索未至之境预览」写回去，徽章永久消失直到 React 重新渲染。
- **修复**：`src/client/brand-apply.ts` 新增 `headlineTextTarget()`：当兄弟节点是分组容器时，下钻到其首个元素子节点（标题 span）再写 `textContent`；旧版「兄弟即标题 span」结构原样返回。浏览器内结构模拟：新版结构改标题后徽章仍在、恢复后标题与徽章都正确；旧结构行为不变。

### 修复 4（P2）：hero 槽位不再顶掉官方悬停摆尾动画

- **现象**：single 槽一旦有人注册就占住座位（渲染 null 也不会回落到 fallback）；插件在默认（未设自定义 logo）时也注册 `conversation.hero.brand.mark`，于是 0.2.1 新加的 hover 动画鱼被替换成静态鱼。
- **修复**：`src/client/brand-slots.tsx` 的 hero 座位改为跟随 `brandStore` **动态注册/注销**——只有设置了自定义 logo 才占座，否则把座位还给核心动画 fallback；侧边栏两个品牌座位保持常驻（插件默认品牌字样依赖它们）。

### 修复 5（P2）：0.2.1 失效选择器与未覆盖的设计令牌

- **失效选择器**：`[data-chat-flow=""] [role="status"][aria-live="polite"]`（0.2.1 的 `role=status` 已不再带 `aria-live`，运行态文字改用 `TextShimmer` 原语）与 `[data-state="ongoing"]{--dsh-state-ongoing:…}`（该变量在 0.2.1 未定义）已删除。
- **令牌补齐**：`brand-overrides.css` 新增一段 `body[class*="theme-"]` 别名映射，把 0.2.1 新增/常用的 `--dsw-alias-label-shimmer`、`--dsw-alias-label-deep-diving(-shimmer)`、`--dsw-alias-settings-card-fill/-stroke`、`--dsw-alias-menu-icon`、`--dsw-alias-turn-trigger-bg(-hover)`、`--dsw-alias-switch-thumb`、`--dsw-alias-toast-label` 从各主题已有的令牌派生出来（`var()`/`color-mix` 引用），19 套主题自动生效；`default` 主题不挂 class，保持核心原值。`bg-mask-*` / `file-diff-*` 属中性遮罩与语义色，刻意不主题化。
- **SVG 指纹选择器**：`span:has(> svg[…])` / `button:has(> svg[…])` 放松为后代 `:has(svg[…])`，槽位包裹层（`div[data-slot][display:contents]`）存在时仍能命中核心 fallback 品牌图形。

### 修复 6（P2）：品牌重绘节流与主题 class 清理收敛

- `src/client/index.ts` 的 `MutationObserver` 不再每次 DOM 变更都执行整轮 `applyBrand` + `themeBackend.reassert()` + 浮动条 `sync()`：改为 `requestAnimationFrame` 合并到每帧一次（文本替换仍逐条即时处理），流式输出时显著降负；dispose 时取消挂起的帧。
- `src/client/theme-backend.ts` 不再删除 body 上所有 `theme-*` class，只清理插件自己 19 个主题 id 对应的 class，避免误删第三方同名 class。

---

## 0.5.0 — 2026-10-12

> 适配 **DeepSeek Harness 0.2.0-rc.2**（`dsh-client-store` / `configForms` 一代；桌面版 `@deepseek-ai/dsh-desktop 0.2.0-rc.2`）。
> 修复「装到桌面版后 DeepSeek Harness Desktop 起不来」，以及品牌持久化、明暗图标、与官方品牌插件抢槽位三个连带问题。

### 修复 1（严重）：安装后桌面版无法启动

- **现象**：桌面版安装 `dsh-yizi-themes` 后，应用启动即失败（窗口黑屏 / 无界面）。崩溃日志 `logs/crash-*-web-boot.log`：
  ```
  Error: web boot: 1 entry did not activate
  dsh-yizi-themes: import failed: client-modules: require("@deepseek-ai/dsh-client-runtime/client")
    missed the module table — not a platform seed word, not a materialized module,
    and no registered package factory
  ```
- **根因**：Harness 在 `dsh-client-runtime` 一代之后**删除了 `@deepseek-ai/dsh-client-runtime` 包**，客户端模块表（`dsh-client-modules` 的 `PLATFORM_MODULES` 种子表）改为 `react` / `@deepseek-ai/cordis` / `@deepseek-ai/dsh-client-store` / `@deepseek-ai/dsh-client-ui-slots` / `-ui-primitives` / `-ui-dockkit`。旧包仍 `require('@deepseek-ai/dsh-client-runtime/client')`，模块表里查不到、又没有注册工厂 → 该 entry 激活失败。桌面版的 web 引导是"全有或全无"：**任何 entry 激活失败，整个客户端引导即中止**，所以插件直接拖垮了桌面版启动。
- **修复**：`defineStore` 改从 `@deepseek-ai/dsh-client-store` 导入（该包是本代平台种子之一），客户端 bundle 不再引用任何已删除模块。

### 修复 2：`ctx.settingsScope` 被移除 → 自定义品牌改为本地持久化

- **根因**：`settingsScope` 服务在本代被 `ctx.configForms` 取代；核心 `ui-theme` 设置 schema 也收窄为 `{ preference, fontSize }`——`customBrand` / 风格主题字段不再存在，`createThemeRuntime().setThemeId` 一并移除。旧代码读写这些字段必然失败（品牌设置"能输入、刷新即丢"）。
- **修复**：自定义品牌文档（Logo / 品牌字样 / 徽章 / 新会话标题 / 品牌映射）改为**浏览器本地持久化**（`localStorage` key `dsh-yizi-themes:brand`），写入后同步推进内存 store 并重绘，不再依赖任何被移除的设置传输层；风格主题沿用既有的插件自管路径（`localStorage` + `body.theme-<id>`）。明暗偏好仍走核心 `ctx.theme`。

### 修复 3：明暗图标具名导入变 `undefined` → React 崩溃

- **根因**：本代 icon 集改名（`IconDarkOutline16` → `IconDarkOutlineRegular` / `IconDarkOutlineMedium`）。`import { IconDarkOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'` 在运行期得到 `undefined`，React 渲染即抛 `Minified React error #130`（element type is invalid），会话头部 / 浮动控制条整块渲染失败。
- **修复**：新增 `src/client/primitives-compat.ts`，通过模块命名空间**跨世代解析**图标导出（`IconDarkOutlineRegular` → `IconDarkOutlineMedium` → `IconDarkOutline16`，含 `FishLogo`）；解析不到时该图形省略、控件照常渲染，不再整块崩。

### 修复 4：与官方品牌插件争抢 single 槽位

- **根因**：标准构建里**始终**组合 `@deepseek-ai/dsh-client-ui-brand-official`，它也在 `sidebar.brand.mark` / `sidebar.brand.name` 注册（默认 priority 0）。single 槽位**不允许同优先级第二个占用者**，后注册者抛
  `single slot "sidebar.brand.mark" already has a registration at priority 0 (registered by dsh-yizi-themes)`——谁的注册晚谁报错，行为随机且控制台报错。
- **修复**：本插件的品牌槽位统一以 `priority: -100` 注册。single 槽位渲染**最低优先级**的占用者，因此两者可以共存、且本插件的品牌确定性地生效（官方插件不再报错）。

### 工程侧

- `package.json`：`dsh.client.inject` 指向本代真实存在的客户端包（`@deepseek-ai/dsh-client-locale` / `-ui-theme`）；外部依赖收敛为平台种子（`@deepseek-ai/dsh-client-store` / `-ui-primitives` / `react` / `react-dom/client` / `react/jsx-runtime`）的 peer（`*`、optional）。
- 新增回归验证方法：隔离 `DSH_HOME` + 独立 profile 起 `dsh --profile <test>`，用 headless 浏览器断言"样式注入 / 槽位渲染 / 主题切换持久化 / 品牌持久化 / 零控制台错误"。

### 验证（隔离 profile，0.2.0-rc.2 运行时）

启动即激活；侧边栏品牌（`DEEPSEEK`+`HARNESS`）、新会话 hero 品牌、浮动控制条均渲染；设置→外观出现 20 张主题卡片与自定义品牌输入；切主题 → `body.theme-aurora` 且 localStorage 落盘，刷新后保持；改品牌字样 → 侧边栏实时更新、刷新后保持；**控制台零错误、零失败请求**。

---

## 0.4.0 — 2026-08-28

> 适配 Harness dsh-v0.1.2-alpha.1：官方移除 `@deepseek-ai/dsh-client-runtime` 包后，插件迁移到新基线 `@deepseek-ai/dsh-client-store` / `@deepseek-ai/cordis`。

### 背景：Harness 移除 client-runtime 包

- Harness 在 dsh-v0.1.2-alpha.1（提交 `be531688f3`）把客户端运行时拆解：`defineStore` / `EngineStoreHandle` 迁入 `@deepseek-ai/dsh-client-store`（同名同签名），`ClientContext` 类型迁回 `@deepseek-ai/cordis`，并**删除了 `@deepseek-ai/dsh-client-runtime` 包**。
- 旧版插件在 `dsh.client.inject` 里声明注入 `@deepseek-ai/dsh-client-runtime`，web 前端构建 client-modules 模块表时找不到该包 → 启动报 `require("@deepseek-ai/dsh-client-runtime/client") missed the module table`，插件加载失败。

### 迁移

- `src/client/settings-store.ts`：`defineStore` / `EngineStoreHandle` 改从 `@deepseek-ai/dsh-client-store` 导入（API 同名同签名，零行为变化）。
- `src/client/index.ts`：`ClientContext` 改从 `@deepseek-ai/cordis` 导入。
- `package.json`：`dsh.client.inject`、peer/dev dependencies 里 `@deepseek-ai/dsh-client-runtime` → `@deepseek-ai/dsh-client-store`（对齐官方规范：store 是平台基线，放 devDependencies）。
- `prepare.mjs`：浏览器 bundle 的 external / noExternal 列表同步迁移。

### 兼容性

- **0.4.0 仅适配 dsh-v0.1.2-alpha.1 及以上**（依赖已删除的 runtime 包无法在旧版运行）。
- 主题、自定义品牌、品牌映射、槽位渲染等全部功能行为不变。

### 验证

- 在 dsh-v0.1.2-alpha.1 的 Web profile 实机验证：插件正常加载（模块表解析 `dsh-client-store` 成功）、主题切换与自定义品牌可用、服务端日志无错误。

---

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
