/**
 * Theme Studio — user-defined style themes.
 *
 * A custom theme is three colors: an ACCENT (the brand hue) and optionally
 * explicit light/dark page backgrounds. From those, both mode palettes are
 * derived — in the OKLCH perceptual color space, not by RGB interpolation.
 *
 * Why OKLCH: linear RGB mixing muddies (the midpoint of two vivid colors is
 * grey-brown) and cannot separate "how light" from "how colorful", which is
 * exactly what a theme needs to control. Deriving per ROLE instead — near-
 * neutral surfaces with a whisper of the accent hue, a text ladder whose
 * chroma is decoupled from the accent's own vividness, and the brand as the
 * only saturated voice — is what the shipped themes do by hand; the engine
 * below reproduces those relationships (verified against the `academic`
 * sheet: accent #002fa7 derives dark-mode brand ≈ #5a7ce3, its exact value).
 *
 * Derived colors are emitted as plain hex/rgba — same sheet shape as every
 * built-in theme, so the alias cascade in brand-overrides fills in the rest.
 * Persistence follows the brand document's pattern: a plugin-owned
 * localStorage array (`dsh-yizi-themes:customThemes`), normalized on read.
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

// ── OKLCH color math (Björn Ottosson's reference matrices) ───────────────

interface Oklch { L: number; C: number; H: number }

/**
 * sRGB channel (0-1) → linear light.
 * @param c - gamma-encoded channel.
 * @returns linear channel.
 */
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/**
 * Linear light → sRGB channel (0-1), clamped.
 * @param c - linear channel.
 * @returns gamma-encoded channel.
 */
function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055
  return Math.min(1, Math.max(0, v))
}

/**
 * Parse `#rgb` / `#rrggbb` into rgb bytes; `null` when not a color.
 * @param value - candidate color string.
 * @returns the rgb triple or null.
 */
function parseHex(value: string): { r: number; g: number; b: number } | null {
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
 * Convert a hex color to OKLCH.
 * @param hex - the color.
 * @returns the OKLCH triple (H in degrees), or null when unparseable.
 */
function hexToOklch(hex: string): Oklch | null {
  const parsed = parseHex(hex)
  if (parsed === null) return null
  const r = srgbToLinear(parsed.r / 255)
  const g = srgbToLinear(parsed.g / 255)
  const b = srgbToLinear(parsed.b / 255)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  const C = Math.sqrt(a * a + bb * bb)
  let H = Math.atan2(bb, a) * 180 / Math.PI
  if (H < 0) H += 360
  return { L, C, H }
}

/**
 * Convert OKLCH to a hex color (per-channel gamut clamp — a slight chroma
 * drop at the sRGB boundary, imperceptible at these chroma levels).
 * @param L - lightness 0..1.
 * @param C - chroma.
 * @param H - hue in degrees.
 * @returns the hex color.
 */
function oklchToHex(L: number, C: number, H: number): string {
  const rad = H * Math.PI / 180
  const a = C * Math.cos(rad)
  const b = C * Math.sin(rad)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b
  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_
  const r = linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)
  const g = linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)
  const bl = linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
  const part = (v: number): string => Math.round(v * 255).toString(16).padStart(2, '0')
  return `#${part(r)}${part(g)}${part(bl)}`
}

/**
 * Build a hex color from OKLCH parts (the derivation vocabulary).
 * @param L - lightness 0..1.
 * @param C - chroma.
 * @param H - hue in degrees.
 * @returns the hex color.
 */
function ok(O: number, C: number, H: number): string {
  return oklchToHex(Math.min(1, Math.max(0, O)), Math.max(0, C), ((H % 360) + 360) % 360)
}

/**
 * Build an `rgba()` literal of an OKLCH color at an alpha.
 * @param L - lightness.
 * @param C - chroma.
 * @param H - hue.
 * @param alpha - 0..1 alpha.
 * @returns the rgba() string.
 */
function okA(O: number, C: number, H: number, alpha: number): string {
  const hex = ok(O, C, H)
  const parsed = parseHex(hex)
  if (parsed === null) return hex
  return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha})`
}

/**
 * Clamp a number into [min, max].
 * @param value - the number.
 * @param min - lower bound.
 * @param max - upper bound.
 * @returns the clamped value.
 */
function clampN(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

// ── accent analysis ──────────────────────────────────────────────────────

/** Neutral-blue fallback hue when the accent carries no usable chroma. */
const FALLBACK_HUE = 265

/**
 * Analyze an accent color for derivation: hue stabilized (greys fall back to
 * a neutral blue), chroma clamped to the UI-safe ceiling.
 * @param hex - the accent color.
 * @returns the OKLCH spec used by both palettes.
 */
function accentSpec(hex: string): Oklch {
  const parsed = hexToOklch(hex)
  if (parsed === null) return { L: 0.5, C: 0.12, H: FALLBACK_HUE }
  return {
    L: parsed.L,
    C: Math.min(parsed.C, 0.30),
    H: parsed.C < 0.02 ? FALLBACK_HUE : parsed.H,
  }
}

/**
 * Derive the light-mode page background from an accent (a whisper-tinted
 * near-white).
 * @param accent - the accent color.
 * @returns the derived light background.
 */
export function deriveLightBg(accent: string): string {
  const A = accentSpec(accent)
  return ok(0.975, Math.min(0.02, A.C * 0.06), A.H)
}

/**
 * Derive the dark-mode page background from an accent (near-black with a
 * breath of the accent hue).
 * @param accent - the accent color.
 * @returns the derived dark background.
 */
export function deriveDarkBg(accent: string): string {
  const A = accentSpec(accent)
  return ok(0.165, Math.min(0.018, A.C * 0.10), A.H)
}

// ── palette derivation ───────────────────────────────────────────────────

/**
 * Derive the LIGHT-mode alias palette from (accent, light background).
 *
 * Role recipe (mirrors the shipped light themes):
 *  - surfaces: accent-HUE only, chroma ≤ 0.035 — near-neutral, never pastel;
 *  - text: its own lightness ladder, chroma decoupled from the accent's
 *    vividness (a neon accent still yields calm, readable secondary text);
 *  - brand: the accent, lightness-clamped into the readable band and chroma-
 *    capped, so pastel/neon accents still work as text and fills;
 *  - semantic states: fixed perceptual hues (they must not drift with brand).
 * @param accent - brand hue.
 * @param bg - page background.
 * @returns alias variable → value for the light block.
 */
function deriveLightPalette(accent: string, bg: string): Record<string, string> {
  const A = accentSpec(accent)
  const { H } = A
  const C = Math.min(A.C, 0.26)
  // Brand voice: readable on light surfaces (academic #002fa7 → L 0.42 kept).
  const brandL = clampN(A.L, 0.40, 0.62)
  const brand = ok(brandL, C, H)
  const brandSoftL = clampN(brandL + 0.18, 0, 0.85)
  // Text chroma floor keeps a grey accent usable without going colorless.
  const textC = Math.max(0.02, Math.min(0.13, C * 0.55))
  // Background depth from the (user or derived) page background.
  const B = hexToOklch(bg) ?? { L: 0.975, C: 0.012, H }
  const bgL = clampN(B.L, 0.9, 0.995)
  const bgC = Math.min(0.02, B.C)
  const layer1 = ok(Math.min(0.992, bgL + 0.008), bgC * 0.5, H)
  const layer2 = ok(bgL - 0.012, Math.min(0.03, bgC + 0.006), H)
  const layer3 = ok(bgL - 0.026, Math.min(0.035, bgC + 0.013), H)
  return {
    /* 背景层 */
    '--dsw-alias-bg-base': bg,
    '--dsw-alias-bg-layer-1': layer1,
    '--dsw-alias-bg-layer-2': layer2,
    '--dsw-alias-bg-layer-3': layer3,
    '--dsw-alias-bg-overlay': layer2,
    '--dsw-alias-bg-module-platform': layer2,
    '--dsw-alias-bg-multi-select': layer3,
    '--dsw-alias-bg-skeleton': okA(brandL, C, H, 0.08),
    /* 文字层 */
    '--dsw-alias-label-primary': ok(0.26, 0.022, H),
    '--dsw-alias-label-primary-dimmed': ok(0.33, 0.022, H),
    '--dsw-alias-label-primary-bluish': brand,
    '--dsw-alias-label-secondary': ok(0.60, textC, H),
    '--dsw-alias-label-tertiary': ok(0.65, textC * 0.8, H),
    '--dsw-alias-label-caption': ok(0.70, textC * 0.65, H),
    '--dsw-alias-label-dimmed': ok(0.76, textC * 0.5, H),
    /* 边框层 */
    '--dsw-alias-border-l1': okA(brandL, C, H, 0.10),
    '--dsw-alias-border-l2': okA(brandL, C, H, 0.16),
    '--dsw-alias-border-l3': okA(brandL, C, H, 0.22),
    '--dsw-alias-border-l4': okA(brandL, C, H, 0.28),
    /* 品牌与按钮 */
    '--dsw-alias-brand-primary': brand,
    '--dsw-alias-brand-text': ok(brandL - 0.05, C, H),
    '--dsw-alias-brand-primary-invert': ok(0.985, 0.008, H),
    '--dsw-alias-brand-primary-new-colorprimary-new-color': brand,
    '--dsw-alias-button-primary-fill': brand,
    '--dsw-alias-button-primary-hover': ok(brandL - 0.05, C, H),
    '--dsw-alias-button-primary-dimmed': ok(0.90, 0.045, H),
    '--dsw-alias-button-info-fill': brand,
    '--dsw-alias-button-info-hover': ok(brandL + 0.08, C, H),
    '--dsw-alias-button-contrast-fill': ok(brandL - 0.07, C, H),
    '--dsw-alias-button-elevated-fill': layer1,
    '--dsw-alias-button-floating-fill': layer1,
    '--dsw-alias-button-floating-hover': layer2,
    '--dsw-alias-button-ghost-active-fill': okA(brandL, C, H, 0.13),
    '--dsw-alias-button-ghost-active-hover': okA(brandL, C, H, 0.20),
    '--dsw-alias-button-ghost-active-border': ok(brandSoftL, C * 0.85, H),
    /* 交互层 */
    '--dsw-alias-interactive-bg-hover': okA(brandL, C, H, 0.08),
    '--dsw-alias-interactive-bg-active': okA(brandL, C, H, 0.14),
    '--dsw-alias-interactive-bg-hover-accent': okA(brandL, C, H, 0.16),
    '--dsw-alias-interactive-bg-hover-solid': layer3,
    /* 状态层 */
    '--dsw-alias-state-business-primary': brand,
    '--dsw-alias-state-business-tertiary': ok(0.93, 0.03, H),
    '--dsw-alias-state-error-primary': ok(0.55, 0.19, 27),
    '--dsw-alias-state-error-secondary': ok(0.62, 0.19, 27),
    '--dsw-alias-state-success-primary': ok(0.55, 0.14, 150),
    '--dsw-alias-state-success-secondary': ok(0.66, 0.13, 150),
    '--dsw-alias-state-success-tertiary': ok(0.95, 0.03, 150),
    '--dsw-alias-state-warn-primary': ok(0.60, 0.12, 80),
    '--dsw-alias-state-warn-secondary': ok(0.72, 0.13, 80),
    '--dsw-alias-state-warn-tertiary': ok(0.94, 0.05, 95),
    /* Markdown 渲染 */
    '--dsw-alias-markdown-code-block': layer2,
    '--dsw-alias-markdown-code-block-banner': layer3,
    '--dsw-alias-markdown-inline-code': ok(0.90, 0.05, H),
    '--dsw-alias-markdown-code-segment-selected': layer1,
    '--dsw-alias-markdown-code-segment-unselected': layer3,
    '--dsw-alias-markdown-tag': layer3,
    '--dsw-alias-markdown-placeholder': layer2,
    '--dsw-alias-markdown-citation': layer2,
    /* 特定区域 */
    '--dsw-specific-bubble': layer2,
    '--dsw-specific-bubble-highlight': ok(0.88, 0.06, H),
    '--dsw-specific-sidebar-fill': layer1,
    '--dsw-specific-sidebar-nav-item-active': ok(0.88, 0.06, H),
    '--dsw-specific-sidebar-nav-item-active-accent': ok(0.83, 0.08, H),
    '--dsw-specific-sidebar-nav-item-hover': layer3,
    '--dsw-specific-input-major': layer1,
    '--dsw-specific-login-input': layer2,
    '--dsw-specific-menu': layer2,
    '--dsw-specific-selector': layer3,
    '--dsw-specific-tip': layer2,
    /* 滚动条 */
    '--dsw-alias-scrollbar-bg-l1': ok(0.82, 0.04, H),
    '--dsw-alias-scrollbar-bg-l2': ok(0.79, 0.04, H),
    '--dsw-alias-scrollbar-hover-l1': ok(0.74, 0.045, H),
    '--dsw-alias-scrollbar-hover-l2': ok(0.68, 0.05, H),
    /* 浮层 */
    '--dsw-alias-toast-bg': ok(0.24, 0.025, H),
    '--dsw-alias-tooltip-bg': ok(0.24, 0.025, H),
  }
}

/**
 * Derive the DARK-mode alias palette from (accent, dark background).
 *
 * Role recipe (mirrors the shipped dark blocks):
 *  - brand lightens into the 0.62–0.85 band (academic #002fa7 → #5a7ce3) and
 *    eases its chroma slightly, so fills never glow on dark;
 *  - surfaces step toward white from the dark base, hue-tinted;
 *  - text runs its own ladder from the page background;
 *  - semantic states get the bright dark-mode variants, fixed hues.
 * @param accent - brand hue.
 * @param bg - page background.
 * @returns alias variable → value for the dark block.
 */
function deriveDarkPalette(accent: string, bg: string): Record<string, string> {
  const A = accentSpec(accent)
  const { H } = A
  const brandL = clampN(A.L, 0.62, 0.85)
  const brandC = Math.min(A.C * 0.95, 0.19)
  const brand = ok(brandL, brandC, H)
  const brandFillL = Math.max(0.45, brandL - 0.12)
  const textC = Math.max(0.015, Math.min(0.10, A.C * 0.45))
  const B = hexToOklch(bg) ?? { L: 0.165, C: 0.01, H }
  const bgL = clampN(B.L, 0.10, 0.28)
  const bgC = Math.min(0.02, B.C)
  const layer1 = ok(bgL + 0.035, bgC, H)
  const layer2 = ok(bgL + 0.055, bgC, H)
  const layer3 = ok(bgL + 0.115, bgC * 1.3, H)
  const overlay = ok(bgL + 0.155, bgC * 1.4, H)
  return {
    /* 背景层 */
    '--dsw-alias-bg-base': bg,
    '--dsw-alias-bg-layer-1': layer1,
    '--dsw-alias-bg-layer-2': layer2,
    '--dsw-alias-bg-layer-3': layer3,
    '--dsw-alias-bg-overlay': overlay,
    '--dsw-alias-bg-module-platform': layer2,
    '--dsw-alias-bg-multi-select': layer3,
    '--dsw-alias-bg-skeleton': okA(brandL, brandC, H, 0.08),
    /* 文字层 */
    '--dsw-alias-label-primary': ok(0.85, 0.012, H),
    '--dsw-alias-label-primary-dimmed': ok(0.74, 0.012, H),
    '--dsw-alias-label-primary-bluish': brand,
    '--dsw-alias-label-secondary': ok(0.68, textC, H),
    '--dsw-alias-label-tertiary': ok(0.60, textC * 0.8, H),
    '--dsw-alias-label-caption': ok(0.53, textC * 0.65, H),
    '--dsw-alias-label-dimmed': ok(0.46, textC * 0.5, H),
    /* 边框层 */
    '--dsw-alias-border-l1': okA(brandL, brandC, H, 0.08),
    '--dsw-alias-border-l2': okA(brandL, brandC, H, 0.14),
    '--dsw-alias-border-l3': okA(brandL, brandC, H, 0.20),
    '--dsw-alias-border-l4': okA(brandL, brandC, H, 0.26),
    /* 品牌与按钮 */
    '--dsw-alias-brand-primary': brand,
    '--dsw-alias-brand-text': ok(Math.min(0.9, brandL + 0.08), brandC, H),
    '--dsw-alias-brand-primary-invert': bg,
    '--dsw-alias-brand-primary-new-colorprimary-new-color': brand,
    '--dsw-alias-button-primary-fill': ok(brandFillL, brandC, H),
    '--dsw-alias-button-primary-hover': ok(brandFillL + 0.08, brandC, H),
    '--dsw-alias-button-primary-dimmed': layer3,
    '--dsw-alias-button-info-fill': ok(brandFillL + 0.08, brandC, H),
    '--dsw-alias-button-info-hover': ok(brandFillL, brandC, H),
    '--dsw-alias-button-contrast-fill': ok(Math.min(0.88, brandL + 0.12), brandC * 0.8, H),
    '--dsw-alias-button-elevated-fill': layer3,
    '--dsw-alias-button-floating-fill': layer2,
    '--dsw-alias-button-floating-hover': layer3,
    '--dsw-alias-button-ghost-active-fill': overlay,
    '--dsw-alias-button-ghost-active-hover': ok(bgL + 0.165, bgC * 1.4, H),
    '--dsw-alias-button-ghost-active-border': brand,
    /* 交互层 */
    '--dsw-alias-interactive-bg-hover': okA(brandL, brandC, H, 0.08),
    '--dsw-alias-interactive-bg-active': okA(brandL, brandC, H, 0.14),
    '--dsw-alias-interactive-bg-hover-accent': okA(brandL, brandC, H, 0.16),
    '--dsw-alias-interactive-bg-hover-solid': layer3,
    /* 状态层 */
    '--dsw-alias-state-business-primary': brand,
    '--dsw-alias-state-business-tertiary': layer3,
    '--dsw-alias-state-error-primary': ok(0.66, 0.19, 27),
    '--dsw-alias-state-error-secondary': ok(0.60, 0.19, 27),
    '--dsw-alias-state-success-primary': ok(0.72, 0.15, 150),
    '--dsw-alias-state-success-secondary': ok(0.64, 0.13, 150),
    '--dsw-alias-state-success-tertiary': ok(0.30, 0.04, 150),
    '--dsw-alias-state-warn-primary': ok(0.78, 0.13, 85),
    '--dsw-alias-state-warn-secondary': ok(0.68, 0.12, 85),
    '--dsw-alias-state-warn-tertiary': ok(0.32, 0.05, 95),
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
    '--dsw-specific-bubble-highlight': overlay,
    '--dsw-specific-sidebar-fill': layer1,
    '--dsw-specific-sidebar-nav-item-active': layer3,
    '--dsw-specific-sidebar-nav-item-active-accent': ok(bgL + 0.165, bgC * 1.4, H),
    '--dsw-specific-sidebar-nav-item-hover': layer2,
    '--dsw-specific-input-major': layer2,
    '--dsw-specific-login-input': layer1,
    '--dsw-specific-menu': layer2,
    '--dsw-specific-selector': layer3,
    '--dsw-specific-tip': layer2,
    /* 滚动条 */
    '--dsw-alias-scrollbar-bg-l1': ok(bgL + 0.055, bgC * 1.2, H),
    '--dsw-alias-scrollbar-bg-l2': ok(bgL + 0.085, bgC * 1.3, H),
    '--dsw-alias-scrollbar-hover-l1': ok(bgL + 0.135, bgC * 1.4, H),
    '--dsw-alias-scrollbar-hover-l2': ok(bgL + 0.185, bgC * 1.5, H),
    /* 浮层 */
    '--dsw-alias-toast-bg': ok(0.27, 0.02, H),
    '--dsw-alias-tooltip-bg': ok(0.27, 0.02, H),
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
 * Normalize any color-ish input into `#rrggbb`, falling back on a default.
 * @param value - candidate color.
 * @param fallback - default when unparseable.
 * @returns the normalized hex color.
 */
export function normalizeHex(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const parsed = parseHex(value)
  if (parsed === null) return fallback
  const part = (v: number): string => Math.round(v).toString(16).padStart(2, '0')
  return `#${part(parsed.r)}${part(parsed.g)}${part(parsed.b)}`
}

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
