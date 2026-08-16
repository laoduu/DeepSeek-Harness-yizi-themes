/**
 * Session-header controls for the dsh-yizi-themes plugin: a theme picker
 * (icon button + dropdown) and a light/dark mode toggle. Both read and write
 * through the core ctx.theme service. Registered into the
 * `conversation.session.header.actions` slot so they sit beside the session
 * log button. Uses native CSS custom properties — no new CSS rules required.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  IconDarkOutline16, IconLightOutline16,
} from '@deepseek-ai/dsh-client-ui-primitives'

/** Custom palette glyph (the platform icon set has no palette/brush icon):
 * outlined paint plate + four paint dots, single-color currentColor to match
 * the platform icon style. */
function PaletteIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.6C4.3 1.6 1.5 4.3 1.5 7.8c0 3.4 2.6 5.7 5.9 5.7h1.2c.8 0 1.4-.6 1.4-1.4 0-.4-.2-.8-.4-1.1-.3-.4-.5-.8-.5-1.2 0-.8.7-1.5 1.5-1.5h1.5c1.8 0 3.1-1.2 3.1-2.9C15.2 4 12 1.6 8 1.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="4.8" cy="5.1" r="1" fill="currentColor" />
      <circle cx="7.7" cy="3.9" r="0.9" fill="currentColor" />
      <circle cx="10.7" cy="4.9" r="0.9" fill="currentColor" />
      <circle cx="3.7" cy="8.8" r="0.8" fill="currentColor" />
    </svg>
  )
}

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

/** Hook: re-render the component whenever the theme snapshot changes. */
function useThemeSnapshot(getTheme: HeaderControlsProps['getTheme'], subscribe: HeaderControlsProps['subscribe']) {
  return useSyncExternalStore(
    subscribe,
    () => getTheme(),
    () => getTheme(),
  )
}

const THEMES = [
  { id: 'academic', name: '学术蓝', swatch: ['#f5f8ff', '#002fa7'] },
  { id: 'aurora', name: '极光', swatch: ['#eef4fb', '#4a90d9'] },
  { id: 'cyberpunk', name: '赛博朋克', swatch: ['#f0f4f8', '#0077b6'] },
  { id: 'facebook', name: 'Facebook', swatch: ['#f0f2f5', '#1877f2'] },
  { id: 'liquidglass', name: '液态玻璃', swatch: ['#f4f8ff', '#2563eb'] },
  { id: 'lychee', name: '荔枝红', swatch: ['#fff5f5', '#e63946'] },
  { id: 'magazine', name: '杂志感', swatch: ['#fdf6ec', '#8b4513'] },
  { id: 'matrix', name: '黑客帝国', swatch: ['#f5faf5', '#008a2e'] },
  { id: 'minimal', name: '极简风', swatch: ['#ffffff', '#0066cc'] },
  { id: 'mint', name: '薄荷冰沙', swatch: ['#f5fbf8', '#10b981'] },
  { id: 'morandi', name: '莫兰迪', swatch: ['#f7f3ef', '#b8927a'] },
  { id: 'nature', name: '自然风', swatch: ['#f5f2eb', '#4a7c59'] },
  { id: 'palace', name: '故宫朱砂', swatch: ['#faf6f0', '#b5372a'] },
  { id: 'sunset', name: '落日熔金', swatch: ['#fef8f0', '#b45309'] },
  { id: 'tech', name: '科技感', swatch: ['#f0f4f8', '#2b6cb0'] },
  { id: 'typewriter', name: '复古打字机', swatch: ['#f5f0e8', '#8b6914'] },
  { id: 'vaporwave', name: '蒸汽波', swatch: ['#f8f0f6', '#ff6ec7'] },
  { id: 'vibrant', name: '活力橙', swatch: ['#fff8f0', '#f3641e'] },
  { id: 'violet', name: '紫罗兰', swatch: ['#faf5fe', '#7209b7'] },
]

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
  const currentTheme = snapshot.theme
  const current = THEMES.find(t => t.id === currentTheme)

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
          {THEMES.map((t) => (
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
      {isDark ? <IconDarkOutline16 size={14} /> : <IconLightOutline16 size={14} />}
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
