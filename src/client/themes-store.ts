/**
 * Reactive registry of selectable themes: the 19 shipped definitions plus the
 * Theme Studio's custom themes. One module-level store (same pattern as
 * brand-store) so the Appearance row grid, the header/floating pickers, and
 * the /theme command all read one source of truth and refresh together.
 *
 * `all()` returns a CACHED array (rebuilt only on set) so it is safe as a
 * useSyncExternalStore snapshot.
 */
import { loadCustomThemes, saveCustomThemes, type CustomThemeDoc } from './custom-themes.ts'
import { THEMES } from './themes-list.ts'
import type { ThemeDefinition } from './themes-list.ts'

/** Convert a persisted custom document into a grid/picker definition. */
function toDefinition(doc: CustomThemeDoc): ThemeDefinition {
  return {
    id: doc.id,
    colorScheme: 'light',
    tokens: {},
    name: doc.name,
    swatch: [doc.lightBg, doc.accent],
    desc: '',
  }
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

let customThemes: CustomThemeDoc[] = safeLoadCustomThemes()
let cache: ThemeDefinition[] = [...THEMES, ...customThemes.map(toDefinition)]
const listeners = new Set<() => void>()

function emit(): void {
  for (const listener of [...listeners]) listener()
}

/** The shared themes registry. */
export const themesStore = {
  /** The persisted custom documents (a mutable copy; call set() to publish). */
  customs(): CustomThemeDoc[] {
    return [...customThemes]
  },
  /** Every selectable theme: shipped first, customs after (cached snapshot). */
  all(): ThemeDefinition[] {
    return cache
  },
  /** Replace the custom set, persist it, rebuild the snapshot, and notify. */
  set(docs: CustomThemeDoc[]): void {
    customThemes = [...docs]
    cache = [...THEMES, ...customThemes.map(toDefinition)]
    saveCustomThemes(customThemes)
    emit()
  },
  /** Subscribe to registry changes; returns an unsubscribe function. */
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },
}
