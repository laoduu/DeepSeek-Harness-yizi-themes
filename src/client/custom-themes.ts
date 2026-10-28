/**
 * Theme Studio — user-defined style themes.
 *
 * A custom theme is three colors: an ACCENT (the brand hue) and optionally
 * explicit light/dark page backgrounds. From those, both mode palettes are
 * derived with the same relationships the 19 shipped themes use (verified
 * against the `academic` sheet: dark-mode brand = accent + 42% white, layers
 = small white steps over the dark base, labels = tinted near-neutrals,
 * borders = alpha ladders of the brand hue). The derived document is emitted
 * as `body.theme-custom-<id>` + its `[data-ds-dark-theme]` partner — exactly
 * the shape of every built-in sheet, so the alias cascade in
 * brand-overrides fills in everything the block does not spell out.
 *
 * Persistence follows the brand document's pattern: a plugin-owned
 * localStorage array (`dsh-yizi-themes:customThemes`), normalized on read so
 * a stale or corrupt document can never break the render path.
 */

/** One user-defined theme (the persisted document). */
export interface CustomThemeDoc {
  /** Stable id, `custom-` prefixed so the backend owns the body class. */
  id: string
  /** Display name (used in the grid, the pickers, and /theme). */
  name: string
  /** Brand/accent color, `#rrggbb`. */
  accent: string
  /** Light-mode page background, `#rrggbb`. */
  lightBg: string
  /** Dark-mode page background, `#rrggbb`. */
  darkBg: string
}

/** localStorage key holding the persisted custom-theme array. */
export const CUSTOM_THEMES_STORAGE_KEY = 'dsh-yizi-themes:customThemes'

/** Prefix of every custom theme id (also the backend's cleanup rule). */
export const CUSTOM_THEME_PREFIX = 'custom-'

// ── color math (small, dependency-free) ─────────────────────────────────

interface Rgb { r: number; g: number; b: number }

/**
 * Parse `#rgb` / `#rrggbb` into rgb; `null` when not a color.
 * @param value - candidate color string.
 * @returns the rgb triple or null.
 */
function parseHex(value: string): Rgb | null {
  let hex = value.trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    hex = hex.split('').map((ch) => ch + ch).join('')
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  }
}

/**
 * Clamp a byte value into 0-255.
 * @param value - candidate byte.
 * @returns the clamped byte.
 */
function byte(value: number): number {
  return Math.round(Math.min(255, Math.max(0, value)))
}

/**
 * Serialize an rgb triple back to `#rrggbb`.
 * @param rgb - the triple.
 * @returns the hex string.
 */
function toHex(rgb: Rgb): string {
  const part = (v: number): string => byte(v).toString(16).padStart(2, '0')
  return `#${part(rgb.r)}${part(rgb.g)}${part(rgb.b)}`
}

/**
 * Mix two colors (`t` = share of `b` in `a`), like CSS `color-mix(in srgb, b t%, a)`.
 * @param a - first color.
 * @param b - second color.
 * @param t - 0..1 share of b.
 * @returns the mixed hex color.
 */
function mix(a: string, b: string, t: number): string {
  const ca = parseHex(a)
  const cb = parseHex(b)
  if (ca === null || cb === null) return a
  const k = Math.min(1, Math.max(0, t))
  return toHex({
    r: ca.r + (cb.r - ca.r) * k,
    g: ca.g + (cb.g - ca.g) * k,
    b: ca.b + (cb.b - ca.b) * k,
  })
}

/**
 * An `rgba()` literal of one color at an alpha.
 * @param hex - base color.
 * @param alpha - 0..1 alpha.
 * @returns the rgba() string.
 */
function rgba(hex: string, alpha: number): string {
  const c = parseHex(hex)
  if (c === null) return hex
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`
}

/**
 * Normalize any color-ish input into `#rrggbb`, falling back on a default.
 * @param value - candidate color.
 * @param fallback - default when unparseable.
 * @returns the normalized hex color.
 */
export function normalizeHex(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const parsed = parseHex(value)
  return parsed === null ? fallback : toHex(parsed)
}

/**
 * Derive the light-mode page background from an accent (a very light tint of
 * the accent hue — mirrors `academic`'s #f5f8ff over #002fa7).
 * @param accent - the accent color.
 * @returns the derived light background.
 */
export function deriveLightBg(accent: string): string {
  return mix(accent, '#ffffff', 0.96)
}

/**
 * Derive the dark-mode page background from an accent (a near-black shade
 * tinted by the accent hue — mirrors `academic`'s #0d1117 family).
 * @param accent - the accent color.
 * @returns the derived dark background.
 */
export function deriveDarkBg(accent: string): string {
  return mix('#0d1117', accent, 0.08)
}

// ── palette derivation ───────────────────────────────────────────────────

/**
 * Derive the LIGHT-mode alias palette from (accent, light background).
 * Ratios mirror the shipped light themes.
 * @param accent - brand hue.
 * @param bg - page background.
 * @returns alias variable → value for the light block.
 */
function deriveLightPalette(accent: string, bg: string): Record<string, string> {
  const labelPrimary = mix('#181820', accent, 0.12)
  const layer1 = mix(bg, '#ffffff', 0.45)
  const layer2 = mix(bg, accent, 0.07)
  const layer3 = mix(bg, accent, 0.13)
  return {
    /* 背景层 */
    '--dsw-alias-bg-base': bg,
    '--dsw-alias-bg-layer-1': layer1,
    '--dsw-alias-bg-layer-2': layer2,
    '--dsw-alias-bg-layer-3': layer3,
    '--dsw-alias-bg-overlay': layer2,
    '--dsw-alias-bg-module-platform': layer2,
    '--dsw-alias-bg-multi-select': layer3,
    '--dsw-alias-bg-skeleton': rgba(accent, 0.08),
    /* 文字层 */
    '--dsw-alias-label-primary': labelPrimary,
    '--dsw-alias-label-primary-dimmed': mix(labelPrimary, '#ffffff', 0.10),
    '--dsw-alias-label-primary-bluish': accent,
    '--dsw-alias-label-secondary': mix(accent, '#ffffff', 0.45),
    '--dsw-alias-label-tertiary': mix(accent, '#ffffff', 0.55),
    '--dsw-alias-label-caption': mix(accent, '#ffffff', 0.62),
    '--dsw-alias-label-dimmed': mix(accent, '#ffffff', 0.70),
    /* 边框层 */
    '--dsw-alias-border-l1': rgba(accent, 0.10),
    '--dsw-alias-border-l2': rgba(accent, 0.16),
    '--dsw-alias-border-l3': rgba(accent, 0.22),
    '--dsw-alias-border-l4': rgba(accent, 0.28),
    /* 品牌与按钮 */
    '--dsw-alias-brand-primary': accent,
    '--dsw-alias-brand-text': mix(accent, '#000000', 0.12),
    '--dsw-alias-brand-primary-invert': mix(bg, '#ffffff', 0.5),
    '--dsw-alias-brand-primary-new-colorprimary-new-color': accent,
    '--dsw-alias-button-primary-fill': accent,
    '--dsw-alias-button-primary-hover': mix(accent, '#000000', 0.12),
    '--dsw-alias-button-primary-dimmed': mix(accent, bg, 0.78),
    '--dsw-alias-button-info-fill': accent,
    '--dsw-alias-button-info-hover': mix(accent, '#ffffff', 0.18),
    '--dsw-alias-button-contrast-fill': mix(accent, '#000000', 0.10),
    '--dsw-alias-button-elevated-fill': layer1,
    '--dsw-alias-button-floating-fill': layer1,
    '--dsw-alias-button-floating-hover': layer2,
    '--dsw-alias-button-ghost-active-fill': mix(accent, bg, 0.22),
    '--dsw-alias-button-ghost-active-hover': mix(accent, bg, 0.32),
    '--dsw-alias-button-ghost-active-border': mix(accent, '#ffffff', 0.45),
    /* 交互层 */
    '--dsw-alias-interactive-bg-hover': rgba(accent, 0.08),
    '--dsw-alias-interactive-bg-active': rgba(accent, 0.14),
    '--dsw-alias-interactive-bg-hover-accent': rgba(accent, 0.16),
    '--dsw-alias-interactive-bg-hover-solid': layer3,
    /* 状态层 */
    '--dsw-alias-state-business-primary': accent,
    '--dsw-alias-state-business-tertiary': mix(accent, bg, 0.22),
    '--dsw-alias-state-error-primary': '#c03333',
    '--dsw-alias-state-error-secondary': '#d64545',
    '--dsw-alias-state-success-primary': '#2e8a4e',
    '--dsw-alias-state-success-secondary': '#48a86a',
    '--dsw-alias-state-success-tertiary': '#e0f0e6',
    '--dsw-alias-state-warn-primary': '#b8860b',
    '--dsw-alias-state-warn-secondary': '#d0a02a',
    '--dsw-alias-state-warn-tertiary': '#f2e8c8',
    /* Markdown 渲染 */
    '--dsw-alias-markdown-code-block': layer2,
    '--dsw-alias-markdown-code-block-banner': layer3,
    '--dsw-alias-markdown-inline-code': mix(accent, bg, 0.20),
    '--dsw-alias-markdown-code-segment-selected': layer1,
    '--dsw-alias-markdown-code-segment-unselected': layer3,
    '--dsw-alias-markdown-tag': layer3,
    '--dsw-alias-markdown-placeholder': layer2,
    '--dsw-alias-markdown-citation': layer2,
    /* 特定区域 */
    '--dsw-specific-bubble': layer2,
    '--dsw-specific-bubble-highlight': mix(accent, bg, 0.20),
    '--dsw-specific-sidebar-fill': layer1,
    '--dsw-specific-sidebar-nav-item-active': mix(accent, bg, 0.20),
    '--dsw-specific-sidebar-nav-item-active-accent': mix(accent, bg, 0.30),
    '--dsw-specific-sidebar-nav-item-hover': layer3,
    '--dsw-specific-input-major': layer1,
    '--dsw-specific-login-input': layer2,
    '--dsw-specific-menu': layer2,
    '--dsw-specific-selector': layer3,
    '--dsw-specific-tip': layer2,
    /* 滚动条 */
    '--dsw-alias-scrollbar-bg-l1': mix(accent, bg, 0.20),
    '--dsw-alias-scrollbar-bg-l2': mix(accent, bg, 0.26),
    '--dsw-alias-scrollbar-hover-l1': mix(accent, bg, 0.34),
    '--dsw-alias-scrollbar-hover-l2': mix(accent, bg, 0.42),
    /* 浮层 */
    '--dsw-alias-toast-bg': mix('#1c1c2e', accent, 0.25),
    '--dsw-alias-tooltip-bg': mix('#1c1c2e', accent, 0.25),
  }
}

/**
 * Derive the DARK-mode alias palette from (accent, dark background).
 * Ratios mirror the shipped dark blocks: the brand lightens to keep contrast
 * (`academic`: #002fa7 → #5a7ce3 = +42% white), layers step toward white.
 * @param accent - brand hue.
 * @param bg - page background.
 * @returns alias variable → value for the dark block.
 */
function deriveDarkPalette(accent: string, bg: string): Record<string, string> {
  const brand = mix(accent, '#ffffff', 0.42)
  const labelPrimary = mix(bg, '#e8edf5', 0.85)
  const layer1 = mix(bg, '#ffffff', 0.05)
  const layer2 = mix(bg, '#ffffff', 0.10)
  const layer3 = mix(bg, '#ffffff', 0.16)
  const overlay = mix(bg, '#ffffff', 0.22)
  return {
    /* 背景层 */
    '--dsw-alias-bg-base': bg,
    '--dsw-alias-bg-layer-1': layer1,
    '--dsw-alias-bg-layer-2': layer2,
    '--dsw-alias-bg-layer-3': layer3,
    '--dsw-alias-bg-overlay': overlay,
    '--dsw-alias-bg-module-platform': layer2,
    '--dsw-alias-bg-multi-select': layer3,
    '--dsw-alias-bg-skeleton': rgba(brand, 0.08),
    /* 文字层 */
    '--dsw-alias-label-primary': labelPrimary,
    '--dsw-alias-label-primary-dimmed': mix(labelPrimary, bg, 0.18),
    '--dsw-alias-label-primary-bluish': brand,
    '--dsw-alias-label-secondary': mix(brand, labelPrimary, 0.55),
    '--dsw-alias-label-tertiary': mix(brand, labelPrimary, 0.35),
    '--dsw-alias-label-caption': mix(brand, labelPrimary, 0.25),
    '--dsw-alias-label-dimmed': mix(brand, labelPrimary, 0.18),
    /* 边框层 */
    '--dsw-alias-border-l1': rgba(brand, 0.08),
    '--dsw-alias-border-l2': rgba(brand, 0.14),
    '--dsw-alias-border-l3': rgba(brand, 0.20),
    '--dsw-alias-border-l4': rgba(brand, 0.26),
    /* 品牌与按钮 */
    '--dsw-alias-brand-primary': brand,
    '--dsw-alias-brand-text': mix(brand, '#ffffff', 0.15),
    '--dsw-alias-brand-primary-invert': bg,
    '--dsw-alias-brand-primary-new-colorprimary-new-color': brand,
    '--dsw-alias-button-primary-fill': mix(accent, brand, 0.55),
    '--dsw-alias-button-primary-hover': mix(accent, brand, 0.68),
    '--dsw-alias-button-primary-dimmed': layer3,
    '--dsw-alias-button-info-fill': mix(accent, brand, 0.68),
    '--dsw-alias-button-info-hover': mix(accent, brand, 0.55),
    '--dsw-alias-button-contrast-fill': mix(brand, '#ffffff', 0.30),
    '--dsw-alias-button-elevated-fill': layer3,
    '--dsw-alias-button-floating-fill': layer2,
    '--dsw-alias-button-floating-hover': layer3,
    '--dsw-alias-button-ghost-active-fill': mix(bg, '#ffffff', 0.22),
    '--dsw-alias-button-ghost-active-hover': mix(bg, '#ffffff', 0.28),
    '--dsw-alias-button-ghost-active-border': brand,
    /* 交互层 */
    '--dsw-alias-interactive-bg-hover': rgba(brand, 0.08),
    '--dsw-alias-interactive-bg-active': rgba(brand, 0.14),
    '--dsw-alias-interactive-bg-hover-accent': rgba(brand, 0.16),
    '--dsw-alias-interactive-bg-hover-solid': layer3,
    /* 状态层 */
    '--dsw-alias-state-business-primary': brand,
    '--dsw-alias-state-business-tertiary': layer3,
    '--dsw-alias-state-error-primary': '#e06060',
    '--dsw-alias-state-error-secondary': '#d64545',
    '--dsw-alias-state-success-primary': '#48c878',
    '--dsw-alias-state-success-secondary': '#48a86a',
    '--dsw-alias-state-success-tertiary': '#16301e',
    '--dsw-alias-state-warn-primary': '#d8b040',
    '--dsw-alias-state-warn-secondary': '#c09a2e',
    '--dsw-alias-state-warn-tertiary': '#322a14',
    /* Markdown 渲染 */
    '--dsw-alias-markdown-code-block': layer1,
    '--dsw-alias-markdown-code-block-banner': layer2,
    '--dsw-alias-markdown-inline-code': layer3,
    '--dsw-alias-markdown-code-segment-selected': layer2,
    '--dsw-alias-markdown-code-segment-unselected': layer1,
    '--dsw-alias-markdown-tag': layer3,
    '--dsw-alias-markdown-placeholder': layer2,
    '--dsw-alias-markdown-citation': layer3,
    /* 特定区域 */
    '--dsw-specific-bubble': layer3,
    '--dsw-specific-bubble-highlight': mix(bg, '#ffffff', 0.22),
    '--dsw-specific-sidebar-fill': layer1,
    '--dsw-specific-sidebar-nav-item-active': layer3,
    '--dsw-specific-sidebar-nav-item-active-accent': mix(bg, '#ffffff', 0.28),
    '--dsw-specific-sidebar-nav-item-hover': layer2,
    '--dsw-specific-input-major': layer2,
    '--dsw-specific-login-input': layer1,
    '--dsw-specific-menu': layer2,
    '--dsw-specific-selector': layer3,
    '--dsw-specific-tip': layer2,
    /* 滚动条 */
    '--dsw-alias-scrollbar-bg-l1': mix(bg, '#ffffff', 0.14),
    '--dsw-alias-scrollbar-bg-l2': mix(bg, '#ffffff', 0.20),
    '--dsw-alias-scrollbar-hover-l1': mix(bg, '#ffffff', 0.30),
    '--dsw-alias-scrollbar-hover-l2': mix(bg, '#ffffff', 0.40),
    /* 浮层 */
    '--dsw-alias-toast-bg': mix(bg, '#ffffff', 0.16),
    '--dsw-alias-tooltip-bg': mix(bg, '#ffffff', 0.16),
  }
}

/**
 * Emit the CSS block pair for one custom theme — the same shape as every
 * built-in sheet in themes.ts (light block + `[data-ds-dark-theme]` block).
 * @param doc - the custom theme document.
 * @returns the CSS text.
 */
export function customThemeCss(doc: CustomThemeDoc): string {
  const selector = `body.theme-${doc.id}`
  const block = (vars: Record<string, string>, dark: boolean): string => {
    const head = dark ? `${selector}[data-ds-dark-theme]` : selector
    const lines = Object.entries(vars).map(([name, value]) => `  ${name}: ${value};`)
    return `${head} {\n${lines.join('\n')}\n}`
  }
  return [
    `/* Theme Studio: ${doc.name} (${doc.id}) */`,
    block(deriveLightPalette(doc.accent, doc.lightBg), false),
    block(deriveDarkPalette(doc.accent, doc.darkBg), true),
  ].join('\n')
}

/** Concatenated CSS for every custom theme. */
export function customThemesCss(docs: readonly CustomThemeDoc[]): string {
  return docs.map((doc) => customThemeCss(doc)).join('\n')
}

// ── normalization + persistence ──────────────────────────────────────────

/**
 * Fold unknown JSON into a valid CustomThemeDoc, deriving missing colors.
 * @param raw - parsed storage value.
 * @param index - fallback index for name/id synthesis.
 * @returns the doc, or null when unusable.
 */
export function normalizeCustomTheme(raw: unknown, index: number): CustomThemeDoc | null {
  if (typeof raw !== 'object' || raw === null) return null
  const source = raw as Partial<CustomThemeDoc>
  const name = typeof source.name === 'string' && source.name.trim() !== ''
    ? source.name.trim()
    : `自定义主题 ${index + 1}`
  const accent = normalizeHex(source.accent, '#0066cc')
  const id = typeof source.id === 'string' && source.id.startsWith(CUSTOM_THEME_PREFIX)
    && /^[a-z0-9-]+$/.test(source.id)
    ? source.id
    : `${CUSTOM_THEME_PREFIX}${index + 1}`
  return {
    id,
    name,
    accent,
    lightBg: normalizeHex(source.lightBg, deriveLightBg(accent)),
    darkBg: normalizeHex(source.darkBg, deriveDarkBg(accent)),
  }
}

/**
 * Read the persisted custom themes; [] when none / unavailable / corrupt.
 * @returns the custom-theme documents.
 */
export function loadCustomThemes(): CustomThemeDoc[] {
  try {
    const raw = localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY)
    if (raw === null) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((entry, index) => normalizeCustomTheme(entry, index))
      .filter((doc): doc is CustomThemeDoc => doc !== null)
  } catch {
    return []
  }
}

/**
 * Persist the custom-theme array (storage failures swallowed; memory stays live).
 * @param docs - the documents to store.
 */
export function saveCustomThemes(docs: readonly CustomThemeDoc[]): void {
  try {
    localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(docs))
  } catch { /* storage unavailable */ }
}
