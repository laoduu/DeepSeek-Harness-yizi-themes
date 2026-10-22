# 兼容性审计：dsh-yizi-themes 0.5.0 ↔ DeepSeek Harness 0.2.1-rc.2

- 审计对象：桌面版内置 Harness `0.2.1-rc.2`（`app.asar` → `dsh/`，客户端包 `dist/` 资源）。
- 方法：只读比对 app.asar 内 `dsh-web-frontend` / `dsh-client-*` 包、shell 组合包与插件源码；关键 DOM 结论在浏览器里用结构模拟复核。审计期间未改动 Harness。
- 结论：**P0 无问题**（能加载、能注册、无模块缺失）；发现 1 个 P1 回归和若干 P2 风险。
- 状态：P1 与下列 P2 均已在 **0.5.1** 处理（详见 CHANGELOG），本文保留最初的审计记录。

## 1. 判定汇总

| 项 | 主题 | 判定 |
|---|---|---|
| 1 | client 槽位声明 / 注册选项 | 兼容 |
| 2 | theme 服务 / snapshot / 事件 | 兼容（core `setThemeId` 分支永不激活） |
| 3 | 设计令牌（`--dsw-*`） | 基本兼容：74 个在用 token 全部仍定义；个别选择器/变量失效（P2） |
| 4 | 品牌 DOM 锚点 / SVG 指纹 | 有风险：hero 标题兄弟结构变化（P1，已修） |
| 5 | locale / effect / store / 清单字段 | 兼容 |
| 6 | React | 兼容（shell 提供 18.3.1，peer `^18.2`） |
| 7 | 其他 | P2 级（死选择器、全量 MutationObserver、未覆盖 token） |

## 2. 已验证正常（无需修改）

- **模块表**：插件 bundle 只 require `@deepseek-ai/dsh-client-store`、`-ui-primitives`、`react`、`react-dom/client`、`react/jsx-runtime`，全部命中 shell 静态模块表；不含已删除的 `dsh-client-runtime`。启动无 `import failed`。
- **槽位**：`sidebar.brand.mark` / `sidebar.brand.name`（single/root）、`conversation.hero.brand.mark`（single/root）、`settings.general.item`（list/root）、`conversation.session.header.utilities`（list/session）均仍声明；注册选项 `id` / `order` / `priority` / `store` / `locale` / `inject` 全部被接受。
- **槽位优先级**：single 槽渲染最低 priority；官方品牌插件默认 0，本插件 `-100` 合法胜出，不会像 0.5.0 之前那样抛「already has a registration at priority 0」。
- **主题服务**：`getTheme` / `setTheme` / `register` / `overrideTokens` / `theme/change` 仍在；snapshot 为 `{preference, fontSizes, fontFamilies, active, themes, revision}`，**无 `theme` 字段**，`setThemeId` 全仓不存在 → 插件走 localStorage + `body.theme-<id>` 路径是正确的，且与核心外观行（`appearance` / `font-size`）无 id 冲突。
- **令牌覆盖**：核心亮色定义在 `body{…}`、暗色在 `body[data-ds-dark-theme]{…}`；插件 `body.theme-X`(0,1,1)、`body.theme-X[data-ds-dark-theme]`(0,2,1) 特异性更高，且插件样式表在核心之后注入，覆盖可靠。插件 74 个 `--dsw-*` 全部仍定义，无删名。
- **locale / store / 生命周期**：`ctx.locale.register(ns, {zh,en})`、`ctx.effect`、`slots.inject`、`defineStore({init,actions}) → {spec, create}` 用法均与 0.2.1 一致。
- **图标**：`IconDarkOutline16` 已删，但 `IconDarkOutlineRegular/Medium`、`IconLightOutlineRegular/Medium`、`FishLogo` 仍在 primitives 导出，`primitives-compat.ts` 的跨世代解析先命中新名。

## 3. P1（已修复）：自定义新会话标题会删掉「预览」徽章

- 0.2.1 hero 结构：`span.fishHitbox`（含 `conversation.hero.brand.mark` 槽）的兄弟节点是 `span.titleGroup`，其子节点为 `span`（标题文本）+ `span.previewBadge`（`预览`）。
- 旧实现（`src/client/brand-apply.ts`）把 `titleGroup` 当标题节点，`textContent = 自定义标题` 直接抹掉徽章；恢复默认时写回拼接文本「探索未至之境预览」，徽章消失到下次 React 重渲染。
- 修复：`headlineTextTarget()` 在兄弟节点有元素子节点时下钻到首个元素子节点再写文本；旧结构（兄弟即标题 span）原样返回。
- 浏览器结构模拟：新版结构下改标题后 `previewBadge` 保留、恢复后标题/徽章均正确；旧结构行为不变。

## 4. P2（0.5.1 已处理；以下为审计时的原始建议）

> **0.5.1 处理方式**：① hero 槽改为按 `logo` 动态注册/注销；② 删除失效的 `[aria-live]` / `--dsh-state-ongoing` 规则，运行态文字改用 `--dsw-alias-label-shimmer`（`TextShimmer` 的扫光色）等别名映射实现主题化；③ SVG 指纹选择器放松为后代 `:has(svg[…])`；④ 新增 `body[class*="theme-"]` 别名映射补齐 `settings-card-*`、`menu-icon`、`label-deep-diving*`、`label-shimmer`、`turn-trigger-*`、`switch-thumb`、`toast-label`（`bg-mask-*` 是中性遮罩、`file-diff-*` 是语义色，均刻意不主题化）；⑤ `MutationObserver` 的品牌重绘用 `requestAnimationFrame` 合并，`applyThemeClass` 只清理插件自己的 19 个主题 class。

1. **hero 槽位占用导致官方悬停摆尾动画消失**：0.2.1 只在槽位「无任何 entry」时渲染带 hover 动画的 fallback `HeroFish`；插件始终注册 hero 槽并渲染静态 `FishLogo`（即使未设置自定义 logo）。建议：`logo === ''` 时不注册 hero 槽，按 `brandStore` 变化动态注册/注销，把座位还给官方动画。
2. **失效选择器**：`brand-overrides.css` 的 `[data-chat-flow=""] [role="status"][aria-live="polite"]`（0.2.1 仍有 `data-chat-flow`，但 `role=status` 元素不再带 `aria-live`；运行态文字改用 `TextShimmer` 原语）与 `[data-state="ongoing"] { --dsh-state-ongoing: … }`（变量在 0.2.1 未定义）已不命中，可删除或改用 `ctx.theme.overrideTokens(...)` / 现成 `--dsw-alias-label-deep-diving`。
3. **SVG 指纹选择器不再命中**：`span:has(> svg[viewBox="0 0 23.16 17.04"][width="34"])`、`button:has(> svg[viewBox="0 0 182 24"])` 要求 svg 为直接子节点，但槽位渲染在 `div[data-slot][style="display:contents"]` 内；现代路径由 `[data-yizi-*]` 自行上色，故只影响核心 fallback 的配色。建议删除或改为后代 `:has(svg[...])`。
4. **未覆盖的新 token**：0.2.1 新增/常用的 `--dsw-alias-settings-card-fill`、`--dsw-alias-label-deep-diving`、`--dsw-alias-bg-mask-*`、`--dsw-alias-menu-icon`、`--dsw-alias-file-diff-*` 未纳入 19 套主题，这些表面保持默认灰蓝，可按需补齐。
5. **MutationObserver 开销**：`src/client/index.ts` 监听 `document.body` 的 `childList/subtree/characterData`，每次变更都 `applyBrand` + `themeBackend.reassert()`，流式输出时频率较高。建议 rAF 节流；`theme-backend.ts` 的 `applyThemeClass` 删除 body 上所有 `theme-*` class 也可收窄为插件自有前缀（如 `yizi-theme-`），避免误删第三方同名 class。

## 5. 附：本次一并修复的 Windows 定位问题

新会话（hero）页的浮动主题菜单 `top` 原为 `12px`，在 Windows 桌面版 `titleBarOverlay` 的 40px 原生标题栏条带内，被最小化/最大化/关闭按钮遮挡。现改为 `calc(var(--dsh-windows-titlebar-height, 0px) + 12px)` 并加 `-webkit-app-region: no-drag`；纯 Web / macOS 无该变量时仍为 12px。详见 CHANGELOG。

同一浮层的右侧锚点也改为动态量测：折叠时避让 `conversation.session.header.corner` 里仍渲染的「打开侧边栏」按钮；右栏展开后（`[data-sidebar-right-open]`）避让整块面板的左缘——展开时该按钮按设计卸载、面板宽度在折叠时已是最终值，只切换属性，因此除 `resize` 外还挂了面板 `ResizeObserver` 与只过滤 `data-sidebar-right-open` / `data-sidebar-right-panel` 的 `MutationObserver`；右栏全屏时无位置可放，浮层隐藏。
