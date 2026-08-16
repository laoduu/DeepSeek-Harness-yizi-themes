/**
 * dsh-yizi-themes plugin configuration (shared between host and browser halves).
 * Users override these through cordis.yml on the plugin row. The `Config`
 * type documents the shape; no runtime Schema is exported so the plugin stays
 * free of the private @deepseek-ai/schemastery fork.
 */

export interface Config {
  /** Brand wordmark text (default "DEEPSEEK"). */
  wordmark: string
  /** Badge text riding the wordmark plate (default "HARNESS"). */
  wordmarkBadge: string
  /** New-session hero headline text (default "探索未至之境"). */
  headline: string
  /** Enable brand-string replacement in prompts. */
  mappingEnabled: boolean
  /** Replacement for "DeepSeek". */
  mappingDeepSeek: string
  /** Replacement for "深度求索". */
  mappingDeepSeekChinese: string
  /** Replacement for "Harness". */
  mappingHarness: string
  /** Replacement for "DeepSeek Harness". */
  mappingDeepSeekHarness: string
}

/**
 * Apply brand mappings to a piece of text. Unchanged when mappings are disabled.
 */
export function applyBrandMappings(config: Config, text: string): string {
  if (!config.mappingEnabled) return text
  let out = text
  const replacements: ReadonlyArray<[string, string]> = [
    ['DeepSeek Harness', config.mappingDeepSeekHarness],
    ['DeepSeek', config.mappingDeepSeek],
    ['深度求索', config.mappingDeepSeekChinese],
    ['Harness', config.mappingHarness],
  ]
  for (const [from, to] of replacements) {
    if (from !== to) out = out.replaceAll(from, to)
  }
  return out
}
