/**
 * Appearance preference row registered into the General section item slot:
 * a style-theme swatch grid + a custom-brand configuration block. The light /
 * dark / system mode cubes are intentionally NOT duplicated here — the core
 * Appearance row (or the top-right mode toggle) already provides them, so
 * this row starts straight at the theme grid.
 */
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { DEFAULT_THEME } from './theme-settings.ts'
import type { CustomBrandConfig } from './theme-settings.ts'
import type { ThemeKey } from './locales.ts'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { createAppearanceRowStore } from './settings-store.ts'
import type { ThemeDefinition } from './themes-list.ts'

/** Injected business face: the theme/custom-brand writes. */
export interface AppearanceRowInjected {
  /** Switch the style theme (a registered theme id or `default`). */
  setThemeId: (id: string) => void
  /** Switch the custom brand configuration. */
  setCustomBrand: (patch: Partial<CustomBrandConfig>) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type AppearanceRowComponentProps =
  PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createAppearanceRowStore>>
  & PropsLocale<'yizi.theme'> & AppearanceRowInjected

/** Swatch gradient fallback when a theme declares none. */
const FALLBACK_SWATCH: [string, string] = ['#e8ecf0', '#c0c8d4']

/** Built-in palette ids the mode cubes already cover. */
const PALETTE_IDS = new Set(['light', 'dark'])

/** The implicit "no style theme" entry shown ahead of the registered grid. */
function defaultEntry(): ThemeDefinition {
  return {
    id: DEFAULT_THEME,
    colorScheme: 'light',
    tokens: {},
    name: '',
    desc: '',
    swatch: FALLBACK_SWATCH,
  }
}

/** Local clsx replacement — concatenates truthy string args with spaces. */
function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Render a live SVG/emoji preview. */
function MarkupPreview({ markup, className }: { markup: string; className?: string }) {
  if (markup === '') return null
  const isDataUri = markup.startsWith('data:')
  const isSvg = markup.trimStart().startsWith('<svg')
  if (isDataUri || isSvg) {
    return <span className={className} dangerouslySetInnerHTML={{ __html: markup }} />
  }
  return <span className={className} aria-hidden="true">{markup}</span>
}

/**
 * Render the Appearance row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export function AppearanceRow({ t, setThemeId, setCustomBrand, useStore }: AppearanceRowComponentProps) {
  const themeId = useStore(s => s.theme)
  const themes = useStore(s => s.themes)
  const customBrand = useStore(s => s.customBrand)
  const entries: readonly ThemeDefinition[] = [
    defaultEntry(),
    ...themes.filter(theme => !PALETTE_IDS.has(theme.id)),
  ]
  const update = (patch: Partial<CustomBrandConfig>) => { setCustomBrand(patch) }
  const updateMappings = (patch: Partial<CustomBrandConfig['mappings']>) => {
    setCustomBrand({ mappings: { ...customBrand.mappings, ...patch } })
  }
  return (
    <div className="dsw-yizi-group">
      <div className="dsw-yizi-title">{t('appearance.title')}</div>
      {entries.length > 1 && (
        <>
          <div className="dsw-yizi-section-title">{t('appearance.themes')}</div>
          <div className="dsw-yizi-theme-grid">
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
                  className={cx('dsw-yizi-theme-card', themeId === entry.id && 'dsw-yizi-selected')}
                  aria-pressed={themeId === entry.id}
                  onClick={() => { setThemeId(entry.id) }}
                >
                  <span
                    className="dsw-yizi-swatch"
                    style={{ background: `linear-gradient(135deg, ${swatch[0]} 0%, ${swatch[1]} 100%)` }}
                    aria-hidden="true"
                  />
                  <span className="dsw-yizi-card-label">{label}</span>
                  {desc !== '' && <span className="dsw-yizi-card-desc">{desc}</span>}
                </button>
              )
            })}
          </div>
        </>
      )}
      <div className="dsw-yizi-section-title">{t('appearance.custom')}</div>
      <div className="dsw-yizi-custom-block">
        <div className="dsw-yizi-field-row">
          <label className="dsw-yizi-field-label" htmlFor="custom-logo">{t('appearance.custom.logo')}</label>
          <div className="dsw-yizi-field-input">
            <textarea
              id="custom-logo"
              className="dsw-yizi-textarea"
              rows={3}
              value={customBrand.logo}
              placeholder={t('appearance.custom.logo.placeholder')}
              onChange={(e) => { update({ logo: e.target.value }) }}
            />
            <p className="dsw-yizi-field-hint-subtle">{t('appearance.custom.logo.hint')}</p>
            {customBrand.logo !== '' && (
              <div className="dsw-yizi-preview-wrap">
                <span className="dsw-yizi-preview-label">{t('appearance.custom.logo.preview')}</span>
                <MarkupPreview markup={customBrand.logo} className="dsw-yizi-logo-preview" />
              </div>
            )}
          </div>
        </div>
        <div className="dsw-yizi-field-row">
          <label className="dsw-yizi-field-label" htmlFor="custom-wordmark">{t('appearance.custom.wordmark')}</label>
          <div className="dsw-yizi-field-input">
            <input
              id="custom-wordmark"
              className="dsw-yizi-input"
              value={customBrand.wordmark}
              placeholder={t('appearance.custom.wordmark.placeholder')}
              onChange={(e) => { update({ wordmark: e.target.value }) }}
            />
          </div>
        </div>
        <div className="dsw-yizi-field-row">
          <label className="dsw-yizi-field-label" htmlFor="custom-badge">{t('appearance.custom.badge')}</label>
          <div className="dsw-yizi-field-input">
            <input
              id="custom-badge"
              className="dsw-yizi-input"
              value={customBrand.wordmarkBadge}
              placeholder={t('appearance.custom.badge.placeholder')}
              onChange={(e) => { update({ wordmarkBadge: e.target.value }) }}
            />
          </div>
        </div>
        <div className="dsw-yizi-field-row">
          <label className="dsw-yizi-field-label" htmlFor="custom-headline">{t('appearance.custom.headline')}</label>
          <div className="dsw-yizi-field-input">
            <input
              id="custom-headline"
              className="dsw-yizi-input"
              value={customBrand.headline}
              placeholder={t('appearance.custom.headline.placeholder')}
              onChange={(e) => { update({ headline: e.target.value }) }}
            />
          </div>
        </div>
        <div className="dsw-yizi-divider" />
        <div className="dsw-yizi-field-row">
          <label className="dsw-yizi-field-label">{t('appearance.custom.mappings')}</label>
          <div className="dsw-yizi-field-input">
            <p className="dsw-yizi-field-hint">{t('appearance.custom.mappings.desc')}</p>
            <label className="dsw-yizi-toggle-row">
              <input
                type="checkbox"
                checked={customBrand.mappings.enabled}
                onChange={(e) => { updateMappings({ enabled: e.target.checked }) }}
              />
              <span>{t('appearance.custom.mappings.enabled')}</span>
            </label>
            {customBrand.mappings.enabled && (
              <div className="dsw-yizi-mapping-grid">
                <label className="dsw-yizi-mapping-label">
                  <span>{t('appearance.custom.mappings.deepseekHarness')}</span>
                  <input
                    className="dsw-yizi-input"
                    value={customBrand.mappings.deepseekHarness}
                    onChange={(e) => { updateMappings({ deepseekHarness: e.target.value }) }}
                  />
                </label>
                <label className="dsw-yizi-mapping-label">
                  <span>{t('appearance.custom.mappings.deepseek')}</span>
                  <input
                    className="dsw-yizi-input"
                    value={customBrand.mappings.deepseek}
                    onChange={(e) => { updateMappings({ deepseek: e.target.value }) }}
                  />
                </label>
                <label className="dsw-yizi-mapping-label">
                  <span>{t('appearance.custom.mappings.deepseekChinese')}</span>
                  <input
                    className="dsw-yizi-input"
                    value={customBrand.mappings.deepseekChinese}
                    onChange={(e) => { updateMappings({ deepseekChinese: e.target.value }) }}
                  />
                </label>
                <label className="dsw-yizi-mapping-label">
                  <span>{t('appearance.custom.mappings.harness')}</span>
                  <input
                    className="dsw-yizi-input"
                    value={customBrand.mappings.harness}
                    onChange={(e) => { updateMappings({ harness: e.target.value }) }}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


