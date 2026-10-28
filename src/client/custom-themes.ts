/**
 * Theme Studio — user-defined style themes.
 *
 * A custom theme is one required color (the ACCENT) plus optional
 * refinements. The derivation reads the preset themes' shared grammar —
 * five independent design decisions distilled from the 19 shipped sheets:
 *
 *  1. brand (accent)   — buttons, highlights, skeleton, interactive tints;
 *  2. ink              — a SECOND hue owning text + toast + the DARK page
 *                        tint (academic: violet ink under a blue brand;
 *                        vaporwave: violet ink under a pink brand);
 *  3. mode backgrounds — light page follows the BRAND hue, dark page follows
 *                        the INK hue (vaporwave light #f8f0f6 pink vs dark
 *                        #140a1e violet);
 *  4. border voice     — brand-alpha borders (academic) vs ink-alpha borders
 *                        (typewriter, morandi, minimal);
 *  5. semantic merge   — when the brand sits close to a semantic hue with
 *                        real chroma, that state adopts the brand (palace
 *                        red → error; matrix green → success).
 *
 * Derivation happens in the OKLCH perceptual space (Björn Ottosson's
 * reference matrices): surfaces carry the hue with almost no chroma, the
 * text ladder's lightness is decoupled from the accent's vividness, and the
 * brand is lightness-clamped into a readable band per mode. Verified against
 * the `academic` sheet: accent #002fa7 derives dark-mode brand ≈ #487ff4,
 * secondary text #5e7fc0, layer-2 #eff4ff — all same-family as the hand-tuned
 * #5a7ce3 / #5a7ce3 / #edf2ff.
 *
 * Output is plain hex/rgba in the exact sheet shape of the built-in themes,
 * so the alias cascade in brand-overrides fills in the rest. Persistence is
 * a plugin-owned localStorage array (`dsh-yizi-themes:customThemes`),
 * normalized on read; documents saved by older versions normalize cleanly
 * (missing optional fields fall back to the automatic behavior).
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
  /** Ink color (text/toast/dark-tint hue); '' = derive from the accent. */
  ink?: string
  /** Surface tint strength: 0.5 subtle / 1 standard / 1.8 rich. */
  surfaceTint?: number
  /** Border voice: 'brand' (colored chrome) or 'ink' (neutral chrome). */
  borderStyle?: 'brand' | 'ink'
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

/**
 * Circular hue distance in degrees (0..180).
 * @param a - first hue.
 * @param b - second hue.
 * @returns the shortest distance between the two hues.
 */
function hueDist(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360 + 360) % 360)
  return Math.min(d, 360 - d)
}

// ── accent / ink analysis ────────────────────────────────────────────────

/** Neutral-blue fallback hue when a color carries no usable chroma. */
const FALLBACK_HUE = 265

/**
 * Analyze a color for derivation: hue stabilized (greys fall back to a
 * neutral blue), chroma clamped to the UI-safe ceiling.
 * @param hex - the color.
 * @returns the OKLCH spec.
 */
function colorSpec(hex: string): Oklch {
  const parsed = hexToOklch(hex)
  if (parsed === null) return { L: 0.5, C: 0.12, H: FALLBACK_HUE }
  return {
    L: parsed.L,
    C: Math.min(parsed.C, 0.30),
    H: parsed.C < 0.02 ? FALLBACK_HUE : parsed.H,
  }
}

/**
 * Derive the ink from an accent, following the presets (OKLCH hue wheel):
 * blue brands drift their ink +43° toward violet (academic 263→306, the
 * measured #2a1a3a), pink/red-pink brands shift to violet (vaporwave 345→
 * 303, the measured #3a2a4e), other hue families keep their own hue
 * (typewriter warm 84, matrix green 147). Chroma stays whisper-low — ink is
 * a tinted near-neutral.
 * @param accent - the analyzed accent.
 * @returns the derived ink spec.
 */
function autoInk(accent: Oklch): Oklch {
  let H = accent.H
  if (accent.H >= 225 && accent.H < 295) H = accent.H + 43 // blue → violet
  else if (accent.H >= 320 || accent.H < 15) H = 303 // pink/magenta → violet
  return { L: 0.27, C: Math.min(0.06, accent.C * 0.22), H }
}

/** Resolved inputs shared by both palettes. */
interface PaletteSpec {
  /** Brand spec. */
  brand: Oklch
  /** Ink spec (chroma-capped). */
  ink: Oklch
  /** Hue the text ladder follows (ink when vivid, else brand). */
  textHue: number
  /** Brand chroma (capped). */
  brandC: number
}

/**
 * Resolve accent + optional explicit ink into the shared derivation inputs.
 * @param accent - brand color.
 * @param inkOpt - explicit ink or undefined (auto).
 * @returns the resolved spec.
 */
function resolveSpec(accent: string, inkOpt: string | undefined): PaletteSpec {
  const A = colorSpec(accent)
  const I = typeof inkOpt === 'string' && inkOpt.trim() !== ''
    ? colorSpec(inkOpt.trim())
    : autoInk(A)
  const brandC = Math.min(A.C, 0.26)
  const inkC = Math.min(I.C, 0.10)
  return {
    brand: { L: A.L, C: brandC, H: A.H },
    ink: { L: I.L, C: inkC, H: I.H },
    textHue: inkC >= 0.05 ? I.H : A.H,
    brandC,
  }
}

/**
 * Derive the light-mode page background from an accent (a whisper-tinted
 * near-white in the BRAND hue).
 * @param accent - the accent color.
 * @returns the derived light background.
 */
export function deriveLightBg(accent: string): string {
  const A = colorSpec(accent)
  return ok(0.975, Math.min(0.02, A.C * 0.06), A.H)
}

/**
 * Derive the dark-mode page background from an accent (near-black tinted by
 * the INK hue — the presets' dark pages follow ink, not brand).
 * @param accent - the accent color.
 * @returns the derived dark background.
 */
export function deriveDarkBg(accent: string): string {
  const A = colorSpec(accent)
  const ink = autoInk(A)
  return ok(0.165, Math.min(0.018, A.C * 0.10), ink.H)
}

/**
 * The dark-mode brand voice (for previews): lightened into the dark band.
 * @param accent - the accent color.
 * @returns the dark-mode brand color.
 */
export function deriveDarkBrand(accent: string): string {
  const A = colorSpec(accent)
  return ok(clampN(A.L, 0.62, 0.85), Math.min(A.C * 0.95, 0.19), A.H)
}

/**
 * The auto-derived ink for an accent (what the editor's '' ink resolves to):
 * the light-mode label-primary the engine will emit.
 * @param accent - the accent color.
 * @returns the auto ink hex.
 */
export function deriveInk(accent: string): string {
  const ink = autoInk(colorSpec(accent))
  return ok(ink.L, ink.C, ink.H)
}

// ── palette derivation ───────────────────────────────────────────────────

/** Surface tint strengths (doc.surfaceTint → chroma multiplier). */
const TINT_STRENGTHS: Record<number, number> = { 0.5: 0.5, 1: 1, 1.8: 1.8 }

/**
 * Resolve the tint multiplier (unknown values fall back to standard).
 * @param tint - the doc value.
 * @returns the chroma multiplier.
 */
function tintOf(tint: number | undefined): number {
  return typeof tint === 'number' && TINT_STRENGTHS[tint] !== undefined ? TINT_STRENGTHS[tint] : 1
}

/** Semantic hue anchors (OKLCH, measured): red 25°, green 150°. */
const ERROR_HUE = 25
const SUCCESS_HUE = 150

/**
 * Whether the brand is close enough to a semantic hue (with real chroma) to
 * adopt it — the palace/matrix/vaporwave behavior.
 * @param brand - the resolved brand spec.
 * @param target - semantic hue anchor.
 * @param maxDist - hue distance threshold.
 * @returns true when the state should merge with the brand.
 */
function mergesWithBrand(brand: Oklch, target: number, maxDist: number): boolean {
  return brand.C > 0.14 && hueDist(brand.H, target) <= maxDist
}

/**
 * Derive the LIGHT-mode alias palette.
 *
 * Role recipe (mirrors the shipped light themes):
 *  - surfaces: BRAND hue, chroma ≤ ~0.05 scaled by the tint strength;
 *  - text: lightness ladder 0.27→0.76, hue follows the ink (vaporwave's
 *    violet secondary) or the brand when the ink is near-neutral;
 *  - borders: brand-alpha or ink-alpha per the border voice;
 *  - toast: the ink family, darkness tied to the ink's lightness;
 *  - states: fixed perceptual hues, merged with the brand when adjacent.
 * @param accent - brand hue.
 * @param bg - page background.
 * @param inkOpt - explicit ink (undefined = auto).
 * @param tint - surface tint strength.
 * @param borderStyle - border voice.
 * @returns alias variable → value for the light block.
 */
function deriveLightPalette(
  accent: string,
  bg: string,
  inkOpt: string | undefined,
  tint: number,
  borderStyle: 'brand' | 'ink',
): Record<string, string> {
  const S = resolveSpec(accent, inkOpt)
  const { H: brandH, C: brandC } = S.brand
  const { H: inkH, C: inkC } = S.ink
  const brandL = clampN(S.brand.L, 0.40, 0.62)
  const inkL = clampN(S.ink.L, 0.22, 0.45)
  const brand = ok(brandL, brandC, brandH)
  const brandSoftL = clampN(brandL + 0.18, 0, 0.85)
  const textC = Math.max(0.02, Math.min(0.13, brandC * 0.55))
  const tH = S.textHue
  const borderH = borderStyle === 'ink' ? inkH : brandH
  const borderL = borderStyle === 'ink' ? inkL : brandL
  const borderC = borderStyle === 'ink' ? inkC : brandC
  const borderA = borderStyle === 'ink' ? 0.08 : 0.10
  // Background depth from the (user or derived) page background.
  const B = hexToOklch(bg) ?? { L: 0.975, C: 0.012, H: brandH }
  const bgL = clampN(B.L, 0.9, 0.995)
  const bgC = Math.min(0.02, B.C)
  const layer1 = ok(Math.min(0.992, bgL + 0.008), Math.min(0.05, bgC * 0.5 * tint), brandH)
  const layer2 = ok(bgL - 0.012, Math.min(0.05, (bgC + 0.006) * tint), brandH)
  const layer3 = ok(bgL - 0.026, Math.min(0.06, (bgC + 0.013) * tint), brandH)
  const errorMerged = mergesWithBrand(S.brand, ERROR_HUE, 45)
  const successMerged = mergesWithBrand(S.brand, SUCCESS_HUE, 25)
  return {
    /* 背景层 */
    '--dsw-alias-bg-base': bg,
    '--dsw-alias-bg-layer-1': layer1,
    '--dsw-alias-bg-layer-2': layer2,
    '--dsw-alias-bg-layer-3': layer3,
    '--dsw-alias-bg-overlay': layer2,
    '--dsw-alias-bg-module-platform': layer2,
    '--dsw-alias-bg-multi-select': layer3,
    '--dsw-alias-bg-skeleton': okA(brandL, brandC, brandH, 0.08),
    /* 文字层 */
    '--dsw-alias-label-primary': ok(inkL, inkC, inkH),
    '--dsw-alias-label-primary-dimmed': ok(inkL + 0.07, inkC, inkH),
    '--dsw-alias-label-primary-bluish': brand,
    '--dsw-alias-label-secondary': ok(0.60, textC, tH),
    '--dsw-alias-label-tertiary': ok(0.65, textC * 0.8, tH),
    '--dsw-alias-label-caption': ok(0.70, textC * 0.65, tH),
    '--dsw-alias-label-dimmed': ok(0.76, textC * 0.5, tH),
    /* 边框层 */
    '--dsw-alias-border-l1': okA(borderL, borderC, borderH, borderA),
    '--dsw-alias-border-l2': okA(borderL, borderC, borderH, borderA + 0.06),
    '--dsw-alias-border-l3': okA(borderL, borderC, borderH, borderA + 0.12),
    '--dsw-alias-border-l4': okA(borderL, borderC, borderH, borderA + 0.18),
    /* 品牌与按钮 */
    '--dsw-alias-brand-primary': brand,
    '--dsw-alias-brand-text': ok(brandL - 0.05, brandC, brandH),
    '--dsw-alias-brand-primary-invert': ok(0.985, 0.008, brandH),
    '--dsw-alias-brand-primary-new-colorprimary-new-color': brand,
    '--dsw-alias-button-primary-fill': brand,
    '--dsw-alias-button-primary-hover': ok(brandL - 0.05, brandC, brandH),
    '--dsw-alias-button-primary-dimmed': ok(0.90, 0.045, brandH),
    '--dsw-alias-button-info-fill': brand,
    '--dsw-alias-button-info-hover': ok(brandL + 0.08, brandC, brandH),
    '--dsw-alias-button-contrast-fill': ok(brandL - 0.07, brandC, brandH),
    '--dsw-alias-button-elevated-fill': layer1,
    '--dsw-alias-button-floating-fill': layer1,
    '--dsw-alias-button-floating-hover': layer2,
    '--dsw-alias-button-ghost-active-fill': okA(brandL, brandC, brandH, 0.13),
    '--dsw-alias-button-ghost-active-hover': okA(brandL, brandC, brandH, 0.20),
    '--dsw-alias-button-ghost-active-border': ok(brandSoftL, brandC * 0.85, brandH),
    /* 交互层 */
    '--dsw-alias-interactive-bg-hover': okA(brandL, brandC, brandH, 0.08),
    '--dsw-alias-interactive-bg-active': okA(brandL, brandC, brandH, 0.14),
    '--dsw-alias-interactive-bg-hover-accent': okA(brandL, brandC, brandH, 0.16),
    '--dsw-alias-interactive-bg-hover-solid': layer3,
    /* 状态层 */
    '--dsw-alias-state-business-primary': brand,
    '--dsw-alias-state-business-tertiary': ok(0.93, 0.03, brandH),
    '--dsw-alias-state-error-primary': errorMerged ? brand : ok(0.55, 0.19, ERROR_HUE),
    '--dsw-alias-state-error-secondary': errorMerged ? ok(brandL + 0.06, brandC, brandH) : ok(0.62, 0.19, ERROR_HUE),
    '--dsw-alias-state-success-primary': successMerged ? brand : ok(0.55, 0.14, SUCCESS_HUE),
    '--dsw-alias-state-success-secondary': successMerged ? ok(brandL + 0.06, brandC, brandH) : ok(0.66, 0.13, SUCCESS_HUE),
    '--dsw-alias-state-success-tertiary': ok(0.95, 0.03, SUCCESS_HUE),
    '--dsw-alias-state-warn-primary': ok(0.60, 0.12, 80),
    '--dsw-alias-state-warn-secondary': ok(0.72, 0.13, 80),
    '--dsw-alias-state-warn-tertiary': ok(0.94, 0.05, 95),
    /* Markdown 渲染 */
    '--dsw-alias-markdown-code-block': layer2,
    '--dsw-alias-markdown-code-block-banner': layer3,
    '--dsw-alias-markdown-inline-code': ok(0.90, 0.05, brandH),
    '--dsw-alias-markdown-code-segment-selected': layer1,
    '--dsw-alias-markdown-code-segment-unselected': layer3,
    '--dsw-alias-markdown-tag': layer3,
    '--dsw-alias-markdown-placeholder': layer2,
    '--dsw-alias-markdown-citation': layer2,
    /* 特定区域 */
    '--dsw-specific-bubble': layer2,
    '--dsw-specific-bubble-highlight': ok(0.88, 0.06, brandH),
    '--dsw-specific-sidebar-fill': layer1,
    '--dsw-specific-sidebar-nav-item-active': ok(0.88, 0.06, brandH),
    '--dsw-specific-sidebar-nav-item-active-accent': ok(0.83, 0.08, brandH),
    '--dsw-specific-sidebar-nav-item-hover': layer3,
    '--dsw-specific-input-major': layer1,
    '--dsw-specific-login-input': layer2,
    '--dsw-specific-menu': layer2,
    '--dsw-specific-selector': layer3,
    '--dsw-specific-tip': layer2,
    /* 滚动条 */
    '--dsw-alias-scrollbar-bg-l1': ok(0.82, 0.04, brandH),
    '--dsw-alias-scrollbar-bg-l2': ok(0.79, 0.04, brandH),
    '--dsw-alias-scrollbar-hover-l1': ok(0.74, 0.045, brandH),
    '--dsw-alias-scrollbar-hover-l2': ok(0.68, 0.05, brandH),
    /* 浮层 */
    '--dsw-alias-toast-bg': ok(clampN(inkL + 0.03, 0.20, 0.50), Math.max(inkC, 0.02) * 1.2, inkH),
    '--dsw-alias-tooltip-bg': ok(clampN(inkL + 0.03, 0.20, 0.50), Math.max(inkC, 0.02) * 1.2, inkH),
  }
}

/**
 * Derive the DARK-mode alias palette.
 *
 * Role recipe (mirrors the shipped dark blocks):
 *  - surfaces: INK hue stepping toward white from the dark base (vaporwave's
 *    violet-dark ladder);
 *  - brand lightens into the 0.62–0.85 band with eased chroma;
 *  - text: its own ladder, ink-hued, near-neutral chroma;
 *  - borders: brand-alpha or ink-alpha per the border voice;
 *  - states: bright dark-mode variants, merged with the brand when adjacent.
 * @param accent - brand hue.
 * @param bg - page background.
 * @param inkOpt - explicit ink (undefined = auto).
 * @param tint - surface tint strength.
 * @param borderStyle - border voice.
 * @returns alias variable → value for the dark block.
 */
function deriveDarkPalette(
  accent: string,
  bg: string,
  inkOpt: string | undefined,
  tint: number,
  borderStyle: 'brand' | 'ink',
): Record<string, string> {
  const S = resolveSpec(accent, inkOpt)
  const { H: brandH, C: brandC } = S.brand
  const { H: inkH, C: inkC } = S.ink
  const brandL = clampN(S.brand.L, 0.62, 0.85)
  /** Ink lightness for the neutral-border voice (mirrors the light ladder). */
  const inkL = clampN(S.ink.L, 0.22, 0.45)
  const brand = ok(brandL, brandC, brandH)
  const brandFillL = Math.max(0.45, brandL - 0.12)
  const textC = Math.max(0.015, Math.min(0.10, brandC * 0.45))
  const tH = S.textHue
  const labelC = Math.min(0.05, inkC * 1.2)
  const borderH = borderStyle === 'ink' ? inkH : brandH
  const borderL = borderStyle === 'ink' ? inkL : brandL
  const borderC = borderStyle === 'ink' ? inkC : brandC
  const borderA = borderStyle === 'ink' ? 0.10 : 0.08
  const B = hexToOklch(bg) ?? { L: 0.165, C: 0.01, H: inkH }
  const bgL = clampN(B.L, 0.10, 0.28)
  const bgC = Math.min(0.02, B.C) * tint
  const layer1 = ok(bgL + 0.035, Math.min(0.04, bgC), inkH)
  const layer2 = ok(bgL + 0.055, Math.min(0.05, bgC), inkH)
  const layer3 = ok(bgL + 0.115, Math.min(0.06, bgC * 1.3), inkH)
  const overlay = ok(bgL + 0.155, Math.min(0.07, bgC * 1.4), inkH)
  const errorMerged = mergesWithBrand(S.brand, ERROR_HUE, 45)
  const successMerged = mergesWithBrand(S.brand, SUCCESS_HUE, 25)
  return {
    /* 背景层 */
    '--dsw-alias-bg-base': bg,
    '--dsw-alias-bg-layer-1': layer1,
    '--dsw-alias-bg-layer-2': layer2,
    '--dsw-alias-bg-layer-3': layer3,
    '--dsw-alias-bg-overlay': overlay,
    '--dsw-alias-bg-module-platform': layer2,
    '--dsw-alias-bg-multi-select': layer3,
    '--dsw-alias-bg-skeleton': okA(brandL, brandC, brandH, 0.08),
    /* 文字层 */
    '--dsw-alias-label-primary': ok(0.85, labelC, inkH),
    '--dsw-alias-label-primary-dimmed': ok(0.74, labelC, inkH),
    '--dsw-alias-label-primary-bluish': brand,
    '--dsw-alias-label-secondary': ok(0.68, textC, tH),
    '--dsw-alias-label-tertiary': ok(0.60, textC * 0.8, tH),
    '--dsw-alias-label-caption': ok(0.53, textC * 0.65, tH),
    '--dsw-alias-label-dimmed': ok(0.46, textC * 0.5, tH),
    /* 边框层 */
    '--dsw-alias-border-l1': okA(borderL, borderC, borderH, borderA),
    '--dsw-alias-border-l2': okA(borderL, borderC, borderH, borderA + 0.06),
    '--dsw-alias-border-l3': okA(borderL, borderC, borderH, borderA + 0.12),
    '--dsw-alias-border-l4': okA(borderL, borderC, borderH, borderA + 0.18),
    /* 品牌与按钮 */
    '--dsw-alias-brand-primary': brand,
    '--dsw-alias-brand-text': ok(Math.min(0.9, brandL + 0.08), brandC, brandH),
    '--dsw-alias-brand-primary-invert': bg,
    '--dsw-alias-brand-primary-new-colorprimary-new-color': brand,
    '--dsw-alias-button-primary-fill': ok(brandFillL, brandC, brandH),
    '--dsw-alias-button-primary-hover': ok(brandFillL + 0.08, brandC, brandH),
    '--dsw-alias-button-primary-dimmed': layer3,
    '--dsw-alias-button-info-fill': ok(brandFillL + 0.08, brandC, brandH),
    '--dsw-alias-button-info-hover': ok(brandFillL, brandC, brandH),
    '--dsw-alias-button-contrast-fill': ok(Math.min(0.88, brandL + 0.12), brandC * 0.8, brandH),
    '--dsw-alias-button-elevated-fill': layer3,
    '--dsw-alias-button-floating-fill': layer2,
    '--dsw-alias-button-floating-hover': layer3,
    '--dsw-alias-button-ghost-active-fill': overlay,
    '--dsw-alias-button-ghost-active-hover': ok(bgL + 0.165, Math.min(0.07, bgC * 1.4), inkH),
    '--dsw-alias-button-ghost-active-border': brand,
    /* 交互层 */
    '--dsw-alias-interactive-bg-hover': okA(brandL, brandC, brandH, 0.08),
    '--dsw-alias-interactive-bg-active': okA(brandL, brandC, brandH, 0.14),
    '--dsw-alias-interactive-bg-hover-accent': okA(brandL, brandC, brandH, 0.16),
    '--dsw-alias-interactive-bg-hover-solid': layer3,
    /* 状态层 */
    '--dsw-alias-state-business-primary': brand,
    '--dsw-alias-state-business-tertiary': layer3,
    '--dsw-alias-state-error-primary': errorMerged ? brand : ok(0.66, 0.19, ERROR_HUE),
    '--dsw-alias-state-error-secondary': errorMerged ? ok(brandL - 0.06, brandC, brandH) : ok(0.60, 0.19, ERROR_HUE),
    '--dsw-alias-state-success-primary': successMerged ? brand : ok(0.72, 0.15, SUCCESS_HUE),
    '--dsw-alias-state-success-secondary': successMerged ? ok(brandL - 0.06, brandC, brandH) : ok(0.64, 0.13, SUCCESS_HUE),
    '--dsw-alias-state-success-tertiary': ok(0.30, 0.04, SUCCESS_HUE),
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
    '--dsw-specific-sidebar-nav-item-active-accent': ok(bgL + 0.165, Math.min(0.07, bgC * 1.4), inkH),
    '--dsw-specific-sidebar-nav-item-hover': layer2,
    '--dsw-specific-input-major': layer2,
    '--dsw-specific-login-input': layer1,
    '--dsw-specific-menu': layer2,
    '--dsw-specific-selector': layer3,
    '--dsw-specific-tip': layer2,
    /* 滚动条 */
    '--dsw-alias-scrollbar-bg-l1': ok(bgL + 0.055, Math.min(0.04, bgC * 1.2), inkH),
    '--dsw-alias-scrollbar-bg-l2': ok(bgL + 0.085, Math.min(0.05, bgC * 1.3), inkH),
    '--dsw-alias-scrollbar-hover-l1': ok(bgL + 0.135, Math.min(0.06, bgC * 1.4), inkH),
    '--dsw-alias-scrollbar-hover-l2': ok(bgL + 0.185, Math.min(0.07, bgC * 1.5), inkH),
    /* 浮层 */
    '--dsw-alias-toast-bg': ok(0.27, Math.max(0.015, inkC * 0.8), inkH),
    '--dsw-alias-tooltip-bg': ok(0.27, Math.max(0.015, inkC * 0.8), inkH),
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
  const tint = tintOf(doc.surfaceTint)
  const borderStyle = doc.borderStyle === 'ink' ? 'ink' : 'brand'
  const ink = typeof doc.ink === 'string' && doc.ink.trim() !== '' ? doc.ink.trim() : undefined
  const block = (vars: Record<string, string>, dark: boolean): string => {
    const head = dark ? `${selector}[data-ds-dark-theme]` : selector
    // Every declaration carries !important: the core ThemePresenter writes the
    // ACTIVE core theme's tokens as INLINE style properties on body, and inline
    // styles beat any normal class selector. Author-important declarations are
    // the one stylesheet tier above inline styles, so this is what makes an
    // applied custom theme actually win the cascade. Removing the theme class
    // (switching back to a core theme) instantly restores the inline tokens.
    const lines = Object.entries(vars).map(([name, value]) => `  ${name}: ${value} !important;`)
    return `${head} {\n${lines.join('\n')}\n}`
  }
  return [
    `/* Theme Studio: ${doc.name} (${doc.id}) */`,
    block(deriveLightPalette(doc.accent, doc.lightBg, ink, tint, borderStyle), false),
    block(deriveDarkPalette(doc.accent, doc.darkBg, ink, tint, borderStyle), true),
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
 * Fold unknown JSON into a valid CustomThemeDoc, deriving missing colors and
 * defaulting the optional refinement fields (old documents migrate cleanly).
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
    ink: typeof source.ink === 'string' && source.ink.trim() !== ''
      ? normalizeHex(source.ink, '')
      : undefined,
    surfaceTint: typeof source.surfaceTint === 'number'
      && TINT_STRENGTHS[source.surfaceTint] !== undefined
      ? source.surfaceTint
      : undefined,
    borderStyle: source.borderStyle === 'ink' ? 'ink' : undefined,
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
