/**
 * Theme override sheets — imported as raw strings and injected into
 * the document on plugin load. Each sheet keys off `body.theme-<id>`
 * (light) and `body.theme-<id>[data-ds-dark-theme]` (dark).
 */

export const academicCss = `/* ═══════════════════════════════════════════════════════════════
   Academic 学术蓝 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/academic.css：
   - 亮色：淡蓝白底 + #002FA7 深蓝品牌色，沉稳专业
   - 暗色：GitHub Dark 深蓝黑 + 亮蓝
   ═══════════════════════════════════════════════════════════════ */

body.theme-academic {
  /* 背景层 */
  --dsw-alias-bg-base: #f5f8ff;
  --dsw-alias-bg-layer-1: #f8faff;
  --dsw-alias-bg-layer-2: #edf2ff;
  --dsw-alias-bg-layer-3: #e6edff;
  --dsw-alias-bg-overlay: #edf2ff;
  --dsw-alias-bg-module-platform: #edf2ff;
  --dsw-alias-bg-multi-select: #e6edff;
  --dsw-alias-bg-skeleton: rgba(0, 47, 167, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #1a1a2e;
  --dsw-alias-label-primary-dimmed: #2a2a44;
  --dsw-alias-label-primary-bluish: #002fa7;
  --dsw-alias-label-secondary: #5a7ce3;
  --dsw-alias-label-tertiary: #6a86d8;
  --dsw-alias-label-caption: #7a92d0;
  --dsw-alias-label-dimmed: #8aa2d8;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(0, 47, 167, 0.10);
  --dsw-alias-border-l2: rgba(0, 47, 167, 0.16);
  --dsw-alias-border-l3: rgba(0, 47, 167, 0.22);
  --dsw-alias-border-l4: rgba(0, 47, 167, 0.28);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #002fa7;
  --dsw-alias-brand-text: #002a96;
  --dsw-alias-brand-primary-invert: #edf2ff;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #002fa7;
  --dsw-alias-button-primary-fill: #002fa7;
  --dsw-alias-button-primary-hover: #002a96;
  --dsw-alias-button-primary-dimmed: #d5e2ff;
  --dsw-alias-button-info-fill: #002fa7;
  --dsw-alias-button-info-hover: #1a4ac8;
  --dsw-alias-button-contrast-fill: #002a96;
  --dsw-alias-button-elevated-fill: #f8faff;
  --dsw-alias-button-floating-fill: #f8faff;
  --dsw-alias-button-floating-hover: #edf2ff;
  --dsw-alias-button-ghost-active-fill: #d5e2ff;
  --dsw-alias-button-ghost-active-hover: #c8d8fa;
  --dsw-alias-button-ghost-active-border: #5a7ce3;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(0, 47, 167, 0.08);
  --dsw-alias-interactive-bg-active: rgba(0, 47, 167, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(0, 47, 167, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #e6edff;

  /* 状态层 */
  --dsw-alias-state-business-primary: #002fa7;
  --dsw-alias-state-business-tertiary: #d5e2ff;
  --dsw-alias-state-error-primary: #c03333;
  --dsw-alias-state-error-secondary: #d64545;
  --dsw-alias-state-success-primary: #2e8a4e;
  --dsw-alias-state-success-secondary: #48a86a;
  --dsw-alias-state-success-tertiary: #d5eee0;
  --dsw-alias-state-warn-primary: #b8860b;
  --dsw-alias-state-warn-secondary: #d0a02a;
  --dsw-alias-state-warn-tertiary: #f2e8c8;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #edf2ff;
  --dsw-alias-markdown-code-block-banner: #e6edff;
  --dsw-alias-markdown-inline-code: #d5e2ff;
  --dsw-alias-markdown-code-segment-selected: #f8faff;
  --dsw-alias-markdown-code-segment-unselected: #e6edff;
  --dsw-alias-markdown-tag: #e6edff;
  --dsw-alias-markdown-placeholder: #edf2ff;
  --dsw-alias-markdown-citation: #edf2ff;

  /* 特定区域 */
  --dsw-specific-bubble: #edf2ff;
  --dsw-specific-bubble-highlight: #d5e2ff;
  --dsw-specific-sidebar-fill: #f0f7ff;
  --dsw-specific-sidebar-nav-item-active: #d5e2ff;
  --dsw-specific-sidebar-nav-item-active-accent: #c0d2f8;
  --dsw-specific-sidebar-nav-item-hover: #e6edff;
  --dsw-specific-input-major: #f8faff;
  --dsw-specific-login-input: #edf2ff;
  --dsw-specific-menu: #edf2ff;
  --dsw-specific-selector: #e6edff;
  --dsw-specific-tip: #edf2ff;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #c8d6f0;
  --dsw-alias-scrollbar-bg-l2: #bccbe8;
  --dsw-alias-scrollbar-hover-l1: #a8b8e0;
  --dsw-alias-scrollbar-hover-l2: #94a6d8;

  /* 浮层 */
  --dsw-alias-toast-bg: #2a2a44;
  --dsw-alias-tooltip-bg: #2a2a44;
}

body.theme-academic[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #0d1117;
  --dsw-alias-bg-layer-1: #111827;
  --dsw-alias-bg-layer-2: #131b2e;
  --dsw-alias-bg-layer-3: #1a2540;
  --dsw-alias-bg-overlay: #1e2a48;
  --dsw-alias-bg-module-platform: #131b2e;
  --dsw-alias-bg-multi-select: #1a2540;
  --dsw-alias-bg-skeleton: rgba(90, 124, 227, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #c9d1d9;
  --dsw-alias-label-primary-dimmed: #a8b4c8;
  --dsw-alias-label-primary-bluish: #5a7ce3;
  --dsw-alias-label-secondary: #6b85b8;
  --dsw-alias-label-tertiary: #5a76a8;
  --dsw-alias-label-caption: #4e6898;
  --dsw-alias-label-dimmed: #425a88;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(90, 124, 227, 0.08);
  --dsw-alias-border-l2: rgba(90, 124, 227, 0.14);
  --dsw-alias-border-l3: rgba(90, 124, 227, 0.20);
  --dsw-alias-border-l4: rgba(90, 124, 227, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #5a7ce3;
  --dsw-alias-brand-text: #7a96e8;
  --dsw-alias-brand-primary-invert: #0d1117;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #5a7ce3;
  --dsw-alias-button-primary-fill: #2a4ab0;
  --dsw-alias-button-primary-hover: #3a5cc8;
  --dsw-alias-button-primary-dimmed: #1a2540;
  --dsw-alias-button-info-fill: #3a5cc8;
  --dsw-alias-button-info-hover: #2a4ab0;
  --dsw-alias-button-contrast-fill: #9ab0f0;
  --dsw-alias-button-elevated-fill: #1a2540;
  --dsw-alias-button-floating-fill: #131b2e;
  --dsw-alias-button-floating-hover: #1a2540;
  --dsw-alias-button-ghost-active-fill: #1e2a48;
  --dsw-alias-button-ghost-active-hover: #243252;
  --dsw-alias-button-ghost-active-border: #5a7ce3;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(90, 124, 227, 0.08);
  --dsw-alias-interactive-bg-active: rgba(90, 124, 227, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(90, 124, 227, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #1a2540;

  /* 状态层 */
  --dsw-alias-state-business-primary: #5a7ce3;
  --dsw-alias-state-business-tertiary: #1a2540;
  --dsw-alias-state-error-primary: #e06060;
  --dsw-alias-state-error-secondary: #d64545;
  --dsw-alias-state-success-primary: #48c878;
  --dsw-alias-state-success-secondary: #48a86a;
  --dsw-alias-state-success-tertiary: #16301e;
  --dsw-alias-state-warn-primary: #d8b040;
  --dsw-alias-state-warn-secondary: #c09a2e;
  --dsw-alias-state-warn-tertiary: #322a14;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #111827;
  --dsw-alias-markdown-code-block-banner: #131b2e;
  --dsw-alias-markdown-inline-code: #1a2540;
  --dsw-alias-markdown-code-segment-selected: #131b2e;
  --dsw-alias-markdown-code-segment-unselected: #111827;
  --dsw-alias-markdown-tag: #1a2540;
  --dsw-alias-markdown-placeholder: #131b2e;
  --dsw-alias-markdown-citation: #1a2540;

  /* 特定区域 */
  --dsw-specific-bubble: #1a2540;
  --dsw-specific-bubble-highlight: #1e2a48;
  --dsw-specific-sidebar-fill: #111827;
  --dsw-specific-sidebar-nav-item-active: #1a2540;
  --dsw-specific-sidebar-nav-item-active-accent: #243252;
  --dsw-specific-sidebar-nav-item-hover: #131b2e;
  --dsw-specific-input-major: #131b2e;
  --dsw-specific-login-input: #111827;
  --dsw-specific-menu: #131b2e;
  --dsw-specific-selector: #1a2540;
  --dsw-specific-tip: #131b2e;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #1c2940;
  --dsw-alias-scrollbar-bg-l2: #223250;
  --dsw-alias-scrollbar-hover-l1: #2a3c60;
  --dsw-alias-scrollbar-hover-l2: #324870;

  /* 浮层 */
  --dsw-alias-toast-bg: #243252;
  --dsw-alias-tooltip-bg: #243252;
}
`

export const auroraCss = `/* ═══════════════════════════════════════════════════════════════
   Aurora 极光 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown themes/aurora.css：
   - 亮色：清晨极光，冰蓝底 + 柔和多彩
   - 暗色：北极极夜，深墨底 + 耀眼极光
   通过覆盖 --dsw-alias-* 语义 token 完成整体换肤，选择器挂在
   body.theme-aurora（亮）/ body.theme-aurora[data-ds-dark-theme]（暗），
   与 Harness 的 data-ds-dark-theme 明暗机制正交配合。
   ═══════════════════════════════════════════════════════════════ */

body.theme-aurora {
  /* 背景层 */
  --dsw-alias-bg-base: #f0f5fa;
  --dsw-alias-bg-layer-1: #f4f8fc;
  --dsw-alias-bg-layer-2: #eaf1f9;
  --dsw-alias-bg-layer-3: #e3ecf6;
  --dsw-alias-bg-overlay: #e6eef8;
  --dsw-alias-bg-module-platform: #eaf1f9;
  --dsw-alias-bg-multi-select: #e6eef8;
  --dsw-alias-bg-skeleton: rgba(74, 144, 217, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #1a2a3a;
  --dsw-alias-label-primary-dimmed: #27425c;
  --dsw-alias-label-primary-bluish: #2a5a90;
  --dsw-alias-label-secondary: #4a6a8a;
  --dsw-alias-label-tertiary: #5a7a9a;
  --dsw-alias-label-caption: #6a8aaa;
  --dsw-alias-label-dimmed: #7d96ad;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(74, 144, 217, 0.10);
  --dsw-alias-border-l2: rgba(74, 144, 217, 0.18);
  --dsw-alias-border-l3: rgba(74, 144, 217, 0.24);
  --dsw-alias-border-l4: rgba(74, 144, 217, 0.30);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #4a90d9;
  --dsw-alias-brand-text: #2a5a90;
  --dsw-alias-brand-primary-invert: #eaf1f9;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #4a90d9;
  --dsw-alias-button-primary-fill: #4a90d9;
  --dsw-alias-button-primary-hover: #3a7ac0;
  --dsw-alias-button-primary-dimmed: #dce9f6;
  --dsw-alias-button-info-fill: #4a90d9;
  --dsw-alias-button-info-hover: #64a8e8;
  --dsw-alias-button-contrast-fill: #2a5a90;
  --dsw-alias-button-elevated-fill: #f7fafd;
  --dsw-alias-button-floating-fill: #f4f8fc;
  --dsw-alias-button-floating-hover: #eaf1f9;
  --dsw-alias-button-ghost-active-fill: #dce9f6;
  --dsw-alias-button-ghost-active-hover: #d2e2f2;
  --dsw-alias-button-ghost-active-border: #7db4e8;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(74, 144, 217, 0.08);
  --dsw-alias-interactive-bg-active: rgba(74, 144, 217, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(74, 144, 217, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #e6eef8;

  /* 状态层 */
  --dsw-alias-state-business-primary: #4a90d9;
  --dsw-alias-state-business-tertiary: #dce9f6;
  --dsw-alias-state-error-primary: #d64545;
  --dsw-alias-state-error-secondary: #e85c5c;
  --dsw-alias-state-success-primary: #2f9e6e;
  --dsw-alias-state-success-secondary: #4fb487;
  --dsw-alias-state-success-tertiary: #d9f2e6;
  --dsw-alias-state-warn-primary: #d98e2b;
  --dsw-alias-state-warn-secondary: #e8a94e;
  --dsw-alias-state-warn-tertiary: #fbe9d2;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #eaf1f9;
  --dsw-alias-markdown-code-block-banner: #e3ecf6;
  --dsw-alias-markdown-inline-code: #dce9f6;
  --dsw-alias-markdown-code-segment-selected: #f4f8fc;
  --dsw-alias-markdown-code-segment-unselected: #e6eef8;
  --dsw-alias-markdown-tag: #e6eef8;
  --dsw-alias-markdown-placeholder: #e3ecf6;
  --dsw-alias-markdown-citation: #eaf1f9;

  /* 特定区域 */
  --dsw-specific-bubble: #eaf1f9;
  --dsw-specific-bubble-highlight: #dce9f6;
  --dsw-specific-sidebar-fill: #e8f0f8;
  --dsw-specific-sidebar-nav-item-active: #dce9f6;
  --dsw-specific-sidebar-nav-item-active-accent: #c9ddf2;
  --dsw-specific-sidebar-nav-item-hover: #e3ecf6;
  --dsw-specific-input-major: #f4f8fc;
  --dsw-specific-login-input: #eaf1f9;
  --dsw-specific-menu: #eaf1f9;
  --dsw-specific-selector: #e6eef8;
  --dsw-specific-tip: #eaf1f9;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #d0ddea;
  --dsw-alias-scrollbar-bg-l2: #c4d4e4;
  --dsw-alias-scrollbar-hover-l1: #b4c8dc;
  --dsw-alias-scrollbar-hover-l2: #a4bcd4;

  /* 浮层 */
  --dsw-alias-toast-bg: #27425c;
  --dsw-alias-tooltip-bg: #27425c;
}

body.theme-aurora[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #0a0e1a;
  --dsw-alias-bg-layer-1: #0e1524;
  --dsw-alias-bg-layer-2: #121a2c;
  --dsw-alias-bg-layer-3: #162034;
  --dsw-alias-bg-overlay: #1a2740;
  --dsw-alias-bg-module-platform: #121a2c;
  --dsw-alias-bg-multi-select: #162034;
  --dsw-alias-bg-skeleton: rgba(100, 200, 255, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #c8d8e8;
  --dsw-alias-label-primary-dimmed: #a0c0e0;
  --dsw-alias-label-primary-bluish: #80c8f0;
  --dsw-alias-label-secondary: #8aaac8;
  --dsw-alias-label-tertiary: #6a8aaa;
  --dsw-alias-label-caption: #5a7a9a;
  --dsw-alias-label-dimmed: #4a6a8a;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(100, 200, 255, 0.08);
  --dsw-alias-border-l2: rgba(100, 200, 255, 0.14);
  --dsw-alias-border-l3: rgba(100, 200, 255, 0.20);
  --dsw-alias-border-l4: rgba(100, 200, 255, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #64c8ff;
  --dsw-alias-brand-text: #a0d0f0;
  --dsw-alias-brand-primary-invert: #0a0e1a;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #64c8ff;
  --dsw-alias-button-primary-fill: #2e6ca6;
  --dsw-alias-button-primary-hover: #3a86c8;
  --dsw-alias-button-primary-dimmed: #1a2740;
  --dsw-alias-button-info-fill: #3a86c8;
  --dsw-alias-button-info-hover: #2e6ca6;
  --dsw-alias-button-contrast-fill: #80c8f0;
  --dsw-alias-button-elevated-fill: #162034;
  --dsw-alias-button-floating-fill: #121a2c;
  --dsw-alias-button-floating-hover: #162034;
  --dsw-alias-button-ghost-active-fill: #1a2740;
  --dsw-alias-button-ghost-active-hover: #20304a;
  --dsw-alias-button-ghost-active-border: #4a86b8;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(100, 200, 255, 0.08);
  --dsw-alias-interactive-bg-active: rgba(100, 200, 255, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(100, 200, 255, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #162034;

  /* 状态层 */
  --dsw-alias-state-business-primary: #64c8ff;
  --dsw-alias-state-business-tertiary: #1a2740;
  --dsw-alias-state-error-primary: #f06060;
  --dsw-alias-state-error-secondary: #e85c5c;
  --dsw-alias-state-success-primary: #4fce8f;
  --dsw-alias-state-success-secondary: #4fb487;
  --dsw-alias-state-success-tertiary: #14301f;
  --dsw-alias-state-warn-primary: #e8a94e;
  --dsw-alias-state-warn-secondary: #d98e2b;
  --dsw-alias-state-warn-tertiary: #3a2c12;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #0e1524;
  --dsw-alias-markdown-code-block-banner: #121a2c;
  --dsw-alias-markdown-inline-code: #162034;
  --dsw-alias-markdown-code-segment-selected: #121a2c;
  --dsw-alias-markdown-code-segment-unselected: #0e1524;
  --dsw-alias-markdown-tag: #162034;
  --dsw-alias-markdown-placeholder: #121a2c;
  --dsw-alias-markdown-citation: #162034;

  /* 特定区域 */
  --dsw-specific-bubble: #162034;
  --dsw-specific-bubble-highlight: #1a2740;
  --dsw-specific-sidebar-fill: #0d1220;
  --dsw-specific-sidebar-nav-item-active: #1a2740;
  --dsw-specific-sidebar-nav-item-active-accent: #223250;
  --dsw-specific-sidebar-nav-item-hover: #121a2c;
  --dsw-specific-input-major: #121a2c;
  --dsw-specific-login-input: #0e1524;
  --dsw-specific-menu: #121a2c;
  --dsw-specific-selector: #162034;
  --dsw-specific-tip: #121a2c;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #1e2a3c;
  --dsw-alias-scrollbar-bg-l2: #24324a;
  --dsw-alias-scrollbar-hover-l1: #2c3e58;
  --dsw-alias-scrollbar-hover-l2: #344a68;

  /* 浮层 */
  --dsw-alias-toast-bg: #20304a;
  --dsw-alias-tooltip-bg: #20304a;
}
`

export const cyberpunkCss = `/* ═══════════════════════════════════════════════════════════════
   Cyberpunk 赛博朋克 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/cyberpunk.css：
   - 亮色：冷白底 + 霓虹青粉点缀，干净利落的未来感
   - 暗色：深黑底 + 霓虹青粉撞色发光，霓虹灯下的终端
   ═══════════════════════════════════════════════════════════════ */

body.theme-cyberpunk {
  /* 背景层 */
  --dsw-alias-bg-base: #f0f4f8;
  --dsw-alias-bg-layer-1: #f7fafc;
  --dsw-alias-bg-layer-2: #e8eef6;
  --dsw-alias-bg-layer-3: #dfe7f2;
  --dsw-alias-bg-overlay: #e8eef6;
  --dsw-alias-bg-module-platform: #e8eef6;
  --dsw-alias-bg-multi-select: #dfe7f2;
  --dsw-alias-bg-skeleton: rgba(0, 119, 182, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #1a1a2e;
  --dsw-alias-label-primary-dimmed: #2a2a44;
  --dsw-alias-label-primary-bluish: #0077b6;
  --dsw-alias-label-secondary: #3a4a68;
  --dsw-alias-label-tertiary: #5a6a88;
  --dsw-alias-label-caption: #6a7a98;
  --dsw-alias-label-dimmed: #7a8aa8;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(0, 119, 182, 0.10);
  --dsw-alias-border-l2: rgba(0, 119, 182, 0.18);
  --dsw-alias-border-l3: rgba(0, 119, 182, 0.26);
  --dsw-alias-border-l4: rgba(0, 119, 182, 0.34);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #0077b6;
  --dsw-alias-brand-text: #00629a;
  --dsw-alias-brand-primary-invert: #e8eef6;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #0077b6;
  --dsw-alias-button-primary-fill: #0077b6;
  --dsw-alias-button-primary-hover: #00629a;
  --dsw-alias-button-primary-dimmed: #c8e0f2;
  --dsw-alias-button-info-fill: #9b2fa6;
  --dsw-alias-button-info-hover: #b84ac4;
  --dsw-alias-button-contrast-fill: #00508a;
  --dsw-alias-button-elevated-fill: #f7fafc;
  --dsw-alias-button-floating-fill: #f7fafc;
  --dsw-alias-button-floating-hover: #e8eef6;
  --dsw-alias-button-ghost-active-fill: #c8e0f2;
  --dsw-alias-button-ghost-active-hover: #b8d4ea;
  --dsw-alias-button-ghost-active-border: #40a0d8;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(0, 119, 182, 0.08);
  --dsw-alias-interactive-bg-active: rgba(0, 119, 182, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(155, 47, 166, 0.14);
  --dsw-alias-interactive-bg-hover-solid: #dfe7f2;

  /* 状态层 */
  --dsw-alias-state-business-primary: #0077b6;
  --dsw-alias-state-business-tertiary: #c8e0f2;
  --dsw-alias-state-error-primary: #d04545;
  --dsw-alias-state-error-secondary: #e05c5c;
  --dsw-alias-state-success-primary: #2e9a6a;
  --dsw-alias-state-success-secondary: #48b88a;
  --dsw-alias-state-success-tertiary: #d2eee4;
  --dsw-alias-state-warn-primary: #c0882e;
  --dsw-alias-state-warn-secondary: #d8a04a;
  --dsw-alias-state-warn-tertiary: #f0e4c8;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #e8eef6;
  --dsw-alias-markdown-code-block-banner: #dfe7f2;
  --dsw-alias-markdown-inline-code: #c8e0f2;
  --dsw-alias-markdown-code-segment-selected: #f7fafc;
  --dsw-alias-markdown-code-segment-unselected: #dfe7f2;
  --dsw-alias-markdown-tag: #dfe7f2;
  --dsw-alias-markdown-placeholder: #e8eef6;
  --dsw-alias-markdown-citation: #e8eef6;

  /* 特定区域 */
  --dsw-specific-bubble: #e8eef6;
  --dsw-specific-bubble-highlight: #c8e0f2;
  --dsw-specific-sidebar-fill: #e8eef6;
  --dsw-specific-sidebar-nav-item-active: #c8e0f2;
  --dsw-specific-sidebar-nav-item-active-accent: #b0d2ea;
  --dsw-specific-sidebar-nav-item-hover: #dfe7f2;
  --dsw-specific-input-major: #f7fafc;
  --dsw-specific-login-input: #e8eef6;
  --dsw-specific-menu: #e8eef6;
  --dsw-specific-selector: #dfe7f2;
  --dsw-specific-tip: #e8eef6;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #c4d4e4;
  --dsw-alias-scrollbar-bg-l2: #b8c8dc;
  --dsw-alias-scrollbar-hover-l1: #a4b6cc;
  --dsw-alias-scrollbar-hover-l2: #90a4bc;

  /* 浮层 */
  --dsw-alias-toast-bg: #2a2a44;
  --dsw-alias-tooltip-bg: #2a2a44;
}

body.theme-cyberpunk[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #050508;
  --dsw-alias-bg-layer-1: #0a0a14;
  --dsw-alias-bg-layer-2: #0a0a20;
  --dsw-alias-bg-layer-3: #101028;
  --dsw-alias-bg-overlay: #151530;
  --dsw-alias-bg-module-platform: #0a0a20;
  --dsw-alias-bg-multi-select: #101028;
  --dsw-alias-bg-skeleton: rgba(0, 212, 255, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #d0d0e0;
  --dsw-alias-label-primary-dimmed: #b0b0c8;
  --dsw-alias-label-primary-bluish: #00d4ff;
  --dsw-alias-label-secondary: #009db0;
  --dsw-alias-label-tertiary: #00889a;
  --dsw-alias-label-caption: #00788a;
  --dsw-alias-label-dimmed: #00687a;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(0, 212, 255, 0.10);
  --dsw-alias-border-l2: rgba(0, 212, 255, 0.18);
  --dsw-alias-border-l3: rgba(238, 0, 238, 0.22);
  --dsw-alias-border-l4: rgba(238, 0, 238, 0.30);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #00d4ff;
  --dsw-alias-brand-text: #00f0ff;
  --dsw-alias-brand-primary-invert: #050508;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #00d4ff;
  --dsw-alias-button-primary-fill: #0088b0;
  --dsw-alias-button-primary-hover: #00a8d8;
  --dsw-alias-button-primary-dimmed: #101028;
  --dsw-alias-button-info-fill: #b800c8;
  --dsw-alias-button-info-hover: #d800e8;
  --dsw-alias-button-contrast-fill: #00f0ff;
  --dsw-alias-button-elevated-fill: #101028;
  --dsw-alias-button-floating-fill: #0a0a20;
  --dsw-alias-button-floating-hover: #101028;
  --dsw-alias-button-ghost-active-fill: #151530;
  --dsw-alias-button-ghost-active-hover: #1a1a3a;
  --dsw-alias-button-ghost-active-border: #00d4ff;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(0, 212, 255, 0.08);
  --dsw-alias-interactive-bg-active: rgba(0, 212, 255, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(238, 0, 238, 0.14);
  --dsw-alias-interactive-bg-hover-solid: #101028;

  /* 状态层 */
  --dsw-alias-state-business-primary: #00d4ff;
  --dsw-alias-state-business-tertiary: #101028;
  --dsw-alias-state-error-primary: #ff4a6a;
  --dsw-alias-state-error-secondary: #e03a58;
  --dsw-alias-state-success-primary: #00e08a;
  --dsw-alias-state-success-secondary: #00c878;
  --dsw-alias-state-success-tertiary: #0a2a1e;
  --dsw-alias-state-warn-primary: #ffcc4a;
  --dsw-alias-state-warn-secondary: #e8b038;
  --dsw-alias-state-warn-tertiary: #2e2410;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #0a0a14;
  --dsw-alias-markdown-code-block-banner: #0a0a20;
  --dsw-alias-markdown-inline-code: #101028;
  --dsw-alias-markdown-code-segment-selected: #0a0a20;
  --dsw-alias-markdown-code-segment-unselected: #0a0a14;
  --dsw-alias-markdown-tag: #101028;
  --dsw-alias-markdown-placeholder: #0a0a20;
  --dsw-alias-markdown-citation: #101028;

  /* 特定区域 */
  --dsw-specific-bubble: #101028;
  --dsw-specific-bubble-highlight: #151530;
  --dsw-specific-sidebar-fill: #030306;
  --dsw-specific-sidebar-nav-item-active: #101028;
  --dsw-specific-sidebar-nav-item-active-accent: #1a1a3a;
  --dsw-specific-sidebar-nav-item-hover: #0a0a20;
  --dsw-specific-input-major: #0a0a20;
  --dsw-specific-login-input: #0a0a14;
  --dsw-specific-menu: #0a0a20;
  --dsw-specific-selector: #101028;
  --dsw-specific-tip: #0a0a20;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #151530;
  --dsw-alias-scrollbar-bg-l2: #1a1a3a;
  --dsw-alias-scrollbar-hover-l1: #202048;
  --dsw-alias-scrollbar-hover-l2: #262654;

  /* 浮层 */
  --dsw-alias-toast-bg: #1a1a3a;
  --dsw-alias-tooltip-bg: #1a1a3a;
}
`

export const facebookCss = `/* ═══════════════════════════════════════════════════════════════
   Facebook (Meta) — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/facebook.css：
   还原 Facebook 的社交平台视觉——灰白底+白卡片、
   #1877F2 品牌蓝、卡片式容器、圆角+阴影。
   ═══════════════════════════════════════════════════════════════ */

body.theme-facebook {
  /* 背景层 */
  --dsw-alias-bg-base: #f0f2f5;
  --dsw-alias-bg-layer-1: #ffffff;
  --dsw-alias-bg-layer-2: #e4e6eb;
  --dsw-alias-bg-layer-3: #d8dadf;
  --dsw-alias-bg-overlay: #e4e6eb;
  --dsw-alias-bg-module-platform: #ffffff;
  --dsw-alias-bg-multi-select: #e4e6eb;
  --dsw-alias-bg-skeleton: rgba(24, 119, 242, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #050505;
  --dsw-alias-label-primary-dimmed: #1a1a1a;
  --dsw-alias-label-primary-bluish: #1877f2;
  --dsw-alias-label-secondary: #65676b;
  --dsw-alias-label-tertiary: #7a7c80;
  --dsw-alias-label-caption: #8a8c90;
  --dsw-alias-label-dimmed: #9a9ca0;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(5, 5, 5, 0.06);
  --dsw-alias-border-l2: rgba(5, 5, 5, 0.12);
  --dsw-alias-border-l3: rgba(5, 5, 5, 0.18);
  --dsw-alias-border-l4: rgba(5, 5, 5, 0.24);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #1877f2;
  --dsw-alias-brand-text: #1665d8;
  --dsw-alias-brand-primary-invert: #e4e6eb;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #1877f2;
  --dsw-alias-button-primary-fill: #1877f2;
  --dsw-alias-button-primary-hover: #1665d8;
  --dsw-alias-button-primary-dimmed: #c8dcfa;
  --dsw-alias-button-info-fill: #1877f2;
  --dsw-alias-button-info-hover: #3a8cf4;
  --dsw-alias-button-contrast-fill: #1058b8;
  --dsw-alias-button-elevated-fill: #ffffff;
  --dsw-alias-button-floating-fill: #ffffff;
  --dsw-alias-button-floating-hover: #e4e6eb;
  --dsw-alias-button-ghost-active-fill: #c8dcfa;
  --dsw-alias-button-ghost-active-hover: #b4d0f4;
  --dsw-alias-button-ghost-active-border: #5aa0f4;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(24, 119, 242, 0.06);
  --dsw-alias-interactive-bg-active: rgba(24, 119, 242, 0.12);
  --dsw-alias-interactive-bg-hover-accent: rgba(24, 119, 242, 0.12);
  --dsw-alias-interactive-bg-hover-solid: #e4e6eb;

  /* 状态层 */
  --dsw-alias-state-business-primary: #1877f2;
  --dsw-alias-state-business-tertiary: #c8dcfa;
  --dsw-alias-state-error-primary: #d04545;
  --dsw-alias-state-error-secondary: #e05c5c;
  --dsw-alias-state-success-primary: #2e9a4e;
  --dsw-alias-state-success-secondary: #48b86a;
  --dsw-alias-state-success-tertiary: #d2eee0;
  --dsw-alias-state-warn-primary: #b8902e;
  --dsw-alias-state-warn-secondary: #d0a84a;
  --dsw-alias-state-warn-tertiary: #f0e8c8;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #e4e6eb;
  --dsw-alias-markdown-code-block-banner: #d8dadf;
  --dsw-alias-markdown-inline-code: #c8dcfa;
  --dsw-alias-markdown-code-segment-selected: #ffffff;
  --dsw-alias-markdown-code-segment-unselected: #d8dadf;
  --dsw-alias-markdown-tag: #d8dadf;
  --dsw-alias-markdown-placeholder: #e4e6eb;
  --dsw-alias-markdown-citation: #e4e6eb;

  /* 特定区域 */
  --dsw-specific-bubble: #ffffff;
  --dsw-specific-bubble-highlight: #c8dcfa;
  --dsw-specific-sidebar-fill: #ffffff;
  --dsw-specific-sidebar-nav-item-active: #e4e6eb;
  --dsw-specific-sidebar-nav-item-active-accent: #c8dcfa;
  --dsw-specific-sidebar-nav-item-hover: #e4e6eb;
  --dsw-specific-input-major: #ffffff;
  --dsw-specific-login-input: #e4e6eb;
  --dsw-specific-menu: #ffffff;
  --dsw-specific-selector: #e4e6eb;
  --dsw-specific-tip: #ffffff;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #c8cacc;
  --dsw-alias-scrollbar-bg-l2: #b8babd;
  --dsw-alias-scrollbar-hover-l1: #a4a6a8;
  --dsw-alias-scrollbar-hover-l2: #909296;

  /* 浮层 */
  --dsw-alias-toast-bg: #1a1a1a;
  --dsw-alias-tooltip-bg: #1a1a1a;
}

body.theme-facebook[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #18191a;
  --dsw-alias-bg-layer-1: #242526;
  --dsw-alias-bg-layer-2: #2e3031;
  --dsw-alias-bg-layer-3: #3a3b3c;
  --dsw-alias-bg-overlay: #3a3b3c;
  --dsw-alias-bg-module-platform: #242526;
  --dsw-alias-bg-multi-select: #3a3b3c;
  --dsw-alias-bg-skeleton: rgba(45, 136, 255, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #e4e6eb;
  --dsw-alias-label-primary-dimmed: #c0c4cc;
  --dsw-alias-label-primary-bluish: #2d88ff;
  --dsw-alias-label-secondary: #a8a8a8;
  --dsw-alias-label-tertiary: #909090;
  --dsw-alias-label-caption: #808080;
  --dsw-alias-label-dimmed: #707070;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(255, 255, 255, 0.06);
  --dsw-alias-border-l2: rgba(255, 255, 255, 0.12);
  --dsw-alias-border-l3: rgba(255, 255, 255, 0.18);
  --dsw-alias-border-l4: rgba(255, 255, 255, 0.24);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #2d88ff;
  --dsw-alias-brand-text: #4da3ff;
  --dsw-alias-brand-primary-invert: #18191a;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #2d88ff;
  --dsw-alias-button-primary-fill: #1a5eb8;
  --dsw-alias-button-primary-hover: #2d88ff;
  --dsw-alias-button-primary-dimmed: #3a3b3c;
  --dsw-alias-button-info-fill: #2d88ff;
  --dsw-alias-button-info-hover: #1a5eb8;
  --dsw-alias-button-contrast-fill: #8ec3ff;
  --dsw-alias-button-elevated-fill: #3a3b3c;
  --dsw-alias-button-floating-fill: #2e3031;
  --dsw-alias-button-floating-hover: #3a3b3c;
  --dsw-alias-button-ghost-active-fill: #3a3b3c;
  --dsw-alias-button-ghost-active-hover: #444648;
  --dsw-alias-button-ghost-active-border: #2d88ff;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, 0.06);
  --dsw-alias-interactive-bg-active: rgba(255, 255, 255, 0.12);
  --dsw-alias-interactive-bg-hover-accent: rgba(45, 136, 255, 0.14);
  --dsw-alias-interactive-bg-hover-solid: #3a3b3c;

  /* 状态层 */
  --dsw-alias-state-business-primary: #2d88ff;
  --dsw-alias-state-business-tertiary: #2e3031;
  --dsw-alias-state-error-primary: #f06060;
  --dsw-alias-state-error-secondary: #e05050;
  --dsw-alias-state-success-primary: #48c878;
  --dsw-alias-state-success-secondary: #48b86a;
  --dsw-alias-state-success-tertiary: #16301e;
  --dsw-alias-state-warn-primary: #d8b040;
  --dsw-alias-state-warn-secondary: #c0a02e;
  --dsw-alias-state-warn-tertiary: #322a14;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #2e3031;
  --dsw-alias-markdown-code-block-banner: #3a3b3c;
  --dsw-alias-markdown-inline-code: #3a3b3c;
  --dsw-alias-markdown-code-segment-selected: #2e3031;
  --dsw-alias-markdown-code-segment-unselected: #242526;
  --dsw-alias-markdown-tag: #3a3b3c;
  --dsw-alias-markdown-placeholder: #2e3031;
  --dsw-alias-markdown-citation: #3a3b3c;

  /* 特定区域 */
  --dsw-specific-bubble: #2e3031;
  --dsw-specific-bubble-highlight: #3a3b3c;
  --dsw-specific-sidebar-fill: #242526;
  --dsw-specific-sidebar-nav-item-active: #3a3b3c;
  --dsw-specific-sidebar-nav-item-active-accent: #444648;
  --dsw-specific-sidebar-nav-item-hover: #2e3031;
  --dsw-specific-input-major: #2e3031;
  --dsw-specific-login-input: #242526;
  --dsw-specific-menu: #2e3031;
  --dsw-specific-selector: #3a3b3c;
  --dsw-specific-tip: #2e3031;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #3a3b3c;
  --dsw-alias-scrollbar-bg-l2: #444648;
  --dsw-alias-scrollbar-hover-l1: #4e5052;
  --dsw-alias-scrollbar-hover-l2: #585a5c;

  /* 浮层 */
  --dsw-alias-toast-bg: #444648;
  --dsw-alias-tooltip-bg: #444648;
}
`

export const liquidglassCss = `/* ═══════════════════════════════════════════════════════════════
   Liquid Glass 液态玻璃 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/liquidglass.css：
   多层半透明面板堆叠 + backdrop-filter 模糊 + 光反射高光边缘。
   亮色 — 冰晶玻璃，纯白底 + 淡蓝半透面板
   深色 — 午夜玻璃，深靛底 + 霓虹蓝微光
   ═══════════════════════════════════════════════════════════════ */

body.theme-liquidglass {
  /* 背景层 */
  --dsw-alias-bg-base: #f6f9fe;
  --dsw-alias-bg-layer-1: rgba(255, 255, 255, 0.65);
  --dsw-alias-bg-layer-2: rgba(225, 235, 250, 0.55);
  --dsw-alias-bg-layer-3: rgba(215, 228, 248, 0.60);
  --dsw-alias-bg-overlay: rgba(230, 240, 252, 0.85);
  --dsw-alias-bg-module-platform: rgba(255, 255, 255, 0.72);
  --dsw-alias-bg-multi-select: rgba(210, 225, 250, 0.35);
  --dsw-alias-bg-skeleton: rgba(37, 99, 235, 0.06);

  /* 文字层 */
  --dsw-alias-label-primary: #1a2538;
  --dsw-alias-label-primary-dimmed: #2a3a52;
  --dsw-alias-label-primary-bluish: #1d4ed8;
  --dsw-alias-label-secondary: #5578a8;
  --dsw-alias-label-tertiary: #6588b8;
  --dsw-alias-label-caption: #7598c8;
  --dsw-alias-label-dimmed: #85a8d8;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(140, 165, 210, 0.18);
  --dsw-alias-border-l2: rgba(140, 165, 210, 0.28);
  --dsw-alias-border-l3: rgba(140, 165, 210, 0.36);
  --dsw-alias-border-l4: rgba(140, 165, 210, 0.44);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #2563eb;
  --dsw-alias-brand-text: #1d4ed8;
  --dsw-alias-brand-primary-invert: rgba(230, 240, 252, 0.85);
  --dsw-alias-brand-primary-new-colorprimary-new-color: #2563eb;
  --dsw-alias-button-primary-fill: #2563eb;
  --dsw-alias-button-primary-hover: #1d4ed8;
  --dsw-alias-button-primary-dimmed: rgba(37, 99, 235, 0.10);
  --dsw-alias-button-info-fill: #2563eb;
  --dsw-alias-button-info-hover: #3a76f0;
  --dsw-alias-button-contrast-fill: #1e40af;
  --dsw-alias-button-elevated-fill: rgba(255, 255, 255, 0.85);
  --dsw-alias-button-floating-fill: rgba(255, 255, 255, 0.72);
  --dsw-alias-button-floating-hover: rgba(210, 225, 250, 0.35);
  --dsw-alias-button-ghost-active-fill: rgba(37, 99, 235, 0.10);
  --dsw-alias-button-ghost-active-hover: rgba(37, 99, 235, 0.16);
  --dsw-alias-button-ghost-active-border: #6ea0f4;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(210, 225, 250, 0.35);
  --dsw-alias-interactive-bg-active: rgba(37, 99, 235, 0.10);
  --dsw-alias-interactive-bg-hover-accent: rgba(37, 99, 235, 0.14);
  --dsw-alias-interactive-bg-hover-solid: rgba(215, 228, 248, 0.60);

  /* 状态层 */
  --dsw-alias-state-business-primary: #2563eb;
  --dsw-alias-state-business-tertiary: rgba(37, 99, 235, 0.10);
  --dsw-alias-state-error-primary: #d04545;
  --dsw-alias-state-error-secondary: #e05c5c;
  --dsw-alias-state-success-primary: #2e9a6a;
  --dsw-alias-state-success-secondary: #48b88a;
  --dsw-alias-state-success-tertiary: rgba(46, 154, 106, 0.12);
  --dsw-alias-state-warn-primary: #b8902e;
  --dsw-alias-state-warn-secondary: #d0a84a;
  --dsw-alias-state-warn-tertiary: rgba(184, 144, 46, 0.12);

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: rgba(225, 235, 250, 0.55);
  --dsw-alias-markdown-code-block-banner: rgba(215, 228, 248, 0.60);
  --dsw-alias-markdown-inline-code: rgba(37, 99, 235, 0.10);
  --dsw-alias-markdown-code-segment-selected: rgba(255, 255, 255, 0.85);
  --dsw-alias-markdown-code-segment-unselected: rgba(215, 228, 248, 0.60);
  --dsw-alias-markdown-tag: rgba(215, 228, 248, 0.60);
  --dsw-alias-markdown-placeholder: rgba(225, 235, 250, 0.55);
  --dsw-alias-markdown-citation: rgba(225, 235, 250, 0.55);

  /* 特定区域 */
  --dsw-specific-bubble: rgba(255, 255, 255, 0.65);
  --dsw-specific-bubble-highlight: rgba(37, 99, 235, 0.10);
  --dsw-specific-sidebar-fill: rgba(235, 245, 255, 0.60);
  --dsw-specific-sidebar-nav-item-active: rgba(37, 99, 235, 0.10);
  --dsw-specific-sidebar-nav-item-active-accent: rgba(37, 99, 235, 0.16);
  --dsw-specific-sidebar-nav-item-hover: rgba(210, 225, 250, 0.35);
  --dsw-specific-input-major: rgba(255, 255, 255, 0.72);
  --dsw-specific-login-input: rgba(225, 235, 250, 0.55);
  --dsw-specific-menu: rgba(255, 255, 255, 0.72);
  --dsw-specific-selector: rgba(210, 225, 250, 0.35);
  --dsw-specific-tip: rgba(225, 235, 250, 0.55);

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: rgba(140, 165, 210, 0.25);
  --dsw-alias-scrollbar-bg-l2: rgba(140, 165, 210, 0.32);
  --dsw-alias-scrollbar-hover-l1: rgba(120, 150, 200, 0.42);
  --dsw-alias-scrollbar-hover-l2: rgba(110, 140, 190, 0.50);

  /* 浮层 */
  --dsw-alias-toast-bg: #1e3a60;
  --dsw-alias-tooltip-bg: #1e3a60;
}

body.theme-liquidglass[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #0c1222;
  --dsw-alias-bg-layer-1: rgba(96, 165, 250, 0.06);
  --dsw-alias-bg-layer-2: rgba(10, 17, 32, 0.92);
  --dsw-alias-bg-layer-3: rgba(96, 165, 250, 0.10);
  --dsw-alias-bg-overlay: rgba(14, 22, 40, 0.92);
  --dsw-alias-bg-module-platform: rgba(96, 165, 250, 0.06);
  --dsw-alias-bg-multi-select: rgba(96, 165, 250, 0.10);
  --dsw-alias-bg-skeleton: rgba(96, 165, 250, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #cdd8ee;
  --dsw-alias-label-primary-dimmed: #a8b8d4;
  --dsw-alias-label-primary-bluish: #60a5fa;
  --dsw-alias-label-secondary: #6b8dc4;
  --dsw-alias-label-tertiary: #5a7cb4;
  --dsw-alias-label-caption: #4a6ca4;
  --dsw-alias-label-dimmed: #3e5c94;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(96, 165, 250, 0.08);
  --dsw-alias-border-l2: rgba(96, 165, 250, 0.14);
  --dsw-alias-border-l3: rgba(96, 165, 250, 0.20);
  --dsw-alias-border-l4: rgba(96, 165, 250, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #60a5fa;
  --dsw-alias-brand-text: #93c5fd;
  --dsw-alias-brand-primary-invert: #0c1222;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #60a5fa;
  --dsw-alias-button-primary-fill: #1e4a8a;
  --dsw-alias-button-primary-hover: #2a5cb0;
  --dsw-alias-button-primary-dimmed: rgba(96, 165, 250, 0.10);
  --dsw-alias-button-info-fill: #3a76c8;
  --dsw-alias-button-info-hover: #2a5cb0;
  --dsw-alias-button-contrast-fill: #a0c8f8;
  --dsw-alias-button-elevated-fill: rgba(96, 165, 250, 0.10);
  --dsw-alias-button-floating-fill: rgba(10, 17, 32, 0.92);
  --dsw-alias-button-floating-hover: rgba(96, 165, 250, 0.10);
  --dsw-alias-button-ghost-active-fill: rgba(96, 165, 250, 0.10);
  --dsw-alias-button-ghost-active-hover: rgba(96, 165, 250, 0.16);
  --dsw-alias-button-ghost-active-border: #60a5fa;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(96, 165, 250, 0.10);
  --dsw-alias-interactive-bg-active: rgba(96, 165, 250, 0.16);
  --dsw-alias-interactive-bg-hover-accent: rgba(96, 165, 250, 0.18);
  --dsw-alias-interactive-bg-hover-solid: rgba(96, 165, 250, 0.10);

  /* 状态层 */
  --dsw-alias-state-business-primary: #60a5fa;
  --dsw-alias-state-business-tertiary: rgba(96, 165, 250, 0.10);
  --dsw-alias-state-error-primary: #f07070;
  --dsw-alias-state-error-secondary: #e05c5c;
  --dsw-alias-state-success-primary: #48c89a;
  --dsw-alias-state-success-secondary: #48b88a;
  --dsw-alias-state-success-tertiary: rgba(72, 200, 154, 0.12);
  --dsw-alias-state-warn-primary: #d8b050;
  --dsw-alias-state-warn-secondary: #c0a03e;
  --dsw-alias-state-warn-tertiary: rgba(216, 176, 80, 0.12);

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: rgba(10, 17, 32, 0.92);
  --dsw-alias-markdown-code-block-banner: rgba(96, 165, 250, 0.10);
  --dsw-alias-markdown-inline-code: rgba(96, 165, 250, 0.10);
  --dsw-alias-markdown-code-segment-selected: rgba(96, 165, 250, 0.06);
  --dsw-alias-markdown-code-segment-unselected: rgba(10, 17, 32, 0.92);
  --dsw-alias-markdown-tag: rgba(96, 165, 250, 0.10);
  --dsw-alias-markdown-placeholder: rgba(10, 17, 32, 0.92);
  --dsw-alias-markdown-citation: rgba(96, 165, 250, 0.10);

  /* 特定区域 */
  --dsw-specific-bubble: rgba(96, 165, 250, 0.06);
  --dsw-specific-bubble-highlight: rgba(96, 165, 250, 0.10);
  --dsw-specific-sidebar-fill: rgba(10, 17, 32, 0.92);
  --dsw-specific-sidebar-nav-item-active: rgba(96, 165, 250, 0.10);
  --dsw-specific-sidebar-nav-item-active-accent: rgba(96, 165, 250, 0.16);
  --dsw-specific-sidebar-nav-item-hover: rgba(96, 165, 250, 0.06);
  --dsw-specific-input-major: rgba(96, 165, 250, 0.06);
  --dsw-specific-login-input: rgba(10, 17, 32, 0.92);
  --dsw-specific-menu: rgba(10, 17, 32, 0.92);
  --dsw-specific-selector: rgba(96, 165, 250, 0.10);
  --dsw-specific-tip: rgba(10, 17, 32, 0.92);

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: rgba(96, 165, 250, 0.14);
  --dsw-alias-scrollbar-bg-l2: rgba(96, 165, 250, 0.20);
  --dsw-alias-scrollbar-hover-l1: rgba(96, 165, 250, 0.28);
  --dsw-alias-scrollbar-hover-l2: rgba(96, 165, 250, 0.36);

  /* 浮层 */
  --dsw-alias-toast-bg: #1a2c4c;
  --dsw-alias-tooltip-bg: #1a2c4c;
}
`

export const lycheeCss = `/* ═══════════════════════════════════════════════════════════════
   Lychee 荔枝红 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/lychee.css：
   #E63946 荔枝红品牌色，鲜活有温度。
   亮色：淡红白底；深色：暗红黑底 + 亮红。
   ═══════════════════════════════════════════════════════════════ */

body.theme-lychee {
  /* 背景层 */
  --dsw-alias-bg-base: #fff5f5;
  --dsw-alias-bg-layer-1: #fffafa;
  --dsw-alias-bg-layer-2: #ffeeee;
  --dsw-alias-bg-layer-3: #ffe6e8;
  --dsw-alias-bg-overlay: #ffeeee;
  --dsw-alias-bg-module-platform: #ffeeee;
  --dsw-alias-bg-multi-select: #ffe6e8;
  --dsw-alias-bg-skeleton: rgba(230, 57, 70, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #2b2726;
  --dsw-alias-label-primary-dimmed: #3a3434;
  --dsw-alias-label-primary-bluish: #d64550;
  --dsw-alias-label-secondary: #d15c66;
  --dsw-alias-label-tertiary: #a06a70;
  --dsw-alias-label-caption: #b07a80;
  --dsw-alias-label-dimmed: #c08a90;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(230, 57, 70, 0.10);
  --dsw-alias-border-l2: rgba(230, 57, 70, 0.16);
  --dsw-alias-border-l3: rgba(230, 57, 70, 0.22);
  --dsw-alias-border-l4: rgba(230, 57, 70, 0.28);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #e63946;
  --dsw-alias-brand-text: #b72f3b;
  --dsw-alias-brand-primary-invert: #ffeeee;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #e63946;
  --dsw-alias-button-primary-fill: #e63946;
  --dsw-alias-button-primary-hover: #c92a36;
  --dsw-alias-button-primary-dimmed: #ffd6d8;
  --dsw-alias-button-info-fill: #e63946;
  --dsw-alias-button-info-hover: #f05a64;
  --dsw-alias-button-contrast-fill: #a82830;
  --dsw-alias-button-elevated-fill: #fffafa;
  --dsw-alias-button-floating-fill: #fffafa;
  --dsw-alias-button-floating-hover: #ffeeee;
  --dsw-alias-button-ghost-active-fill: #ffd6d8;
  --dsw-alias-button-ghost-active-hover: #ffc8cc;
  --dsw-alias-button-ghost-active-border: #f07880;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(230, 57, 70, 0.08);
  --dsw-alias-interactive-bg-active: rgba(230, 57, 70, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(230, 57, 70, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #ffe6e8;

  /* 状态层 */
  --dsw-alias-state-business-primary: #e63946;
  --dsw-alias-state-business-tertiary: #ffd6d8;
  --dsw-alias-state-error-primary: #d02a36;
  --dsw-alias-state-error-secondary: #e63946;
  --dsw-alias-state-success-primary: #2e9a6a;
  --dsw-alias-state-success-secondary: #48b88a;
  --dsw-alias-state-success-tertiary: #d2eee0;
  --dsw-alias-state-warn-primary: #b8862e;
  --dsw-alias-state-warn-secondary: #d0a04a;
  --dsw-alias-state-warn-tertiary: #f0e4c8;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #ffeeee;
  --dsw-alias-markdown-code-block-banner: #ffe6e8;
  --dsw-alias-markdown-inline-code: #ffd6d8;
  --dsw-alias-markdown-code-segment-selected: #fffafa;
  --dsw-alias-markdown-code-segment-unselected: #ffe6e8;
  --dsw-alias-markdown-tag: #ffe6e8;
  --dsw-alias-markdown-placeholder: #ffeeee;
  --dsw-alias-markdown-citation: #ffeeee;

  /* 特定区域 */
  --dsw-specific-bubble: #ffeeee;
  --dsw-specific-bubble-highlight: #ffd6d8;
  --dsw-specific-sidebar-fill: #ffeaeb;
  --dsw-specific-sidebar-nav-item-active: #ffd6d8;
  --dsw-specific-sidebar-nav-item-active-accent: #f8c4c8;
  --dsw-specific-sidebar-nav-item-hover: #ffe6e8;
  --dsw-specific-input-major: #fffafa;
  --dsw-specific-login-input: #ffeeee;
  --dsw-specific-menu: #ffeeee;
  --dsw-specific-selector: #ffe6e8;
  --dsw-specific-tip: #ffeeee;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #f0c8cc;
  --dsw-alias-scrollbar-bg-l2: #e8b8bc;
  --dsw-alias-scrollbar-hover-l1: #dca4a8;
  --dsw-alias-scrollbar-hover-l2: #d09096;

  /* 浮层 */
  --dsw-alias-toast-bg: #3a3434;
  --dsw-alias-tooltip-bg: #3a3434;
}

body.theme-lychee[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #171212;
  --dsw-alias-bg-layer-1: #1e1516;
  --dsw-alias-bg-layer-2: #241819;
  --dsw-alias-bg-layer-3: #2d1e20;
  --dsw-alias-bg-overlay: #332426;
  --dsw-alias-bg-module-platform: #241819;
  --dsw-alias-bg-multi-select: #2d1e20;
  --dsw-alias-bg-skeleton: rgba(255, 122, 133, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #f0e6e7;
  --dsw-alias-label-primary-dimmed: #d8c8ca;
  --dsw-alias-label-primary-bluish: #ff7a85;
  --dsw-alias-label-secondary: #d17880;
  --dsw-alias-label-tertiary: #b06a72;
  --dsw-alias-label-caption: #9a5e66;
  --dsw-alias-label-dimmed: #88505a;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(255, 122, 133, 0.08);
  --dsw-alias-border-l2: rgba(255, 122, 133, 0.14);
  --dsw-alias-border-l3: rgba(255, 122, 133, 0.20);
  --dsw-alias-border-l4: rgba(255, 122, 133, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #ff7a85;
  --dsw-alias-brand-text: #f8919a;
  --dsw-alias-brand-primary-invert: #171212;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #ff7a85;
  --dsw-alias-button-primary-fill: #a82a34;
  --dsw-alias-button-primary-hover: #c83a44;
  --dsw-alias-button-primary-dimmed: #2d1e20;
  --dsw-alias-button-info-fill: #c83a44;
  --dsw-alias-button-info-hover: #a82a34;
  --dsw-alias-button-contrast-fill: #f8a0a8;
  --dsw-alias-button-elevated-fill: #2d1e20;
  --dsw-alias-button-floating-fill: #241819;
  --dsw-alias-button-floating-hover: #2d1e20;
  --dsw-alias-button-ghost-active-fill: #332426;
  --dsw-alias-button-ghost-active-hover: #3a2a2c;
  --dsw-alias-button-ghost-active-border: #ff7a85;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(255, 122, 133, 0.08);
  --dsw-alias-interactive-bg-active: rgba(255, 122, 133, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(255, 122, 133, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #2d1e20;

  /* 状态层 */
  --dsw-alias-state-business-primary: #ff7a85;
  --dsw-alias-state-business-tertiary: #2d1e20;
  --dsw-alias-state-error-primary: #ff7070;
  --dsw-alias-state-error-secondary: #f05c60;
  --dsw-alias-state-success-primary: #48c89a;
  --dsw-alias-state-success-secondary: #48b88a;
  --dsw-alias-state-success-tertiary: #16301e;
  --dsw-alias-state-warn-primary: #d8b050;
  --dsw-alias-state-warn-secondary: #c0a03e;
  --dsw-alias-state-warn-tertiary: #322a14;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #1e1516;
  --dsw-alias-markdown-code-block-banner: #241819;
  --dsw-alias-markdown-inline-code: #2d1e20;
  --dsw-alias-markdown-code-segment-selected: #241819;
  --dsw-alias-markdown-code-segment-unselected: #1e1516;
  --dsw-alias-markdown-tag: #2d1e20;
  --dsw-alias-markdown-placeholder: #241819;
  --dsw-alias-markdown-citation: #2d1e20;

  /* 特定区域 */
  --dsw-specific-bubble: #2d1e20;
  --dsw-specific-bubble-highlight: #332426;
  --dsw-specific-sidebar-fill: #1e1516;
  --dsw-specific-sidebar-nav-item-active: #2d1e20;
  --dsw-specific-sidebar-nav-item-active-accent: #3a2a2c;
  --dsw-specific-sidebar-nav-item-hover: #241819;
  --dsw-specific-input-major: #241819;
  --dsw-specific-login-input: #1e1516;
  --dsw-specific-menu: #241819;
  --dsw-specific-selector: #2d1e20;
  --dsw-specific-tip: #241819;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #332426;
  --dsw-alias-scrollbar-bg-l2: #3a2a2c;
  --dsw-alias-scrollbar-hover-l1: #463234;
  --dsw-alias-scrollbar-hover-l2: #523a3c;

  /* 浮层 */
  --dsw-alias-toast-bg: #3a2a2c;
  --dsw-alias-tooltip-bg: #3a2a2c;
}
`

export const magazineCss = `/* ═══════════════════════════════════════════════════════════════
   Magazine 杂志感 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/magazine.css：
   温暖纸张底 + 咖啡棕，衬线字体，优雅的阅读体验。
   ═══════════════════════════════════════════════════════════════ */

body.theme-magazine {
  /* 背景层 */
  --dsw-alias-bg-base: #faf8f5;
  --dsw-alias-bg-layer-1: #fdfcf9;
  --dsw-alias-bg-layer-2: #f5f0e8;
  --dsw-alias-bg-layer-3: #efe8dc;
  --dsw-alias-bg-overlay: #f5f0e8;
  --dsw-alias-bg-module-platform: #f5f0e8;
  --dsw-alias-bg-multi-select: #efe8dc;
  --dsw-alias-bg-skeleton: rgba(139, 69, 19, 0.06);

  /* 文字层 */
  --dsw-alias-label-primary: #2c2416;
  --dsw-alias-label-primary-dimmed: #3a3020;
  --dsw-alias-label-primary-bluish: #8b4513;
  --dsw-alias-label-secondary: #7a6e5d;
  --dsw-alias-label-tertiary: #8a7e6d;
  --dsw-alias-label-caption: #9a8e7d;
  --dsw-alias-label-dimmed: #aa9e8d;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(44, 36, 22, 0.08);
  --dsw-alias-border-l2: rgba(44, 36, 22, 0.14);
  --dsw-alias-border-l3: rgba(44, 36, 22, 0.20);
  --dsw-alias-border-l4: rgba(44, 36, 22, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #8b4513;
  --dsw-alias-brand-text: #7a3a10;
  --dsw-alias-brand-primary-invert: #f5f0e8;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #8b4513;
  --dsw-alias-button-primary-fill: #8b4513;
  --dsw-alias-button-primary-hover: #7a3a10;
  --dsw-alias-button-primary-dimmed: #e0d8c8;
  --dsw-alias-button-info-fill: #8b4513;
  --dsw-alias-button-info-hover: #9c5420;
  --dsw-alias-button-contrast-fill: #6a3410;
  --dsw-alias-button-elevated-fill: #fdfcf9;
  --dsw-alias-button-floating-fill: #fdfcf9;
  --dsw-alias-button-floating-hover: #f5f0e8;
  --dsw-alias-button-ghost-active-fill: #e0d8c8;
  --dsw-alias-button-ghost-active-hover: #d4ccc0;
  --dsw-alias-button-ghost-active-border: #b07048;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(139, 69, 19, 0.08);
  --dsw-alias-interactive-bg-active: rgba(139, 69, 19, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(139, 69, 19, 0.14);
  --dsw-alias-interactive-bg-hover-solid: #efe8dc;

  /* 状态层 */
  --dsw-alias-state-business-primary: #8b4513;
  --dsw-alias-state-business-tertiary: #e0d8c8;
  --dsw-alias-state-error-primary: #b04a30;
  --dsw-alias-state-error-secondary: #c05a40;
  --dsw-alias-state-success-primary: #5a8a4a;
  --dsw-alias-state-success-secondary: #6aa05a;
  --dsw-alias-state-success-tertiary: #dce8d4;
  --dsw-alias-state-warn-primary: #a8823a;
  --dsw-alias-state-warn-secondary: #c09a4a;
  --dsw-alias-state-warn-tertiary: #ece0c8;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #f5f0e8;
  --dsw-alias-markdown-code-block-banner: #efe8dc;
  --dsw-alias-markdown-inline-code: #e0d8c8;
  --dsw-alias-markdown-code-segment-selected: #fdfcf9;
  --dsw-alias-markdown-code-segment-unselected: #efe8dc;
  --dsw-alias-markdown-tag: #efe8dc;
  --dsw-alias-markdown-placeholder: #f5f0e8;
  --dsw-alias-markdown-citation: #f5f0e8;

  /* 特定区域 */
  --dsw-specific-bubble: #f5f0e8;
  --dsw-specific-bubble-highlight: #e0d8c8;
  --dsw-specific-sidebar-fill: #f5f0e8;
  --dsw-specific-sidebar-nav-item-active: #e0d8c8;
  --dsw-specific-sidebar-nav-item-active-accent: #d0c8b8;
  --dsw-specific-sidebar-nav-item-hover: #efe8dc;
  --dsw-specific-input-major: #fdfcf9;
  --dsw-specific-login-input: #f5f0e8;
  --dsw-specific-menu: #f5f0e8;
  --dsw-specific-selector: #efe8dc;
  --dsw-specific-tip: #f5f0e8;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #d8d0c0;
  --dsw-alias-scrollbar-bg-l2: #ccc4b4;
  --dsw-alias-scrollbar-hover-l1: #bcb4a4;
  --dsw-alias-scrollbar-hover-l2: #aca494;

  /* 浮层 */
  --dsw-alias-toast-bg: #3a3020;
  --dsw-alias-tooltip-bg: #3a3020;
}

body.theme-magazine[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #1a1612;
  --dsw-alias-bg-layer-1: #1e1a14;
  --dsw-alias-bg-layer-2: #241f18;
  --dsw-alias-bg-layer-3: #2a241c;
  --dsw-alias-bg-overlay: #322c22;
  --dsw-alias-bg-module-platform: #241f18;
  --dsw-alias-bg-multi-select: #2a241c;
  --dsw-alias-bg-skeleton: rgba(201, 149, 107, 0.06);

  /* 文字层 */
  --dsw-alias-label-primary: #d4cfc4;
  --dsw-alias-label-primary-dimmed: #bcb6aa;
  --dsw-alias-label-primary-bluish: #c9956b;
  --dsw-alias-label-secondary: #8a7e6e;
  --dsw-alias-label-tertiary: #7a6e5e;
  --dsw-alias-label-caption: #6a5e50;
  --dsw-alias-label-dimmed: #5a4e42;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(201, 149, 107, 0.08);
  --dsw-alias-border-l2: rgba(201, 149, 107, 0.14);
  --dsw-alias-border-l3: rgba(201, 149, 107, 0.20);
  --dsw-alias-border-l4: rgba(201, 149, 107, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #c9956b;
  --dsw-alias-brand-text: #d8a884;
  --dsw-alias-brand-primary-invert: #1a1612;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #c9956b;
  --dsw-alias-button-primary-fill: #8a5a38;
  --dsw-alias-button-primary-hover: #9c6a48;
  --dsw-alias-button-primary-dimmed: #2a241c;
  --dsw-alias-button-info-fill: #9c6a48;
  --dsw-alias-button-info-hover: #8a5a38;
  --dsw-alias-button-contrast-fill: #e0b890;
  --dsw-alias-button-elevated-fill: #2a241c;
  --dsw-alias-button-floating-fill: #241f18;
  --dsw-alias-button-floating-hover: #2a241c;
  --dsw-alias-button-ghost-active-fill: #322c22;
  --dsw-alias-button-ghost-active-hover: #3a342a;
  --dsw-alias-button-ghost-active-border: #b07850;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(201, 149, 107, 0.08);
  --dsw-alias-interactive-bg-active: rgba(201, 149, 107, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(201, 149, 107, 0.14);
  --dsw-alias-interactive-bg-hover-solid: #2a241c;

  /* 状态层 */
  --dsw-alias-state-business-primary: #c9956b;
  --dsw-alias-state-business-tertiary: #2a241c;
  --dsw-alias-state-error-primary: #d07050;
  --dsw-alias-state-error-secondary: #c05a40;
  --dsw-alias-state-success-primary: #8ab87a;
  --dsw-alias-state-success-secondary: #9cc88a;
  --dsw-alias-state-success-tertiary: #1e2c1a;
  --dsw-alias-state-warn-primary: #d0a85a;
  --dsw-alias-state-warn-secondary: #bc9448;
  --dsw-alias-state-warn-tertiary: #2e2818;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #1e1a14;
  --dsw-alias-markdown-code-block-banner: #241f18;
  --dsw-alias-markdown-inline-code: #2a241c;
  --dsw-alias-markdown-code-segment-selected: #241f18;
  --dsw-alias-markdown-code-segment-unselected: #1e1a14;
  --dsw-alias-markdown-tag: #2a241c;
  --dsw-alias-markdown-placeholder: #241f18;
  --dsw-alias-markdown-citation: #2a241c;

  /* 特定区域 */
  --dsw-specific-bubble: #2a241c;
  --dsw-specific-bubble-highlight: #322c22;
  --dsw-specific-sidebar-fill: #1e1a14;
  --dsw-specific-sidebar-nav-item-active: #2a241c;
  --dsw-specific-sidebar-nav-item-active-accent: #3a342a;
  --dsw-specific-sidebar-nav-item-hover: #241f18;
  --dsw-specific-input-major: #241f18;
  --dsw-specific-login-input: #1e1a14;
  --dsw-specific-menu: #241f18;
  --dsw-specific-selector: #2a241c;
  --dsw-specific-tip: #241f18;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #2e2820;
  --dsw-alias-scrollbar-bg-l2: #362e24;
  --dsw-alias-scrollbar-hover-l1: #40382c;
  --dsw-alias-scrollbar-hover-l2: #4a4234;

  /* 浮层 */
  --dsw-alias-toast-bg: #3a342a;
  --dsw-alias-tooltip-bg: #3a342a;
}
`

export const matrixCss = `/* ═══════════════════════════════════════════════════════════════
   Matrix 黑客帝国 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/matrix.css：
   亮色：白底绿字，终端白日模式；暗色：纯黑底矩阵绿。
   ═══════════════════════════════════════════════════════════════ */

body.theme-matrix {
  /* 背景层 */
  --dsw-alias-bg-base: #f5faf5;
  --dsw-alias-bg-layer-1: #fafdfa;
  --dsw-alias-bg-layer-2: #e8f5e8;
  --dsw-alias-bg-layer-3: #d5ecd5;
  --dsw-alias-bg-overlay: #e8f5e8;
  --dsw-alias-bg-module-platform: #e8f5e8;
  --dsw-alias-bg-multi-select: #d5ecd5;
  --dsw-alias-bg-skeleton: rgba(0, 138, 46, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #1a2a1a;
  --dsw-alias-label-primary-dimmed: #2a3a2a;
  --dsw-alias-label-primary-bluish: #008a2e;
  --dsw-alias-label-secondary: #3a7a3a;
  --dsw-alias-label-tertiary: #4a8a4a;
  --dsw-alias-label-caption: #5a9a5a;
  --dsw-alias-label-dimmed: #6aaa6a;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(0, 138, 46, 0.10);
  --dsw-alias-border-l2: rgba(0, 138, 46, 0.16);
  --dsw-alias-border-l3: rgba(0, 138, 46, 0.22);
  --dsw-alias-border-l4: rgba(0, 138, 46, 0.28);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #008a2e;
  --dsw-alias-brand-text: #007a28;
  --dsw-alias-brand-primary-invert: #e8f5e8;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #008a2e;
  --dsw-alias-button-primary-fill: #008a2e;
  --dsw-alias-button-primary-hover: #007828;
  --dsw-alias-button-primary-dimmed: #c0e8c0;
  --dsw-alias-button-info-fill: #008a2e;
  --dsw-alias-button-info-hover: #0a9a3a;
  --dsw-alias-button-contrast-fill: #006a22;
  --dsw-alias-button-elevated-fill: #fafdfa;
  --dsw-alias-button-floating-fill: #fafdfa;
  --dsw-alias-button-floating-hover: #e8f5e8;
  --dsw-alias-button-ghost-active-fill: #c0e8c0;
  --dsw-alias-button-ghost-active-hover: #b0dcb0;
  --dsw-alias-button-ghost-active-border: #4aa86a;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(0, 138, 46, 0.08);
  --dsw-alias-interactive-bg-active: rgba(0, 138, 46, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(0, 138, 46, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #d5ecd5;

  /* 状态层 */
  --dsw-alias-state-business-primary: #008a2e;
  --dsw-alias-state-business-tertiary: #c0e8c0;
  --dsw-alias-state-error-primary: #b04a2a;
  --dsw-alias-state-error-secondary: #c05a3a;
  --dsw-alias-state-success-primary: #008a2e;
  --dsw-alias-state-success-secondary: #0a9a3a;
  --dsw-alias-state-success-tertiary: #c0e8c0;
  --dsw-alias-state-warn-primary: #a88a2a;
  --dsw-alias-state-warn-secondary: #c0a03a;
  --dsw-alias-state-warn-tertiary: #ece4c0;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #e8f5e8;
  --dsw-alias-markdown-code-block-banner: #d5ecd5;
  --dsw-alias-markdown-inline-code: #c0e8c0;
  --dsw-alias-markdown-code-segment-selected: #fafdfa;
  --dsw-alias-markdown-code-segment-unselected: #d5ecd5;
  --dsw-alias-markdown-tag: #d5ecd5;
  --dsw-alias-markdown-placeholder: #e8f5e8;
  --dsw-alias-markdown-citation: #e8f5e8;

  /* 特定区域 */
  --dsw-specific-bubble: #e8f5e8;
  --dsw-specific-bubble-highlight: #c0e8c0;
  --dsw-specific-sidebar-fill: #edf5ed;
  --dsw-specific-sidebar-nav-item-active: #c0e8c0;
  --dsw-specific-sidebar-nav-item-active-accent: #a8dca8;
  --dsw-specific-sidebar-nav-item-hover: #d5ecd5;
  --dsw-specific-input-major: #fafdfa;
  --dsw-specific-login-input: #e8f5e8;
  --dsw-specific-menu: #e8f5e8;
  --dsw-specific-selector: #d5ecd5;
  --dsw-specific-tip: #e8f5e8;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #b8d8b8;
  --dsw-alias-scrollbar-bg-l2: #a8cca8;
  --dsw-alias-scrollbar-hover-l1: #94bc94;
  --dsw-alias-scrollbar-hover-l2: #80ac80;

  /* 浮层 */
  --dsw-alias-toast-bg: #2a3a2a;
  --dsw-alias-tooltip-bg: #2a3a2a;
}

body.theme-matrix[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #000000;
  --dsw-alias-bg-layer-1: #000a00;
  --dsw-alias-bg-layer-2: #001a00;
  --dsw-alias-bg-layer-3: #002200;
  --dsw-alias-bg-overlay: #002a00;
  --dsw-alias-bg-module-platform: #001a00;
  --dsw-alias-bg-multi-select: #002200;
  --dsw-alias-bg-skeleton: rgba(57, 255, 20, 0.06);

  /* 文字层 */
  --dsw-alias-label-primary: #00ff41;
  --dsw-alias-label-primary-dimmed: #00dd38;
  --dsw-alias-label-primary-bluish: #39ff14;
  --dsw-alias-label-secondary: #00b33c;
  --dsw-alias-label-tertiary: #00993a;
  --dsw-alias-label-caption: #008838;
  --dsw-alias-label-dimmed: #007734;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(57, 255, 20, 0.08);
  --dsw-alias-border-l2: rgba(57, 255, 20, 0.14);
  --dsw-alias-border-l3: rgba(57, 255, 20, 0.20);
  --dsw-alias-border-l4: rgba(57, 255, 20, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #39ff14;
  --dsw-alias-brand-text: #00ff41;
  --dsw-alias-brand-primary-invert: #000000;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #39ff14;
  --dsw-alias-button-primary-fill: #007828;
  --dsw-alias-button-primary-hover: #009e36;
  --dsw-alias-button-primary-dimmed: #002200;
  --dsw-alias-button-info-fill: #008828;
  --dsw-alias-button-info-hover: #00aa36;
  --dsw-alias-button-contrast-fill: #39ff14;
  --dsw-alias-button-elevated-fill: #002200;
  --dsw-alias-button-floating-fill: #001a00;
  --dsw-alias-button-floating-hover: #002200;
  --dsw-alias-button-ghost-active-fill: #002a00;
  --dsw-alias-button-ghost-active-hover: #003400;
  --dsw-alias-button-ghost-active-border: #39ff14;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(57, 255, 20, 0.08);
  --dsw-alias-interactive-bg-active: rgba(57, 255, 20, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(57, 255, 20, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #002200;

  /* 状态层 */
  --dsw-alias-state-business-primary: #39ff14;
  --dsw-alias-state-business-tertiary: #002200;
  --dsw-alias-state-error-primary: #ff4a3a;
  --dsw-alias-state-error-secondary: #e03a28;
  --dsw-alias-state-success-primary: #39ff14;
  --dsw-alias-state-success-secondary: #00e05e;
  --dsw-alias-state-success-tertiary: #002a10;
  --dsw-alias-state-warn-primary: #ffcc3a;
  --dsw-alias-state-warn-secondary: #e0b02a;
  --dsw-alias-state-warn-tertiary: #2e2410;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #000a00;
  --dsw-alias-markdown-code-block-banner: #001a00;
  --dsw-alias-markdown-inline-code: #002200;
  --dsw-alias-markdown-code-segment-selected: #001a00;
  --dsw-alias-markdown-code-segment-unselected: #000a00;
  --dsw-alias-markdown-tag: #002200;
  --dsw-alias-markdown-placeholder: #001a00;
  --dsw-alias-markdown-citation: #002200;

  /* 特定区域 */
  --dsw-specific-bubble: #002200;
  --dsw-specific-bubble-highlight: #002a00;
  --dsw-specific-sidebar-fill: #000000;
  --dsw-specific-sidebar-nav-item-active: #002200;
  --dsw-specific-sidebar-nav-item-active-accent: #003400;
  --dsw-specific-sidebar-nav-item-hover: #001a00;
  --dsw-specific-input-major: #001a00;
  --dsw-specific-login-input: #000a00;
  --dsw-specific-menu: #001a00;
  --dsw-specific-selector: #002200;
  --dsw-specific-tip: #001a00;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #002200;
  --dsw-alias-scrollbar-bg-l2: #002a00;
  --dsw-alias-scrollbar-hover-l1: #003400;
  --dsw-alias-scrollbar-hover-l2: #003e00;

  /* 浮层 */
  --dsw-alias-toast-bg: #003400;
  --dsw-alias-tooltip-bg: #003400;
}
`

export const minimalCss = `/* ═══════════════════════════════════════════════════════════════
   Minimal 极简风 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/minimal.css：
   纯白底 + 中性灰，清爽干净的原始风格。
   ═══════════════════════════════════════════════════════════════ */

body.theme-minimal {
  /* 背景层 */
  --dsw-alias-bg-base: #ffffff;
  --dsw-alias-bg-layer-1: #ffffff;
  --dsw-alias-bg-layer-2: #fafafa;
  --dsw-alias-bg-layer-3: #f5f5f5;
  --dsw-alias-bg-overlay: #fafafa;
  --dsw-alias-bg-module-platform: #fafafa;
  --dsw-alias-bg-multi-select: #f5f5f5;
  --dsw-alias-bg-skeleton: rgba(0, 0, 0, 0.04);

  /* 文字层 */
  --dsw-alias-label-primary: #333333;
  --dsw-alias-label-primary-dimmed: #444444;
  --dsw-alias-label-primary-bluish: #0066cc;
  --dsw-alias-label-secondary: #666666;
  --dsw-alias-label-tertiary: #777777;
  --dsw-alias-label-caption: #888888;
  --dsw-alias-label-dimmed: #999999;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(0, 0, 0, 0.06);
  --dsw-alias-border-l2: rgba(0, 0, 0, 0.12);
  --dsw-alias-border-l3: rgba(0, 0, 0, 0.18);
  --dsw-alias-border-l4: rgba(0, 0, 0, 0.24);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #0066cc;
  --dsw-alias-brand-text: #0058b4;
  --dsw-alias-brand-primary-invert: #fafafa;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #0066cc;
  --dsw-alias-button-primary-fill: #0066cc;
  --dsw-alias-button-primary-hover: #0058b4;
  --dsw-alias-button-primary-dimmed: #e6f0fa;
  --dsw-alias-button-info-fill: #0066cc;
  --dsw-alias-button-info-hover: #1a7ae0;
  --dsw-alias-button-contrast-fill: #004a9a;
  --dsw-alias-button-elevated-fill: #ffffff;
  --dsw-alias-button-floating-fill: #ffffff;
  --dsw-alias-button-floating-hover: #f5f5f5;
  --dsw-alias-button-ghost-active-fill: #e6f0fa;
  --dsw-alias-button-ghost-active-hover: #d6e8f4;
  --dsw-alias-button-ghost-active-border: #4a9ae0;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(0, 0, 0, 0.04);
  --dsw-alias-interactive-bg-active: rgba(0, 0, 0, 0.08);
  --dsw-alias-interactive-bg-hover-accent: rgba(0, 102, 204, 0.10);
  --dsw-alias-interactive-bg-hover-solid: #f5f5f5;

  /* 状态层 */
  --dsw-alias-state-business-primary: #0066cc;
  --dsw-alias-state-business-tertiary: #e6f0fa;
  --dsw-alias-state-error-primary: #cc3333;
  --dsw-alias-state-error-secondary: #dd4444;
  --dsw-alias-state-success-primary: #2e9a4e;
  --dsw-alias-state-success-secondary: #48b86a;
  --dsw-alias-state-success-tertiary: #d8eee0;
  --dsw-alias-state-warn-primary: #b08a2a;
  --dsw-alias-state-warn-secondary: #c8a040;
  --dsw-alias-state-warn-tertiary: #ece4c8;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #fafafa;
  --dsw-alias-markdown-code-block-banner: #f5f5f5;
  --dsw-alias-markdown-inline-code: #e6f0fa;
  --dsw-alias-markdown-code-segment-selected: #ffffff;
  --dsw-alias-markdown-code-segment-unselected: #f5f5f5;
  --dsw-alias-markdown-tag: #f5f5f5;
  --dsw-alias-markdown-placeholder: #fafafa;
  --dsw-alias-markdown-citation: #fafafa;

  /* 特定区域 */
  --dsw-specific-bubble: #fafafa;
  --dsw-specific-bubble-highlight: #e6f0fa;
  --dsw-specific-sidebar-fill: #f8f8f8;
  --dsw-specific-sidebar-nav-item-active: #e6f0fa;
  --dsw-specific-sidebar-nav-item-active-accent: #d0e4f4;
  --dsw-specific-sidebar-nav-item-hover: #f5f5f5;
  --dsw-specific-input-major: #ffffff;
  --dsw-specific-login-input: #fafafa;
  --dsw-specific-menu: #ffffff;
  --dsw-specific-selector: #f5f5f5;
  --dsw-specific-tip: #fafafa;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #d8d8d8;
  --dsw-alias-scrollbar-bg-l2: #c8c8c8;
  --dsw-alias-scrollbar-hover-l1: #b4b4b4;
  --dsw-alias-scrollbar-hover-l2: #a0a0a0;

  /* 浮层 */
  --dsw-alias-toast-bg: #444444;
  --dsw-alias-tooltip-bg: #444444;
}

body.theme-minimal[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #1a1a1a;
  --dsw-alias-bg-layer-1: #1e1e1e;
  --dsw-alias-bg-layer-2: #222222;
  --dsw-alias-bg-layer-3: #2a2a2a;
  --dsw-alias-bg-overlay: #303030;
  --dsw-alias-bg-module-platform: #222222;
  --dsw-alias-bg-multi-select: #2a2a2a;
  --dsw-alias-bg-skeleton: rgba(255, 255, 255, 0.04);

  /* 文字层 */
  --dsw-alias-label-primary: #d4d4d4;
  --dsw-alias-label-primary-dimmed: #b8b8b8;
  --dsw-alias-label-primary-bluish: #4a9eff;
  --dsw-alias-label-secondary: #777777;
  --dsw-alias-label-tertiary: #666666;
  --dsw-alias-label-caption: #585858;
  --dsw-alias-label-dimmed: #4a4a4a;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(255, 255, 255, 0.06);
  --dsw-alias-border-l2: rgba(255, 255, 255, 0.12);
  --dsw-alias-border-l3: rgba(255, 255, 255, 0.18);
  --dsw-alias-border-l4: rgba(255, 255, 255, 0.24);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #4a9eff;
  --dsw-alias-brand-text: #66b0ff;
  --dsw-alias-brand-primary-invert: #1a1a1a;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #4a9eff;
  --dsw-alias-button-primary-fill: #2a6ab8;
  --dsw-alias-button-primary-hover: #3a7ed4;
  --dsw-alias-button-primary-dimmed: #2a2a2a;
  --dsw-alias-button-info-fill: #3a7ed4;
  --dsw-alias-button-info-hover: #2a6ab8;
  --dsw-alias-button-contrast-fill: #80bcff;
  --dsw-alias-button-elevated-fill: #2a2a2a;
  --dsw-alias-button-floating-fill: #222222;
  --dsw-alias-button-floating-hover: #2a2a2a;
  --dsw-alias-button-ghost-active-fill: #303030;
  --dsw-alias-button-ghost-active-hover: #383838;
  --dsw-alias-button-ghost-active-border: #4a9eff;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, 0.06);
  --dsw-alias-interactive-bg-active: rgba(255, 255, 255, 0.10);
  --dsw-alias-interactive-bg-hover-accent: rgba(74, 158, 255, 0.14);
  --dsw-alias-interactive-bg-hover-solid: #2a2a2a;

  /* 状态层 */
  --dsw-alias-state-business-primary: #4a9eff;
  --dsw-alias-state-business-tertiary: #2a2a2a;
  --dsw-alias-state-error-primary: #f07070;
  --dsw-alias-state-error-secondary: #e05c5c;
  --dsw-alias-state-success-primary: #48c878;
  --dsw-alias-state-success-secondary: #48b86a;
  --dsw-alias-state-success-tertiary: #16301e;
  --dsw-alias-state-warn-primary: #d8b050;
  --dsw-alias-state-warn-secondary: #c0a03e;
  --dsw-alias-state-warn-tertiary: #322a14;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #1e1e1e;
  --dsw-alias-markdown-code-block-banner: #222222;
  --dsw-alias-markdown-inline-code: #2a2a2a;
  --dsw-alias-markdown-code-segment-selected: #222222;
  --dsw-alias-markdown-code-segment-unselected: #1e1e1e;
  --dsw-alias-markdown-tag: #2a2a2a;
  --dsw-alias-markdown-placeholder: #222222;
  --dsw-alias-markdown-citation: #2a2a2a;

  /* 特定区域 */
  --dsw-specific-bubble: #2a2a2a;
  --dsw-specific-bubble-highlight: #303030;
  --dsw-specific-sidebar-fill: #1e1e1e;
  --dsw-specific-sidebar-nav-item-active: #2a2a2a;
  --dsw-specific-sidebar-nav-item-active-accent: #383838;
  --dsw-specific-sidebar-nav-item-hover: #222222;
  --dsw-specific-input-major: #222222;
  --dsw-specific-login-input: #1e1e1e;
  --dsw-specific-menu: #222222;
  --dsw-specific-selector: #2a2a2a;
  --dsw-specific-tip: #222222;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #303030;
  --dsw-alias-scrollbar-bg-l2: #383838;
  --dsw-alias-scrollbar-hover-l1: #424242;
  --dsw-alias-scrollbar-hover-l2: #4c4c4c;

  /* 浮层 */
  --dsw-alias-toast-bg: #383838;
  --dsw-alias-tooltip-bg: #383838;
}
`

export const mintCss = `/* ═══════════════════════════════════════════════════════════════
   Mint 薄荷冰沙 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/mint.css：
   清爽薄荷绿主调 + 奶白底色，圆润边角，像一杯薄荷奶昔。
   ═══════════════════════════════════════════════════════════════ */

body.theme-mint {
  /* 背景层 */
  --dsw-alias-bg-base: #f5fbf8;
  --dsw-alias-bg-layer-1: #fafdfb;
  --dsw-alias-bg-layer-2: #e8f8f0;
  --dsw-alias-bg-layer-3: #d0f0e0;
  --dsw-alias-bg-overlay: #e8f8f0;
  --dsw-alias-bg-module-platform: #e8f8f0;
  --dsw-alias-bg-multi-select: #d0f0e0;
  --dsw-alias-bg-skeleton: rgba(16, 185, 129, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #1a3a2a;
  --dsw-alias-label-primary-dimmed: #2a4a3a;
  --dsw-alias-label-primary-bluish: #059669;
  --dsw-alias-label-secondary: #34d399;
  --dsw-alias-label-tertiary: #3a8a6a;
  --dsw-alias-label-caption: #4a9a7a;
  --dsw-alias-label-dimmed: #5aaa8a;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(16, 185, 129, 0.10);
  --dsw-alias-border-l2: rgba(16, 185, 129, 0.16);
  --dsw-alias-border-l3: rgba(16, 185, 129, 0.22);
  --dsw-alias-border-l4: rgba(16, 185, 129, 0.28);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #10b981;
  --dsw-alias-brand-text: #059669;
  --dsw-alias-brand-primary-invert: #e8f8f0;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #10b981;
  --dsw-alias-button-primary-fill: #10b981;
  --dsw-alias-button-primary-hover: #059669;
  --dsw-alias-button-primary-dimmed: #c6eee0;
  --dsw-alias-button-info-fill: #10b981;
  --dsw-alias-button-info-hover: #34d399;
  --dsw-alias-button-contrast-fill: #0a7a52;
  --dsw-alias-button-elevated-fill: #fafdfb;
  --dsw-alias-button-floating-fill: #fafdfb;
  --dsw-alias-button-floating-hover: #e8f8f0;
  --dsw-alias-button-ghost-active-fill: #c6eee0;
  --dsw-alias-button-ghost-active-hover: #b4e4d4;
  --dsw-alias-button-ghost-active-border: #5ac8a0;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(16, 185, 129, 0.08);
  --dsw-alias-interactive-bg-active: rgba(16, 185, 129, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(16, 185, 129, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #d0f0e0;

  /* 状态层 */
  --dsw-alias-state-business-primary: #10b981;
  --dsw-alias-state-business-tertiary: #c6eee0;
  --dsw-alias-state-error-primary: #c05050;
  --dsw-alias-state-error-secondary: #d06464;
  --dsw-alias-state-success-primary: #10b981;
  --dsw-alias-state-success-secondary: #34d399;
  --dsw-alias-state-success-tertiary: #c6eee0;
  --dsw-alias-state-warn-primary: #b0882a;
  --dsw-alias-state-warn-secondary: #c8a040;
  --dsw-alias-state-warn-tertiary: #ece4c4;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #e8f8f0;
  --dsw-alias-markdown-code-block-banner: #d0f0e0;
  --dsw-alias-markdown-inline-code: #c6eee0;
  --dsw-alias-markdown-code-segment-selected: #fafdfb;
  --dsw-alias-markdown-code-segment-unselected: #d0f0e0;
  --dsw-alias-markdown-tag: #d0f0e0;
  --dsw-alias-markdown-placeholder: #e8f8f0;
  --dsw-alias-markdown-citation: #e8f8f0;

  /* 特定区域 */
  --dsw-specific-bubble: #e8f8f0;
  --dsw-specific-bubble-highlight: #c6eee0;
  --dsw-specific-sidebar-fill: #eaf6f0;
  --dsw-specific-sidebar-nav-item-active: #c6eee0;
  --dsw-specific-sidebar-nav-item-active-accent: #b0e2d0;
  --dsw-specific-sidebar-nav-item-hover: #d0f0e0;
  --dsw-specific-input-major: #fafdfb;
  --dsw-specific-login-input: #e8f8f0;
  --dsw-specific-menu: #e8f8f0;
  --dsw-specific-selector: #d0f0e0;
  --dsw-specific-tip: #e8f8f0;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #b0dcc8;
  --dsw-alias-scrollbar-bg-l2: #a0d0bc;
  --dsw-alias-scrollbar-hover-l1: #8cc0aa;
  --dsw-alias-scrollbar-hover-l2: #78b098;

  /* 浮层 */
  --dsw-alias-toast-bg: #2a4a3a;
  --dsw-alias-tooltip-bg: #2a4a3a;
}

body.theme-mint[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #0a1a14;
  --dsw-alias-bg-layer-1: #081510;
  --dsw-alias-bg-layer-2: #0f2a1e;
  --dsw-alias-bg-layer-3: #153a2a;
  --dsw-alias-bg-overlay: #1a4432;
  --dsw-alias-bg-module-platform: #0f2a1e;
  --dsw-alias-bg-multi-select: #153a2a;
  --dsw-alias-bg-skeleton: rgba(52, 211, 153, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #b0e0d0;
  --dsw-alias-label-primary-dimmed: #98c8b8;
  --dsw-alias-label-primary-bluish: #6ee7b7;
  --dsw-alias-label-secondary: #10b981;
  --dsw-alias-label-tertiary: #0a9a6a;
  --dsw-alias-label-caption: #088a5e;
  --dsw-alias-label-dimmed: #067a52;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(52, 211, 153, 0.08);
  --dsw-alias-border-l2: rgba(52, 211, 153, 0.14);
  --dsw-alias-border-l3: rgba(52, 211, 153, 0.20);
  --dsw-alias-border-l4: rgba(52, 211, 153, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #34d399;
  --dsw-alias-brand-text: #6ee7b7;
  --dsw-alias-brand-primary-invert: #0a1a14;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #34d399;
  --dsw-alias-button-primary-fill: #0a7a52;
  --dsw-alias-button-primary-hover: #0f9a68;
  --dsw-alias-button-primary-dimmed: #153a2a;
  --dsw-alias-button-info-fill: #0f9a68;
  --dsw-alias-button-info-hover: #0a7a52;
  --dsw-alias-button-contrast-fill: #8aecd0;
  --dsw-alias-button-elevated-fill: #153a2a;
  --dsw-alias-button-floating-fill: #0f2a1e;
  --dsw-alias-button-floating-hover: #153a2a;
  --dsw-alias-button-ghost-active-fill: #1a4432;
  --dsw-alias-button-ghost-active-hover: #20503c;
  --dsw-alias-button-ghost-active-border: #34d399;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(52, 211, 153, 0.08);
  --dsw-alias-interactive-bg-active: rgba(52, 211, 153, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(52, 211, 153, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #153a2a;

  /* 状态层 */
  --dsw-alias-state-business-primary: #34d399;
  --dsw-alias-state-business-tertiary: #153a2a;
  --dsw-alias-state-error-primary: #e07070;
  --dsw-alias-state-error-secondary: #d05c5c;
  --dsw-alias-state-success-primary: #34d399;
  --dsw-alias-state-success-secondary: #6ee7b7;
  --dsw-alias-state-success-tertiary: #0f2a1e;
  --dsw-alias-state-warn-primary: #d8b050;
  --dsw-alias-state-warn-secondary: #c0a03e;
  --dsw-alias-state-warn-tertiary: #322a14;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #081510;
  --dsw-alias-markdown-code-block-banner: #0f2a1e;
  --dsw-alias-markdown-inline-code: #153a2a;
  --dsw-alias-markdown-code-segment-selected: #0f2a1e;
  --dsw-alias-markdown-code-segment-unselected: #081510;
  --dsw-alias-markdown-tag: #153a2a;
  --dsw-alias-markdown-placeholder: #0f2a1e;
  --dsw-alias-markdown-citation: #153a2a;

  /* 特定区域 */
  --dsw-specific-bubble: #153a2a;
  --dsw-specific-bubble-highlight: #1a4432;
  --dsw-specific-sidebar-fill: #081510;
  --dsw-specific-sidebar-nav-item-active: #153a2a;
  --dsw-specific-sidebar-nav-item-active-accent: #20503c;
  --dsw-specific-sidebar-nav-item-hover: #0f2a1e;
  --dsw-specific-input-major: #0f2a1e;
  --dsw-specific-login-input: #081510;
  --dsw-specific-menu: #0f2a1e;
  --dsw-specific-selector: #153a2a;
  --dsw-specific-tip: #0f2a1e;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #17402e;
  --dsw-alias-scrollbar-bg-l2: #1c4a36;
  --dsw-alias-scrollbar-hover-l1: #225840;
  --dsw-alias-scrollbar-hover-l2: #28664a;

  /* 浮层 */
  --dsw-alias-toast-bg: #20503c;
  --dsw-alias-tooltip-bg: #20503c;
}
`

export const morandiCss = `/* ═══════════════════════════════════════════════════════════════
   Morandi 莫兰迪 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown themes/morandi.css：
   - 亮色：米白底 + 低饱和豆沙/粉藕色
   - 暗色：深褐底 + 暖灰文字
   低饱和灰调，高级而不张扬。
   ═══════════════════════════════════════════════════════════════ */

body.theme-morandi {
  /* 背景层 */
  --dsw-alias-bg-base: #f7f3ef;
  --dsw-alias-bg-layer-1: #faf7f4;
  --dsw-alias-bg-layer-2: #f1ece6;
  --dsw-alias-bg-layer-3: #ece5dd;
  --dsw-alias-bg-overlay: #f1ece6;
  --dsw-alias-bg-module-platform: #f1ece6;
  --dsw-alias-bg-multi-select: #ece5dd;
  --dsw-alias-bg-skeleton: rgba(184, 146, 122, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #4d4640;
  --dsw-alias-label-primary-dimmed: #5c5550;
  --dsw-alias-label-primary-bluish: #7a6a5c;
  --dsw-alias-label-secondary: #90847a;
  --dsw-alias-label-tertiary: #9a8f84;
  --dsw-alias-label-caption: #a89c90;
  --dsw-alias-label-dimmed: #b3a89d;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(77, 70, 64, 0.08);
  --dsw-alias-border-l2: rgba(77, 70, 64, 0.14);
  --dsw-alias-border-l3: rgba(77, 70, 64, 0.20);
  --dsw-alias-border-l4: rgba(77, 70, 64, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #b8927a;
  --dsw-alias-brand-text: #9a7a60;
  --dsw-alias-brand-primary-invert: #f1ece6;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #b8927a;
  --dsw-alias-button-primary-fill: #b8927a;
  --dsw-alias-button-primary-hover: #a5826a;
  --dsw-alias-button-primary-dimmed: #e8ddd2;
  --dsw-alias-button-info-fill: #b8927a;
  --dsw-alias-button-info-hover: #c4a088;
  --dsw-alias-button-contrast-fill: #8a6e58;
  --dsw-alias-button-elevated-fill: #faf7f4;
  --dsw-alias-button-floating-fill: #faf7f4;
  --dsw-alias-button-floating-hover: #f1ece6;
  --dsw-alias-button-ghost-active-fill: #e8ddd2;
  --dsw-alias-button-ghost-active-hover: #e2d5c8;
  --dsw-alias-button-ghost-active-border: #c4a088;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(184, 146, 122, 0.10);
  --dsw-alias-interactive-bg-active: rgba(184, 146, 122, 0.16);
  --dsw-alias-interactive-bg-hover-accent: rgba(184, 146, 122, 0.18);
  --dsw-alias-interactive-bg-hover-solid: #ece5dd;

  /* 状态层 */
  --dsw-alias-state-business-primary: #b8927a;
  --dsw-alias-state-business-tertiary: #e8ddd2;
  --dsw-alias-state-error-primary: #b56a5a;
  --dsw-alias-state-error-secondary: #c47a6a;
  --dsw-alias-state-success-primary: #7a9a7a;
  --dsw-alias-state-success-secondary: #8fb08f;
  --dsw-alias-state-success-tertiary: #dce8dc;
  --dsw-alias-state-warn-primary: #b8924a;
  --dsw-alias-state-warn-secondary: #c8a25e;
  --dsw-alias-state-warn-tertiary: #ece0cc;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #f1ece6;
  --dsw-alias-markdown-code-block-banner: #ece5dd;
  --dsw-alias-markdown-inline-code: #e8ddd2;
  --dsw-alias-markdown-code-segment-selected: #faf7f4;
  --dsw-alias-markdown-code-segment-unselected: #ece5dd;
  --dsw-alias-markdown-tag: #ece5dd;
  --dsw-alias-markdown-placeholder: #f1ece6;
  --dsw-alias-markdown-citation: #f1ece6;

  /* 特定区域 */
  --dsw-specific-bubble: #f1ece6;
  --dsw-specific-bubble-highlight: #e8ddd2;
  --dsw-specific-sidebar-fill: #efebe5;
  --dsw-specific-sidebar-nav-item-active: #e8ddd2;
  --dsw-specific-sidebar-nav-item-active-accent: #dccfc0;
  --dsw-specific-sidebar-nav-item-hover: #ece5dd;
  --dsw-specific-input-major: #faf7f4;
  --dsw-specific-login-input: #f1ece6;
  --dsw-specific-menu: #f1ece6;
  --dsw-specific-selector: #ece5dd;
  --dsw-specific-tip: #f1ece6;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #ddd2c6;
  --dsw-alias-scrollbar-bg-l2: #d2c6b8;
  --dsw-alias-scrollbar-hover-l1: #c2b4a4;
  --dsw-alias-scrollbar-hover-l2: #b2a290;

  /* 浮层 */
  --dsw-alias-toast-bg: #5c5550;
  --dsw-alias-tooltip-bg: #5c5550;
}

body.theme-morandi[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #2c2926;
  --dsw-alias-bg-layer-1: #322f2b;
  --dsw-alias-bg-layer-2: #38342f;
  --dsw-alias-bg-layer-3: #3e3a34;
  --dsw-alias-bg-overlay: #46413a;
  --dsw-alias-bg-module-platform: #38342f;
  --dsw-alias-bg-multi-select: #3e3a34;
  --dsw-alias-bg-skeleton: rgba(200, 192, 182, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #c8c0b6;
  --dsw-alias-label-primary-dimmed: #b4aca0;
  --dsw-alias-label-primary-bluish: #cca888;
  --dsw-alias-label-secondary: #a09890;
  --dsw-alias-label-tertiary: #8a8278;
  --dsw-alias-label-caption: #7a7268;
  --dsw-alias-label-dimmed: #6a6258;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(200, 192, 182, 0.06);
  --dsw-alias-border-l2: rgba(200, 192, 182, 0.12);
  --dsw-alias-border-l3: rgba(200, 192, 182, 0.18);
  --dsw-alias-border-l4: rgba(200, 192, 182, 0.24);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #cca888;
  --dsw-alias-brand-text: #d8b898;
  --dsw-alias-brand-primary-invert: #2c2926;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #cca888;
  --dsw-alias-button-primary-fill: #8a7260;
  --dsw-alias-button-primary-hover: #9c8470;
  --dsw-alias-button-primary-dimmed: #3e3a34;
  --dsw-alias-button-info-fill: #9c8470;
  --dsw-alias-button-info-hover: #8a7260;
  --dsw-alias-button-contrast-fill: #d8b898;
  --dsw-alias-button-elevated-fill: #3e3a34;
  --dsw-alias-button-floating-fill: #38342f;
  --dsw-alias-button-floating-hover: #3e3a34;
  --dsw-alias-button-ghost-active-fill: #46413a;
  --dsw-alias-button-ghost-active-hover: #4e4840;
  --dsw-alias-button-ghost-active-border: #a8846a;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(200, 192, 182, 0.08);
  --dsw-alias-interactive-bg-active: rgba(200, 192, 182, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(204, 168, 136, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #3e3a34;

  /* 状态层 */
  --dsw-alias-state-business-primary: #cca888;
  --dsw-alias-state-business-tertiary: #3e3a34;
  --dsw-alias-state-error-primary: #c47a6a;
  --dsw-alias-state-error-secondary: #d48a7a;
  --dsw-alias-state-success-primary: #8fb08f;
  --dsw-alias-state-success-secondary: #9cc09c;
  --dsw-alias-state-success-tertiary: #2c3a2c;
  --dsw-alias-state-warn-primary: #c8a25e;
  --dsw-alias-state-warn-secondary: #d4b06e;
  --dsw-alias-state-warn-tertiary: #3a3220;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #322f2b;
  --dsw-alias-markdown-code-block-banner: #38342f;
  --dsw-alias-markdown-inline-code: #3e3a34;
  --dsw-alias-markdown-code-segment-selected: #38342f;
  --dsw-alias-markdown-code-segment-unselected: #322f2b;
  --dsw-alias-markdown-tag: #3e3a34;
  --dsw-alias-markdown-placeholder: #38342f;
  --dsw-alias-markdown-citation: #3e3a34;

  /* 特定区域 */
  --dsw-specific-bubble: #3e3a34;
  --dsw-specific-bubble-highlight: #46413a;
  --dsw-specific-sidebar-fill: #242120;
  --dsw-specific-sidebar-nav-item-active: #3e3a34;
  --dsw-specific-sidebar-nav-item-active-accent: #48433c;
  --dsw-specific-sidebar-nav-item-hover: #322f2b;
  --dsw-specific-input-major: #38342f;
  --dsw-specific-login-input: #322f2b;
  --dsw-specific-menu: #38342f;
  --dsw-specific-selector: #3e3a34;
  --dsw-specific-tip: #38342f;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #423e38;
  --dsw-alias-scrollbar-bg-l2: #4a463f;
  --dsw-alias-scrollbar-hover-l1: #565148;
  --dsw-alias-scrollbar-hover-l2: #625c52;

  /* 浮层 */
  --dsw-alias-toast-bg: #4e4840;
  --dsw-alias-tooltip-bg: #4e4840;
}
`

export const natureCss = `/* ═══════════════════════════════════════════════════════════════
   Nature 自然风 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/nature.css：
   暖米纸底 + 墨绿，Lora 衬线字体，自然纸感阅读体验。
   亮色：米黄纸底 + 森林绿；暗色：深墨绿 + 苔藓绿。
   ═══════════════════════════════════════════════════════════════ */

body.theme-nature {
  /* 背景层 */
  --dsw-alias-bg-base: #f5f2eb;
  --dsw-alias-bg-layer-1: #faf8f2;
  --dsw-alias-bg-layer-2: #eae7de;
  --dsw-alias-bg-layer-3: #e0dcd0;
  --dsw-alias-bg-overlay: #eae7de;
  --dsw-alias-bg-module-platform: #eae7de;
  --dsw-alias-bg-multi-select: #e0dcd0;
  --dsw-alias-bg-skeleton: rgba(74, 124, 89, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #2d3a2e;
  --dsw-alias-label-primary-dimmed: #3a4a3c;
  --dsw-alias-label-primary-bluish: #4a7c59;
  --dsw-alias-label-secondary: #6b7a6c;
  --dsw-alias-label-tertiary: #7a8a7c;
  --dsw-alias-label-caption: #8a9a8c;
  --dsw-alias-label-dimmed: #9aaa9c;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(45, 58, 46, 0.08);
  --dsw-alias-border-l2: rgba(45, 58, 46, 0.14);
  --dsw-alias-border-l3: rgba(45, 58, 46, 0.20);
  --dsw-alias-border-l4: rgba(45, 58, 46, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #4a7c59;
  --dsw-alias-brand-text: #3a6a4a;
  --dsw-alias-brand-primary-invert: #eae7de;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #4a7c59;
  --dsw-alias-button-primary-fill: #4a7c59;
  --dsw-alias-button-primary-hover: #3a6a4a;
  --dsw-alias-button-primary-dimmed: #d4cfc0;
  --dsw-alias-button-info-fill: #4a7c59;
  --dsw-alias-button-info-hover: #5a8c69;
  --dsw-alias-button-contrast-fill: #2e523c;
  --dsw-alias-button-elevated-fill: #faf8f2;
  --dsw-alias-button-floating-fill: #faf8f2;
  --dsw-alias-button-floating-hover: #eae7de;
  --dsw-alias-button-ghost-active-fill: #d4cfc0;
  --dsw-alias-button-ghost-active-hover: #c8c4b4;
  --dsw-alias-button-ghost-active-border: #7aa88a;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(74, 124, 89, 0.08);
  --dsw-alias-interactive-bg-active: rgba(74, 124, 89, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(74, 124, 89, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #e0dcd0;

  /* 状态层 */
  --dsw-alias-state-business-primary: #4a7c59;
  --dsw-alias-state-business-tertiary: #d4cfc0;
  --dsw-alias-state-error-primary: #b05a3a;
  --dsw-alias-state-error-secondary: #c06a4a;
  --dsw-alias-state-success-primary: #4a7c59;
  --dsw-alias-state-success-secondary: #5a8c69;
  --dsw-alias-state-success-tertiary: #d4e0d4;
  --dsw-alias-state-warn-primary: #a8842a;
  --dsw-alias-state-warn-secondary: #c09c3a;
  --dsw-alias-state-warn-tertiary: #e8e0c4;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #eae7de;
  --dsw-alias-markdown-code-block-banner: #e0dcd0;
  --dsw-alias-markdown-inline-code: #d4cfc0;
  --dsw-alias-markdown-code-segment-selected: #faf8f2;
  --dsw-alias-markdown-code-segment-unselected: #e0dcd0;
  --dsw-alias-markdown-tag: #e0dcd0;
  --dsw-alias-markdown-placeholder: #eae7de;
  --dsw-alias-markdown-citation: #eae7de;

  /* 特定区域 */
  --dsw-specific-bubble: #eae7de;
  --dsw-specific-bubble-highlight: #d4cfc0;
  --dsw-specific-sidebar-fill: #eae7de;
  --dsw-specific-sidebar-nav-item-active: #d4cfc0;
  --dsw-specific-sidebar-nav-item-active-accent: #c4c0b0;
  --dsw-specific-sidebar-nav-item-hover: #e0dcd0;
  --dsw-specific-input-major: #faf8f2;
  --dsw-specific-login-input: #eae7de;
  --dsw-specific-menu: #eae7de;
  --dsw-specific-selector: #e0dcd0;
  --dsw-specific-tip: #eae7de;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #c8c4b4;
  --dsw-alias-scrollbar-bg-l2: #bcb8a8;
  --dsw-alias-scrollbar-hover-l1: #aca898;
  --dsw-alias-scrollbar-hover-l2: #9c9888;

  /* 浮层 */
  --dsw-alias-toast-bg: #3a4a3c;
  --dsw-alias-tooltip-bg: #3a4a3c;
}

body.theme-nature[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #1a1f1a;
  --dsw-alias-bg-layer-1: #1e241e;
  --dsw-alias-bg-layer-2: #242c24;
  --dsw-alias-bg-layer-3: #2a332a;
  --dsw-alias-bg-overlay: #323c32;
  --dsw-alias-bg-module-platform: #242c24;
  --dsw-alias-bg-multi-select: #2a332a;
  --dsw-alias-bg-skeleton: rgba(125, 184, 142, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #c8d4c5;
  --dsw-alias-label-primary-dimmed: #aebcb0;
  --dsw-alias-label-primary-bluish: #7db88e;
  --dsw-alias-label-secondary: #7a8a78;
  --dsw-alias-label-tertiary: #6a7a68;
  --dsw-alias-label-caption: #5a6a58;
  --dsw-alias-label-dimmed: #4c5a4a;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(125, 184, 142, 0.08);
  --dsw-alias-border-l2: rgba(125, 184, 142, 0.14);
  --dsw-alias-border-l3: rgba(125, 184, 142, 0.20);
  --dsw-alias-border-l4: rgba(125, 184, 142, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #7db88e;
  --dsw-alias-brand-text: #8ac89c;
  --dsw-alias-brand-primary-invert: #1a1f1a;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #7db88e;
  --dsw-alias-button-primary-fill: #3a5a44;
  --dsw-alias-button-primary-hover: #4c7458;
  --dsw-alias-button-primary-dimmed: #2a332a;
  --dsw-alias-button-info-fill: #4c7458;
  --dsw-alias-button-info-hover: #3a5a44;
  --dsw-alias-button-contrast-fill: #9cd0ac;
  --dsw-alias-button-elevated-fill: #2a332a;
  --dsw-alias-button-floating-fill: #242c24;
  --dsw-alias-button-floating-hover: #2a332a;
  --dsw-alias-button-ghost-active-fill: #323c32;
  --dsw-alias-button-ghost-active-hover: #3a463a;
  --dsw-alias-button-ghost-active-border: #7db88e;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(125, 184, 142, 0.08);
  --dsw-alias-interactive-bg-active: rgba(125, 184, 142, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(125, 184, 142, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #2a332a;

  /* 状态层 */
  --dsw-alias-state-business-primary: #7db88e;
  --dsw-alias-state-business-tertiary: #2a332a;
  --dsw-alias-state-error-primary: #d08060;
  --dsw-alias-state-error-secondary: #c06c50;
  --dsw-alias-state-success-primary: #7db88e;
  --dsw-alias-state-success-secondary: #8ac89c;
  --dsw-alias-state-success-tertiary: #1c2c22;
  --dsw-alias-state-warn-primary: #d0b060;
  --dsw-alias-state-warn-secondary: #bc9c4c;
  --dsw-alias-state-warn-tertiary: #302818;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #1e241e;
  --dsw-alias-markdown-code-block-banner: #242c24;
  --dsw-alias-markdown-inline-code: #2a332a;
  --dsw-alias-markdown-code-segment-selected: #242c24;
  --dsw-alias-markdown-code-segment-unselected: #1e241e;
  --dsw-alias-markdown-tag: #2a332a;
  --dsw-alias-markdown-placeholder: #242c24;
  --dsw-alias-markdown-citation: #2a332a;

  /* 特定区域 */
  --dsw-specific-bubble: #2a332a;
  --dsw-specific-bubble-highlight: #323c32;
  --dsw-specific-sidebar-fill: #1e241e;
  --dsw-specific-sidebar-nav-item-active: #2a332a;
  --dsw-specific-sidebar-nav-item-active-accent: #3a463a;
  --dsw-specific-sidebar-nav-item-hover: #242c24;
  --dsw-specific-input-major: #242c24;
  --dsw-specific-login-input: #1e241e;
  --dsw-specific-menu: #242c24;
  --dsw-specific-selector: #2a332a;
  --dsw-specific-tip: #242c24;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #2e3a30;
  --dsw-alias-scrollbar-bg-l2: #344236;
  --dsw-alias-scrollbar-hover-l1: #3e4e40;
  --dsw-alias-scrollbar-hover-l2: #485a4a;

  /* 浮层 */
  --dsw-alias-toast-bg: #3a463a;
  --dsw-alias-tooltip-bg: #3a463a;
}
`

export const palaceCss = `/* ═══════════════════════════════════════════════════════════════
   Palace 故宫朱砂 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown themes/palace.css：
   - 亮色：宣纸底 + 朱砂红 + 琉璃金
   - 暗色：深墨底 + 朱砂红提亮
   中式宫廷典雅。
   ═══════════════════════════════════════════════════════════════ */

body.theme-palace {
  /* 背景层 */
  --dsw-alias-bg-base: #faf6f0;
  --dsw-alias-bg-layer-1: #fdfaf5;
  --dsw-alias-bg-layer-2: #f5eee4;
  --dsw-alias-bg-layer-3: #efe5d8;
  --dsw-alias-bg-overlay: #f5eee4;
  --dsw-alias-bg-module-platform: #f5eee4;
  --dsw-alias-bg-multi-select: #efe5d8;
  --dsw-alias-bg-skeleton: rgba(181, 55, 42, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #3d2f24;
  --dsw-alias-label-primary-dimmed: #4a3a2e;
  --dsw-alias-label-primary-bluish: #8a4a2a;
  --dsw-alias-label-secondary: #7a6a58;
  --dsw-alias-label-tertiary: #8a7a68;
  --dsw-alias-label-caption: #9a8a76;
  --dsw-alias-label-dimmed: #a89a88;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(181, 55, 42, 0.10);
  --dsw-alias-border-l2: rgba(181, 55, 42, 0.16);
  --dsw-alias-border-l3: rgba(181, 55, 42, 0.22);
  --dsw-alias-border-l4: rgba(181, 55, 42, 0.28);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #b5372a;
  --dsw-alias-brand-text: #9c2f24;
  --dsw-alias-brand-primary-invert: #f5eee4;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #b5372a;
  --dsw-alias-button-primary-fill: #b5372a;
  --dsw-alias-button-primary-hover: #9c2f24;
  --dsw-alias-button-primary-dimmed: #ecd8ce;
  --dsw-alias-button-info-fill: #b5372a;
  --dsw-alias-button-info-hover: #c84a3c;
  --dsw-alias-button-contrast-fill: #8a2a20;
  --dsw-alias-button-elevated-fill: #fdfaf5;
  --dsw-alias-button-floating-fill: #fdfaf5;
  --dsw-alias-button-floating-hover: #f5eee4;
  --dsw-alias-button-ghost-active-fill: #ecd8ce;
  --dsw-alias-button-ghost-active-hover: #e2cdc0;
  --dsw-alias-button-ghost-active-border: #c87868;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(181, 55, 42, 0.08);
  --dsw-alias-interactive-bg-active: rgba(181, 55, 42, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(181, 55, 42, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #efe5d8;

  /* 状态层 */
  --dsw-alias-state-business-primary: #b5372a;
  --dsw-alias-state-business-tertiary: #ecd8ce;
  --dsw-alias-state-error-primary: #b5372a;
  --dsw-alias-state-error-secondary: #c84a3c;
  --dsw-alias-state-success-primary: #7a8a4a;
  --dsw-alias-state-success-secondary: #8fa05c;
  --dsw-alias-state-success-tertiary: #e2e8d0;
  --dsw-alias-state-warn-primary: #b8862a;
  --dsw-alias-state-warn-secondary: #c89c42;
  --dsw-alias-state-warn-tertiary: #ece0c4;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #f5eee4;
  --dsw-alias-markdown-code-block-banner: #efe5d8;
  --dsw-alias-markdown-inline-code: #ecd8ce;
  --dsw-alias-markdown-code-segment-selected: #fdfaf5;
  --dsw-alias-markdown-code-segment-unselected: #efe5d8;
  --dsw-alias-markdown-tag: #efe5d8;
  --dsw-alias-markdown-placeholder: #f5eee4;
  --dsw-alias-markdown-citation: #f5eee4;

  /* 特定区域 */
  --dsw-specific-bubble: #f5eee4;
  --dsw-specific-bubble-highlight: #ecd8ce;
  --dsw-specific-sidebar-fill: #f3ecdf;
  --dsw-specific-sidebar-nav-item-active: #ecd8ce;
  --dsw-specific-sidebar-nav-item-active-accent: #dfc8b8;
  --dsw-specific-sidebar-nav-item-hover: #efe5d8;
  --dsw-specific-input-major: #fdfaf5;
  --dsw-specific-login-input: #f5eee4;
  --dsw-specific-menu: #f5eee4;
  --dsw-specific-selector: #efe5d8;
  --dsw-specific-tip: #f5eee4;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #e2d0c2;
  --dsw-alias-scrollbar-bg-l2: #d8c4b4;
  --dsw-alias-scrollbar-hover-l1: #c8b09e;
  --dsw-alias-scrollbar-hover-l2: #b89c88;

  /* 浮层 */
  --dsw-alias-toast-bg: #4a3a2e;
  --dsw-alias-tooltip-bg: #4a3a2e;
}

body.theme-palace[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #201812;
  --dsw-alias-bg-layer-1: #271d15;
  --dsw-alias-bg-layer-2: #2e2218;
  --dsw-alias-bg-layer-3: #35281c;
  --dsw-alias-bg-overlay: #3d2e20;
  --dsw-alias-bg-module-platform: #2e2218;
  --dsw-alias-bg-multi-select: #35281c;
  --dsw-alias-bg-skeleton: rgba(200, 96, 70, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #e0d4c4;
  --dsw-alias-label-primary-dimmed: #ccbeb0;
  --dsw-alias-label-primary-bluish: #d88454;
  --dsw-alias-label-secondary: #b0a090;
  --dsw-alias-label-tertiary: #9a8a78;
  --dsw-alias-label-caption: #8a7a68;
  --dsw-alias-label-dimmed: #7a6a58;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(200, 96, 70, 0.08);
  --dsw-alias-border-l2: rgba(200, 96, 70, 0.14);
  --dsw-alias-border-l3: rgba(200, 96, 70, 0.20);
  --dsw-alias-border-l4: rgba(200, 96, 70, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #d04838;
  --dsw-alias-brand-text: #e07058;
  --dsw-alias-brand-primary-invert: #201812;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #d04838;
  --dsw-alias-button-primary-fill: #a03a2e;
  --dsw-alias-button-primary-hover: #b84a3c;
  --dsw-alias-button-primary-dimmed: #35281c;
  --dsw-alias-button-info-fill: #a03a2e;
  --dsw-alias-button-info-hover: #b84a3c;
  --dsw-alias-button-contrast-fill: #e8845c;
  --dsw-alias-button-elevated-fill: #35281c;
  --dsw-alias-button-floating-fill: #2e2218;
  --dsw-alias-button-floating-hover: #35281c;
  --dsw-alias-button-ghost-active-fill: #3d2e20;
  --dsw-alias-button-ghost-active-hover: #463426;
  --dsw-alias-button-ghost-active-border: #c06050;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(200, 96, 70, 0.08);
  --dsw-alias-interactive-bg-active: rgba(200, 96, 70, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(200, 96, 70, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #35281c;

  /* 状态层 */
  --dsw-alias-state-business-primary: #d04838;
  --dsw-alias-state-business-tertiary: #35281c;
  --dsw-alias-state-error-primary: #e06050;
  --dsw-alias-state-error-secondary: #d04838;
  --dsw-alias-state-success-primary: #9cb05c;
  --dsw-alias-state-success-secondary: #acc06c;
  --dsw-alias-state-success-tertiary: #2c3220;
  --dsw-alias-state-warn-primary: #d8a84e;
  --dsw-alias-state-warn-secondary: #c89844;
  --dsw-alias-state-warn-tertiary: #3a3020;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #271d15;
  --dsw-alias-markdown-code-block-banner: #2e2218;
  --dsw-alias-markdown-inline-code: #35281c;
  --dsw-alias-markdown-code-segment-selected: #2e2218;
  --dsw-alias-markdown-code-segment-unselected: #271d15;
  --dsw-alias-markdown-tag: #35281c;
  --dsw-alias-markdown-placeholder: #2e2218;
  --dsw-alias-markdown-citation: #35281c;

  /* 特定区域 */
  --dsw-specific-bubble: #35281c;
  --dsw-specific-bubble-highlight: #3d2e20;
  --dsw-specific-sidebar-fill: #241b13;
  --dsw-specific-sidebar-nav-item-active: #35281c;
  --dsw-specific-sidebar-nav-item-active-accent: #463426;
  --dsw-specific-sidebar-nav-item-hover: #2e2218;
  --dsw-specific-input-major: #2e2218;
  --dsw-specific-login-input: #271d15;
  --dsw-specific-menu: #2e2218;
  --dsw-specific-selector: #35281c;
  --dsw-specific-tip: #2e2218;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #3a2c20;
  --dsw-alias-scrollbar-bg-l2: #423426;
  --dsw-alias-scrollbar-hover-l1: #4e3c2c;
  --dsw-alias-scrollbar-hover-l2: #5a4634;

  /* 浮层 */
  --dsw-alias-toast-bg: #463426;
  --dsw-alias-tooltip-bg: #463426;
}
`

export const sunsetCss = `/* ═══════════════════════════════════════════════════════════════
   Sunset 落日熔金 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/sunset.css：
   亮色：暖白底 + 琥珀色，午后的暖阳；
   暗色：深紫底 + 金色光芒，暮色中的精装书。
   ═══════════════════════════════════════════════════════════════ */

body.theme-sunset {
  /* 背景层 */
  --dsw-alias-bg-base: #fef8f0;
  --dsw-alias-bg-layer-1: #fffaf4;
  --dsw-alias-bg-layer-2: #fdf0e0;
  --dsw-alias-bg-layer-3: #f5e0c5;
  --dsw-alias-bg-overlay: #fdf0e0;
  --dsw-alias-bg-module-platform: #fdf0e0;
  --dsw-alias-bg-multi-select: #f5e0c5;
  --dsw-alias-bg-skeleton: rgba(180, 83, 9, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #3a2a1a;
  --dsw-alias-label-primary-dimmed: #4a3a2a;
  --dsw-alias-label-primary-bluish: #b45309;
  --dsw-alias-label-secondary: #8a6a40;
  --dsw-alias-label-tertiary: #9a7a4a;
  --dsw-alias-label-caption: #aa8a5a;
  --dsw-alias-label-dimmed: #ba9a6a;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(180, 83, 9, 0.10);
  --dsw-alias-border-l2: rgba(180, 83, 9, 0.16);
  --dsw-alias-border-l3: rgba(180, 83, 9, 0.22);
  --dsw-alias-border-l4: rgba(180, 83, 9, 0.28);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #b45309;
  --dsw-alias-brand-text: #9a4408;
  --dsw-alias-brand-primary-invert: #fdf0e0;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #b45309;
  --dsw-alias-button-primary-fill: #b45309;
  --dsw-alias-button-primary-hover: #9a4408;
  --dsw-alias-button-primary-dimmed: #e8d0b0;
  --dsw-alias-button-info-fill: #b45309;
  --dsw-alias-button-info-hover: #c66a1a;
  --dsw-alias-button-contrast-fill: #8a3a06;
  --dsw-alias-button-elevated-fill: #fffaf4;
  --dsw-alias-button-floating-fill: #fffaf4;
  --dsw-alias-button-floating-hover: #fdf0e0;
  --dsw-alias-button-ghost-active-fill: #e8d0b0;
  --dsw-alias-button-ghost-active-hover: #dcc4a4;
  --dsw-alias-button-ghost-active-border: #d88030;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(180, 83, 9, 0.08);
  --dsw-alias-interactive-bg-active: rgba(180, 83, 9, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(180, 83, 9, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #f5e0c5;

  /* 状态层 */
  --dsw-alias-state-business-primary: #b45309;
  --dsw-alias-state-business-tertiary: #e8d0b0;
  --dsw-alias-state-error-primary: #c05030;
  --dsw-alias-state-error-secondary: #d06444;
  --dsw-alias-state-success-primary: #5a8a4a;
  --dsw-alias-state-success-secondary: #6aa05a;
  --dsw-alias-state-success-tertiary: #dce8d4;
  --dsw-alias-state-warn-primary: #b8862a;
  --dsw-alias-state-warn-secondary: #d0a040;
  --dsw-alias-state-warn-tertiary: #ece0c4;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #fdf0e0;
  --dsw-alias-markdown-code-block-banner: #f5e0c5;
  --dsw-alias-markdown-inline-code: #e8d0b0;
  --dsw-alias-markdown-code-segment-selected: #fffaf4;
  --dsw-alias-markdown-code-segment-unselected: #f5e0c5;
  --dsw-alias-markdown-tag: #f5e0c5;
  --dsw-alias-markdown-placeholder: #fdf0e0;
  --dsw-alias-markdown-citation: #fdf0e0;

  /* 特定区域 */
  --dsw-specific-bubble: #fdf0e0;
  --dsw-specific-bubble-highlight: #e8d0b0;
  --dsw-specific-sidebar-fill: #faf0e5;
  --dsw-specific-sidebar-nav-item-active: #e8d0b0;
  --dsw-specific-sidebar-nav-item-active-accent: #dcc0a0;
  --dsw-specific-sidebar-nav-item-hover: #f5e0c5;
  --dsw-specific-input-major: #fffaf4;
  --dsw-specific-login-input: #fdf0e0;
  --dsw-specific-menu: #fdf0e0;
  --dsw-specific-selector: #f5e0c5;
  --dsw-specific-tip: #fdf0e0;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #e0c8a8;
  --dsw-alias-scrollbar-bg-l2: #d4bc9c;
  --dsw-alias-scrollbar-hover-l1: #c4ac8c;
  --dsw-alias-scrollbar-hover-l2: #b49c7c;

  /* 浮层 */
  --dsw-alias-toast-bg: #4a3a2a;
  --dsw-alias-tooltip-bg: #4a3a2a;
}

body.theme-sunset[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #0d0812;
  --dsw-alias-bg-layer-1: #120a1a;
  --dsw-alias-bg-layer-2: #1a0e28;
  --dsw-alias-bg-layer-3: #251535;
  --dsw-alias-bg-overlay: #2c1a3e;
  --dsw-alias-bg-module-platform: #1a0e28;
  --dsw-alias-bg-multi-select: #251535;
  --dsw-alias-bg-skeleton: rgba(251, 191, 36, 0.06);

  /* 文字层 */
  --dsw-alias-label-primary: #e8c8a8;
  --dsw-alias-label-primary-dimmed: #d0b090;
  --dsw-alias-label-primary-bluish: #fbbf24;
  --dsw-alias-label-secondary: #a07050;
  --dsw-alias-label-tertiary: #906040;
  --dsw-alias-label-caption: #805234;
  --dsw-alias-label-dimmed: #70442a;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(251, 191, 36, 0.08);
  --dsw-alias-border-l2: rgba(251, 191, 36, 0.14);
  --dsw-alias-border-l3: rgba(251, 191, 36, 0.20);
  --dsw-alias-border-l4: rgba(251, 191, 36, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #fbbf24;
  --dsw-alias-brand-text: #f5d070;
  --dsw-alias-brand-primary-invert: #0d0812;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #fbbf24;
  --dsw-alias-button-primary-fill: #92400e;
  --dsw-alias-button-primary-hover: #b45309;
  --dsw-alias-button-primary-dimmed: #251535;
  --dsw-alias-button-info-fill: #a8500e;
  --dsw-alias-button-info-hover: #c86a1a;
  --dsw-alias-button-contrast-fill: #f5d070;
  --dsw-alias-button-elevated-fill: #251535;
  --dsw-alias-button-floating-fill: #1a0e28;
  --dsw-alias-button-floating-hover: #251535;
  --dsw-alias-button-ghost-active-fill: #2c1a3e;
  --dsw-alias-button-ghost-active-hover: #34204a;
  --dsw-alias-button-ghost-active-border: #fbbf24;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(251, 191, 36, 0.08);
  --dsw-alias-interactive-bg-active: rgba(251, 191, 36, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(251, 191, 36, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #251535;

  /* 状态层 */
  --dsw-alias-state-business-primary: #fbbf24;
  --dsw-alias-state-business-tertiary: #251535;
  --dsw-alias-state-error-primary: #f07050;
  --dsw-alias-state-error-secondary: #e05c3a;
  --dsw-alias-state-success-primary: #8ab87a;
  --dsw-alias-state-success-secondary: #9cc88a;
  --dsw-alias-state-success-tertiary: #1e2c1a;
  --dsw-alias-state-warn-primary: #f0b040;
  --dsw-alias-state-warn-secondary: #d8a030;
  --dsw-alias-state-warn-tertiary: #322818;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #120a1a;
  --dsw-alias-markdown-code-block-banner: #1a0e28;
  --dsw-alias-markdown-inline-code: #251535;
  --dsw-alias-markdown-code-segment-selected: #1a0e28;
  --dsw-alias-markdown-code-segment-unselected: #120a1a;
  --dsw-alias-markdown-tag: #251535;
  --dsw-alias-markdown-placeholder: #1a0e28;
  --dsw-alias-markdown-citation: #251535;

  /* 特定区域 */
  --dsw-specific-bubble: #251535;
  --dsw-specific-bubble-highlight: #2c1a3e;
  --dsw-specific-sidebar-fill: #0a0610;
  --dsw-specific-sidebar-nav-item-active: #251535;
  --dsw-specific-sidebar-nav-item-active-accent: #34204a;
  --dsw-specific-sidebar-nav-item-hover: #1a0e28;
  --dsw-specific-input-major: #1a0e28;
  --dsw-specific-login-input: #120a1a;
  --dsw-specific-menu: #1a0e28;
  --dsw-specific-selector: #251535;
  --dsw-specific-tip: #1a0e28;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #2c1a3e;
  --dsw-alias-scrollbar-bg-l2: #34204a;
  --dsw-alias-scrollbar-hover-l1: #402858;
  --dsw-alias-scrollbar-hover-l2: #4c3066;

  /* 浮层 */
  --dsw-alias-toast-bg: #34204a;
  --dsw-alias-tooltip-bg: #34204a;
}
`

export const techCss = `/* ═══════════════════════════════════════════════════════════════
   Tech 科技感 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown themes/tech.css：
   - 亮色：冷蓝白，清爽的科技感
   - 暗色：GitHub 深色，经典开发工具风
   ═══════════════════════════════════════════════════════════════ */

body.theme-tech {
  /* 背景层 */
  --dsw-alias-bg-base: #f0f4f8;
  --dsw-alias-bg-layer-1: #f7fafc;
  --dsw-alias-bg-layer-2: #e8eef5;
  --dsw-alias-bg-layer-3: #e2e8f0;
  --dsw-alias-bg-overlay: #e8eef5;
  --dsw-alias-bg-module-platform: #e8eef5;
  --dsw-alias-bg-multi-select: #e2e8f0;
  --dsw-alias-bg-skeleton: rgba(43, 108, 176, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #1a202c;
  --dsw-alias-label-primary-dimmed: #2d3748;
  --dsw-alias-label-primary-bluish: #2b6cb0;
  --dsw-alias-label-secondary: #4a5568;
  --dsw-alias-label-tertiary: #5a6a7e;
  --dsw-alias-label-caption: #718096;
  --dsw-alias-label-dimmed: #8a97a8;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(26, 32, 44, 0.08);
  --dsw-alias-border-l2: rgba(26, 32, 44, 0.14);
  --dsw-alias-border-l3: rgba(26, 32, 44, 0.20);
  --dsw-alias-border-l4: rgba(26, 32, 44, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #2b6cb0;
  --dsw-alias-brand-text: #1a4f88;
  --dsw-alias-brand-primary-invert: #e8eef5;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #2b6cb0;
  --dsw-alias-button-primary-fill: #2b6cb0;
  --dsw-alias-button-primary-hover: #245a94;
  --dsw-alias-button-primary-dimmed: #d8e4f0;
  --dsw-alias-button-info-fill: #2b6cb0;
  --dsw-alias-button-info-hover: #3a7cc4;
  --dsw-alias-button-contrast-fill: #1a4f88;
  --dsw-alias-button-elevated-fill: #f7fafc;
  --dsw-alias-button-floating-fill: #f7fafc;
  --dsw-alias-button-floating-hover: #e8eef5;
  --dsw-alias-button-ghost-active-fill: #d8e4f0;
  --dsw-alias-button-ghost-active-hover: #cbdbe9;
  --dsw-alias-button-ghost-active-border: #6a9cc4;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(43, 108, 176, 0.08);
  --dsw-alias-interactive-bg-active: rgba(43, 108, 176, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(43, 108, 176, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #e2e8f0;

  /* 状态层 */
  --dsw-alias-state-business-primary: #2b6cb0;
  --dsw-alias-state-business-tertiary: #d8e4f0;
  --dsw-alias-state-error-primary: #c53030;
  --dsw-alias-state-error-secondary: #e53e3e;
  --dsw-alias-state-success-primary: #2f855a;
  --dsw-alias-state-success-secondary: #48bb78;
  --dsw-alias-state-success-tertiary: #d4efe0;
  --dsw-alias-state-warn-primary: #b7791f;
  --dsw-alias-state-warn-secondary: #d69e2e;
  --dsw-alias-state-warn-tertiary: #f4e6c8;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #e8eef5;
  --dsw-alias-markdown-code-block-banner: #e2e8f0;
  --dsw-alias-markdown-inline-code: #d8e4f0;
  --dsw-alias-markdown-code-segment-selected: #f7fafc;
  --dsw-alias-markdown-code-segment-unselected: #e2e8f0;
  --dsw-alias-markdown-tag: #e2e8f0;
  --dsw-alias-markdown-placeholder: #e8eef5;
  --dsw-alias-markdown-citation: #e8eef5;

  /* 特定区域 */
  --dsw-specific-bubble: #e8eef5;
  --dsw-specific-bubble-highlight: #d8e4f0;
  --dsw-specific-sidebar-fill: #e8edf2;
  --dsw-specific-sidebar-nav-item-active: #d8e4f0;
  --dsw-specific-sidebar-nav-item-active-accent: #c4d6e6;
  --dsw-specific-sidebar-nav-item-hover: #e2e8f0;
  --dsw-specific-input-major: #f7fafc;
  --dsw-specific-login-input: #e8eef5;
  --dsw-specific-menu: #e8eef5;
  --dsw-specific-selector: #e2e8f0;
  --dsw-specific-tip: #e8eef5;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #c9d6e4;
  --dsw-alias-scrollbar-bg-l2: #bdcbd9;
  --dsw-alias-scrollbar-hover-l1: #a8b9ca;
  --dsw-alias-scrollbar-hover-l2: #94a8bc;

  /* 浮层 */
  --dsw-alias-toast-bg: #2d3748;
  --dsw-alias-tooltip-bg: #2d3748;
}

body.theme-tech[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #0d1117;
  --dsw-alias-bg-layer-1: #161b22;
  --dsw-alias-bg-layer-2: #1c2128;
  --dsw-alias-bg-layer-3: #21262d;
  --dsw-alias-bg-overlay: #24292f;
  --dsw-alias-bg-module-platform: #1c2128;
  --dsw-alias-bg-multi-select: #21262d;
  --dsw-alias-bg-skeleton: rgba(88, 166, 255, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #c9d1d9;
  --dsw-alias-label-primary-dimmed: #a8b3c0;
  --dsw-alias-label-primary-bluish: #58a6ff;
  --dsw-alias-label-secondary: #8b949e;
  --dsw-alias-label-tertiary: #76818c;
  --dsw-alias-label-caption: #6e7a85;
  --dsw-alias-label-dimmed: #5e6a76;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(255, 255, 255, 0.06);
  --dsw-alias-border-l2: rgba(255, 255, 255, 0.12);
  --dsw-alias-border-l3: rgba(255, 255, 255, 0.16);
  --dsw-alias-border-l4: rgba(255, 255, 255, 0.20);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #58a6ff;
  --dsw-alias-brand-text: #79b8ff;
  --dsw-alias-brand-primary-invert: #0d1117;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #58a6ff;
  --dsw-alias-button-primary-fill: #1f6feb;
  --dsw-alias-button-primary-hover: #388bfd;
  --dsw-alias-button-primary-dimmed: #21262d;
  --dsw-alias-button-info-fill: #1f6feb;
  --dsw-alias-button-info-hover: #388bfd;
  --dsw-alias-button-contrast-fill: #79b8ff;
  --dsw-alias-button-elevated-fill: #21262d;
  --dsw-alias-button-floating-fill: #1c2128;
  --dsw-alias-button-floating-hover: #21262d;
  --dsw-alias-button-ghost-active-fill: #21262d;
  --dsw-alias-button-ghost-active-hover: #24292f;
  --dsw-alias-button-ghost-active-border: #388bfd;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, 0.08);
  --dsw-alias-interactive-bg-active: rgba(255, 255, 255, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(88, 166, 255, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #21262d;

  /* 状态层 */
  --dsw-alias-state-business-primary: #58a6ff;
  --dsw-alias-state-business-tertiary: #1f2937;
  --dsw-alias-state-error-primary: #f85149;
  --dsw-alias-state-error-secondary: #ff7b72;
  --dsw-alias-state-success-primary: #3fb950;
  --dsw-alias-state-success-secondary: #56d364;
  --dsw-alias-state-success-tertiary: #14361c;
  --dsw-alias-state-warn-primary: #d29922;
  --dsw-alias-state-warn-secondary: #e3b341;
  --dsw-alias-state-warn-tertiary: #3a2c12;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #161b22;
  --dsw-alias-markdown-code-block-banner: #1c2128;
  --dsw-alias-markdown-inline-code: #21262d;
  --dsw-alias-markdown-code-segment-selected: #1c2128;
  --dsw-alias-markdown-code-segment-unselected: #161b22;
  --dsw-alias-markdown-tag: #21262d;
  --dsw-alias-markdown-placeholder: #1c2128;
  --dsw-alias-markdown-citation: #21262d;

  /* 特定区域 */
  --dsw-specific-bubble: #21262d;
  --dsw-specific-bubble-highlight: #1f6feb;
  --dsw-specific-sidebar-fill: #0d1117;
  --dsw-specific-sidebar-nav-item-active: #21262d;
  --dsw-specific-sidebar-nav-item-active-accent: #1f6feb;
  --dsw-specific-sidebar-nav-item-hover: #161b22;
  --dsw-specific-input-major: #1c2128;
  --dsw-specific-login-input: #161b22;
  --dsw-specific-menu: #1c2128;
  --dsw-specific-selector: #21262d;
  --dsw-specific-tip: #1c2128;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #24292f;
  --dsw-alias-scrollbar-bg-l2: #2d333b;
  --dsw-alias-scrollbar-hover-l1: #343b44;
  --dsw-alias-scrollbar-hover-l2: #3d4650;

  /* 浮层 */
  --dsw-alias-toast-bg: #21262d;
  --dsw-alias-tooltip-bg: #21262d;
}
`

export const typewriterCss = `/* ═══════════════════════════════════════════════════════════════
   Typewriter 复古打字机 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/typewriter.css：
   亮色：老纸底色 + 深褐墨色，午后的书房；
   暗色：深灰底 + 暖金字，暗室中的老式终端。
   ═══════════════════════════════════════════════════════════════ */

body.theme-typewriter {
  /* 背景层 */
  --dsw-alias-bg-base: #f5f0e8;
  --dsw-alias-bg-layer-1: #faf6ee;
  --dsw-alias-bg-layer-2: #ede6d8;
  --dsw-alias-bg-layer-3: #e0d8c8;
  --dsw-alias-bg-overlay: #ede6d8;
  --dsw-alias-bg-module-platform: #ede6d8;
  --dsw-alias-bg-multi-select: #e0d8c8;
  --dsw-alias-bg-skeleton: rgba(139, 105, 20, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #2a2520;
  --dsw-alias-label-primary-dimmed: #3a342e;
  --dsw-alias-label-primary-bluish: #8b6914;
  --dsw-alias-label-secondary: #7a6a50;
  --dsw-alias-label-tertiary: #8a7a5a;
  --dsw-alias-label-caption: #9a8a6a;
  --dsw-alias-label-dimmed: #aa9a7a;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(42, 37, 32, 0.08);
  --dsw-alias-border-l2: rgba(42, 37, 32, 0.14);
  --dsw-alias-border-l3: rgba(42, 37, 32, 0.20);
  --dsw-alias-border-l4: rgba(42, 37, 32, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #8b6914;
  --dsw-alias-brand-text: #7a5c10;
  --dsw-alias-brand-primary-invert: #ede6d8;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #8b6914;
  --dsw-alias-button-primary-fill: #8b6914;
  --dsw-alias-button-primary-hover: #7a5c10;
  --dsw-alias-button-primary-dimmed: #d0c8b8;
  --dsw-alias-button-info-fill: #8b6914;
  --dsw-alias-button-info-hover: #9c7c20;
  --dsw-alias-button-contrast-fill: #6a4e0c;
  --dsw-alias-button-elevated-fill: #faf6ee;
  --dsw-alias-button-floating-fill: #faf6ee;
  --dsw-alias-button-floating-hover: #ede6d8;
  --dsw-alias-button-ghost-active-fill: #d0c8b8;
  --dsw-alias-button-ghost-active-hover: #c4bcac;
  --dsw-alias-button-ghost-active-border: #b09040;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(139, 105, 20, 0.08);
  --dsw-alias-interactive-bg-active: rgba(139, 105, 20, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(139, 105, 20, 0.14);
  --dsw-alias-interactive-bg-hover-solid: #e0d8c8;

  /* 状态层 */
  --dsw-alias-state-business-primary: #8b6914;
  --dsw-alias-state-business-tertiary: #d0c8b8;
  --dsw-alias-state-error-primary: #b04a30;
  --dsw-alias-state-error-secondary: #c05a3a;
  --dsw-alias-state-success-primary: #4a7a3a;
  --dsw-alias-state-success-secondary: #5a8a4a;
  --dsw-alias-state-success-tertiary: #d4e0cc;
  --dsw-alias-state-warn-primary: #a8842a;
  --dsw-alias-state-warn-secondary: #c09c3a;
  --dsw-alias-state-warn-tertiary: #e8e0c4;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #ede6d8;
  --dsw-alias-markdown-code-block-banner: #e0d8c8;
  --dsw-alias-markdown-inline-code: #d0c8b8;
  --dsw-alias-markdown-code-segment-selected: #faf6ee;
  --dsw-alias-markdown-code-segment-unselected: #e0d8c8;
  --dsw-alias-markdown-tag: #e0d8c8;
  --dsw-alias-markdown-placeholder: #ede6d8;
  --dsw-alias-markdown-citation: #ede6d8;

  /* 特定区域 */
  --dsw-specific-bubble: #ede6d8;
  --dsw-specific-bubble-highlight: #d0c8b8;
  --dsw-specific-sidebar-fill: #f0ebe0;
  --dsw-specific-sidebar-nav-item-active: #d0c8b8;
  --dsw-specific-sidebar-nav-item-active-accent: #c0b8a8;
  --dsw-specific-sidebar-nav-item-hover: #e0d8c8;
  --dsw-specific-input-major: #faf6ee;
  --dsw-specific-login-input: #ede6d8;
  --dsw-specific-menu: #ede6d8;
  --dsw-specific-selector: #e0d8c8;
  --dsw-specific-tip: #ede6d8;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #c8c0b0;
  --dsw-alias-scrollbar-bg-l2: #bcb4a4;
  --dsw-alias-scrollbar-hover-l1: #aca494;
  --dsw-alias-scrollbar-hover-l2: #9c9484;

  /* 浮层 */
  --dsw-alias-toast-bg: #3a342e;
  --dsw-alias-tooltip-bg: #3a342e;
}

body.theme-typewriter[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #1a1a18;
  --dsw-alias-bg-layer-1: #151513;
  --dsw-alias-bg-layer-2: #222220;
  --dsw-alias-bg-layer-3: #2a2a28;
  --dsw-alias-bg-overlay: #302e2a;
  --dsw-alias-bg-module-platform: #222220;
  --dsw-alias-bg-multi-select: #2a2a28;
  --dsw-alias-bg-skeleton: rgba(196, 152, 67, 0.06);

  /* 文字层 */
  --dsw-alias-label-primary: #b0a898;
  --dsw-alias-label-primary-dimmed: #9a9284;
  --dsw-alias-label-primary-bluish: #c49843;
  --dsw-alias-label-secondary: #706858;
  --dsw-alias-label-tertiary: #60584a;
  --dsw-alias-label-caption: #524c3e;
  --dsw-alias-label-dimmed: #464034;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(196, 152, 67, 0.08);
  --dsw-alias-border-l2: rgba(196, 152, 67, 0.14);
  --dsw-alias-border-l3: rgba(196, 152, 67, 0.20);
  --dsw-alias-border-l4: rgba(196, 152, 67, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #c49843;
  --dsw-alias-brand-text: #d4a853;
  --dsw-alias-brand-primary-invert: #1a1a18;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #c49843;
  --dsw-alias-button-primary-fill: #706020;
  --dsw-alias-button-primary-hover: #8a7a2e;
  --dsw-alias-button-primary-dimmed: #2a2a28;
  --dsw-alias-button-info-fill: #8a7a2e;
  --dsw-alias-button-info-hover: #706020;
  --dsw-alias-button-contrast-fill: #e0c080;
  --dsw-alias-button-elevated-fill: #2a2a28;
  --dsw-alias-button-floating-fill: #222220;
  --dsw-alias-button-floating-hover: #2a2a28;
  --dsw-alias-button-ghost-active-fill: #302e2a;
  --dsw-alias-button-ghost-active-hover: #383630;
  --dsw-alias-button-ghost-active-border: #c49843;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(196, 152, 67, 0.08);
  --dsw-alias-interactive-bg-active: rgba(196, 152, 67, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(196, 152, 67, 0.14);
  --dsw-alias-interactive-bg-hover-solid: #2a2a28;

  /* 状态层 */
  --dsw-alias-state-business-primary: #c49843;
  --dsw-alias-state-business-tertiary: #2a2a28;
  --dsw-alias-state-error-primary: #d07050;
  --dsw-alias-state-error-secondary: #c05a3a;
  --dsw-alias-state-success-primary: #8ab87a;
  --dsw-alias-state-success-secondary: #9cc88a;
  --dsw-alias-state-success-tertiary: #1e2c1a;
  --dsw-alias-state-warn-primary: #d0b050;
  --dsw-alias-state-warn-secondary: #bc9c40;
  --dsw-alias-state-warn-tertiary: #2e2818;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #151513;
  --dsw-alias-markdown-code-block-banner: #222220;
  --dsw-alias-markdown-inline-code: #2a2a28;
  --dsw-alias-markdown-code-segment-selected: #222220;
  --dsw-alias-markdown-code-segment-unselected: #151513;
  --dsw-alias-markdown-tag: #2a2a28;
  --dsw-alias-markdown-placeholder: #222220;
  --dsw-alias-markdown-citation: #2a2a28;

  /* 特定区域 */
  --dsw-specific-bubble: #2a2a28;
  --dsw-specific-bubble-highlight: #302e2a;
  --dsw-specific-sidebar-fill: #151513;
  --dsw-specific-sidebar-nav-item-active: #2a2a28;
  --dsw-specific-sidebar-nav-item-active-accent: #383630;
  --dsw-specific-sidebar-nav-item-hover: #222220;
  --dsw-specific-input-major: #222220;
  --dsw-specific-login-input: #151513;
  --dsw-specific-menu: #222220;
  --dsw-specific-selector: #2a2a28;
  --dsw-specific-tip: #222220;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #302e2a;
  --dsw-alias-scrollbar-bg-l2: #383630;
  --dsw-alias-scrollbar-hover-l1: #42403a;
  --dsw-alias-scrollbar-hover-l2: #4c4a44;

  /* 浮层 */
  --dsw-alias-toast-bg: #383630;
  --dsw-alias-tooltip-bg: #383630;
}
`

export const vaporwaveCss = `/* ═══════════════════════════════════════════════════════════════
   Vaporwave 蒸汽波 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown themes/vaporwave.css：
   - 亮色：浅粉紫底 + 霓虹品红/青色强调
   - 暗色：深紫黑底 + 荧光粉紫
   粉紫复古未来。
   ═══════════════════════════════════════════════════════════════ */

body.theme-vaporwave {
  /* 背景层 */
  --dsw-alias-bg-base: #f8f0f6;
  --dsw-alias-bg-layer-1: #fcf5fa;
  --dsw-alias-bg-layer-2: #f2e6f0;
  --dsw-alias-bg-layer-3: #eadbe8;
  --dsw-alias-bg-overlay: #f2e6f0;
  --dsw-alias-bg-module-platform: #f2e6f0;
  --dsw-alias-bg-multi-select: #eadbe8;
  --dsw-alias-bg-skeleton: rgba(255, 110, 199, 0.10);

  /* 文字层 */
  --dsw-alias-label-primary: #2a1a3a;
  --dsw-alias-label-primary-dimmed: #3a2a4e;
  --dsw-alias-label-primary-bluish: #8a3ab0;
  --dsw-alias-label-secondary: #6a4a8a;
  --dsw-alias-label-tertiary: #7a5a9a;
  --dsw-alias-label-caption: #8a6aaa;
  --dsw-alias-label-dimmed: #9a7ab8;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(255, 110, 199, 0.12);
  --dsw-alias-border-l2: rgba(255, 110, 199, 0.20);
  --dsw-alias-border-l3: rgba(255, 110, 199, 0.28);
  --dsw-alias-border-l4: rgba(255, 110, 199, 0.36);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #ff6ec7;
  --dsw-alias-brand-text: #e84a9e;
  --dsw-alias-brand-primary-invert: #f2e6f0;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #ff6ec7;
  --dsw-alias-button-primary-fill: #ff6ec7;
  --dsw-alias-button-primary-hover: #e84a9e;
  --dsw-alias-button-primary-dimmed: #f6d8ec;
  --dsw-alias-button-info-fill: #6e8aff;
  --dsw-alias-button-info-hover: #8aa4ff;
  --dsw-alias-button-contrast-fill: #b84a8a;
  --dsw-alias-button-elevated-fill: #fcf5fa;
  --dsw-alias-button-floating-fill: #fcf5fa;
  --dsw-alias-button-floating-hover: #f2e6f0;
  --dsw-alias-button-ghost-active-fill: #f6d8ec;
  --dsw-alias-button-ghost-active-hover: #eec8e2;
  --dsw-alias-button-ghost-active-border: #ff8ad4;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(255, 110, 199, 0.10);
  --dsw-alias-interactive-bg-active: rgba(255, 110, 199, 0.18);
  --dsw-alias-interactive-bg-hover-accent: rgba(110, 138, 255, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #eadbe8;

  /* 状态层 */
  --dsw-alias-state-business-primary: #ff6ec7;
  --dsw-alias-state-business-tertiary: #f6d8ec;
  --dsw-alias-state-error-primary: #e84a9e;
  --dsw-alias-state-error-secondary: #ff6ec7;
  --dsw-alias-state-success-primary: #4aa89a;
  --dsw-alias-state-success-secondary: #6ec8b8;
  --dsw-alias-state-success-tertiary: #d2efe8;
  --dsw-alias-state-warn-primary: #d89a3a;
  --dsw-alias-state-warn-secondary: #e8b04e;
  --dsw-alias-state-warn-tertiary: #f2e4c8;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #f2e6f0;
  --dsw-alias-markdown-code-block-banner: #eadbe8;
  --dsw-alias-markdown-inline-code: #f6d8ec;
  --dsw-alias-markdown-code-segment-selected: #fcf5fa;
  --dsw-alias-markdown-code-segment-unselected: #eadbe8;
  --dsw-alias-markdown-tag: #eadbe8;
  --dsw-alias-markdown-placeholder: #f2e6f0;
  --dsw-alias-markdown-citation: #f2e6f0;

  /* 特定区域 */
  --dsw-specific-bubble: #f2e6f0;
  --dsw-specific-bubble-highlight: #f6d8ec;
  --dsw-specific-sidebar-fill: #f4e8f2;
  --dsw-specific-sidebar-nav-item-active: #f6d8ec;
  --dsw-specific-sidebar-nav-item-active-accent: #e8c2dc;
  --dsw-specific-sidebar-nav-item-hover: #eadbe8;
  --dsw-specific-input-major: #fcf5fa;
  --dsw-specific-login-input: #f2e6f0;
  --dsw-specific-menu: #f2e6f0;
  --dsw-specific-selector: #eadbe8;
  --dsw-specific-tip: #f2e6f0;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #e2c4d8;
  --dsw-alias-scrollbar-bg-l2: #d8b6cc;
  --dsw-alias-scrollbar-hover-l1: #c8a0ba;
  --dsw-alias-scrollbar-hover-l2: #b88aaa;

  /* 浮层 */
  --dsw-alias-toast-bg: #3a2a4e;
  --dsw-alias-tooltip-bg: #3a2a4e;
}

body.theme-vaporwave[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #140a1e;
  --dsw-alias-bg-layer-1: #1c1028;
  --dsw-alias-bg-layer-2: #241632;
  --dsw-alias-bg-layer-3: #2c1c3c;
  --dsw-alias-bg-overlay: #342246;
  --dsw-alias-bg-module-platform: #241632;
  --dsw-alias-bg-multi-select: #2c1c3c;
  --dsw-alias-bg-skeleton: rgba(255, 110, 199, 0.10);

  /* 文字层 */
  --dsw-alias-label-primary: #e8d4f0;
  --dsw-alias-label-primary-dimmed: #d4b8e0;
  --dsw-alias-label-primary-bluish: #ff8ad4;
  --dsw-alias-label-secondary: #b89ac8;
  --dsw-alias-label-tertiary: #a08ab0;
  --dsw-alias-label-caption: #8a78a0;
  --dsw-alias-label-dimmed: #7a6890;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(255, 110, 199, 0.10);
  --dsw-alias-border-l2: rgba(255, 110, 199, 0.18);
  --dsw-alias-border-l3: rgba(255, 110, 199, 0.26);
  --dsw-alias-border-l4: rgba(255, 110, 199, 0.34);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #ff6ec7;
  --dsw-alias-brand-text: #ff8ad4;
  --dsw-alias-brand-primary-invert: #140a1e;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #ff6ec7;
  --dsw-alias-button-primary-fill: #b84a9e;
  --dsw-alias-button-primary-hover: #d85eb8;
  --dsw-alias-button-primary-dimmed: #2c1c3c;
  --dsw-alias-button-info-fill: #6e8aff;
  --dsw-alias-button-info-hover: #8aa4ff;
  --dsw-alias-button-contrast-fill: #ff8ad4;
  --dsw-alias-button-elevated-fill: #2c1c3c;
  --dsw-alias-button-floating-fill: #241632;
  --dsw-alias-button-floating-hover: #2c1c3c;
  --dsw-alias-button-ghost-active-fill: #342246;
  --dsw-alias-button-ghost-active-hover: #3c2a50;
  --dsw-alias-button-ghost-active-border: #d85eb8;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(255, 110, 199, 0.10);
  --dsw-alias-interactive-bg-active: rgba(255, 110, 199, 0.18);
  --dsw-alias-interactive-bg-hover-accent: rgba(110, 138, 255, 0.18);
  --dsw-alias-interactive-bg-hover-solid: #2c1c3c;

  /* 状态层 */
  --dsw-alias-state-business-primary: #ff6ec7;
  --dsw-alias-state-business-tertiary: #2c1c3c;
  --dsw-alias-state-error-primary: #ff6ec7;
  --dsw-alias-state-error-secondary: #e84a9e;
  --dsw-alias-state-success-primary: #6ec8b8;
  --dsw-alias-state-success-secondary: #8ad8c8;
  --dsw-alias-state-success-tertiary: #1c2e2a;
  --dsw-alias-state-warn-primary: #e8b04e;
  --dsw-alias-state-warn-secondary: #d89a3a;
  --dsw-alias-state-warn-tertiary: #322820;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #1c1028;
  --dsw-alias-markdown-code-block-banner: #241632;
  --dsw-alias-markdown-inline-code: #2c1c3c;
  --dsw-alias-markdown-code-segment-selected: #241632;
  --dsw-alias-markdown-code-segment-unselected: #1c1028;
  --dsw-alias-markdown-tag: #2c1c3c;
  --dsw-alias-markdown-placeholder: #241632;
  --dsw-alias-markdown-citation: #2c1c3c;

  /* 特定区域 */
  --dsw-specific-bubble: #2c1c3c;
  --dsw-specific-bubble-highlight: #342246;
  --dsw-specific-sidebar-fill: #180c24;
  --dsw-specific-sidebar-nav-item-active: #2c1c3c;
  --dsw-specific-sidebar-nav-item-active-accent: #3c2a50;
  --dsw-specific-sidebar-nav-item-hover: #241632;
  --dsw-specific-input-major: #241632;
  --dsw-specific-login-input: #1c1028;
  --dsw-specific-menu: #241632;
  --dsw-specific-selector: #2c1c3c;
  --dsw-specific-tip: #241632;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #302040;
  --dsw-alias-scrollbar-bg-l2: #38264a;
  --dsw-alias-scrollbar-hover-l1: #44305a;
  --dsw-alias-scrollbar-hover-l2: #503a6a;

  /* 浮层 */
  --dsw-alias-toast-bg: #3c2a50;
  --dsw-alias-tooltip-bg: #3c2a50;
}
`

export const vibrantCss = `/* ═══════════════════════════════════════════════════════════════
   Vibrant 活力橙 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/vibrant.css：
   暖橙基调 #F3641E，鲜明醒目。
   ═══════════════════════════════════════════════════════════════ */

body.theme-vibrant {
  /* 背景层 */
  --dsw-alias-bg-base: #fff8f2;
  --dsw-alias-bg-layer-1: #fffbf6;
  --dsw-alias-bg-layer-2: #fef1f1;
  --dsw-alias-bg-layer-3: #ffe0cc;
  --dsw-alias-bg-overlay: #fef1f1;
  --dsw-alias-bg-module-platform: #fef1f1;
  --dsw-alias-bg-multi-select: #ffe0cc;
  --dsw-alias-bg-skeleton: rgba(243, 100, 30, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #2a1a0e;
  --dsw-alias-label-primary-dimmed: #3a2a1e;
  --dsw-alias-label-primary-bluish: #d04a10;
  --dsw-alias-label-secondary: #b06030;
  --dsw-alias-label-tertiary: #c07040;
  --dsw-alias-label-caption: #d08050;
  --dsw-alias-label-dimmed: #e09060;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(243, 100, 30, 0.10);
  --dsw-alias-border-l2: rgba(243, 100, 30, 0.16);
  --dsw-alias-border-l3: rgba(243, 100, 30, 0.22);
  --dsw-alias-border-l4: rgba(243, 100, 30, 0.28);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #f3641e;
  --dsw-alias-brand-text: #d04a10;
  --dsw-alias-brand-primary-invert: #fef1f1;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #f3641e;
  --dsw-alias-button-primary-fill: #f3641e;
  --dsw-alias-button-primary-hover: #d04a10;
  --dsw-alias-button-primary-dimmed: #ffe6d5;
  --dsw-alias-button-info-fill: #f3641e;
  --dsw-alias-button-info-hover: #f87a3a;
  --dsw-alias-button-contrast-fill: #b83e0c;
  --dsw-alias-button-elevated-fill: #fffbf6;
  --dsw-alias-button-floating-fill: #fffbf6;
  --dsw-alias-button-floating-hover: #fef1f1;
  --dsw-alias-button-ghost-active-fill: #ffe6d5;
  --dsw-alias-button-ghost-active-hover: #f8d8c4;
  --dsw-alias-button-ghost-active-border: #f88a50;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(243, 100, 30, 0.08);
  --dsw-alias-interactive-bg-active: rgba(243, 100, 30, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(243, 100, 30, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #ffe0cc;

  /* 状态层 */
  --dsw-alias-state-business-primary: #f3641e;
  --dsw-alias-state-business-tertiary: #ffe6d5;
  --dsw-alias-state-error-primary: #d04030;
  --dsw-alias-state-error-secondary: #e05444;
  --dsw-alias-state-success-primary: #4a9a3a;
  --dsw-alias-state-success-secondary: #5ab04a;
  --dsw-alias-state-success-tertiary: #d8e8d0;
  --dsw-alias-state-warn-primary: #c08a2a;
  --dsw-alias-state-warn-secondary: #d8a040;
  --dsw-alias-state-warn-tertiary: #ece4c4;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #fef1f1;
  --dsw-alias-markdown-code-block-banner: #ffe0cc;
  --dsw-alias-markdown-inline-code: #ffe6d5;
  --dsw-alias-markdown-code-segment-selected: #fffbf6;
  --dsw-alias-markdown-code-segment-unselected: #ffe0cc;
  --dsw-alias-markdown-tag: #ffe0cc;
  --dsw-alias-markdown-placeholder: #fef1f1;
  --dsw-alias-markdown-citation: #fef1f1;

  /* 特定区域 */
  --dsw-specific-bubble: #fef1f1;
  --dsw-specific-bubble-highlight: #ffe6d5;
  --dsw-specific-sidebar-fill: #fdf0ec;
  --dsw-specific-sidebar-nav-item-active: #ffe6d5;
  --dsw-specific-sidebar-nav-item-active-accent: #f4d4c0;
  --dsw-specific-sidebar-nav-item-hover: #ffe0cc;
  --dsw-specific-input-major: #fffbf6;
  --dsw-specific-login-input: #fef1f1;
  --dsw-specific-menu: #fef1f1;
  --dsw-specific-selector: #ffe0cc;
  --dsw-specific-tip: #fef1f1;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #f0c8b0;
  --dsw-alias-scrollbar-bg-l2: #e8bca4;
  --dsw-alias-scrollbar-hover-l1: #dca890;
  --dsw-alias-scrollbar-hover-l2: #d0947c;

  /* 浮层 */
  --dsw-alias-toast-bg: #3a2a1e;
  --dsw-alias-tooltip-bg: #3a2a1e;
}

body.theme-vibrant[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #1a1410;
  --dsw-alias-bg-layer-1: #1e1610;
  --dsw-alias-bg-layer-2: #241c14;
  --dsw-alias-bg-layer-3: #2e241c;
  --dsw-alias-bg-overlay: #362a20;
  --dsw-alias-bg-module-platform: #241c14;
  --dsw-alias-bg-multi-select: #2e241c;
  --dsw-alias-bg-skeleton: rgba(255, 176, 96, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #e0d0c0;
  --dsw-alias-label-primary-dimmed: #c8b8a8;
  --dsw-alias-label-primary-bluish: #ffb060;
  --dsw-alias-label-secondary: #a08060;
  --dsw-alias-label-tertiary: #907050;
  --dsw-alias-label-caption: #806040;
  --dsw-alias-label-dimmed: #705434;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(255, 176, 96, 0.08);
  --dsw-alias-border-l2: rgba(255, 176, 96, 0.14);
  --dsw-alias-border-l3: rgba(255, 176, 96, 0.20);
  --dsw-alias-border-l4: rgba(255, 176, 96, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #ffb060;
  --dsw-alias-brand-text: #ffc080;
  --dsw-alias-brand-primary-invert: #1a1410;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #ffb060;
  --dsw-alias-button-primary-fill: #a84a10;
  --dsw-alias-button-primary-hover: #c86a20;
  --dsw-alias-button-primary-dimmed: #2e241c;
  --dsw-alias-button-info-fill: #c86a20;
  --dsw-alias-button-info-hover: #a84a10;
  --dsw-alias-button-contrast-fill: #ffc898;
  --dsw-alias-button-elevated-fill: #2e241c;
  --dsw-alias-button-floating-fill: #241c14;
  --dsw-alias-button-floating-hover: #2e241c;
  --dsw-alias-button-ghost-active-fill: #362a20;
  --dsw-alias-button-ghost-active-hover: #3e3024;
  --dsw-alias-button-ghost-active-border: #ffb060;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(255, 176, 96, 0.08);
  --dsw-alias-interactive-bg-active: rgba(255, 176, 96, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(255, 176, 96, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #2e241c;

  /* 状态层 */
  --dsw-alias-state-business-primary: #ffb060;
  --dsw-alias-state-business-tertiary: #2e241c;
  --dsw-alias-state-error-primary: #f08060;
  --dsw-alias-state-error-secondary: #e06c50;
  --dsw-alias-state-success-primary: #8ac87a;
  --dsw-alias-state-success-secondary: #9cd88a;
  --dsw-alias-state-success-tertiary: #1e2c1a;
  --dsw-alias-state-warn-primary: #e0b050;
  --dsw-alias-state-warn-secondary: #c8a040;
  --dsw-alias-state-warn-tertiary: #322818;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #1e1610;
  --dsw-alias-markdown-code-block-banner: #241c14;
  --dsw-alias-markdown-inline-code: #2e241c;
  --dsw-alias-markdown-code-segment-selected: #241c14;
  --dsw-alias-markdown-code-segment-unselected: #1e1610;
  --dsw-alias-markdown-tag: #2e241c;
  --dsw-alias-markdown-placeholder: #241c14;
  --dsw-alias-markdown-citation: #2e241c;

  /* 特定区域 */
  --dsw-specific-bubble: #2e241c;
  --dsw-specific-bubble-highlight: #362a20;
  --dsw-specific-sidebar-fill: #1e1610;
  --dsw-specific-sidebar-nav-item-active: #2e241c;
  --dsw-specific-sidebar-nav-item-active-accent: #3e3024;
  --dsw-specific-sidebar-nav-item-hover: #241c14;
  --dsw-specific-input-major: #241c14;
  --dsw-specific-login-input: #1e1610;
  --dsw-specific-menu: #241c14;
  --dsw-specific-selector: #2e241c;
  --dsw-specific-tip: #241c14;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #322820;
  --dsw-alias-scrollbar-bg-l2: #3a2e24;
  --dsw-alias-scrollbar-hover-l1: #463828;
  --dsw-alias-scrollbar-hover-l2: #52422e;

  /* 浮层 */
  --dsw-alias-toast-bg: #3e3024;
  --dsw-alias-tooltip-bg: #3e3024;
}
`

export const violetCss = `/* ═══════════════════════════════════════════════════════════════
   Violet 紫罗兰 — DeepSeek Harness 主题

   设计语言移植自 YiziMarkdown code/src-tauri/themes/violet.css：
   #7209B7 紫罗兰品牌色，雅致文艺、小众高级。
   亮色：淡紫白；暗色：深紫黑 + 亮紫罗兰。
   ═══════════════════════════════════════════════════════════════ */

body.theme-violet {
  /* 背景层 */
  --dsw-alias-bg-base: #faf5fe;
  --dsw-alias-bg-layer-1: #fdf9ff;
  --dsw-alias-bg-layer-2: #f4eafb;
  --dsw-alias-bg-layer-3: #ede0f8;
  --dsw-alias-bg-overlay: #f4eafb;
  --dsw-alias-bg-module-platform: #f4eafb;
  --dsw-alias-bg-multi-select: #ede0f8;
  --dsw-alias-bg-skeleton: rgba(114, 9, 183, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #271b30;
  --dsw-alias-label-primary-dimmed: #372b40;
  --dsw-alias-label-primary-bluish: #7209b7;
  --dsw-alias-label-secondary: #924ed1;
  --dsw-alias-label-tertiary: #7a3ab8;
  --dsw-alias-label-caption: #8a4ac8;
  --dsw-alias-label-dimmed: #9a5ad8;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(114, 9, 183, 0.10);
  --dsw-alias-border-l2: rgba(114, 9, 183, 0.16);
  --dsw-alias-border-l3: rgba(114, 9, 183, 0.22);
  --dsw-alias-border-l4: rgba(114, 9, 183, 0.28);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #7209b7;
  --dsw-alias-brand-text: #5f0899;
  --dsw-alias-brand-primary-invert: #f4eafb;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #7209b7;
  --dsw-alias-button-primary-fill: #7209b7;
  --dsw-alias-button-primary-hover: #5f0899;
  --dsw-alias-button-primary-dimmed: #e4d0f5;
  --dsw-alias-button-info-fill: #7209b7;
  --dsw-alias-button-info-hover: #8a28cc;
  --dsw-alias-button-contrast-fill: #4e077e;
  --dsw-alias-button-elevated-fill: #fdf9ff;
  --dsw-alias-button-floating-fill: #fdf9ff;
  --dsw-alias-button-floating-hover: #f4eafb;
  --dsw-alias-button-ghost-active-fill: #e4d0f5;
  --dsw-alias-button-ghost-active-hover: #d8c0ec;
  --dsw-alias-button-ghost-active-border: #a868e0;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(114, 9, 183, 0.08);
  --dsw-alias-interactive-bg-active: rgba(114, 9, 183, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(114, 9, 183, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #ede0f8;

  /* 状态层 */
  --dsw-alias-state-business-primary: #7209b7;
  --dsw-alias-state-business-tertiary: #e4d0f5;
  --dsw-alias-state-error-primary: #c03a8a;
  --dsw-alias-state-error-secondary: #d050a0;
  --dsw-alias-state-success-primary: #4a9a6a;
  --dsw-alias-state-success-secondary: #5ab07a;
  --dsw-alias-state-success-tertiary: #d4e8dc;
  --dsw-alias-state-warn-primary: #a87a2a;
  --dsw-alias-state-warn-secondary: #c09040;
  --dsw-alias-state-warn-tertiary: #ece0c4;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #f4eafb;
  --dsw-alias-markdown-code-block-banner: #ede0f8;
  --dsw-alias-markdown-inline-code: #e4d0f5;
  --dsw-alias-markdown-code-segment-selected: #fdf9ff;
  --dsw-alias-markdown-code-segment-unselected: #ede0f8;
  --dsw-alias-markdown-tag: #ede0f8;
  --dsw-alias-markdown-placeholder: #f4eafb;
  --dsw-alias-markdown-citation: #f4eafb;

  /* 特定区域 */
  --dsw-specific-bubble: #f4eafb;
  --dsw-specific-bubble-highlight: #e4d0f5;
  --dsw-specific-sidebar-fill: #f4eafb;
  --dsw-specific-sidebar-nav-item-active: #e4d0f5;
  --dsw-specific-sidebar-nav-item-active-accent: #d4c0e8;
  --dsw-specific-sidebar-nav-item-hover: #ede0f8;
  --dsw-specific-input-major: #fdf9ff;
  --dsw-specific-login-input: #f4eafb;
  --dsw-specific-menu: #f4eafb;
  --dsw-specific-selector: #ede0f8;
  --dsw-specific-tip: #f4eafb;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #dcc8ec;
  --dsw-alias-scrollbar-bg-l2: #d0b8e4;
  --dsw-alias-scrollbar-hover-l1: #c0a4d8;
  --dsw-alias-scrollbar-hover-l2: #b090cc;

  /* 浮层 */
  --dsw-alias-toast-bg: #372b40;
  --dsw-alias-tooltip-bg: #372b40;
}

body.theme-violet[data-ds-dark-theme] {
  /* 背景层 */
  --dsw-alias-bg-base: #16101f;
  --dsw-alias-bg-layer-1: #1b1228;
  --dsw-alias-bg-layer-2: #1e152c;
  --dsw-alias-bg-layer-3: #271b38;
  --dsw-alias-bg-overlay: #2e2042;
  --dsw-alias-bg-module-platform: #1e152c;
  --dsw-alias-bg-multi-select: #271b38;
  --dsw-alias-bg-skeleton: rgba(167, 92, 240, 0.08);

  /* 文字层 */
  --dsw-alias-label-primary: #e2d8ee;
  --dsw-alias-label-primary-dimmed: #c8bcd8;
  --dsw-alias-label-primary-bluish: #a75cf0;
  --dsw-alias-label-secondary: #b484e0;
  --dsw-alias-label-tertiary: #9a6cc8;
  --dsw-alias-label-caption: #885cb4;
  --dsw-alias-label-dimmed: #764ca0;

  /* 边框层 */
  --dsw-alias-border-l1: rgba(167, 92, 240, 0.08);
  --dsw-alias-border-l2: rgba(167, 92, 240, 0.14);
  --dsw-alias-border-l3: rgba(167, 92, 240, 0.20);
  --dsw-alias-border-l4: rgba(167, 92, 240, 0.26);

  /* 品牌与按钮 */
  --dsw-alias-brand-primary: #a75cf0;
  --dsw-alias-brand-text: #c084fc;
  --dsw-alias-brand-primary-invert: #16101f;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #a75cf0;
  --dsw-alias-button-primary-fill: #6a2ab0;
  --dsw-alias-button-primary-hover: #8440d0;
  --dsw-alias-button-primary-dimmed: #271b38;
  --dsw-alias-button-info-fill: #8440d0;
  --dsw-alias-button-info-hover: #6a2ab0;
  --dsw-alias-button-contrast-fill: #d0a4f8;
  --dsw-alias-button-elevated-fill: #271b38;
  --dsw-alias-button-floating-fill: #1e152c;
  --dsw-alias-button-floating-hover: #271b38;
  --dsw-alias-button-ghost-active-fill: #2e2042;
  --dsw-alias-button-ghost-active-hover: #36264c;
  --dsw-alias-button-ghost-active-border: #a75cf0;

  /* 交互层 */
  --dsw-alias-interactive-bg-hover: rgba(167, 92, 240, 0.08);
  --dsw-alias-interactive-bg-active: rgba(167, 92, 240, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(167, 92, 240, 0.16);
  --dsw-alias-interactive-bg-hover-solid: #271b38;

  /* 状态层 */
  --dsw-alias-state-business-primary: #a75cf0;
  --dsw-alias-state-business-tertiary: #271b38;
  --dsw-alias-state-error-primary: #e070b8;
  --dsw-alias-state-error-secondary: #d05ca8;
  --dsw-alias-state-success-primary: #8ac89a;
  --dsw-alias-state-success-secondary: #9cd8aa;
  --dsw-alias-state-success-tertiary: #1e2c22;
  --dsw-alias-state-warn-primary: #d8b060;
  --dsw-alias-state-warn-secondary: #c09848;
  --dsw-alias-state-warn-tertiary: #322818;

  /* Markdown 渲染 */
  --dsw-alias-markdown-code-block: #1b1228;
  --dsw-alias-markdown-code-block-banner: #1e152c;
  --dsw-alias-markdown-inline-code: #271b38;
  --dsw-alias-markdown-code-segment-selected: #1e152c;
  --dsw-alias-markdown-code-segment-unselected: #1b1228;
  --dsw-alias-markdown-tag: #271b38;
  --dsw-alias-markdown-placeholder: #1e152c;
  --dsw-alias-markdown-citation: #271b38;

  /* 特定区域 */
  --dsw-specific-bubble: #271b38;
  --dsw-specific-bubble-highlight: #2e2042;
  --dsw-specific-sidebar-fill: #1b1228;
  --dsw-specific-sidebar-nav-item-active: #271b38;
  --dsw-specific-sidebar-nav-item-active-accent: #36264c;
  --dsw-specific-sidebar-nav-item-hover: #1e152c;
  --dsw-specific-input-major: #1e152c;
  --dsw-specific-login-input: #1b1228;
  --dsw-specific-menu: #1e152c;
  --dsw-specific-selector: #271b38;
  --dsw-specific-tip: #1e152c;

  /* 滚动条 */
  --dsw-alias-scrollbar-bg-l1: #2e2042;
  --dsw-alias-scrollbar-bg-l2: #36264c;
  --dsw-alias-scrollbar-hover-l1: #42305c;
  --dsw-alias-scrollbar-hover-l2: #4e3a6c;

  /* 浮层 */
  --dsw-alias-toast-bg: #36264c;
  --dsw-alias-tooltip-bg: #36264c;
}
`
