/** Appearance row store: snapshot-mirror action and the revision guard. */
import { describe, expect, it } from 'vitest'
import { createAppearanceRowStore } from '../src/client/settings-store.ts'

const THEMES = [
  { id: 'light', colorScheme: 'light' as const, tokens: {} },
  { id: 'aurora', colorScheme: 'light' as const, tokens: {}, name: 'Aurora' },
]

describe('createAppearanceRowStore', () => {
  it('init shape: system preference, default theme, empty catalog, revision at -1', () => {
    const store = createAppearanceRowStore().create()
    expect(store.getSnapshot()).toEqual({ preference: 'system', theme: 'default', themes: [], revision: -1 })
  })

  it('sync mirrors the preference, style theme, and catalog, and advances the revision', () => {
    const store = createAppearanceRowStore().create()
    store.actions.sync('dark', 'aurora', THEMES, 0)
    expect(store.getSnapshot()).toEqual({ preference: 'dark', theme: 'aurora', themes: THEMES, revision: 0 })
    store.actions.sync('light', 'default', THEMES, 2)
    expect(store.getSnapshot().preference).toBe('light')
    expect(store.getSnapshot().theme).toBe('default')
    expect(store.getSnapshot().revision).toBe(2)
  })

  it('revision guard drops stale and duplicate writes', () => {
    const store = createAppearanceRowStore().create()
    store.actions.sync('dark', 'aurora', THEMES, 3)
    store.actions.sync('system', 'tech', THEMES, 2)
    store.actions.sync('system', 'tech', THEMES, 3)
    expect(store.getSnapshot().preference).toBe('dark')
    expect(store.getSnapshot().theme).toBe('aurora')
    expect(store.getSnapshot().revision).toBe(3)
  })
})