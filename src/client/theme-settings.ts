/**
 * Client-half theme settings for the dsh-yizi-themes plugin: pure types and
 * defaults. The durable side of the custom brand is browser-local
 * (`brand-persistence.ts`); light/dark/system comes from the core theme
 * service, and the style-theme id from the plugin's own theme backend.
 */

/** Built-in preferences accepted at the registry and settings boundaries. */
export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const

/** Id meaning "no style theme": the built-in light/dark token palettes apply. */
export const DEFAULT_THEME = 'default'

/** Theme preference persisted by the product Appearance row. */
export type ThemePreference = typeof THEME_PREFERENCES[number]

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
