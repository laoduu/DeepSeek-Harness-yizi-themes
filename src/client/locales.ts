/** `yizi.theme` namespace dictionaries (the Appearance row's copy). */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'appearance.title': '外观',
  'appearance.themes': '主题',
  'appearance.default': '默认',
  'appearance.default.desc': 'Harness 经典配色',
  'appearance.custom': '自定义',
  'appearance.custom.logo': 'Logo SVG',
  'appearance.custom.logo.preview': '预览',
  'appearance.custom.logo.placeholder': '粘贴 SVG 代码或 data URI',
  'appearance.custom.logo.hint': '提示：此图标用于左上角与新会话页。若想让 SVG 颜色随主题与明暗自动切换，请把硬编码颜色（如 fill="#xxxx"）替换为 fill="var(--dsw-alias-brand-primary)" 或 fill="currentColor"。',
  'appearance.custom.wordmark': '品牌字样',
  'appearance.custom.wordmark.placeholder': 'DEEPSEEK',
  'appearance.custom.badge': '徽章字样',
  'appearance.custom.badge.placeholder': 'HARNESS',
  'appearance.custom.headline': '新会话标题',
  'appearance.custom.headline.placeholder': '探索未至之境',
  'appearance.custom.mappings': '品牌映射',
  'appearance.custom.mappings.desc': '替换提示词中的品牌字符串',
  'appearance.custom.mappings.enabled': '启用品牌映射',
  'appearance.custom.mappings.deepseekHarness': 'DeepSeek Harness →',
  'appearance.custom.mappings.deepseek': 'DeepSeek →',
  'appearance.custom.mappings.deepseekChinese': '深度求索 →',
  'appearance.custom.mappings.harness': 'Harness →',
} satisfies Record<string, string>

/** The settings.theme namespace key union. */
export type ThemeKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'appearance.title': 'Appearance',
  'appearance.themes': 'Theme',
  'appearance.default': 'Default',
  'appearance.default.desc': 'Classic Harness palette',
  'appearance.custom': 'Custom',
  'appearance.custom.logo': 'Logo SVG',
  'appearance.custom.logo.preview': 'Preview',
  'appearance.custom.logo.placeholder': 'Paste SVG code or data URI',
  'appearance.custom.logo.hint': 'Tip: this icon is used for the top-left brand and the new-session page. To make SVG colors follow the theme and light/dark mode, replace hardcoded colors (e.g. fill="#xxxx") with fill="var(--dsw-alias-brand-primary)" or fill="currentColor".',
  'appearance.custom.wordmark': 'Wordmark',
  'appearance.custom.wordmark.placeholder': 'DEEPSEEK',
  'appearance.custom.badge': 'Badge text',
  'appearance.custom.badge.placeholder': 'HARNESS',
  'appearance.custom.headline': 'New session headline',
  'appearance.custom.headline.placeholder': 'Explore the unknown',
  'appearance.custom.mappings': 'Brand mappings',
  'appearance.custom.mappings.desc': 'Replace brand strings in prompts',
  'appearance.custom.mappings.enabled': 'Enable brand mappings',
  'appearance.custom.mappings.deepseekHarness': 'DeepSeek Harness →',
  'appearance.custom.mappings.deepseek': 'DeepSeek →',
  'appearance.custom.mappings.deepseekChinese': '深度求索 →',
  'appearance.custom.mappings.harness': 'Harness →',
} satisfies Record<ThemeKey, string>
