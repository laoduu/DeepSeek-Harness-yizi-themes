/**
 * Appearance preference row registered into the General section item slot:
 * title + a mode cube row (light/dark/system) plus a style-theme swatch grid.
 * Registered by this package — the theme feature owns its own settings
 * surface. Selection follows the persisted preference/theme, never the
 * resolved active theme.
 */
import clsx from 'clsx'
import {
  IconDarkOutline16, IconFollowsystemOutline16, IconLightOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import type { ThemePreference } from '../theme-settings.ts'
import { DEFAULT_THEME } from '../theme-settings.ts'
import type { ThemeKey } from './locales.ts'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { createAppearanceRowStore } from './settings-store.ts'
import type { ThemeDefinition } from './index.ts'
import css from './AppearanceRow.module.css'

/** Injected business face: the preference/theme writes (t rides the standard locale seat). */
export interface AppearanceRowInjected {
  /** Switch the theme preference. */
  setTheme: (id: ThemePreference) => void
  /** Switch the style theme (a registered theme id or `default`). */
  setThemeId: (id: string) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type AppearanceRowComponentProps =
  PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createAppearanceRowStore>>
  & PropsLocale<'settings.theme'> & AppearanceRowInjected

/** Mode cube order and icons (figma 501:30015-30017: Light, Dark, System). */
const CUBES: readonly { id: ThemePreference; labelKey: ThemeKey; Icon: typeof IconLightOutline16 }[] = [
  { id: 'light', labelKey: 'appearance.light', Icon: IconLightOutline16 },
  { id: 'dark', labelKey: 'appearance.dark', Icon: IconDarkOutline16 },
  { id: 'system', labelKey: 'appearance.system', Icon: IconFollowsystemOutline16 },
]

/** Swatch gradient fallback when a theme declares none. */
const FALLBACK_SWATCH: [string, string] = ['#e8ecf0', '#c0c8d4']

/** Built-in palette ids the mode cubes already cover; they never appear as style-theme cards. */
const PALETTE_IDS = new Set(['light', 'dark'])

/** The implicit "no style theme" entry shown ahead of the registered grid. */
function defaultEntry(): ThemeDefinition {
  return {
    id: DEFAULT_THEME,
    colorScheme: 'light',
    tokens: {},
    name: '', // name/desc come from locale keys below
    swatch: FALLBACK_SWATCH,
  }
}

/**
 * Render the Appearance row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export function AppearanceRow({ t, setTheme, setThemeId, useStore }: AppearanceRowComponentProps) {
  const preference = useStore(s => s.preference)
  const themeId = useStore(s => s.theme)
  const themes = useStore(s => s.themes)
  const entries: readonly ThemeDefinition[] = [
    defaultEntry(),
    ...themes.filter(theme => !PALETTE_IDS.has(theme.id)),
  ]
  return (
    <div className={css.group}>
      <div className={css.title}>{t('appearance.title')}</div>
      <div className={css.cubeRow}>
        {CUBES.map(({ id, labelKey, Icon }) => (
          <button
            key={id}
            type="button"
            className={clsx(css.themeCube, preference === id && css.selected)}
            aria-pressed={preference === id}
            onClick={() => { setTheme(id) }}
          >
            <Icon />
            {t(labelKey)}
          </button>
        ))}
      </div>
      {entries.length > 1 && (
        <>
          <div className={css.sectionTitle}>{t('appearance.themes')}</div>
          <div className={css.themeGrid}>
            {entries.map((entry) => {
              const label = entry.id === DEFAULT_THEME
                ? t('appearance.default')
                : (entry.name ?? entry.id)
              const desc = entry.id === DEFAULT_THEME
                ? t('appearance.default.desc')
                : (entry.desc ?? '')
              const swatch = entry.swatch ?? FALLBACK_SWATCH
              return (
                <button
                  key={entry.id}
                  type="button"
                  className={clsx(css.themeCard, themeId === entry.id && css.selected)}
                  aria-pressed={themeId === entry.id}
                  onClick={() => { setThemeId(entry.id) }}
                >
                  <span
                    className={css.swatch}
                    style={{ background: `linear-gradient(135deg, ${swatch[0]} 0%, ${swatch[1]} 100%)` }}
                    aria-hidden="true"
                  />
                  <span className={css.cardLabel}>{label}</span>
                  {desc !== '' && <span className={css.cardDesc}>{desc}</span>}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}