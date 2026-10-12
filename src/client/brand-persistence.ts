/**
 * Browser-local persistence for the custom-brand configuration.
 *
 * Why localStorage rather than the Harness settings transport: the browser half
 * can only read/write settings namespaces the Host actually serves, and the
 * core `ui-theme` schema that older builds let us piggyback on (`customBrand`)
 * no longer exists. A plugin-owned browser-local document is therefore the
 * stable seam — the same one the style-theme id already uses — and it survives
 * Harness reorganizations of the settings API.
 */
import { DEFAULT_CUSTOM_BRAND, type CustomBrandConfig } from './theme-settings.ts'

/** localStorage key holding the persisted custom brand document. */
export const BRAND_STORAGE_KEY = 'dsh-yizi-themes:brand'

/**
 * Narrow unknown stored JSON to a display string, falling back on the default.
 * @param value - candidate value from storage.
 * @param fallback - default when the value is not a string.
 * @returns the stored string or the fallback.
 */
function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback
}

/**
 * Narrow unknown stored JSON to a boolean, falling back on the default.
 * @param value - candidate value from storage.
 * @param fallback - default when the value is not a boolean.
 * @returns the stored boolean or the fallback.
 */
function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

/**
 * Fold arbitrary persisted JSON into a complete, well-typed brand config.
 * Older documents may miss fields or carry wrong types; every gap falls back
 * to the default so a stale document can never break the render path.
 * @param raw - parsed storage value.
 * @returns a complete custom-brand configuration.
 */
export function normalizeBrand(raw: unknown): CustomBrandConfig {
  const defaults = DEFAULT_CUSTOM_BRAND
  if (typeof raw !== 'object' || raw === null) return defaults
  const source = raw as Partial<CustomBrandConfig>
  const mappings = (typeof source.mappings === 'object' && source.mappings !== null
    ? source.mappings
    : {}) as Partial<CustomBrandConfig['mappings']>
  return {
    logo: asString(source.logo, defaults.logo),
    wordmark: asString(source.wordmark, defaults.wordmark),
    wordmarkBadge: asString(source.wordmarkBadge, defaults.wordmarkBadge),
    headline: asString(source.headline, defaults.headline),
    mappings: {
      enabled: asBoolean(mappings.enabled, defaults.mappings.enabled),
      deepseek: asString(mappings.deepseek, defaults.mappings.deepseek),
      deepseekChinese: asString(mappings.deepseekChinese, defaults.mappings.deepseekChinese),
      harness: asString(mappings.harness, defaults.mappings.harness),
      deepseekHarness: asString(mappings.deepseekHarness, defaults.mappings.deepseekHarness),
    },
  }
}

/**
 * Read the persisted custom brand; defaults when nothing is stored, storage is
 * unavailable (private mode), or the document is corrupt.
 * @returns the brand configuration to render with.
 */
export function loadBrand(): CustomBrandConfig {
  try {
    const raw = localStorage.getItem(BRAND_STORAGE_KEY)
    if (raw === null) return DEFAULT_CUSTOM_BRAND
    return normalizeBrand(JSON.parse(raw))
  } catch {
    return DEFAULT_CUSTOM_BRAND
  }
}

/**
 * Persist the custom brand. Storage failures (quota, private mode) are
 * swallowed: the in-memory configuration stays live for the current page.
 * @param config - the configuration to store.
 */
export function saveBrand(config: CustomBrandConfig): void {
  try {
    localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(config))
  } catch { /* storage unavailable; keep the in-memory config */ }
}
