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
 * fall through to the shell's fallback), the sidebar mark occupant renders the
 * fish itself when no custom logo is set — preserving the exact default — and
 * the name occupant always renders the wordmark + badge (the plugin's default
 * brand, restoring the pre-rc.8 official look that the standard build replaces
 * with a dev placeholder). The HERO seat is the exception: it is registered
 * only while a custom logo exists, so the official hover-animated fish keeps
 * its seat otherwise.
 */
import React, { useSyncExternalStore } from 'react'
import { brandStore, markModernBrandPath } from './brand-store.ts'
import { cleanupLegacyBrandDom } from './brand-apply.ts'
import { resolveIcon } from './primitives-compat.ts'

/** Fish fallback across Harness generations (the export keeps its name; the
 * lookup only guards against it disappearing in a future build). */
const FishLogo = resolveIcon('FishLogo')

/**
 * Registration priority for every brand seat.
 *
 * The official deployment-brand plugin (`dsh-client-ui-brand-official`) is
 * composed in every standard build and registers the same single seats at the
 * default priority 0. A single slot rejects a SECOND occupant at the SAME
 * priority, so a lower priority both avoids the collision and still renders —
 * for a single slot the lowest-priority occupant is the one rendered.
 */
const BRAND_SLOT_PRIORITY = -100

/** Minimal slots face consumed by the registration (avoids private type deps). */
export interface BrandSlots {
  inject(key: string, callback: () => unknown): () => void
  register(spec: { name: string; priority?: number }, component: unknown): () => void
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
  // The host requests its fixed 24px edge; the user's overall brand scale
  // multiplies it (the official contract hands the occupant a REQUESTED size,
  // not a mandated one, and the sidebar row leaves ~44px of vertical room).
  const px = Math.round(size * custom.scale)
  if (custom.logo !== '') {
    return React.createElement(BrandMarkup, { markup: custom.logo, size: px })
  }
  return React.createElement('span', { 'data-yizi-logo': 'mark', style: BRAND_COLOR },
    FishLogo !== undefined ? React.createElement(FishLogo, { size: px }) : null)
}

/** `sidebar.brand.name` occupant: wordmark + badge cluster. */
export function YiziBrandName(): React.ReactElement {
  const custom = useSyncExternalStore(brandStore.subscribe, brandStore.getSnapshot)
  // The name slot's official contract states the occupant owns its content
  // width, so scaling the font metrics here is fully within the seam. Metrics
  // ride the same brand scale as the mark so the cluster stays proportional.
  const k = custom.scale
  const children: React.ReactNode[] = [
    React.createElement('span', {
      key: 'wm',
      style: {
        fontSize: Math.round(18 * k), fontWeight: 600, letterSpacing: '.02em',
        lineHeight: `${Math.round(24 * k)}px`, whiteSpace: 'nowrap',
        color: 'var(--dsw-alias-brand-primary)',
      },
    }, custom.wordmark),
  ]
  if (custom.wordmarkBadge !== '') {
    children.push(React.createElement('span', {
      key: 'badge',
      style: {
        fontSize: Math.max(8, Math.round(10 * k)),
        lineHeight: `${Math.max(11, Math.round(14 * k))}px`,
        padding: `0 ${Math.max(4, Math.round(5 * k))}px`,
        borderRadius: Math.max(2, Math.round(3 * k)),
        background: 'var(--dsw-alias-brand-primary)',
        color: 'var(--dsw-alias-label-primary-inverted)',
        letterSpacing: '.08em', whiteSpace: 'nowrap',
      },
    }, custom.wordmarkBadge))
  }
  return React.createElement('span', {
    'data-yizi-brand-name': '1',
    style: {
      display: 'inline-flex', alignItems: 'center',
      gap: `${Math.max(3, Math.round(6 * k))}px`,
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
  const px = Math.round(size * custom.scale)
  const inner = custom.logo !== ''
    ? React.createElement(BrandMarkup, { markup: custom.logo, size: px })
    : (FishLogo !== undefined ? React.createElement(FishLogo, { size: px, className: undefined }) : null)
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
 *
 * The HERO seat is registered only while a custom logo is set. A registered
 * single slot OCCUPIES its seat — the shell renders its own fallback only when
 * the slot has no entry — so leaving ours registered with an empty logo would
 * permanently replace the official hover-animated fish with a static copy.
 * It therefore follows `brandStore` and leaves the seat alone otherwise.
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
    return slots.register({ name: 'sidebar.brand.mark', priority: BRAND_SLOT_PRIORITY }, YiziBrandMark)
  }))
  disposers.push(slots.inject('sidebar.brand.name', () => {
    activate()
    return slots.register({ name: 'sidebar.brand.name', priority: BRAND_SLOT_PRIORITY }, YiziBrandName)
  }))
  disposers.push(slots.inject('conversation.hero.brand.mark', () => {
    activate()
    let disposeHero: (() => void) | null = null
    const syncHero = (logo: string): void => {
      if (logo !== '') {
        if (disposeHero === null) {
          disposeHero = slots.register(
            { name: 'conversation.hero.brand.mark', priority: BRAND_SLOT_PRIORITY },
            YiziHeroMark,
          )
        }
      } else if (disposeHero !== null) {
        disposeHero()
        disposeHero = null
      }
    }
    syncHero(brandStore.getSnapshot().logo)
    const unsubscribe = brandStore.subscribe(() => syncHero(brandStore.getSnapshot().logo))
    return () => {
      unsubscribe()
      disposeHero?.()
      disposeHero = null
    }
  }))
  return () => {
    for (const dispose of disposers) dispose()
  }
}
