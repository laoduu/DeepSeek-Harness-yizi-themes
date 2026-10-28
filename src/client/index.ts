/**
 * dsh-yizi-themes — browser (client) half.
 *
 * Replaces the core AppearanceRow with our own (theme grid + custom brand +
 * prompt mappings), injects the style-theme override sheets and the row
 * stylesheet, and wires up output-time brand-text replacement on assistant
 * messages.
 */
import type { Context } from '@deepseek-ai/cordis'
import type { ThemeRuntime } from '@deepseek-ai/dsh-client-ui-theme/client'
import { AppearanceRow } from './AppearanceRow.tsx'
import type { AppearanceRowInjected } from './AppearanceRow.tsx'
import { createAppearanceRowStore } from './settings-store.ts'
import { THEMES } from './themes-list.ts'
import type { CustomBrandConfig, ThemePreference } from './theme-settings.ts'
import { loadBrand, saveBrand } from './brand-persistence.ts'
import { zh, en, type ThemeKey } from './locales.ts'
import * as themeCss from './themes.ts'
import rowStyles from './styles.ts'
import brandOverrideCss from './brand-overrides.ts'
import { HeaderControls } from './HeaderControls.tsx'
import type { HeaderControlsProps } from './HeaderControls.tsx'
import { mountFloatingControls } from './FloatingControls.tsx'
import { createThemeBackend } from './theme-backend.ts'
import type { ThemeBackend } from './theme-backend.ts'
import { applyBrand } from './brand-apply.ts'
import { registerBrandSlots } from './brand-slots.tsx'
import { brandStore } from './brand-store.ts'
import { registerThemeCommand } from './theme-commands.ts'
import { runDoctorChecks } from './doctor.tsx'
import type { DoctorReport } from './doctor.tsx'

/** Plugin identity. */
export const name = 'dsh-yizi-themes'

/**
 * Required client services: slots/locale for the settings row and the header
 * controls, and the core ui-theme service (`ctx.theme`) for light/dark/system.
 * No settings-transport service is required — the custom brand lives in
 * localStorage (see brand-persistence.ts).
 */
export const inject = ['slots', 'locale', 'theme']

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

/** Read the core theme state (preference + optional style-theme id) from ctx.theme. */
function readCoreTheme(ctx: Context): { preference: ThemePreference; theme: string } {
  const runtime = ctx.get('theme') as ThemeRuntime | undefined
  if (runtime === undefined) return { preference: 'system', theme: 'default' }
  const snapshot = runtime.getTheme() as { preference?: ThemePreference; theme?: unknown }
  // Newer Harness builds dropped the style-theme dimension from the core
  // theme snapshot (the style theme is the plugin's own backend), so `theme`
  // is absent there and the plugin path owns the id.
  const theme = typeof snapshot.theme === 'string' ? snapshot.theme : 'default'
  return { preference: snapshot.preference ?? 'system', theme }
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
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    // NEVER rewrite text the user is typing: anything inside an input,
    // textarea, or contenteditable (the composer, settings fields) is left
    // exactly as authored.
    const parent = node.parentElement
    if (parent !== null && parent.closest('input, textarea, [contenteditable="true"], [contenteditable=""]')) {
      continue
    }
    textNodes.push(node)
  }
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
  // DOM mutations arrive in bursts (streaming tokens, React commits), and the
  // brand re-apply is idempotent — so coalesce it to one call per frame
  // instead of one per mutation. Per-node TEXT replacement stays immediate so
  // streamed output is rewritten as it lands.
  let frame = 0
  const scheduleApply = (): void => {
    if (apply === undefined || frame !== 0) return
    frame = requestAnimationFrame(() => {
      frame = 0
      apply()
    })
  }
  const observer = new MutationObserver((mutations) => {
    // Re-apply the DOM brand (sidebar / hero) whenever the tree changes —
    // idempotent, so React remounts converge back to the custom brand.
    scheduleApply()
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
  return () => {
    observer.disconnect()
    if (frame !== 0) {
      cancelAnimationFrame(frame)
      frame = 0
    }
  }
}

/** Build the AppearanceRow's injected face from core ctx + plugin settings. */
function buildInjected(
  ctx: Context,
  settings: CustomBrandConfig,
  setSettings: (patch: Partial<CustomBrandConfig>) => void,
  writeThemeId: (id: string) => void,
  runDoctor: () => DoctorReport,
): AppearanceRowInjected {
  return {
    setThemeId: (id) => { writeThemeId(id) },
    setCustomBrand: (patch) => { setSettings(patch) },
    runDoctor,
  }
}

export function apply(ctx: Context): void {
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

  // ── /theme slash command (official ui-commands surface) ────────────────
  // Registered as a popupSelect contribution: both style themes and the
  // light/dark preference, searchable, current values pre-highlighted. On a
  // core without the commandUi service the inner fiber stays PENDING and the
  // plugin activates without the command — no crash path.
  const t = ctx.locale.bind(SETTINGS_NS)
  registerThemeCommand(ctx, {
    backend: themeBackend,
    preference: () => {
      try { return runtime.getTheme().preference ?? 'system' } catch { return 'system' }
    },
    setPreference: (preference) => { runtime.setTheme(preference) },
    translate: (key) => t(key as ThemeKey),
  })

  // ── Doctor self-check inputs (used by the Appearance row's diagnostics) ─
  const runDoctor = (): DoctorReport => runDoctorChecks({
    themeId: () => themeBackend.readThemeId(),
    coreThemeApi: themeBackend.coreThemeApi,
    preference: () => {
      try { return runtime.getTheme().preference ?? 'system' } catch { return 'system' }
    },
    commandUiAvailable: () => (ctx as unknown as { get(name: string): unknown }).get('commandUi') !== undefined,
    translate: (key) => t(key as ThemeKey),
  })

  // ── Brand slots (rc.8+): render the custom brand through the official
  // brand seats instead of DOM surgery ─────────────────────────────────────
  // `sidebar.brand.mark` / `sidebar.brand.name` / `conversation.hero.brand.mark`
  // are the designed deployment-branding surface, so this path is stable
  // across Harness upgrades. On cores without those slots the inject callbacks
  // never fire and the legacy DOM path (brand-apply.ts) stays active.
  ctx.effect(() => registerBrandSlots(ctx.slots), 'dsh-yizi-themes: brand slots')

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

  // ── Custom-brand configuration (browser-local) ─────────────────────────
  // The brand document lives in localStorage next to the style-theme id. The
  // Harness settings transport serves only namespaces the Host composes, and
  // the core `ui-theme` schema this plugin used to write through no longer
  // carries a `customBrand` field, so a plugin-owned browser-local document is
  // the stable seam across Harness reorganizations of the settings API.
  let customBrand: CustomBrandConfig = loadBrand()
  // Seed the reactive brand store so the slot occupants render immediately.
  brandStore.set(customBrand)
  const setCustomBrand = (patch: Partial<CustomBrandConfig>) => {
    customBrand = {
      ...customBrand,
      ...patch,
      mappings: { ...customBrand.mappings, ...(patch.mappings ?? {}) },
    }
    // Persist synchronously: one whole-document write per edit, so a reload
    // keeps the edit and no async echo can fight IME composition.
    saveBrand(customBrand)
    // Push the edit into the row store immediately so the controlled inputs
    // re-render with the new value instead of snapping back (the store is the
    // row's only data source and only syncs on theme/change otherwise).
    push(customBrand)
    // Publish to the slot occupants (sidebar / hero marks + name) live.
    brandStore.set(customBrand)
    // Apply the brand to the sidebar/hero DOM live.
    applyBrand(customBrand)
  }

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
    push(customBrand)
  }
  // Apply the persisted brand on boot (slot path renders from brandStore; the
  // legacy DOM path needs this first pass).
  applyBrand(customBrand)
  // Re-sync on both core theme/change (preference, core-path theme id) and
  // local emitter changes (plugin-path theme id).
  ctx.effect(() => themeBackend.subscribe(sync), 'dsh-yizi-themes: theme state adoption')
  ctx.effect(() => ctx.locale.register(SETTINGS_NS, { zh, en }), 'dsh-yizi-themes: row dictionaries')

  const injected = (actions: ReturnType<typeof store['create']>['actions']): AppearanceRowInjected => {
    bound = actions
    sync()
    return buildInjected(ctx, customBrand, setCustomBrand, (id) => themeBackend.setThemeId(id), runDoctor)
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
    () => customBrand.mappings,
    () => {
      applyBrand(customBrand)
      // Plugin-path themes re-assert the body class after any DOM churn.
      themeBackend.reassert()
      // Show the floating controls only while the hero (blank session) is up.
      floating.sync()
    },
  ), 'dsh-yizi-themes: brand replacement observer')
}


