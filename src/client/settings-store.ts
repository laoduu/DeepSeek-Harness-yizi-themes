/**
 * Appearance row slot store: a mirror of the theme service snapshot. The
 * plugin's apply-world change listener is the only writer; the row component
 * reads via props.useStore.
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-store'
import type { ThemePreference } from './theme-settings.ts'
import type { CustomBrandConfig } from './theme-settings.ts'
import type { ThemeDefinition } from './themes-list.ts'

/** Store state mirrored from the theme snapshot. */
export interface AppearanceRowState {
  /** Persisted preference (selection state reads this, never the resolved active theme). */
  preference: ThemePreference
  /** Persisted style theme id (`default` when none is selected). */
  theme: string
  /** Registered themes in registration order (built-ins first). */
  themes: readonly ThemeDefinition[]
  /** Persisted custom brand configuration. */
  customBrand: CustomBrandConfig
  /** Service revision; -1 until first sync so revision 0 lands as a change. */
  revision: number
}

/** Declared action shape giving the exported factory a stable return type. */
type AppearanceRowActions = {
  sync: (draft: AppearanceRowState, preference: ThemePreference, theme: string, themes: readonly ThemeDefinition[], customBrand: CustomBrandConfig, revision: number) => void
}

/**
 * Declares the Appearance row state and write surface.
 * @returns the store handle.
 */
export function createAppearanceRowStore(): EngineStoreHandle<AppearanceRowState, AppearanceRowActions> {
  return defineStore({
    init: (): AppearanceRowState => ({
      preference: 'system',
      theme: 'default',
      themes: [],
      customBrand: {
        logo: '', wordmark: 'DEEPSEEK', wordmarkBadge: 'HARNESS',
        headline: '探索未至之境',
        mappings: {
          enabled: false, deepseek: 'DeepSeek', deepseekChinese: '深度求索',
          harness: 'Harness', deepseekHarness: 'DeepSeek Harness',
        },
      },
      revision: -1,
    }),
    actions: {
      sync: (d, preference: ThemePreference, theme: string, themes: readonly ThemeDefinition[], customBrand: CustomBrandConfig, revision: number) => {
        if (revision <= d.revision) return
        d.preference = preference
        d.theme = theme
        d.themes = themes
        d.customBrand = customBrand
        d.revision = revision
      },
    },
  })
}
