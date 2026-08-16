// @vitest-environment jsdom
/** AppearanceRow behavior: three mode cubes, the style-theme swatch grid, and
 * the custom-brand block. Selection follows the persisted preference/theme/
 * customBrand; clicks drive setTheme, setThemeId, and setCustomBrand. */
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
  'appearance.custom': 'Custom',
  'appearance.custom.logo': 'Logo SVG',
  'appearance.custom.logo.preview': 'Preview',
  'appearance.custom.logo.placeholder': 'Paste SVG code or data URI',
  'appearance.custom.wordmark': 'Wordmark',
  'appearance.custom.wordmark.placeholder': 'DEEPSEEK',
  'appearance.custom.badge': 'Badge text',
  'appearance.custom.badge.placeholder': 'HARNESS',
  'appearance.custom.heroIcon': 'New session icon',
  'appearance.custom.heroIcon.placeholder': 'Paste SVG, emoji, or data URI',
  'appearance.custom.headline': 'New session headline',
  'appearance.custom.headline.placeholder': 'Explore the unknown',
  'appearance.custom.mappings': 'Brand mappings',
  'appearance.custom.mappings.desc': 'Replace brand strings in prompts',
  'appearance.custom.mappings.enabled': 'Enable brand mappings',
  'appearance.custom.mappings.deepseekHarness': 'DeepSeek Harness →',
  'appearance.custom.mappings.deepseek': 'DeepSeek →',
  'appearance.custom.mappings.deepseekChinese': '深度求索 →',
  'appearance.custom.mappings.harness': 'Harness →',
}

const THEMES = [
  { id: 'base', colorScheme: 'light' as const, tokens: {}, name: 'Base', swatch: ['#ffffff', '#f0f0f0'] as [string, string], desc: 'Vanilla' },
  { id: 'aurora', colorScheme: 'light' as const, tokens: {}, name: 'Aurora', swatch: ['#eef4fb', '#4a90d9'] as [string, string], desc: 'Flow' },
]

const CUSTOM_BRAND = {
  logo: '', wordmark: 'DEEPSEEK', wordmarkBadge: 'HARNESS',
  heroIcon: '', headline: '探索未至之境',
  mappings: {
    enabled: false, deepseek: 'DeepSeek', deepseekChinese: '深度求索',
    harness: 'Harness', deepseekHarness: 'DeepSeek Harness',
  },
}

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
  store.actions.sync(preference, theme, THEMES, CUSTOM_BRAND, 0)
  const setTheme = vi.fn()
  const setThemeId = vi.fn()
  const setCustomBrand = vi.fn()
  const props: AppearanceRowComponentProps = {
    useSessions: emptySessions(),
    useWorkspaces: emptyWorkspaces(),
    useStore: bindSnapshotSelector(store),
    actions: store.actions,
    t: (key: string) => COPY[key] ?? key,
    setTheme,
    setThemeId,
    setCustomBrand,
  }
  render(<AppearanceRow {...props} />)
  return { store, setTheme, setThemeId, setCustomBrand }
}

const pressed = (name: RegExp): string | null =>
  screen.getByRole('button', { name }).getAttribute('aria-pressed')

describe('AppearanceRow', () => {
  it('renders the title, the three mode cubes, a theme grid, and the custom block', () => {
    mount('dark', DEFAULT_THEME)
    expect(screen.getByText('Appearance')).toBeDefined()
    // Anchor the mode cubes so a theme named Light/Dark cannot collide.
    expect(pressed(/^Dark$/)).toBe('true')
    expect(pressed(/^Light$/)).toBe('false')
    expect(pressed(/^System$/)).toBe('false')
    expect(screen.getByText('Theme')).toBeDefined()
    expect(screen.getByText('Default')).toBeDefined()
    expect(screen.getByText('Aurora')).toBeDefined()
    // Custom-brand block renders its heading and fields.
    expect(screen.getByText('Custom')).toBeDefined()
    expect(screen.getByLabelText('Logo SVG')).toBeDefined()
    expect(screen.getByLabelText('Wordmark')).toBeDefined()
    expect(screen.getByLabelText('Badge text')).toBeDefined()
    expect(screen.getByLabelText('New session icon')).toBeDefined()
    expect(screen.getByLabelText('New session headline')).toBeDefined()
    expect(screen.getByText('Brand mappings')).toBeDefined()
  })

  it('mode clicks drive setTheme; selection follows the store mirror, not the click echo', () => {
    const b = mount('dark', DEFAULT_THEME)
    fireEvent.click(screen.getByRole('button', { name: /^Light$/ }))
    expect(b.setTheme).toHaveBeenCalledWith('light')
    // No store write yet: selection is unchanged.
    expect(pressed(/^Dark$/)).toBe('true')
    act(() => { b.store.actions.sync('light', DEFAULT_THEME, THEMES, CUSTOM_BRAND, 1) })
    expect(pressed(/^Light$/)).toBe('true')
    expect(pressed(/^Dark$/)).toBe('false')
  })

  it('theme cards drive setThemeId; the selected card follows the store mirror', () => {
    const b = mount('system', DEFAULT_THEME)
    fireEvent.click(screen.getByRole('button', { name: /^AuroraFlow$/ }))
    expect(b.setThemeId).toHaveBeenCalledWith('aurora')
    expect(pressed(/^DefaultClassic Harness palette$/)).toBe('true')
    act(() => { b.store.actions.sync('system', 'aurora', THEMES, CUSTOM_BRAND, 1) })
    expect(pressed(/^AuroraFlow$/)).toBe('true')
    expect(pressed(/^DefaultClassic Harness palette$/)).toBe('false')
  })

  it('custom-brand inputs drive setCustomBrand', () => {
    const b = mount('system', DEFAULT_THEME)
    const logo = screen.getByLabelText('Logo SVG') as HTMLTextAreaElement
    fireEvent.change(logo, { target: { value: '<svg>custom</svg>' } })
    expect(b.setCustomBrand).toHaveBeenCalledWith({ logo: '<svg>custom</svg>' })
    const wordmark = screen.getByLabelText('Wordmark') as HTMLInputElement
    fireEvent.change(wordmark, { target: { value: 'MYAI' } })
    expect(b.setCustomBrand).toHaveBeenCalledWith({ wordmark: 'MYAI' })
  })

  it('brand-mapping toggle reveals the mapping fields', () => {
    const b = mount('system', DEFAULT_THEME)
    const toggle = screen.getByText('Enable brand mappings')
    fireEvent.click(toggle)
    expect(b.setCustomBrand).toHaveBeenCalledWith({ mappings: { enabled: true } })
  })
})