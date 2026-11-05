# 兼容审计：Harness 0.2.2-rc.1

> 审计基线：插件此前只声明适配到 `dsh-v0.2.1-rc.3`（0.5.2 版审计）。
> 本次一次性覆盖 `rc.3 → rc.4 → rc.5 → 0.2.2-rc.1` 三个跨度，结论驱动 0.5.7。
>
> 审计方法沿用 0.2.1 时代的只读方式：**不 checkout、不安装 rc.1 依赖**，全部对照
> 上游仓库里的 tag 引用读取源码（`git show <tag>:<path>` / `git diff <tag1> <tag2>`），
> 再对插件逐个集成面求证据。

## 结论摘要

| 等级 | 数量 | 说明 |
|---|---|---|
| **P0（破坏性，必须改）** | **0** | 0.2.2-rc.1 上插件可零改动启动；槽位、主题服务、命令契约、品牌槽、内联 token 机制全部保留 |
| **P1（建议改 / 需补声明）** | 3 | 缺 `engines.dsh`；移动端（头号特性）从未适配；品牌映射在代码块里会改坏内容 |
| **P2（可选增强）** | 4 | 令牌增量、插件索引元数据、设置导航图标、新增 6 种界面语言 |

**总体判断：零破坏性变更。** 插件在 0.2.2-rc.1 上不需为「跑起来」改任何一行代码；
0.5.7 的改动全部来自 P1/P2 的主动增强，而非兼容性补救。

---

## 一、分版本相关变更

### rc.3 → rc.4（2026-10-26 / 10-28）

上游 rc.4 只有一个修复：**ACP 模式下诊断输出混入 stdout**（`@LegGasai, @tianyicui`）。
纯 Host 侧 stdout 行为，**不涉及任何客户端 UI**。插件零影响。

### rc.4 → rc.5（2026-10-29 / 10-30）

上游 rc.5 只有一个改动：**优化对话中思考内容的展示效果**（`@LegGasai`）。

对本插件的影响：思考内容的 DOM/样式改版。插件没有针对思考区的专用规则，
主题通过 `--dsw-alias-*` 令牌继承生效，因此只要令牌名不变就不受影响
（令牌差集见第三节）。**零代码改动。**

### rc.5 → 0.2.2-rc.1（2026-11-04）

0.2.2 系列首个候选版，是本次审计的主体。与本插件相关的条目：

| 上游变更 | 与本插件的关系 | 判定 |
|---|---|---|
| **完善手机 / 平板适配**（软键盘、导航、窄屏布局）——本版头号特性 | 插件的浮动控件、设置行、工作室面板均为桌面几何假设 | **P1**（见第四节） |
| **同步 Cordis Core 至 4.1.0、Loader 至 1.1.0**，统一配置访问与持久化 | 插件不使用 fiber 配置读写，只用 `ctx.effect` / `ctx.inject` / 服务注入 | 无影响（已实测，见第五节） |
| **插件管理支持更新第三方包，热更新失败回滚** | 插件 0.5.6 起 apply 全阶段隔离 + 注册幂等，正是热更新前提 | **P2** → 已在 0.5.7 用真实 bundle 实测通过 |
| **插件可为自己的设置页面提供导航图标** | 该能力作用于**设置分区**（section）级，本插件是 General 分区内的 **item**，不适用 | P2（记录结论） |
| **统一右键 / 键盘菜单，支持开发者扩展** | 可把「切换主题」挂进右键菜单 | P2（本次未实现） |
| **新增 6 种界面语言**（ja/es/fr/de/ru/pt-BR） | 插件字典只有 zh / en | P2（记录结论） |
| **修复启停插件时其他插件样式被移除** | 与本插件的 `<style>` 注入方式相关 | 需回归 → 已纳入幂等实测 |
| **Node.js 最低版本提高到 24.9** | 构建环境要求 | 已确认（本机 24.15.0） |
| Session Projection 注册改异步、stats 入口拆分、official-bundles 迁移 | 均属 Host/SDK 侧，纯 UI 主题插件不涉及 | 无影响 |

---

## 二、逐集成面核实表

全部证据取自 `dsh-v0.2.2-rc.1` 标签内源码。

| # | 集成面 | 插件依赖点 | rc.3 | rc.1 | 影响 | 等级 |
|---|---|---|---|---|---|---|
| 1 | `settings.general.item` | 注册外观行 | 存在 | **存在** | 无 | — |
| 2 | `conversation.session.header.utilities` | 注册头部主题控件 | 存在 | **存在** | 无 | — |
| 3 | `sidebar.brand.mark` | 侧栏 Logo 槽 | 存在 | **存在** | 无 | — |
| 4 | `sidebar.brand.name` | 品牌字样 + 徽章槽 | 存在 | **存在** | 无 | — |
| 5 | `conversation.hero.brand.mark` | 新会话 Hero 品牌槽 | 存在 | **存在** | 无 | — |
| 6 | 槽位重复注册行为 | 插件幂等策略 | 同优先级 second 抛错 | **不变** | 无 | — |
| 7 | `ThemePresenter` 内联 token | 自定义主题用 `!important` 压制 | `body.style.setProperty` | **不变**（`ui-layout/src/client/theme-presenter.ts` 仍用 setProperty） | 无 | — |
| 8 | `ThemeSnapshot` 形状 | 读 `preference` / `themes` / `active` | 含 `preference.themes.active` | **不变** | 无 | — |
| 9 | `theme.setTheme(id)` | 明暗切换 | 存在 | **存在** | 无 | — |
| 10 | `theme.register(definition)` | 可选注册（coreThemeApi 路径） | 存在 | **存在**（`ThemeRuntime.register`） | 无 | — |
| 11 | `setThemeId` | 插件「核心路径」探测 | rc.3 已无 | **仍无** | 插件自动走 localStorage 路径（设计如此） | — |
| 12 | `theme/change` 事件 | 订阅变化 | 存在 | **存在** | 无 | — |
| 13 | `commandUi.register` + `popupSelect` | `/theme` 命令 | 存在 | **存在**（`ui-commands/src/client/service.ts`、`PopupSelectView.tsx`） | 无 | — |
| 14 | `ctx.locale.register` / `bind` | 字典与文案 | 存在 | **存在** | 无 | — |
| 15 | `data-conversation-header-corner` | 浮动控件避让 | 存在 | **存在**（`ui-conversation/.../ConversationSession.tsx`） | 无 | — |
| 16 | `data-sidebar-right-open` / `-panel` | 浮动控件避让 | 存在 | **存在**（`ui-sidebar-right/.../SidebarRight.tsx`） | 无 | — |
| 17 | `titleGroup`（hero 标题 + 预览徽章） | 自定义标题下钻 | 存在 | **存在**（`EmptyHero.tsx`、`HeroShell.module.css`） | 无 | — |
| 18 | `--dsh-windows-titlebar-height` | 桌面标题栏避让 | 存在（preload） | **存在**（`apps/desktop/src/preload-windows.ts`，仍写 40px） | 无 | — |
| 19 | `[data-yizi-hero-mark]` | 插件自有锚点 | — | 插件自建 | 无 | — |
| 20 | 移动端断点 | 插件响应式 | — | 主断点 **767px**（另有 560 / 720 / 760 / 1100） | 插件原先未适配 | **P1** |

> 说明：第 11 项不是回归——`setThemeId` 从未出现在 `dsh-client-store` 一代，
> 插件自 0.2.3 起就实现了插件路径（`localStorage` + 自行切换 `body.theme-<id>`），
> 0.2.2-rc.1 仍是该局面，继续走插件路径。

---

## 三、CSS 令牌差集（rc.3 → 0.2.2-rc.1）

方法：分别 grep 两个标签下 `packages/client` 中全部 `--dsw-*` 变量名并求差集。
rc.3 独有 **436** 个，rc.1 独有 **450** 个。

### 新增（14 个）

| 令牌 | UI 表面 | 插件是否覆盖 |
|---|---|---|
| `--dsw-alias-illustration-*`（8 个：background / backing / detail / inset / shadow / surface / illustration- / -illustration-） | 插画/占位插图区（含两个书写中的半截名，上游内部使用） | **未覆盖**（非主题语义，P2） |
| `--dsw-alias-state-done-primary` | 任务「已完成」状态 | **未覆盖**（P2，可映射到 success） |
| `--dsw-static-neutral-bluish-55` / `-90` / `-310` | 中性色阶新增档 | **未覆盖**（插件只重映射 `--dsw-static-deepseek-400/450/500` 三档品牌蓝，中性色阶刻意保持核心值） |
| `--dsw-static-violet-400` / `-600` | 紫色阶（推测用于新特性） | **未覆盖**（插件无显式 violet static 映射；P2） |
| `--dsw-static-missing` | 缺失占位 | 无关 |

### 移除（1 个）

| 令牌 | 影响 |
|---|---|
| `--dsw-specific-sidebar-nav-item-hover` | **插件在自定义主题里仍定义它**。核心不再引用 ⇒ 该声明变成死声明，无副作用（不报错、不影响渲染）。可保留（兼容旧核心）或后续清理。 |

> 结论：令牌层**无破坏性缺失**。插件定义的 84+ 个令牌中，被核心移除引用的只有 1 个，
> 且属「多定义无害」。新增令牌均为新表面，未覆盖时回退到核心默认值，不影响可读性。

---

## 四、移动端（P1）：风险点与 0.5.7 处理

0.2.2 把手机/平板适配作为头号特性，上游新增了大量 `max-width: 767px` 与
`pointer: coarse` 规则。插件此前**没有任何响应式规则**，风险点如下：

| 位置 | 窄屏下的问题 | 0.5.7 处理 |
|---|---|---|
| 主题网格 `.dsw-yizi-theme-grid` | `minmax(180px,1fr)` 在 320–375px 宽度只能放 1 列，卡片过高 | 窄屏降为 `minmax(132px,1fr)` |
| 工作室编辑行 `.dsw-yizi-studio-row` | 名称输入 + 两个预览在手机宽度被压缩到不可用 | 允许换行，名称占满一整行 |
| 工作室已存列表 `.dsw-yizi-studio-item` | 预览 + 名称 + 三个按钮挤在一行溢出 | 允许换行，按钮组换到下一行右对齐 |
| 映射表 `.dsw-yizi-mapping-grid` | 双列在窄屏溢出 | 降为单列 |
| 对比度面板 `.dsw-yizi-contrast-grid` | 自适应列在同屏挤压 | 窄屏单列 |
| 传输按钮 `.dsw-yizi-transfer-actions` | 并排按钮溢出 | 窄屏纵向堆叠、占满宽度 |
| 触控目标（chips / 行按钮 / 诊断按钮） | 高度约 20–26px，低于 44px 舒适区；`hover` 在触屏不出现 | `pointer: coarse` 下提高内边距与最小高度 |
| 浮动控件 `FloatingControls` | 已是「量测障碍物后动态定位」，窄屏下右侧无空间时自动隐藏 | 逻辑本身已自适应，无需改动 |

---

## 五、热更新 / 双重 apply 实测（P2 → 已通过）

上游 0.2.2 支持插件包热更新与失败回滚，前提是插件二次 apply 不能出错。
0.5.6 已做「全阶段 `guarded` + 注册幂等」，本次用**真实构建产物**回归：

- 脚本：`scripts/hot-reload-check.mjs`（CI 中执行）
- 方法：加载真实 `dist/client.js`，用最小 DOM + 服务桩模拟 `slots`（single 槽同优先级
  重复注册会**真的抛错**，忠实还原核心校验），连续调用 `apply(ctx)` **两次**；
- 结果：**2 次 apply 均不抛出**；重复注册被插件自身 `warn` 后跳过；
  `settings.general.item` 与品牌槽各保留 **1 份**；`<style>` 宿主只创建 **1 个**；
  bootlog 中**无 `FAIL:`** 阶段。

该检查同时覆盖了上游「启停插件时其他插件样式被移除」这一修复点：样式表宿主按 id
复用（`injectThemeSheets`），不会在重复加载时叠加第二份。

---

## 六、插件元数据：`engines.dsh` 与索引声明

上游自 0.2.1-rc.1 起，第三方插件兼容性**优先按 `engines.dsh` 判断**，未声明时回退到
扫描 `peerDependencies` 中的 `@deepseek-ai/dsh*` 名称。证据：
`packages/boot/app-boot/src/plugin-compatibility.ts`：

```ts
const engines = Object.hasOwn(fields, 'engines') ? objectOf(fields.engines, 'Plugin manifest engines') : {}
if (Object.hasOwn(engines, 'dsh')) {
  const range = engines.dsh
  ...
  return satisfies(runtimeVersion, range) ? {} : { 'engines.dsh': range }
}
```

匹配用 `semver.satisfies(..., { includePrerelease: true })`，即**预发布版本参与区间匹配**。
未满足时插件被标记不兼容，安装/启动会给出显式诊断并要求 exact-version 豁免。

**0.5.7 处理**：`package.json` 增加

```json
"engines": { "dsh": ">=0.1.2-alpha.1" }
```

理由：插件面向 `dsh-client-store` 一代（0.1.2-alpha.1 起），并在 0.2.2-rc.1 上实测可运行；
用下界而非区间上界，避免上游每发一个 rc 就把插件判为不兼容（乐观锁 + 逐版审计是本项目既有策略）。

**插件索引 / 富文本详情元数据**：补充 `description`（含功能关键词）、`keywords`、
`author`、`homepage`、`repository`、`bugs`，便于自定义插件索引与插件管理页展示。

**设置导航图标**：上游实现为 `settings.section.icon` 槽
（`packages/client/ui-settings-general/src/client/SettingsRoot.tsx` 的
`renderSlot('settings.section.icon', ...)`），作用于**设置分区**行。本插件注册的是
General 分区内的 item（`settings.general.item`），**不在该槽的作用域**，故不适用。

---

## 七、插件必须修改项

**无。** 0.2.2-rc.1 上零改动即可运行。

## 八、建议修改项（0.5.7 已全部落地）

| # | 事项 | 状态 |
|---|---|---|
| 1 | 声明 `engines.dsh` | ✅ 已加 |
| 2 | 窄屏 / 触屏响应式（767px + coarse pointer） | ✅ 已加 |
| 3 | 品牌映射收窄：不改写代码块 / 终端 / 输入区 | ✅ 已加 |
| 4 | 热更新双 apply 回归脚本 | ✅ 已加（CI） |
| 5 | 补 `--dsw-alias-state-done-primary` 等新增令牌 | ⏳ P2 未做（非主题语义，视觉影响小） |
| 6 | 6 种新增界面语言 | ⏳ P2 未做（英文已完整，`Record<ThemeKey,string>` 强制） |

## 九、无需改动项

- 全部槽位名与槽位语义
- `ThemePresenter` 内联 token 机制（自定义主题的 `!important` 策略继续有效）
- 主题运行时 API（`getTheme` / `setTheme` / `register` / `theme/change`）
- `/theme` 的 `popupSelect` 契约
- 桌面标题栏变量与 40px 高度
- 右栏 / header corner 的避让锚点
- hero `titleGroup` 结构

---

## 附：证据索引

- 上游仓库：<https://github.com/deepseek-ai/deepseek-harness>
- 对照标签：`dsh-v0.2.1-rc.3`、`dsh-v0.2.1-rc.5`、`dsh-v0.2.2-rc.1`
- 0.2.2-rc.1 发布说明：<https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-rc.1>
- 兼容判定实现：`packages/boot/app-boot/src/plugin-compatibility.ts`
- 主题运行时：`packages/client/ui-theme/src/client/index.ts`
- 主题内联注入：`packages/client/ui-layout/src/client/theme-presenter.ts`
- 设置导航图标槽：`packages/client/ui-settings-general/src/client/SettingsRoot.tsx`
- 桌面标题栏：`apps/desktop/src/preload-windows.ts`
- 移动端断点：`packages/client/**/*.css`（`max-width: 767px` 为 12 处主断点）
