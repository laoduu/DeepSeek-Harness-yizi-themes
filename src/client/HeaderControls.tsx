/**
 * Session-header controls for the dsh-yizi-themes plugin: a theme picker
 * (icon button + dropdown) and a light/dark mode toggle. Both read and write
 * through the core ctx.theme service. Registered into the
 * `conversation.session.header.actions` slot so they sit beside the session
 * log button. Uses native CSS custom properties — no new CSS rules required.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { resolveIcon } from './primitives-compat.ts'
import { PaletteIcon } from './PaletteIcon.tsx'
import { themesStore } from './themes-store.ts'
import type { ThemeDefinition } from './themes-list.ts'

/** Light/dark glyphs across Harness icon-set generations (`<Name>16` → `<Name>Regular`). */
const DarkModeIcon = resolveIcon('IconDarkOutlineRegular', 'IconDarkOutlineMedium', 'IconDarkOutline16')
const LightModeIcon = resolveIcon('IconLightOutlineRegular', 'IconLightOutlineMedium', 'IconLightOutline16')

/** Props injected by the plugin's slot registration (close over ctx). */
export interface HeaderControlsProps {
  /** Read the current theme snapshot. */
  getTheme: () => { preference: string; theme: string; active: { id: string } }
  /** Set the light/dark/system preference. */
  setPreference: (id: 'light' | 'dark' | 'system') => void
  /** Set the style theme id. */
  setThemeId: (id: string) => void
  /** Subscribe to theme changes; returns an unsubscribe function. */
  subscribe: (listener: () => void) => () => void
}

/** Hook: the full theme registry (shipped + Theme Studio customs), cached snapshot. */
function useThemes(): readonly ThemeDefinition[] {
  return useSyncExternalStore(
    themesStore.subscribe,
    () => themesStore.all(),
    () => themesStore.all(),
  )
}

/** Hook: re-render the component whenever the theme snapshot changes. */
function useThemeSnapshot(getTheme: HeaderControlsProps['getTheme'], subscribe: HeaderControlsProps['subscribe']) {
  return useSyncExternalStore(
    subscribe,
    () => getTheme(),
    () => getTheme(),
  )
}

/** Native-style icon button (no CSS modules). */
function IconButton({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 28, padding: '0 8px',
        border: '1px solid var(--dsw-alias-border-l2)',
        borderRadius: 8,
        background: 'var(--dsw-alias-button-elevated-fill, transparent)',
        color: 'var(--dsw-alias-label-primary)',
        cursor: 'pointer', fontSize: 13, lineHeight: '20px',
      }}
    >
      {children}
    </button>
  )
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

/** Theme picker button with dropdown. */
function ThemePicker({ getTheme, setThemeId, subscribe }: HeaderControlsProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const snapshot = useThemeSnapshot(getTheme, subscribe)
  const themes = useThemes()
  const currentTheme = snapshot.theme
  const current = themes.find(t => t.id === currentTheme)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <IconButton onClick={() => { setOpen(o => !o) }} title={`主题: ${current?.name ?? '默认'}`}>
        <PaletteIcon size={14} />
        <span style={{
          display: 'inline-block', width: 14, height: 14, borderRadius: 4,
          background: current ? `linear-gradient(135deg, ${current.swatch[0]}, ${current.swatch[1]})` : 'var(--dsw-alias-border-l2)',
          border: '1px solid var(--dsw-alias-border-l1)',
        }} />
      </IconButton>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0,
          minWidth: 180, padding: 6,
          border: '1px solid var(--dsw-alias-border-l2)',
          borderRadius: 12,
          background: 'var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-base))',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          zIndex: 1000,
        }}>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setThemeId(t.id); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '6px 8px',
                border: 'none', borderRadius: 8,
                background: currentTheme === t.id ? 'var(--dsw-alias-interactive-bg-hover)' : 'transparent',
                color: 'var(--dsw-alias-label-primary)',
                cursor: 'pointer', textAlign: 'left', fontSize: 13,
              }}
            >
              <span style={{
                display: 'inline-block', width: 16, height: 16, borderRadius: 4,
                background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})`,
                border: '1px solid var(--dsw-alias-border-l1)', flex: 'none',
              }} />
              <span style={{ flex: 1 }}>{t.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** Light/dark mode toggle button. */
function ModeToggle({ getTheme, setPreference, subscribe }: HeaderControlsProps) {
  const snapshot = useThemeSnapshot(getTheme, subscribe)
  const preference = snapshot.preference
  const isDark = preference === 'dark' || (preference === 'system' && typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <IconButton
      onClick={() => { setPreference(isDark ? 'light' : 'dark') }}
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {isDark
        ? (DarkModeIcon !== undefined ? <DarkModeIcon size={14} /> : null)
        : (LightModeIcon !== undefined ? <LightModeIcon size={14} /> : null)}
      <span>{isDark ? '深色' : '浅色'}</span>
    </IconButton>
  )
}

/** Root component: renders both controls side by side. */
export function HeaderControls(props: HeaderControlsProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <ThemePicker {...props} />
      <ModeToggle {...props} />
    </div>
  )
}
