// @vitest-environment jsdom
/** AppearanceRow behavior: three mode cubes plus the style-theme swatch grid,
 * selection follows the persisted preference/theme, clicks drive setTheme and
 * setThemeId. */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createSnapshotStore, type SessionListState, type WorkspaceListState } from '@deepseek-ai/dsh-client-runtime/client'
import { bindSnapshotSelector } from '@deepseek-ai/dsh-client-web-react'
import { AppearanceRow } from '../src/client/AppearanceRow.tsx'
import type { AppearanceRowComponentProps } from '../src/client/AppearanceRow.tsx'
import { createAppearanceRowStore } from '../src/client/settings-store.ts'
import type { ThemePreference } from '../src/client/index.ts'
import { DEFAULT_THEME } from '../src/theme-settings.ts'

afterEach(cleanup)

const COPY: Record<string, string> = {
  'appearance.title': 'Appearance',
  'appearance.light': 'Light',
  'appearance.dark': 'Dark',
  'appearance.system': 'System',
  'appearance.themes': 'Theme',
  'appearance.default': 'Default',
  'appearance.default.desc': 'Classic Harness palette',
}

const THEMES = [
  { id: 'base', colorScheme: 'light' as const, tokens: {}, name: 'Base', swatch: ['#ffffff', '#f0f0f0'] as [string, string], desc: 'Vanilla' },
  { id: 'aurora', colorScheme: 'light' as const, tokens: {}, name: 'Aurora', swatch: ['#eef4fb', '#4a90d9'] as [string, string], desc: 'Flow' },
]

/** Empty global standard-kit hooks (the row reads neither). */
function emptySessions() {
  const store = createSnapshotStore<SessionListState>(
    { ids: [], byId: {}, current: undefined, phase: 'ready', subagentsByParent: {}, jobsBySession: {}, currentAddress: undefined })
  return bindSnapshotSelector(store)
}
function emptyWorkspaces() {
  const store = createSnapshotStore<WorkspaceListState>({
    items: [], archivedSessionIds: [], state: 'idle', phase: 'ready', error: null,
    baselinesReady: true, recentWorkspaceId: undefined,
  })
  return bindSnapshotSelector(store)
}

function mount(preference: ThemePreference = 'system', theme = DEFAULT_THEME) {
  // Real store instance — the sanctioned zero-machinery path for tests.
  const store = createAppearanceRowStore().create()
  store.actions.sync(preference, theme, THEMES, 0)
  const setTheme = vi.fn()
  const setThemeId = vi.fn()
  const props: AppearanceRowComponentProps = {
    useSessions: emptySessions(),
    useWorkspaces: emptyWorkspaces(),
    useStore: bindSnapshotSelector(store),
    actions: store.actions,
    t: (key: string) => COPY[key] ?? key,
    setTheme,
    setThemeId,
  }
  render(<AppearanceRow {...props} />)
  return { store, setTheme, setThemeId }
}

const pressed = (name: RegExp): string | null =>
  screen.getByRole('button', { name }).getAttribute('aria-pressed')

describe('AppearanceRow', () => {
  it('renders the title, the three mode cubes, and a theme grid', () => {
    mount('dark', DEFAULT_THEME)
    expect(screen.getByText('Appearance')).toBeDefined()
    // Anchor the mode cubes so a theme named Light/Dark cannot collide.
    expect(pressed(/^Dark$/)).toBe('true')
    expect(pressed(/^Light$/)).toBe('false')
    expect(pressed(/^System$/)).toBe('false')
    expect(screen.getByText('Theme')).toBeDefined()
    // The implicit default card plus each registered theme. Accessible names
    // concatenate the label and description (e.g. "AuroraFlow").
    expect(screen.getByText('Default')).toBeDefined()
    expect(screen.getByText('Aurora')).toBeDefined()
    expect(pressed(/^DefaultClassic Harness palette$/)).toBe('true')
    expect(pressed(/^AuroraFlow$/)).toBe('false')
  })

  it('mode clicks drive setTheme; selection follows the store mirror, not the click echo', () => {
    const b = mount('dark', DEFAULT_THEME)
    fireEvent.click(screen.getByRole('button', { name: /^Light$/ }))
    expect(b.setTheme).toHaveBeenCalledWith('light')
    // No store write yet: selection is unchanged.
    expect(pressed(/^Dark$/)).toBe('true')
    act(() => { b.store.actions.sync('light', DEFAULT_THEME, THEMES, 1) })
    expect(pressed(/^Light$/)).toBe('true')
    expect(pressed(/^Dark$/)).toBe('false')
  })

  it('theme cards drive setThemeId; the selected card follows the store mirror', () => {
    const b = mount('system', DEFAULT_THEME)
    fireEvent.click(screen.getByRole('button', { name: /^AuroraFlow$/ }))
    expect(b.setThemeId).toHaveBeenCalledWith('aurora')
    expect(pressed(/^DefaultClassic Harness palette$/)).toBe('true')
    act(() => { b.store.actions.sync('system', 'aurora', THEMES, 1) })
    expect(pressed(/^AuroraFlow$/)).toBe('true')
    expect(pressed(/^DefaultClassic Harness palette$/)).toBe('false')
  })
})