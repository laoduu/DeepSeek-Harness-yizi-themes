/**
 * Reactive registry of selectable themes: the 19 shipped themes plus the
 * Theme Studio's own themes. One module-level store (same pattern as
 * brand-store) so the Appearance section grid, the header/floating pickers,
 * and the /theme command all read one source of truth and refresh together.
 *
 * LOCALIZATION: the cached snapshot holds theme IDS + swatches, and display
 * text is resolved through a translate function supplied at read time. That
 * keeps the cache free of language state (so a language switch does not
 * invalidate it) and guarantees every surface renders the user's language
 * rather than the Chinese authored text.
 *
 * `all(t)` returns a CACHED array keyed by nothing but the registry revision,
 * so it is safe as a useSyncExternalStore snapshot: the caller passes its
 * bound translate function, and the cache is rebuilt when the registry or the
 * translate function changes.
 */
import { loadCustomThemes, saveCustomThemes, type CustomThemeDoc } from './custom-themes.ts'
import { SHIPPED_THEMES, themeNameKey, themeDescKey } from './themes-list.ts'
import type { ShippedTheme, ThemeDefinition } from './themes-list.ts'

/** Bound translate for the plugin's settings namespace. */
export type Translate = (key: string) => string

/**
 * The translate function currently bound to the UI language.
 *
 * The plugin sets this once at apply time from `ctx.locale.bind(...)`. It is
 * kept here — not only passed around — because the store must be able to
 * resolve display text on its OWN notifications: when the UI language changes,
 * nothing about the theme registry changes, yet every rendered theme name and
 * description becomes stale. `setTranslate` is therefore called on every
 * language change and bumps the revision so `notifyLanguageChange()` can
 * re-render the pickers (which subscribe to this store).
 */
let currentTranslate: Translate | undefined

/**
 * Bind the translate function used when a caller does not pass one explicitly
 * (the header picker and the /theme command read through the store).
 * @param t - bound translate for the `yizi.theme` namespace.
 */
export function setStoreTranslate(t: Translate): void {
  currentTranslate = t
}

/** The translate function the store falls back on. */
function fallbackTranslate(): Translate {
  if (currentTranslate !== undefined) return currentTranslate
  // Before the plugin binds a translator (module import order, tests), show
  // the theme id rather than throwing during render.
  return (key: string) => key
}

/** Persisted custom docs loaded once; a broken store must never break the boot. */
function safeLoadCustomThemes(): CustomThemeDoc[] {
  try {
    return loadCustomThemes()
  } catch (error) {
    console.error('[yizi-themes] custom theme load failed', error)
    return []
  }
}

/** Resolve one shipped theme's display text. */
function resolveShipped(theme: ShippedTheme, t: Translate): ThemeDefinition {
  return {
    id: theme.id,
    colorScheme: theme.colorScheme,
    tokens: {},
    name: t(themeNameKey(theme.id)),
    swatch: [theme.swatch[0], theme.swatch[1]],
    desc: t(themeDescKey(theme.id)),
  }
}

/** Convert a persisted custom document into a grid/picker definition.
 * Custom themes carry their own user-authored name, so no translation applies. */
function toCustomDefinition(doc: CustomThemeDoc): ThemeDefinition {
  return {
    id: doc.id,
    colorScheme: 'light',
    tokens: {},
    name: doc.name,
    swatch: [doc.lightBg, doc.accent],
    desc: '',
  }
}

/**
 * Build an independent themes registry. The plugin uses one module-level
 * instance; tests build their own so assertions never disturb the live store.
 * @param initial - custom documents to start from (defaults to none).
 * @param load - loader for persisted documents (tests pass a stub).
 * @returns the registry handle.
 */
export function createThemesStore(
  initial: readonly CustomThemeDoc[] = [],
  load: () => CustomThemeDoc[] = safeLoadCustomThemes,
): {
  customs: () => CustomThemeDoc[]
  all: (t?: Translate) => ThemeDefinition[]
  revision: () => number
  set: (docs: CustomThemeDoc[]) => void
  notifyLanguageChange: () => void
  subscribe: (listener: () => void) => () => void
} {
  let customThemes: CustomThemeDoc[] = [...initial]
  if (initial.length === 0) {
    try {
      customThemes = load()
    } catch (error) {
      console.error('[yizi-themes] custom theme load failed', error)
      customThemes = []
    }
  }
  const listeners = new Set<() => void>()
  let cached: ThemeDefinition[] | undefined
  let cachedTranslate: Translate | undefined
  let revision = 0

  function emit(): void {
    for (const listener of [...listeners]) listener()
  }

  return {
    customs: () => [...customThemes],
    all(t?: Translate): ThemeDefinition[] {
      const translate = t ?? fallbackTranslate()
      if (cached !== undefined && cachedTranslate === translate) return cached
      cached = [
        ...SHIPPED_THEMES.map((theme) => resolveShipped(theme, translate)),
        ...customThemes.map(toCustomDefinition),
      ]
      cachedTranslate = translate
      return cached
    },
    revision: () => revision,
    set(docs: CustomThemeDoc[]): void {
      customThemes = [...docs]
      cached = undefined
      cachedTranslate = undefined
      revision += 1
      saveCustomThemes(customThemes)
      emit()
    },
    notifyLanguageChange(): void {
      cached = undefined
      cachedTranslate = undefined
      revision += 1
      emit()
    },
    subscribe(listener: () => void): () => void {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
  }
}

/** The shared themes registry the plugin uses. */
export const themesStore = createThemesStore()
