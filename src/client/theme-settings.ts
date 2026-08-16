/**
 * Client-half theme settings for the dsh-yizi-themes plugin.
 * Pure types + defaults — the durable schema lives in the host config
 * (`config.ts`); the browser half reads/writes through the settings transport.
 */

/** Built-in preferences accepted at the registry and settings boundaries. */
export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const

/** Settings namespace owned by the theme plugin. */
export const THEME_SETTINGS_NAMESPACE = 'ui-theme'

/** Field carrying the selected built-in theme preference. */
export const THEME_PREFERENCE_FIELD = 'preference'

/** Field carrying the selected style theme id. */
export const THEME_FIELD = 'theme'

/** Field carrying the custom brand configuration. */
export const CUSTOM_BRAND_FIELD = 'customBrand'

/** Id meaning "no style theme": the built-in light/dark token palettes apply. */
export const DEFAULT_THEME = 'default'

/** Theme preference persisted by the product Appearance row. */
export type ThemePreference = typeof THEME_PREFERENCES[number]

/** Default preference when the user-settings document has no override. */
export const DEFAULT_PREFERENCE: ThemePreference = 'system'

/** Custom brand display configuration. */
export interface CustomBrandConfig {
  /** Custom logo SVG markup (raw `<svg>…</svg>` or a data URI); empty uses the built-in fish.
   * Also used as the new-session hero icon. */
  logo: string
  /** Brand wordmark text (default "DEEPSEEK"). */
  wordmark: string
  /** Badge text riding the wordmark plate (default "HARNESS"). */
  wordmarkBadge: string
  /** New-session hero headline text (default "探索未至之境"). */
  headline: string
  /** Brand-string replacement map injected into rendered output. */
  mappings: {
    /** Enable brand-string replacement. */
    enabled: boolean
    /** Replacement for "DeepSeek". */
    deepseek: string
    /** Replacement for "深度求索". */
    deepseekChinese: string
    /** Replacement for "Harness". */
    harness: string
    /** Replacement for "DeepSeek Harness". */
    deepseekHarness: string
  }
}

/** Default custom brand config (empty = built-in defaults apply). */
export const DEFAULT_CUSTOM_BRAND: CustomBrandConfig = {
  logo: '',
  wordmark: 'DEEPSEEK',
  wordmarkBadge: 'HARNESS',
  headline: '探索未至之境',
  mappings: {
    enabled: false,
    deepseek: 'DeepSeek',
    deepseekChinese: '深度求索',
    harness: 'Harness',
    deepseekHarness: 'DeepSeek Harness',
  },
}

/** Durable theme section shared by the Host schema and the browser scope. */
export interface ThemeSettings {
  /** Selected built-in preference. */
  preference: ThemePreference
  /** Selected style theme id (a registered theme or {@link DEFAULT_THEME}). */
  theme: string
  /** Custom brand display configuration. */
  customBrand: CustomBrandConfig
}

/**
 * Narrow one wire or registry value to a persistable preference.
 * @param value - value crossing the settings or registry boundary.
 * @returns whether the value is a built-in preference.
 */
export function isThemePreference(value: unknown): value is ThemePreference {
  return THEME_PREFERENCES.some(preference => preference === value)
}

/**
 * Apply brand mappings to a piece of text. Unchanged when mappings are disabled
 * or no replacement yields a different string.
 * @param settings - Current theme settings (reads customBrand.mappings).
 * @param text - Text to rewrite.
 * @returns the text with every enabled mapping applied.
 */
export function applyBrandMappings(settings: ThemeSettings, text: string): string {
  const { mappings } = settings.customBrand
  if (!mappings.enabled) return text
  let out = text
  const replacements: ReadonlyArray<[string, string]> = [
    ['DeepSeek Harness', mappings.deepseekHarness],
    ['DeepSeek', mappings.deepseek],
    ['深度求索', mappings.deepseekChinese],
    ['Harness', mappings.harness],
  ]
  for (const [from, to] of replacements) {
    if (from !== to) out = out.replaceAll(from, to)
  }
  return out
}
