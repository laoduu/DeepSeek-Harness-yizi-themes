/** Appearance row store: snapshot-mirror action and the revision guard. */
import { describe, expect, it } from 'vitest'
import { createAppearanceRowStore } from '../src/client/settings-store.ts'

const THEMES = [
  { id: 'light', colorScheme: 'light' as const, tokens: {} },
  { id: 'aurora', colorScheme: 'light' as const, tokens: {}, name: 'Aurora' },
]

const CUSTOM_BRAND = {
  logo: '', wordmark: 'DEEPSEEK', wordmarkBadge: 'HARNESS',
  heroIcon: '', headline: '探索未至之境',
  mappings: {
    enabled: false, deepseek: 'DeepSeek', deepseekChinese: '深度求索',
    harness: 'Harness', deepseekHarness: 'DeepSeek Harness',
  },
}

describe('createAppearanceRowStore', () => {
  it('init shape: system preference, default theme, empty catalog, default custom brand, revision at -1', () => {
    const store = createAppearanceRowStore().create()
    expect(store.getSnapshot()).toEqual({
      preference: 'system', theme: 'default', themes: [],
      customBrand: CUSTOM_BRAND, revision: -1,
    })
  })

  it('sync mirrors the preference, style theme, catalog, custom brand, and advances the revision', () => {
    const store = createAppearanceRowStore().create()
    store.actions.sync('dark', 'aurora', THEMES, CUSTOM_BRAND, 0)
    expect(store.getSnapshot()).toEqual({
      preference: 'dark', theme: 'aurora', themes: THEMES,
      customBrand: CUSTOM_BRAND, revision: 0,
    })
    store.actions.sync('light', 'default', THEMES, CUSTOM_BRAND, 2)
    expect(store.getSnapshot().preference).toBe('light')
    expect(store.getSnapshot().theme).toBe('default')
    expect(store.getSnapshot().revision).toBe(2)
  })

  it('revision guard drops stale and duplicate writes', () => {
    const store = createAppearanceRowStore().create()
    store.actions.sync('dark', 'aurora', THEMES, CUSTOM_BRAND, 3)
    store.actions.sync('system', 'tech', THEMES, CUSTOM_BRAND, 2)
    store.actions.sync('system', 'tech', THEMES, CUSTOM_BRAND, 3)
    expect(store.getSnapshot().preference).toBe('dark')
    expect(store.getSnapshot().theme).toBe('aurora')
    expect(store.getSnapshot().revision).toBe(3)
  })
})