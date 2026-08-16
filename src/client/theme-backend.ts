/**
 * Style-theme backend: the orthogonal "style theme" dimension (selectable
 * theme ids like aurora / violet, persisted, applied as `body.theme-<id>`)
 * is NOT part of the stock Harness source — it exists only in builds that
 * carry it (the old v1 patch, or a fork). The npm-published rc.5 and clean
 * checkouts lack setThemeId entirely, so the plugin implements the dimension
 * itself and uses the core when it is available:
 *
 *   - core path (runtime.setThemeId exists): read/write the theme id through
 *     the core (persists to settings.yaml; the core presenter applies
 *     `body.theme-<id>`), and notify through the core's `theme/change`;
 *   - plugin path: persist in localStorage, apply `body.theme-<id>` directly,
 *     notify via a local emitter (the core never learns about theme ids).
 *     Light/dark still flows through the core's preference in both paths.
 *
 * The injected face (`getTheme` / `setThemeId` / `subscribe`) is identical on
 * both paths, so the header controls and the settings row are backend-agnostic.
 */
import type { Context } from '@deepseek-ai/cordis'
import type { ThemeRuntime } from '@deepseek-ai/dsh-client-ui-theme/client'

/** The theme face consumed by the plugin's pickers and settings row. */
export interface ThemeFace {
  preference: string
  theme: string
  active: { id: string }
}

/** Unified style-theme backend handle. */
export interface ThemeBackend {
  /** Whether the core itself provides setThemeId (settings.yaml persistence). */
  readonly coreThemeApi: boolean
  /** Read the current theme id (core field, or localStorage on plugin path). */
  readThemeId(): string
  /** Current face: preference from the core, theme from the backend. */
  getTheme(): ThemeFace
  /** Select a theme id (core write, or localStorage + body class + notify). */
  setThemeId(id: string): void
  /** Subscribe to theme changes (core `theme/change` + local emitter). */
  subscribe(listener: () => void): () => void
  /** Plugin path only: re-assert `body.theme-<id>` after DOM churn. */
  reassert(): void
}

const THEME_STORAGE_KEY = 'dsh-yizi-themes:themeId'

/** Build the backend for one plugin fiber. */
export function createThemeBackend(runtime: ThemeRuntime, ctx: Context): ThemeBackend {
  const coreThemeApi = typeof (runtime as ThemeRuntime).setThemeId === 'function'
  const listeners = new Set<() => void>()
  const emit = (): void => { for (const l of [...listeners]) l() }

  const readThemeId = (): string => {
    if (coreThemeApi) {
      const s = runtime.getTheme()
      return typeof s.theme === 'string' ? s.theme : 'default'
    }
    try { return localStorage.getItem(THEME_STORAGE_KEY) ?? 'default' } catch { return 'default' }
  }

  /** Apply `body.theme-<id>` ourselves (plugin path; the core presenter never does). */
  const applyThemeClass = (id: string): void => {
    const body = document.body
    if (body === null) return // not booted yet; the observer reasserts later
    for (const cls of [...body.classList]) {
      if (cls.startsWith('theme-')) body.classList.remove(cls)
    }
    if (id !== '' && id !== 'default') body.classList.add(`theme-${id}`)
  }

  // Stable identity between real changes (useSyncExternalStore needs a cached
  // snapshot; the core's own snapshot is frozen, ours is rebuilt on change).
  let cached: ThemeFace | undefined
  const getTheme = (): ThemeFace => {
    const s = runtime.getTheme()
    const theme = readThemeId()
    if (cached !== undefined && cached.preference === s.preference && cached.theme === theme) {
      return cached
    }
    cached = { preference: s.preference, theme, active: { id: theme } }
    return cached
  }

  const setThemeId = (id: string): void => {
    if (coreThemeApi) {
      runtime.setThemeId(id)
      return
    }
    try { localStorage.setItem(THEME_STORAGE_KEY, id) } catch { /* private mode */ }
    applyThemeClass(id)
    emit()
  }

  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener)
    const off = ctx.on('theme/change', listener)
    return () => { listeners.delete(listener); off() }
  }

  return {
    coreThemeApi,
    readThemeId,
    getTheme,
    setThemeId,
    subscribe,
    reassert: () => { if (!coreThemeApi) applyThemeClass(readThemeId()) },
  }
}
