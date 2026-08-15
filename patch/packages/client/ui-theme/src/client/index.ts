/**
 * Browser theme registry over the `--dsw-*` token stylesheets. The service
 * owns two orthogonal dimensions: the light/dark/system **preference** (which
 * palette the base sheets use) and the **style theme** id (which optional
 * `body.theme-<id>` overrides sheet applies on top). It resolves `system`
 * through `prefers-color-scheme`, folds the active style theme into an
 * immutable snapshot, and never touches the DOM — ui-layout's presenter
 * consumes the resolved snapshot. The Host settings scope loads and stores the
 * preference and theme id in the user-settings document. The plugin also
 * registers the Appearance preference row into the settings General section —
 * the theme feature owns its own settings surface.
 */
import type { Context } from '@deepseek-ai/cordis'
import type { BoundActions } from '@deepseek-ai/dsh-client-ui-slots'
import type { ClientContext, SettingsScope } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: the ctx.settingsScope Context merge. Cross-plugin collaboration
// goes through the service, never a value import (client bundle purity gate).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { AppearanceRowInjected } from './AppearanceRow.tsx'
import { AppearanceRow } from './AppearanceRow.tsx'
import { createAppearanceRowStore } from './settings-store.ts'
import { en, zh, type ThemeKey } from './locales.ts'
import {
  DEFAULT_PREFERENCE, DEFAULT_THEME, isThemePreference, THEME_FIELD, THEME_PREFERENCE_FIELD,
  THEME_SETTINGS_NAMESPACE, type ThemePreference, type ThemeSettings,
} from '../theme-settings.ts'

export type { AppearanceRowComponentProps, AppearanceRowInjected } from './AppearanceRow.tsx'
export type { AppearanceRowState } from './settings-store.ts'
export type { ThemeKey } from './locales.ts'
export type { ThemePreference, ThemeSettings } from '../theme-settings.ts'
export { DEFAULT_THEME, THEME_FIELD } from '../theme-settings.ts'

/** Namespace owning this feature's settings-row copy. */
export const SETTINGS_NS = 'settings.theme'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The Appearance settings row's copy. */
    'settings.theme': ThemeKey
  }
}

/** Theme token dictionary: --dsw-alias-* overrides keyed by variable name. */
export type ThemeTokens = Record<string, string>

/**
 * One override-layer token value: both palette modes are mandatory (repeat
 * the same value when the token is scheme-invariant) so an override never
 * goes illegible when the user switches to the other scheme.
 */
export interface ThemeTokenModes {
  /** Value applied while the light base palette is active. */
  light: string
  /** Value applied while the dark base palette is active. */
  dark: string
}

/** Override-layer dictionary: token names to per-mode value pairs. */
export type ThemeTokenOverrides = Record<string, ThemeTokenModes>

/** One selectable theme: id, dark/light semantics, and alias-token overrides. */
export interface ThemeDefinition {
  /** Theme id (the setTheme argument for concrete themes). */
  id: string
  /**
   * Which base palette this theme builds on. The presenter switches
   * `body[data-ds-dark-theme]` from this field — never from the id. For a
   * style theme (one backed by a `body.theme-<id>` overrides sheet) this is
   * the scheme the sheet's light block declares; the active scheme still
   * follows the preference at snapshot build time.
   */
  colorScheme: 'light' | 'dark'
  /** Alias-layer overrides applied as inline CSS variables over the base palette. */
  tokens: ThemeTokens
  /** Optional display name shown by the Appearance grid. */
  name?: string
  /** Optional two-color gradient swatch shown by the Appearance grid. */
  swatch?: [string, string]
  /** Optional one-line description shown by the Appearance grid. */
  desc?: string
}

/** Immutable theme state published on every change. */
export interface ThemeSnapshot {
  /** The persisted preference (may be `system`). */
  preference: ThemePreference
  /** The persisted style theme id (`default` when none is selected). */
  theme: string
  /**
   * The resolved active theme (`system` resolved via prefers-color-scheme)
   * with override layers folded into its tokens (seq order, later layers win
   * per-token; each value picked for the active color scheme). When a style
   * theme is active its id and metadata ride here and its colorScheme follows
   * the resolved preference.
   */
  active: ThemeDefinition
  /** Registered themes in registration order (built-ins first). */
  themes: readonly ThemeDefinition[]
  /** Monotonic change counter (registry or active changes). */
  revision: number
}

/** One theme token exposed to pre-definition Cordis inspection. */
export interface ThemeTokenInspection {
  /** Token name accepted by {@link ThemeService.overrideTokens}. */
  name: string
  /** Intended visual role. */
  description: string
  /** CSS value category. */
  valueType: string
  /** Whether override layers must supply both palette modes. */
  requiresLightAndDark: boolean
  /** CSS custom property consumed by UI styles. */
  cssVariable?: string
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    theme: ThemeRuntime
  }
  interface Events {
    /**
     * Theme state changed (preference switched, style theme switched, registry
     * updated, or the OS color scheme changed while the preference is `system`).
     * @param snapshot - Current immutable theme snapshot.
     * @mode emit
     */
    'theme/change'(snapshot: ThemeSnapshot): void
  }
}

const BUILTIN_THEMES: readonly ThemeDefinition[] = Object.freeze([
  Object.freeze({ id: 'light', colorScheme: 'light' as const, tokens: Object.freeze({}) }),
  Object.freeze({ id: 'dark', colorScheme: 'dark' as const, tokens: Object.freeze({}) }),
  Object.freeze({
    id: 'academic', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '学术蓝', swatch: ['#f5f8ff', '#002fa7'] as [string, string],
    desc: '沉稳专业的学术风格',
  }),
  Object.freeze({
    id: 'aurora', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '极光', swatch: ['#eef4fb', '#4a90d9'] as [string, string],
    desc: '冰蓝基调，流光溢彩',
  }),
  Object.freeze({
    id: 'cyberpunk', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '赛博朋克', swatch: ['#f0f4f8', '#0077b6'] as [string, string],
    desc: '冷白底霓虹青粉，未来感',
  }),
  Object.freeze({
    id: 'facebook', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: 'Facebook', swatch: ['#f0f2f5', '#1877f2'] as [string, string],
    desc: '经典蓝白，简洁社交风',
  }),
  Object.freeze({
    id: 'liquidglass', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '液态玻璃', swatch: ['#f4f8ff', '#2563eb'] as [string, string],
    desc: '冰蓝通透，磨砂玻璃质感',
  }),
  Object.freeze({
    id: 'lychee', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '荔枝红', swatch: ['#fff5f5', '#e63946'] as [string, string],
    desc: '热情红调，温暖鲜明',
  }),
  Object.freeze({
    id: 'magazine', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '杂志感', swatch: ['#fdf6ec', '#8b4513'] as [string, string],
    desc: '温暖优雅的阅读体验',
  }),
  Object.freeze({
    id: 'matrix', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '黑客帝国', swatch: ['#f5faf5', '#008a2e'] as [string, string],
    desc: '白底绿字终端风，暗色经典',
  }),
  Object.freeze({
    id: 'minimal', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '极简风', swatch: ['#ffffff', '#e8e8e8'] as [string, string],
    desc: '清爽干净的原始风格',
  }),
  Object.freeze({
    id: 'mint', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '薄荷冰沙', swatch: ['#f5fbf8', '#10b981'] as [string, string],
    desc: '清透薄荷绿，清凉舒适',
  }),
  Object.freeze({
    id: 'morandi', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '莫兰迪', swatch: ['#f7f3ef', '#b8927a'] as [string, string],
    desc: '低饱和灰调，高级不张扬',
  }),
  Object.freeze({
    id: 'nature', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '自然风', swatch: ['#f5f2eb', '#4a7c59'] as [string, string],
    desc: '纸感森林绿，自然阅读',
  }),
  Object.freeze({
    id: 'palace', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '故宫朱砂', swatch: ['#faf6f0', '#b5372a'] as [string, string],
    desc: '朱砂红与琉璃金，中式典雅',
  }),
  Object.freeze({
    id: 'sunset', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '落日熔金', swatch: ['#fef8f0', '#b45309'] as [string, string],
    desc: '暖白底琥珀色，暗色金红',
  }),
  Object.freeze({
    id: 'tech', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '科技感', swatch: ['#f0f4f8', '#2b6cb0'] as [string, string],
    desc: '冷蓝灰，亮暗双面',
  }),
  Object.freeze({
    id: 'typewriter', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '复古打字机', swatch: ['#f5f0e8', '#8b6914'] as [string, string],
    desc: '老纸底深褐墨色',
  }),
  Object.freeze({
    id: 'vaporwave', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '蒸汽波', swatch: ['#f8f0f6', '#ff6ec7'] as [string, string],
    desc: '粉紫霓虹，复古未来',
  }),
  Object.freeze({
    id: 'vibrant', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '活力橙', swatch: ['#fff8f0', '#f3641e'] as [string, string],
    desc: '暖橙基调，鲜明醒目',
  }),
  Object.freeze({
    id: 'violet', colorScheme: 'light' as const, tokens: Object.freeze({}),
    name: '紫罗兰', swatch: ['#faf5fe', '#7209b7'] as [string, string],
    desc: '雅致文艺，小众高级',
  }),
])

const BUILTIN_INSPECT_TOKENS: readonly ThemeTokenInspection[] = Object.freeze([
  { name: '--dsw-alias-bg-base', description: 'Application base background.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-alias-bg-base' },
  { name: '--dsw-alias-bg-layer-1', description: 'Primary raised surface background.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-alias-bg-layer-1' },
  { name: '--dsw-alias-bg-layer-2', description: 'Secondary nested surface background.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-alias-bg-layer-2' },
  { name: '--dsw-alias-bg-overlay', description: 'Overlay and popover background.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-alias-bg-overlay' },
  { name: '--dsw-alias-border-l1', description: 'Primary subtle border.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-alias-border-l1' },
  { name: '--dsw-alias-border-l2', description: 'Secondary stronger border.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-alias-border-l2' },
  { name: '--dsw-alias-brand-primary', description: 'Primary brand accent.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-alias-brand-primary' },
  { name: '--dsw-alias-label-primary', description: 'Primary text color.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-alias-label-primary' },
  { name: '--dsw-alias-label-secondary', description: 'Secondary text color.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-alias-label-secondary' },
  { name: '--dsw-alias-state-error-primary', description: 'Primary error state color.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-alias-state-error-primary' },
  { name: '--dsw-alias-state-success-primary', description: 'Primary success state color.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-alias-state-success-primary' },
  { name: '--dsw-alias-state-warn-primary', description: 'Primary warning state color.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-alias-state-warn-primary' },
  { name: '--dsw-specific-sidebar-fill', description: 'Sidebar column and title-row background.', valueType: 'CSS color', requiresLightAndDark: true, cssVariable: '--dsw-specific-sidebar-fill' },
])

/**
 * Theme registry and preference owner. `light`/`dark` are built in (the base
 * stylesheets carry both palettes); style themes register alias-layer
 * overrides and/or pair with a `body.theme-<id>` overrides sheet shipped by
 * this package. Reads go through {@link getTheme}; preference writes only
 * through {@link setTheme} (built-in modes) and style-theme writes through
 * {@link setThemeId}; continuous sync only through the `theme/change` event.
 * {@link overrideTokens} stacks partial token layers over the active theme
 * without touching the registry.
 * The service holds the `prefers-color-scheme` media query (environment
 * sensing, not presentation) and re-emits when the OS scheme flips while the
 * preference is `system`.
 */
export class ThemeRuntime {
  private readonly ctx: Context
  private readonly host: SettingsScope<ThemeSettings>
  private themes: ThemeDefinition[] = [...BUILTIN_THEMES]
  private preference: ThemePreference
  private themeId: string = DEFAULT_THEME
  private revision = 0
  private snapshot: ThemeSnapshot
  private readonly media: MediaQueryList | undefined
  /** Override layers by source; seq (monotonic) is the stacking order. */
  private readonly overrides = new Map<string, { seq: number; tokens: ThemeTokenOverrides }>()
  private overrideSeq = 0

  /**
   * @param ctx - owning context (change events are emitted on it; the
   * media-query and scope listeners are released through ctx.effect on dispose).
   * @param host - durable preference scope owned by the same plugin.
   */
  constructor(ctx: Context, host: SettingsScope<ThemeSettings>) {
    this.ctx = ctx
    this.host = host
    this.preference = DEFAULT_PREFERENCE
    // Non-browser runs (node e2e booting the client tree) have no matchMedia.
    this.media = typeof matchMedia === 'undefined' ? undefined : matchMedia('(prefers-color-scheme: dark)')
    this.snapshot = this.buildSnapshot()
    if (this.media !== undefined) {
      const media = this.media
      const onChange = (): void => {
        if (this.preference !== 'system') return
        this.publish()
      }
      ctx.effect(() => {
        media.addEventListener('change', onChange)
        return () => { media.removeEventListener('change', onChange) }
      }, 'ui-theme: prefers-color-scheme listener')
    }
    ctx.effect(() => host.subscribe(() => { this.adopt() }), 'ui-theme: settings scope adoption')
    this.adopt()
  }

  /**
   * Read the current immutable theme snapshot.
   * @returns the current snapshot (stable reference until the next change).
   */
  getTheme(): ThemeSnapshot {
    return this.snapshot
  }

  /**
   * Export the current token directory without reading DOM or computed styles.
   * @returns stable JSON-safe token descriptions, including registered and override-only names.
   */
  exportInspectTokens(): ThemeTokenInspection[] {
    const tokens = new Map(BUILTIN_INSPECT_TOKENS.map(token => [token.name, token]))
    for (const theme of this.themes) {
      for (const name of Object.keys(theme.tokens)) {
        if (!tokens.has(name)) tokens.set(name, dynamicToken(name))
      }
    }
    for (const layer of this.overrides.values()) {
      for (const name of Object.keys(layer.tokens)) {
        if (!tokens.has(name)) tokens.set(name, dynamicToken(name))
      }
    }
    return [...tokens.values()].map(token => ({ ...token })).sort((left, right) => left.name.localeCompare(right.name))
  }

  /**
   * Switch the built-in preference (light/dark/system) — the only preference
   * write entry; every accepted value emits `theme/change` and persists.
   * Style-theme selection goes through {@link setThemeId}.
   * @param id - a built-in preference id; unknown ids throw.
   */
  setTheme(id: ThemePreference): void {
    if (!isThemePreference(id)) {
      throw new Error(`theme preference "${String(id)}" is not a built-in mode — use setThemeId for style themes`)
    }
    if (this.preference === id) return
    this.preference = id
    void this.host.set(THEME_PREFERENCE_FIELD, id)
    this.publish()
  }

  /**
   * Switch the style theme — the orthogonal appearance dimension. `default`
   * clears the selection; any other id must be a registered theme.
   * @param id - a registered theme id or {@link DEFAULT_THEME}.
   */
  setThemeId(id: string): void {
    if (id !== DEFAULT_THEME && !this.themes.some(t => t.id === id)) {
      throw new Error(`theme "${id}" is not registered`)
    }
    if (this.themeId === id) return
    this.themeId = id
    void this.host.set(THEME_FIELD, id)
    this.publish()
  }

  /** Adopt the scope's accepted durable section without writing it back. */
  private adopt(): void {
    const section = this.host.getSnapshot().value
    if (section === undefined) return
    let changed = false
    if (this.preference !== section.preference) {
      this.preference = section.preference
      changed = true
    }
    const theme = typeof section.theme === 'string' ? section.theme : DEFAULT_THEME
    if (this.themeId !== theme && (theme === DEFAULT_THEME || this.themes.some(t => t.id === theme))) {
      this.themeId = theme
      changed = true
    }
    if (changed) this.publish()
  }

  /**
   * Register a theme. Duplicate id throws (single occupant per id; the
   * built-in pair counts; `system` is a preference, not a registrable id).
   * @param definition - theme id, colorScheme, and alias-token overrides.
   * @returns disposer. Disposing the theme backing the active style selection
   * resets it to the default so the UI never keeps tokens of an unregistered
   * theme.
   */
  register(definition: ThemeDefinition): () => void {
    if (definition.id === 'system') throw new Error('"system" is a preference, not a registrable theme id')
    if (this.themes.some(t => t.id === definition.id)) {
      throw new Error(`theme "${definition.id}" is already registered`)
    }
    this.themes = [...this.themes, definition]
    this.publish()
    return () => {
      if (!this.themes.some(t => t.id === definition.id)) return
      this.themes = this.themes.filter(t => t.id !== definition.id)
      if (this.themeId === definition.id) {
        this.themeId = DEFAULT_THEME
      }
      this.publish()
    }
  }

  /**
   * Stack a token override layer on top of the active theme — the token-level
   * analogue of slot shading: the base theme stays untouched, layers compose
   * in seq order with later layers winning per-token, and removing a layer
   * restores whatever it covered. Calling again with the same source replaces
   * that source's whole layer and restacks it on top (effect re-registration
   * semantics). Emits `theme/change` with the recomposed snapshot.
   * @param source - layer identity; one layer per source (dynamic packages
   * pass their package id — the façade pins it, so it also names the layer's
   * origin for inspection).
   * @param tokens - token-name → `{ light, dark }` value pairs. Validated at
   * runtime (model-authored callers reach this boundary with untyped JS);
   * a bare string value throws a teaching error.
   * @returns disposer removing exactly the layer this call created; a no-op
   * once the source has re-overridden (the newer layer is not torn down).
   */
  overrideTokens(source: string, tokens: ThemeTokenOverrides): () => void {
    const layer = { seq: this.overrideSeq++, tokens: validateOverrides(source, tokens) }
    this.overrides.set(source, layer)
    this.publish()
    return () => {
      if (this.overrides.get(source) !== layer) return
      this.overrides.delete(source)
      this.publish()
    }
  }

  private buildSnapshot(): ThemeSnapshot {
    const resolvedId = this.preference === 'system'
      ? (this.media?.matches === true ? 'dark' : 'light')
      : this.preference
    // Built-in light/dark always exist; a style theme may be active alongside
    // either scheme.
    const base = this.themes.find(t => t.id === resolvedId)
    /* v8 ignore next 2 -- needs a registry without light/dark, which register()/dispose() cannot produce */
    if (base === undefined) throw new Error(`theme registry lost "${resolvedId}"`)
    const style = this.themeId === DEFAULT_THEME ? undefined : this.themes.find(t => t.id === this.themeId)
    const active: ThemeDefinition = style === undefined
      ? base
      : Object.freeze({ ...style, colorScheme: resolvedId })
    return Object.freeze({
      preference: this.preference,
      theme: this.themeId,
      active: this.composeActive(active),
      themes: Object.freeze([...this.themes]),
      revision: this.revision,
    })
  }

  /**
   * Fold the override layers into the active definition: seq order, later
   * layers win per-token, each value picked for the active color scheme (the
   * presenter consumes the composed snapshot and needs no override awareness).
   * Without layers the registered definition passes through by identity.
   */
  private composeActive(active: ThemeDefinition): ThemeDefinition {
    if (this.overrides.size === 0) return active
    const tokens: ThemeTokens = { ...active.tokens }
    for (const layer of [...this.overrides.values()].sort((a, b) => a.seq - b.seq)) {
      for (const [name, modes] of Object.entries(layer.tokens)) {
        tokens[name] = modes[active.colorScheme]
      }
    }
    return Object.freeze({ ...active, tokens: Object.freeze(tokens) })
  }

  private publish(): void {
    this.revision += 1
    this.snapshot = this.buildSnapshot()
    this.ctx.emit('theme/change', this.snapshot)
  }
}

/**
 * Runtime shape check for one override layer (model-authored callers pass
 * untyped JS through the dynamic-package façade, so the static type cannot
 * enforce the pair shape there). Returns a defensive per-token copy so later
 * caller mutation cannot reach the stored layer.
 */
function validateOverrides(source: string, tokens: ThemeTokenOverrides): ThemeTokenOverrides {
  const validated: ThemeTokenOverrides = {}
  for (const [name, value] of Object.entries<unknown>(tokens)) {
    if (typeof value === 'string') {
      throw new TypeError(
        `theme override "${name}" from "${source}" is a bare string — pass { light: ${JSON.stringify(value)}, dark: ${JSON.stringify(value)} } `
        + '(repeat the value when it is the same in both palettes); a single value goes illegible when the user switches color scheme',
      )
    }
    if (typeof value !== 'object' || value === null
      || typeof (value as { light?: unknown }).light !== 'string'
      || typeof (value as { dark?: unknown }).dark !== 'string') {
      throw new TypeError(
        `theme override "${name}" from "${source}" must map to a { light, dark } pair of strings — one value per color scheme`,
      )
    }
    const modes = value as ThemeTokenModes
    validated[name] = { light: modes.light, dark: modes.dark }
  }
  return validated
}

function dynamicToken(name: string): ThemeTokenInspection {
  return {
    name,
    description: 'Theme token registered by the current Client composition.',
    valueType: 'CSS value',
    requiresLightAndDark: true,
    ...(name.startsWith('--') ? { cssVariable: name } : {}),
  }
}

/**
 * Required services: settings transport plus slots/locale for the Appearance
 * row. `remote` carries the forwarded settings invalidation that
 * `bindSettingsScope` subscribes to on this context.
 */
export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope']

/**
 * Client plugin body: provide the theme service and register the
 * feature-owned Appearance preference row into the General section's item
 * slot (a feature owns its settings surface).
 * @param ctx - client cordis context.
 */
export function apply(ctx: ClientContext): void {
  const host = ctx.settingsScope.bind<ThemeSettings>({ namespace: THEME_SETTINGS_NAMESPACE })
  const theme = new ThemeRuntime(ctx, host)
  ctx.provide('theme', theme)

  ctx.effect(() => ctx.locale.register(SETTINGS_NS, { zh, en }), 'ui-theme: settings row dictionaries')

  const store = createAppearanceRowStore()
  let bound: BoundActions<typeof store> | undefined
  const sync = (snapshot: ThemeSnapshot): void => {
    bound?.sync(snapshot.preference, snapshot.theme, snapshot.themes, snapshot.revision)
  }
  ctx.on('theme/change', sync)
  const injected = (actions: BoundActions<typeof store>): AppearanceRowInjected => {
    bound = actions
    // Re-sync from the getter so no event is lost between registration and
    // first render (the store's revision guard drops stale duplicates).
    sync(theme.getTheme())
    return {
      setTheme: (id) => { theme.setTheme(id) },
      setThemeId: (id) => { theme.setThemeId(id) },
    }
  }
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'appearance',
    order: 10,
    store,
    locale: SETTINGS_NS,
    inject: injected,
  }, AppearanceRow))
}
