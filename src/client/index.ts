/**
 * dsh-yizi-themes — browser (client) half.
 *
 * Replaces the core AppearanceRow with our own (theme grid + custom brand +
 * prompt mappings), injects the style-theme override sheets and the row
 * stylesheet, and wires up output-time brand-text replacement on assistant
 * messages.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { Context } from '@deepseek-ai/cordis'
import type { ThemeRuntime } from '@deepseek-ai/dsh-client-ui-theme/client'
import { AppearanceRow } from './AppearanceRow.tsx'
import type { AppearanceRowInjected } from './AppearanceRow.tsx'
import { createAppearanceRowStore } from './settings-store.ts'
import { THEMES } from './themes-list.ts'
import { THEME_SETTINGS_NAMESPACE, type CustomBrandConfig, type ThemeSettings } from './theme-settings.ts'
import { zh, en, type ThemeKey } from './locales.ts'
import * as themeCss from './themes.ts'
import rowStyles from './styles.ts'
import brandOverrideCss from './brand-overrides.ts'
import { HeaderControls } from './HeaderControls.tsx'
import type { HeaderControlsProps } from './HeaderControls.tsx'
import { mountFloatingControls } from './FloatingControls.tsx'
import { createThemeBackend } from './theme-backend.ts'
import { applyBrand } from './brand-apply.ts'

/** Plugin identity. */
export const name = 'dsh-yizi-themes'

/** Depends on the core ui-theme service (ctx.theme) and settings transport. */
export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope', 'theme']

/** Namespace owning this feature's settings-row copy. */
export const SETTINGS_NS = 'yizi.theme'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'yizi.theme': ThemeKey
  }
}

/** Inject all style sheets as a single <style> tag (theme + row + brand overrides). */
function injectThemeSheets(): void {
  const id = 'dsw-yizi-themes-sheets'
  if (document.getElementById(id)) return
  const style = document.createElement('style')
  style.id = id
  const css = Object.values(themeCss).join('\n') + '\n' + rowStyles + '\n' + brandOverrideCss
  style.textContent = css
  document.head.append(style)
}

/** Read the core theme state (preference + theme) from ctx.theme. */
function readCoreTheme(ctx: Context): { preference: ThemeSettings['preference']; theme: string } {
  const runtime = ctx.get('theme') as ThemeRuntime | undefined
  if (runtime === undefined) return { preference: 'system', theme: 'default' }
  const snapshot = runtime.getTheme()
  // Older Harness builds (e.g. the npm-published rc.5) have no style-theme
  // dimension: the snapshot lacks `theme`. Treat it as the default.
  const theme = typeof snapshot.theme === 'string' ? snapshot.theme : 'default'
  return { preference: snapshot.preference, theme }
}

/** Apply brand mappings to every text node under a root element. */
function replaceBrandInNode(root: ParentNode, mappings: CustomBrandConfig['mappings']): void {
  if (!mappings.enabled) return
  const replacements: ReadonlyArray<[string, string]> = [
    ['DeepSeek Harness', mappings.deepseekHarness],
    ['DeepSeek', mappings.deepseek],
    ['深度求索', mappings.deepseekChinese],
    ['Harness', mappings.harness],
  ]
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
  const textNodes: Text[] = []
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text)
  for (const node of textNodes) {
    let text = node.textContent ?? ''
    let changed = false
    for (const [from, to] of replacements) {
      if (from !== to && text.includes(from)) {
        text = text.replaceAll(from, to)
        changed = true
      }
    }
    if (changed) node.textContent = text
  }
}

/** Observe assistant message containers and replace brand strings in real time. */
function observeBrandReplacement(
  getMappings: () => CustomBrandConfig['mappings'],
  apply?: () => void,
): () => void {
  const observer = new MutationObserver((mutations) => {
    // Re-apply the DOM brand (sidebar / hero) whenever the tree changes —
    // idempotent, so React remounts converge back to the custom brand.
    apply?.()
    const mappings = getMappings()
    if (!mappings.enabled) return
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement) replaceBrandInNode(node, mappings)
      }
      if (mutation.type === 'characterData' && mutation.target.parentElement) {
        replaceBrandInNode(mutation.target.parentElement, mappings)
      }
    }
  })
  observer.observe(document.body, { childList: true, subtree: true, characterData: true })
  return () => observer.disconnect()
}

/** Build the AppearanceRow's injected face from core ctx + plugin settings. */
function buildInjected(
  ctx: ClientContext,
  settings: CustomBrandConfig,
  setSettings: (patch: Partial<CustomBrandConfig>) => void,
  writeThemeId: (id: string) => void,
): AppearanceRowInjected {
  return {
    setThemeId: (id) => { writeThemeId(id) },
    setCustomBrand: (patch) => { setSettings(patch) },
  }
}

export function apply(ctx: ClientContext): void {
  // ── Inject all style sheets ────────────────────────────────────────────
  injectThemeSheets()

  const runtime = ctx.theme as ThemeRuntime

  // ── Style-theme backend ─────────────────────────────────────────────────
  // Stock Harness lacks the orthogonal style-theme dimension; the backend
  // uses the core's setThemeId when present (settings.yaml persistence) and
  // otherwise implements it itself (localStorage + body.theme-<id> class).
  const themeBackend = createThemeBackend(runtime, ctx)
  // Restore the persisted theme on boot (plugin path only).
  themeBackend.reassert()

  // ── Register session-header controls (theme picker + mode toggle) ──────
  // The utilities list renders at the right edge of the session header title
  // row; order 10 places them AFTER the session-log export button (order 0),
  // i.e. at the far top-right of the page.
  const headerFace = (): HeaderControlsProps => ({
    getTheme: () => themeBackend.getTheme(),
    setPreference: (id: 'light' | 'dark' | 'system') => { runtime.setTheme(id) },
    setThemeId: (id: string) => { themeBackend.setThemeId(id) },
    subscribe: (listener: () => void) => themeBackend.subscribe(listener),
  })
  ctx.slots.inject(
    'conversation.session.header.utilities',
    () => ctx.slots.register({
      name: 'conversation.session.header.utilities',
      id: 'yizi-header-controls',
      order: 10,
      locale: SETTINGS_NS,
      inject: headerFace,
    }, HeaderControls),
  )

  // ── Floating controls for the blank / new-session state ────────────────
  // The session header (and with it the slot controls) is hidden while a
  // session is blank; mount the same controls fixed at the top right, shown
  // only while the hero is present and hidden once a session header exists.
  const floating = mountFloatingControls(headerFace())
  ctx.effect(() => () => floating.dispose(), 'dsh-yizi-themes: floating controls')

  // ── Self-register any shipped themes the core registry lacks ───────────
  // Only relevant on cores that HAVE the style-theme API (coreThemeApi): a
  // core that gained setThemeId but dropped the built-in list still gets our
  // 19 registered, so setThemeId validation and the theme grid always see
  // every shipped id. The plugin path needs no registration.
  if (themeBackend.coreThemeApi && typeof (runtime as ThemeRuntime).register === 'function') {
    const existing = new Set(runtime.getTheme().themes.map(t => t.id))
    for (const theme of THEMES) {
      if (existing.has(theme.id)) continue
      runtime.register({
        id: theme.id,
        colorScheme: theme.colorScheme,
        tokens: {},
        name: theme.name,
        swatch: theme.swatch,
        desc: theme.desc,
      })
    }
  }

  // ── Custom-brand settings transport ────────────────────────────────────
  // The api-proxy exposes only allowlisted namespaces to the browser (adding
  // a settings registration alone never makes it remotely writable), so the
  // row persists custom-brand edits through the CORE 'ui-theme' namespace —
  // its schema already carries a customBrand field. The decode narrows the
  // full section {preference, theme, customBrand} to the brand part.
  let customBrand: CustomBrandConfig = {
    logo: '', wordmark: 'DEEPSEEK', wordmarkBadge: 'HARNESS',
    headline: '探索未至之境',
    mappings: {
      enabled: false, deepseek: 'DeepSeek', deepseekChinese: '深度求索',
      harness: 'Harness', deepseekHarness: 'DeepSeek Harness',
    },
  }
  const settingsScope = ctx.settingsScope.bind<CustomBrandConfig>({
    namespace: THEME_SETTINGS_NAMESPACE,
    decode: (section: unknown): CustomBrandConfig | undefined => {
      if (typeof section !== 'object' || section === null) return undefined
      const custom = (section as { customBrand?: unknown }).customBrand
      if (typeof custom !== 'object' || custom === null) return undefined
      return custom as CustomBrandConfig
    },
  })
  const readSettings = (): CustomBrandConfig => {
    const section = settingsScope.getSnapshot().value
    if (section === undefined) return customBrand
    return section
  }
  const setCustomBrand = (patch: Partial<CustomBrandConfig>) => {
    customBrand = {
      ...customBrand,
      ...patch,
      mappings: { ...customBrand.mappings, ...(patch.mappings ?? {}) },
    }
    // Push the edit into the row store immediately so the controlled inputs
    // re-render with the new value instead of snapping back (the store is the
    // row's only data source and only syncs on theme/change otherwise).
    push(customBrand)
    // Apply the brand to the sidebar/hero DOM live.
    applyBrand(customBrand)
    // One path write of the whole customBrand object per edit (rather than
    // one RPC per field) keeps the revision-fenced write narrow.
    void settingsScope.set('customBrand', customBrand)
  }
  ctx.effect(() => settingsScope.subscribe(() => {
    // Adopt the server-confirmed section (initial load and after each write)
    // and mirror it into the row store so persisted values render.
    customBrand = readSettings()
    push(customBrand)
    applyBrand(customBrand)
  }), 'dsh-yizi-themes: custom-brand settings adoption')

  // ── Register our AppearanceRow as an ADDITIONAL general item ───────────
  // Uses a distinct id (not 'appearance') so it coexists with the core row
  // instead of colliding; renders the theme grid + custom-brand block.
  const store = createAppearanceRowStore()
  let bound: ReturnType<typeof store['create']>['actions'] | undefined
  let syncSeq = 0
  /** Mirror one settings snapshot into the row store (bumped seq skips staleness). */
  const push = (settings: CustomBrandConfig): void => {
    const core = readCoreTheme(ctx)
    // Theme id comes from the style-theme backend (core field or localStorage),
    // so the grid highlight matches reality on every Harness build.
    bound?.sync(core.preference, themeBackend.readThemeId(), THEMES, settings, ++syncSeq)
  }
  const sync = (): void => {
    push(readSettings())
  }
  // Re-sync on both core theme/change (preference, core-path theme id) and
  // local emitter changes (plugin-path theme id).
  ctx.effect(() => themeBackend.subscribe(sync), 'dsh-yizi-themes: theme state adoption')
  ctx.effect(() => ctx.locale.register(SETTINGS_NS, { zh, en }), 'dsh-yizi-themes: row dictionaries')

  const injected = (actions: ReturnType<typeof store['create']>['actions']): AppearanceRowInjected => {
    bound = actions
    sync()
    return buildInjected(ctx, readSettings(), setCustomBrand, (id) => themeBackend.setThemeId(id))
  }
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'yizi-appearance',
    order: 20,
    store,
    locale: SETTINGS_NS,
    inject: injected,
  }, AppearanceRow))

  // ── Output-time brand-text replacement + DOM brand application ─────────
  ctx.effect(() => observeBrandReplacement(
    () => readSettings().mappings,
    () => {
      applyBrand(readSettings())
      // Plugin-path themes re-assert the body class after any DOM churn.
      themeBackend.reassert()
      // Show the floating controls only while the hero (blank session) is up.
      floating.sync()
    },
  ), 'dsh-yizi-themes: brand replacement observer')
}


