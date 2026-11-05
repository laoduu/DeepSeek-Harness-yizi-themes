/**
 * The 19 shipped style themes: id, scheme, swatch, and the LOCALE KEYS that
 * name and describe them.
 *
 * Display text deliberately lives in the `yizi.theme` dictionaries, not here.
 * Every visible string the plugin renders goes through `t(...)`, so a theme
 * must too — otherwise the theme grid would stay Chinese while the rest of
 * the surface follows the user's language. Each entry therefore carries
 * `nameKey` / `descKey` (`theme.<id>.name` / `theme.<id>.desc`); the callers
 * resolve them with the bound translate function, and `Record<ThemeKey, string>`
 * keeps every language complete at compile time.
 *
 * `ThemeDefinition` still carries concrete `name` / `desc` strings because the
 * ThemeDefinition shape comes from the CORE theme service (a registered theme
 * is a core-facing record). The plugin fills those with the resolved text at
 * the point of registration; the grid, the pickers and /theme all render from
 * the keys.
 */

/** One selectable style theme: id, scheme, swatch, and its locale keys. */
export interface ThemeDefinition {
  id: string
  colorScheme: 'light' | 'dark'
  tokens: Record<string, string>
  name: string
  swatch: [string, string]
  desc: string
}

/** A shipped theme as authored here: no display strings, only locale keys. */
export interface ShippedTheme {
  readonly id: string
  readonly colorScheme: 'light' | 'dark'
  readonly swatch: readonly [string, string]
  /** Locale key holding the display name. */
  readonly nameKey: string
  /** Locale key holding the one-line description. */
  readonly descKey: string
}

/** All 19 shipped themes, ported from YiziMarkdown's design language. */
export const SHIPPED_THEMES: readonly ShippedTheme[] = Object.freeze([
  { id: 'academic', colorScheme: 'light', swatch: ['#f5f8ff', '#002fa7'], nameKey: 'theme.academic.name', descKey: 'theme.academic.desc' },
  { id: 'aurora', colorScheme: 'light', swatch: ['#eef4fb', '#4a90d9'], nameKey: 'theme.aurora.name', descKey: 'theme.aurora.desc' },
  { id: 'cyberpunk', colorScheme: 'light', swatch: ['#f0f4f8', '#0077b6'], nameKey: 'theme.cyberpunk.name', descKey: 'theme.cyberpunk.desc' },
  { id: 'facebook', colorScheme: 'light', swatch: ['#f0f2f5', '#1877f2'], nameKey: 'theme.facebook.name', descKey: 'theme.facebook.desc' },
  { id: 'liquidglass', colorScheme: 'light', swatch: ['#f4f8ff', '#2563eb'], nameKey: 'theme.liquidglass.name', descKey: 'theme.liquidglass.desc' },
  { id: 'lychee', colorScheme: 'light', swatch: ['#fff5f5', '#e63946'], nameKey: 'theme.lychee.name', descKey: 'theme.lychee.desc' },
  { id: 'magazine', colorScheme: 'light', swatch: ['#fdf6ec', '#8b4513'], nameKey: 'theme.magazine.name', descKey: 'theme.magazine.desc' },
  { id: 'matrix', colorScheme: 'light', swatch: ['#f5faf5', '#008a2e'], nameKey: 'theme.matrix.name', descKey: 'theme.matrix.desc' },
  { id: 'minimal', colorScheme: 'light', swatch: ['#ffffff', '#0066cc'], nameKey: 'theme.minimal.name', descKey: 'theme.minimal.desc' },
  { id: 'mint', colorScheme: 'light', swatch: ['#f5fbf8', '#10b981'], nameKey: 'theme.mint.name', descKey: 'theme.mint.desc' },
  { id: 'morandi', colorScheme: 'light', swatch: ['#f7f3ef', '#b8927a'], nameKey: 'theme.morandi.name', descKey: 'theme.morandi.desc' },
  { id: 'nature', colorScheme: 'light', swatch: ['#f5f2eb', '#4a7c59'], nameKey: 'theme.nature.name', descKey: 'theme.nature.desc' },
  { id: 'palace', colorScheme: 'light', swatch: ['#faf6f0', '#b5372a'], nameKey: 'theme.palace.name', descKey: 'theme.palace.desc' },
  { id: 'sunset', colorScheme: 'light', swatch: ['#fef8f0', '#b45309'], nameKey: 'theme.sunset.name', descKey: 'theme.sunset.desc' },
  { id: 'tech', colorScheme: 'light', swatch: ['#f0f4f8', '#2b6cb0'], nameKey: 'theme.tech.name', descKey: 'theme.tech.desc' },
  { id: 'typewriter', colorScheme: 'light', swatch: ['#f5f0e8', '#8b6914'], nameKey: 'theme.typewriter.name', descKey: 'theme.typewriter.desc' },
  { id: 'vaporwave', colorScheme: 'light', swatch: ['#f8f0f6', '#ff6ec7'], nameKey: 'theme.vaporwave.name', descKey: 'theme.vaporwave.desc' },
  { id: 'vibrant', colorScheme: 'light', swatch: ['#fff8f0', '#f3641e'], nameKey: 'theme.vibrant.name', descKey: 'theme.vibrant.desc' },
  { id: 'violet', colorScheme: 'light', swatch: ['#faf5fe', '#7209b7'], nameKey: 'theme.violet.name', descKey: 'theme.violet.desc' },
] as const)

/** Ids of every shipped theme (frozen lookup used by the theme backend). */
export const SHIPPED_THEME_IDS: ReadonlySet<string> = new Set(SHIPPED_THEMES.map((theme) => theme.id))

/**
 * Locale key for a shipped theme's display name.
 * @param id - theme id.
 * @returns the dictionary key.
 */
export function themeNameKey(id: string): string {
  return `theme.${id}.name`
}

/**
 * Locale key for a shipped theme's one-line description.
 * @param id - theme id.
 * @returns the dictionary key.
 */
export function themeDescKey(id: string): string {
  return `theme.${id}.desc`
}

/**
 * Build the core-facing theme record for one shipped theme, resolving its
 * display text through the caller's translate function.
 * @param theme - the shipped theme.
 * @param t - bound translate for the `yizi.theme` namespace.
 * @returns a ThemeDefinition carrying resolved text.
 */
export function toThemeDefinition(theme: ShippedTheme, t: (key: string) => string): ThemeDefinition {
  return {
    id: theme.id,
    colorScheme: theme.colorScheme,
    tokens: {},
    name: t(theme.nameKey),
    swatch: [theme.swatch[0], theme.swatch[1]],
    desc: t(theme.descKey),
  }
}

/** The 19 shipped themes without display text (kept for id-only consumers). */
export const THEMES: readonly ThemeDefinition[] = Object.freeze(
  SHIPPED_THEMES.map((theme) => ({
    id: theme.id,
    colorScheme: theme.colorScheme,
    tokens: {},
    // Fallback text: the Chinese dictionary is the source of truth for the
    // authored wording, so an unresolved id still reads as a theme name
    // rather than a blank cell. Callers that have a translate function
    // should use toThemeDefinition instead.
    name: theme.id,
    swatch: [theme.swatch[0], theme.swatch[1]] as [string, string],
    desc: '',
  })),
)
