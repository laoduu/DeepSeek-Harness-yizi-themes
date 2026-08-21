/**
 * Modern (rc.8+) brand rendering through the official brand slots.
 *
 * Harness composes deployment branding through three root-scope slots:
 *   - `sidebar.brand.mark`       (owner { size }) → the expanded + rail logo
 *   - `sidebar.brand.name`       (owner {})       → the wordmark + badge
 *   - `conversation.hero.brand.mark` (owner { size, className }) → the hero fish
 *
 * These are the designed extension surface: registering them is stable across
 * Harness upgrades, so the plugin no longer depends on internal DOM layout.
 * Each occupant reads the reactive brandStore and re-renders live when the
 * user edits the brand in the settings row.
 *
 * Because a registered single slot OCCUPIES its seat (rendering null does not
 * fall through to the shell's fallback), the mark occupants render the fish
 * themselves when no custom logo is set — preserving the exact default — and
 * the name occupant always renders the wordmark + badge (the plugin's default
 * brand, restoring the pre-rc.8 official look that the standard build replaces
 * with a dev placeholder).
 */
import React, { useSyncExternalStore } from 'react'
import { FishLogo } from '@deepseek-ai/dsh-client-ui-primitives'
import { brandStore, markModernBrandPath } from './brand-store.ts'
import { cleanupLegacyBrandDom } from './brand-apply.ts'

/** Minimal slots face consumed by the registration (avoids private type deps). */
export interface BrandSlots {
  inject(key: string, callback: () => unknown): () => void
  register(spec: { name: string }, component: unknown): () => void
}

/** Inline brand-ink for every occupant (theme + light/dark adaptive). */
const BRAND_COLOR: React.CSSProperties = { color: 'var(--dsw-alias-brand-primary)' }

/**
 * Render user logo markup (SVG markup / data URI image / emoji text) sized to
 * a height through a CSS custom property, so the svg/img inside scales while
 * keeping its aspect ratio. The wrapper carries `data-yizi-logo` for the
 * stylesheet and the theme brand ink (logos drawn with currentColor ride it).
 */
function BrandMarkup({ markup, size }: { markup: string; size: number }): React.ReactElement {
  const trim = markup.trim()
  if (trim.startsWith('<svg') || trim.startsWith('data:')) {
    return React.createElement('span', {
      'data-yizi-logo': '1',
      'aria-hidden': 'true',
      style: {
        '--yizi-logo-size': `${size}px`,
        display: 'inline-block',
        lineHeight: 0,
        ...BRAND_COLOR,
      } as React.CSSProperties,
      dangerouslySetInnerHTML: { __html: markup },
    })
  }
  return React.createElement('span', {
    'data-yizi-logo': '1',
    'aria-hidden': 'true',
    style: { fontSize: Math.round(size * 0.8), lineHeight: 1, ...BRAND_COLOR },
  }, markup)
}

/** `sidebar.brand.mark` occupant: custom logo, or the fish when unset. */
export function YiziBrandMark({ size }: { size: number }): React.ReactElement {
  const custom = useSyncExternalStore(brandStore.subscribe, brandStore.getSnapshot)
  if (custom.logo !== '') {
    return React.createElement(BrandMarkup, { markup: custom.logo, size })
  }
  return React.createElement('span', { 'data-yizi-logo': 'mark', style: BRAND_COLOR },
    React.createElement(FishLogo, { size }))
}

/** `sidebar.brand.name` occupant: wordmark + badge cluster. */
export function YiziBrandName(): React.ReactElement {
  const custom = useSyncExternalStore(brandStore.subscribe, brandStore.getSnapshot)
  const children: React.ReactNode[] = [
    React.createElement('span', {
      key: 'wm',
      style: {
        fontSize: 18, fontWeight: 600, letterSpacing: '.02em',
        lineHeight: '24px', whiteSpace: 'nowrap',
        color: 'var(--dsw-alias-brand-primary)',
      },
    }, custom.wordmark),
  ]
  if (custom.wordmarkBadge !== '') {
    children.push(React.createElement('span', {
      key: 'badge',
      style: {
        fontSize: 10, lineHeight: '14px', padding: '0 5px', borderRadius: 3,
        background: 'var(--dsw-alias-brand-primary)',
        color: 'var(--dsw-alias-label-primary-inverted)',
        letterSpacing: '.08em', whiteSpace: 'nowrap',
      },
    }, custom.wordmarkBadge))
  }
  return React.createElement('span', {
    'data-yizi-brand-name': '1',
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      maxWidth: '100%', overflow: 'hidden',
    },
  }, ...children)
}

/** `conversation.hero.brand.mark` occupant: custom logo or the fish. */
export function YiziHeroMark({ size, className }: { size: number; className?: string }): React.ReactElement {
  const custom = useSyncExternalStore(brandStore.subscribe, brandStore.getSnapshot)
  // The wrapper is anchored by our own `data-yizi-hero-mark` marker: the
  // headline DOM pass locates the hero text as this element's sibling chain,
  // so it never depends on hashed core class names. `className` (the shell's
  // hero mark class) rides the wrapper so hover motion still applies.
  const inner = custom.logo !== ''
    ? React.createElement(BrandMarkup, { markup: custom.logo, size })
    : React.createElement(FishLogo, { size, className: undefined })
  return React.createElement('span', {
    'data-yizi-hero-mark': '1',
    className,
    style: { display: 'inline-flex', alignItems: 'center', ...BRAND_COLOR, lineHeight: 0 },
  }, inner)
}

/**
 * Register the three brand slots. Called once from the plugin apply; each
 * `slots.inject` runs its callback synchronously when the slot is already
 * declared (rc.8+) or when it is declared later (older cores never declare
 * them, so the callback never runs and the legacy DOM path stays active).
 */
export function registerBrandSlots(slots: BrandSlots): () => void {
  let activated = false
  const activate = (): void => {
    if (activated) return
    activated = true
    // The slots are now the single brand source of truth: retire any legacy
    // DOM-surgery artifacts that may have mounted during the boot race.
    markModernBrandPath()
    cleanupLegacyBrandDom()
  }
  const disposers: Array<() => void> = []
  disposers.push(slots.inject('sidebar.brand.mark', () => {
    activate()
    return slots.register({ name: 'sidebar.brand.mark' }, YiziBrandMark)
  }))
  disposers.push(slots.inject('sidebar.brand.name', () => {
    activate()
    return slots.register({ name: 'sidebar.brand.name' }, YiziBrandName)
  }))
  disposers.push(slots.inject('conversation.hero.brand.mark', () => {
    activate()
    return slots.register({ name: 'conversation.hero.brand.mark' }, YiziHeroMark)
  }))
  return () => {
    for (const dispose of disposers) dispose()
  }
}
