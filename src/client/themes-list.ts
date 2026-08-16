/** One selectable style theme: id, display metadata, and swatch gradient. */
export interface ThemeDefinition {
  id: string
  colorScheme: 'light' | 'dark'
  tokens: Record<string, string>
  name: string
  swatch: [string, string]
  desc: string
}

/** All 19 shipped themes, ported from YiziMarkdown's design language. */
export const THEMES: readonly ThemeDefinition[] = Object.freeze([
  Object.freeze({
    id: 'academic', colorScheme: 'light', tokens: {},
    name: '学术蓝', swatch: ['#f5f8ff', '#002fa7'] as [string, string],
    desc: '沉稳专业的学术风格',
  }),
  Object.freeze({
    id: 'aurora', colorScheme: 'light', tokens: {},
    name: '极光', swatch: ['#eef4fb', '#4a90d9'] as [string, string],
    desc: '冰蓝基调，流光溢彩',
  }),
  Object.freeze({
    id: 'cyberpunk', colorScheme: 'light', tokens: {},
    name: '赛博朋克', swatch: ['#f0f4f8', '#0077b6'] as [string, string],
    desc: '冷白底霓虹青粉，未来感',
  }),
  Object.freeze({
    id: 'facebook', colorScheme: 'light', tokens: {},
    name: 'Facebook', swatch: ['#f0f2f5', '#1877f2'] as [string, string],
    desc: '经典蓝白，简洁社交风',
  }),
  Object.freeze({
    id: 'liquidglass', colorScheme: 'light', tokens: {},
    name: '液态玻璃', swatch: ['#f4f8ff', '#2563eb'] as [string, string],
    desc: '冰蓝通透，磨砂玻璃质感',
  }),
  Object.freeze({
    id: 'lychee', colorScheme: 'light', tokens: {},
    name: '荔枝红', swatch: ['#fff5f5', '#e63946'] as [string, string],
    desc: '热情红调，温暖鲜明',
  }),
  Object.freeze({
    id: 'magazine', colorScheme: 'light', tokens: {},
    name: '杂志感', swatch: ['#fdf6ec', '#8b4513'] as [string, string],
    desc: '温暖优雅的阅读体验',
  }),
  Object.freeze({
    id: 'matrix', colorScheme: 'light', tokens: {},
    name: '黑客帝国', swatch: ['#f5faf5', '#008a2e'] as [string, string],
    desc: '白底绿字终端风',
  }),
  Object.freeze({
    id: 'minimal', colorScheme: 'light', tokens: {},
    name: '极简风', swatch: ['#ffffff', '#0066cc'] as [string, string],
    desc: '清爽干净的原始风格',
  }),
  Object.freeze({
    id: 'mint', colorScheme: 'light', tokens: {},
    name: '薄荷冰沙', swatch: ['#f5fbf8', '#10b981'] as [string, string],
    desc: '清透薄荷绿，清凉舒适',
  }),
  Object.freeze({
    id: 'morandi', colorScheme: 'light', tokens: {},
    name: '莫兰迪', swatch: ['#f7f3ef', '#b8927a'] as [string, string],
    desc: '低饱和灰调，高级不张扬',
  }),
  Object.freeze({
    id: 'nature', colorScheme: 'light', tokens: {},
    name: '自然风', swatch: ['#f5f2eb', '#4a7c59'] as [string, string],
    desc: '纸感森林绿，自然阅读',
  }),
  Object.freeze({
    id: 'palace', colorScheme: 'light', tokens: {},
    name: '故宫朱砂', swatch: ['#faf6f0', '#b5372a'] as [string, string],
    desc: '朱砂红与琉璃金，中式典雅',
  }),
  Object.freeze({
    id: 'sunset', colorScheme: 'light', tokens: {},
    name: '落日熔金', swatch: ['#fef8f0', '#b45309'] as [string, string],
    desc: '暖白底琥珀色，暗色金红',
  }),
  Object.freeze({
    id: 'tech', colorScheme: 'light', tokens: {},
    name: '科技感', swatch: ['#f0f4f8', '#2b6cb0'] as [string, string],
    desc: '冷蓝灰，亮暗双面',
  }),
  Object.freeze({
    id: 'typewriter', colorScheme: 'light', tokens: {},
    name: '复古打字机', swatch: ['#f5f0e8', '#8b6914'] as [string, string],
    desc: '老纸底深褐墨色',
  }),
  Object.freeze({
    id: 'vaporwave', colorScheme: 'light', tokens: {},
    name: '蒸汽波', swatch: ['#f8f0f6', '#ff6ec7'] as [string, string],
    desc: '粉紫霓虹，复古未来',
  }),
  Object.freeze({
    id: 'vibrant', colorScheme: 'light', tokens: {},
    name: '活力橙', swatch: ['#fff8f0', '#f3641e'] as [string, string],
    desc: '暖橙基调，鲜明醒目',
  }),
  Object.freeze({
    id: 'violet', colorScheme: 'light', tokens: {},
    name: '紫罗兰', swatch: ['#faf5fe', '#7209b7'] as [string, string],
    desc: '雅致文艺，小众高级',
  }),
])
