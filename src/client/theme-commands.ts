/**
 * The `/theme` slash command: a popupSelect contribution registered through
 * the core ui-commands registry (`ctx.commandUi`) — the same official surface
 * `/model` and `/permission` use. Two option groups: every shipped style
 * theme (the current one marked `active`, which is also the row the popup's
 * highlight parks on) and the light/dark/system preference. Search uses
 * `fuzzy-label`, so typing "violet" or "紫罗兰" both reach the row.
 *
 * Old-core safety: `ctx.inject(['commandUi'], …)` spawns its own fiber that
 * stays PENDING forever when the running build provides no `commandUi`
 * service — the callback never runs and the plugin still activates. (All
 * supported cores ≥ v0.1.2-alpha.1 ship ui-commands, so in practice the
 * contribution always registers.)
 */
import type { Context } from '@deepseek-ai/cordis'
import type { ThemeBackend } from './theme-backend.ts'
import type { ThemeDefinition } from './themes-list.ts'
import { DEFAULT_THEME } from './theme-settings.ts'
import { PaletteIcon } from './PaletteIcon.tsx'

/** One option row of the shared popupSelect shell (structural subset). */
export interface PopupOption {
  readonly id: string
  readonly label: string
  readonly detail?: string
  readonly badge?: string
  readonly group?: { readonly name: string; readonly label: string }
  readonly active?: boolean
}

/** Structural subset of the core CommandContribution contract. */
export interface CommandContributionLike {
  readonly name: string
  label?(): string
  description?(): string
  readonly icon?: unknown
  available(...args: unknown[]): boolean
  readonly ui: {
    readonly kind: 'popupSelect'
    readonly searchMode?: 'substring' | 'fuzzy-label'
    searchLabels?(): { placeholder: string; empty: string; noResults: string }
    options(...args: unknown[]): Promise<readonly PopupOption[]>
    onSelect(...args: unknown[]): void | Promise<void>
  }
}

/** Structural subset of the core CommandUiRuntime registration face. */
export interface CommandUiLike {
  register(contribution: CommandContributionLike): () => void
}

/** Everything the /theme command needs, captured from the plugin fiber. */
export interface ThemeCommandDeps {
  /** Style-theme backend (read the current id / select one). */
  readonly backend: ThemeBackend
  /** Every selectable theme (shipped + Theme Studio customs), read live. */
  themes(): readonly ThemeDefinition[]
  /** Read the current light/dark preference. */
  preference(): string
  /** Set the light/dark preference. */
  setPreference(preference: 'light' | 'dark' | 'system'): void
  /** Bound translate for the plugin's settings namespace. */
  translate(key: string): string
}

/** Group identities (names are opaque keys; labels are localized). */
const STYLE_GROUP = { name: 'style' }
const MODE_GROUP = { name: 'mode' }

/** Option ids for the preference rows. */
const PREF_PREFIX = 'pref:'

/**
 * Register the /theme contribution on cores that provide the commandUi
 * service. Never throws on cores without it (the inner fiber just pends).
 * @param ctx - the plugin's client context.
 * @param deps - theme backend + preference writes + localized copy.
 */
export function registerThemeCommand(ctx: Context, deps: ThemeCommandDeps): void {
  const t = deps.translate
  ctx.inject(['commandUi'], (scope: Context) => {
    const commandUi = (scope as unknown as { get(name: string): unknown }).get('commandUi') as CommandUiLike | undefined
    if (commandUi === undefined || typeof commandUi.register !== 'function') return
    scope.effect(() => commandUi.register({
      name: 'theme',
      label: () => t('command.label'),
      description: () => t('command.description'),
      icon: PaletteIcon,
      available: () => true,
      ui: {
        kind: 'popupSelect',
        searchMode: 'fuzzy-label',
        searchLabels: () => ({
          placeholder: t('command.search.placeholder'),
          empty: t('command.search.empty'),
          noResults: t('command.search.noResults'),
        }),
        options: async () => {
          const themeId = deps.backend.readThemeId()
          const preference = deps.preference()
          const themes = deps.themes()
          return [
            {
              id: DEFAULT_THEME,
              label: t('appearance.default'),
              detail: t('appearance.default.desc'),
              group: { ...STYLE_GROUP, label: t('group.style') },
              active: themeId === DEFAULT_THEME || themeId === '',
            },
            ...themes.map((theme) => ({
              id: theme.id,
              label: theme.name,
              detail: theme.desc,
              group: { ...STYLE_GROUP, label: t('group.style') },
              active: theme.id === themeId,
            })),
            {
              id: `${PREF_PREFIX}system`,
              label: t('mode.system'),
              group: { ...MODE_GROUP, label: t('group.mode') },
              active: preference === 'system',
            },
            {
              id: `${PREF_PREFIX}light`,
              label: t('mode.light'),
              group: { ...MODE_GROUP, label: t('group.mode') },
              active: preference === 'light',
            },
            {
              id: `${PREF_PREFIX}dark`,
              label: t('mode.dark'),
              group: { ...MODE_GROUP, label: t('group.mode') },
              active: preference === 'dark',
            },
          ]
        },
        onSelect: async (option) => {
          if (option.id.startsWith(PREF_PREFIX)) {
            const preference = option.id.slice(PREF_PREFIX.length)
            if (preference === 'light' || preference === 'dark' || preference === 'system') {
              deps.setPreference(preference)
            }
            return
          }
          deps.backend.setThemeId(option.id)
        },
      },
    }), 'dsh-yizi-themes: /theme contribution')
  })
}
