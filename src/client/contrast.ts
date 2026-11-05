/**
 * WCAG 2.1 contrast analysis for the Theme Studio.
 *
 * Pure color math (no DOM): relative luminance per the sRGB reference formula
 * and the (L1 + 0.05) / (L2 + 0.05) contrast ratio. The studio calls these on
 * the exact hex values it will emit, so the rating shown is the rating the
 * saved theme gets — there is no separate "preview color space".
 */

/** An sRGB triple with channels in the 0–255 range. */
export interface Rgb {
  r: number
  g: number
  b: number
}

/** WCAG pass tiers, ordered most to least accessible. */
export type ContrastRating = 'AAA' | 'AA' | 'AA-large' | 'fail'

/**
 * Parse `#rgb` / `#rrggbb` into an rgb triple; null for anything else.
 * @param value - candidate color string.
 * @returns the triple or null.
 */
export function hexToRgb(value: string): Rgb | null {
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
 * WCAG relative luminance of an sRGB color (0 for black, 1 for white).
 * @param value - any parseable hex color.
 * @returns luminance in 0..1, or 0 for an unparseable input.
 */
export function relativeLuminance(value: string): number {
  const rgb = hexToRgb(value)
  if (rgb === null) return 0
  const channel = (byte: number): number => {
    const c = byte / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b)
}

/**
 * Contrast ratio between two colors per WCAG 2.1.
 * @param foreground - text/foreground hex.
 * @param background - surface hex.
 * @returns ratio in 1..21 (1 = identical, 21 = black on white).
 */
export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground)
  const l2 = relativeLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Rate a ratio against the WCAG thresholds (normal text: AA 4.5 / AAA 7;
 * large text (≥18.66px bold or 24px regular): AA 3).
 * @param ratio - a contrast ratio.
 * @returns the highest tier the ratio passes.
 */
export function rateContrast(ratio: number): ContrastRating {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA-large'
  return 'fail'
}

/** Human-facing label for a rating (localized by the caller's locale table). */
export const RATING_ORDER: readonly ContrastRating[] = ['AAA', 'AA', 'AA-large', 'fail']

/** One evaluated color pair, ready for the studio UI. */
export interface ContrastCheck {
  /** What the pair represents (localized elsewhere). */
  readonly key: string
  readonly foreground: string
  readonly background: string
  readonly ratio: number
  readonly rating: ContrastRating
}

/**
 * Evaluate the pairs that decide whether a derived theme is readable:
 * brand on each page base, and the primary text ladder on each base.
 * @param colors - the resolved palette colors.
 * @returns one check per pair.
 */
export function evaluatePalette(colors: {
  brand: string
  ink: string
  lightBg: string
  darkBg: string
  darkBrand: string
  darkLabel: string
}): ContrastCheck[] {
  const pairs: Array<[string, string, string]> = [
    ['brand.on.light', colors.brand, colors.lightBg],
    ['text.on.light', colors.ink, colors.lightBg],
    ['brand.on.dark', colors.darkBrand, colors.darkBg],
    ['text.on.dark', colors.darkLabel, colors.darkBg],
  ]
  return pairs.map(([key, fg, bg]) => {
    const ratio = contrastRatio(fg, bg)
    return { key, foreground: fg, background: bg, ratio, rating: rateContrast(ratio) }
  })
}
