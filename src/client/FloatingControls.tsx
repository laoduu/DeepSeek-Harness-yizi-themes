/**
 * Floating theme controls for the BLANK / new-session state.
 *
 * The session header (which carries the plugin's theme picker + mode toggle
 * via `conversation.session.header.utilities`) is hidden while a session is
 * blank — so a brand-new user with no conversation yet sees no controls.
 * This mounts the SAME HeaderControls into a fixed-position host at the top
 * right of the viewport, shown only while the hero (blank session) is
 * present, and hidden once a real session header exists. A separate React
 * root is safe: HeaderControls needs no app context, only its injected face.
 */
import { createRoot } from 'react-dom/client'
import { HeaderControls, type HeaderControlsProps } from './HeaderControls.tsx'

/** Hero presence ⇔ blank/new-session state (the header is hidden then).
 * Modern (rc.8+) hero mark is OUR slot-rendered `[data-yizi-hero-mark]`;
 * older cores render the fish SVG (viewBox fingerprint). Either presence
 * means a blank session. */
const HERO_SELECTOR = 'svg[viewBox="0 0 23.16 17.04"][width="34"]'
const HERO_MARK_SELECTOR = '[data-yizi-hero-mark="1"]'

/** Handle to the mounted floating controls. */
export interface FloatingControlsHandle {
  /** Re-evaluate visibility against the current DOM (call on mutations). */
  sync(): void
  /** Unmount and remove the host. */
  dispose(): void
}

/**
 * Top offset of the fixed host.
 *
 * The 12px aligns with the conversation column's chrome (root padding
 * 12px 28px), but it must be measured from the CONTENT area, not the window:
 * the Windows desktop reserves a native `titleBarOverlay` caption strip above
 * the Web document (`--dsh-windows-titlebar-height`, 40px) whose minimize /
 * maximize / close buttons paint over the top-right corner of the viewport.
 * Anchoring at a bare 12px therefore put these controls UNDER those native
 * buttons on the blank/new-session screen (the session header that normally
 * seats them is hidden there). The desktop preload defines the variable only
 * while that caption exists, so every other shell (plain Web, macOS) keeps
 * the original 12px offset.
 */
const HOST_TOP = 'calc(var(--dsh-windows-titlebar-height, 0px) + 12px)'

/** Default right inset when no header corner occupant needs the space. */
const BASE_RIGHT = 28
/** Gap kept between the controls and whatever sits to their right. */
const CORNER_GAP = 8
/**
 * Blank sessions still render the session header's `corner` seat even though
 * the title row itself is suppressed — the right sidebar's expand ("open
 * sidebar") button is its only occupant while the sidebar is COLLAPSED. The
 * floating host must sit to the LEFT of that button instead of covering it.
 */
const HEADER_CORNER_SELECTOR = '[data-conversation-header-corner]'
/**
 * The right sidebar panel (`@deepseek-ai/dsh-client-ui-sidebar-right`).
 *
 * It is an absolutely positioned column anchored to the frame's right edge; the
 * shell marks it `data-sidebar-right-open` only while expanded. Expanding it
 * ALSO unmounts the corner expand button (“nothing while it is shown”), so the
 * corner seat goes empty and the panel's own chrome strip becomes the thing the
 * floating controls would otherwise cover. The host therefore treats the open
 * panel's left edge as its right-side boundary too.
 */
const SIDEBAR_PANEL_OPEN_SELECTOR = '[data-sidebar-right-open]'

/** Mount the floating theme/mode controls; returns a visibility sync handle. */
export function mountFloatingControls(injected: HeaderControlsProps): FloatingControlsHandle {
  const host = document.createElement('div')
  host.id = 'dsw-yizi-floating-controls'
  host.style.cssText = [
    'position:fixed', `top:${HOST_TOP}`, `right:${BASE_RIGHT}px`, 'z-index:200',
    'display:flex', 'align-items:center', 'gap:8px',
    // The caption strip is a drag region on the Windows desktop; the host must
    // stay clickable even where a shell marks its own chrome as draggable.
    '-webkit-app-region:no-drag',
  ].join(';')
  document.body.append(host)

  const root = createRoot(host)
  root.render(<HeaderControls {...injected} />)

  // Re-anchor when a tracked boundary changes SIZE (panel drag-resize) even
  // though that changes no DOM node: attribute-only style edits are invisible
  // to the MutationObserver, and a drag emits no `resize` event either.
  const barrierResize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => { place() })
  const observedBarriers = new Set<Element>()
  const observeBarriers = (barriers: readonly Element[]): void => {
    if (barrierResize === null) return
    for (const el of [...observedBarriers]) {
      if (!barriers.includes(el)) { barrierResize.unobserve(el); observedBarriers.delete(el) }
    }
    for (const el of barriers) {
      if (!observedBarriers.has(el)) { barrierResize.observe(el); observedBarriers.add(el) }
    }
  }

  /**
   * Re-anchor horizontally to the LEFT of everything occupying the top-right
   * corner: the header corner occupant (collapsed sidebar's "open sidebar"
   * button) and — when the right sidebar is open — the whole panel, whose left
   * edge is then the boundary. Measured live so shell sizing/padding changes
   * and panel drag-resizing keep working without hardcoded numbers.
   */
  const place = (): void => {
    if (!heroVisible) return
    let boundary = Number.POSITIVE_INFINITY
    const barriers: Element[] = []

    const corner = document.querySelector(HEADER_CORNER_SELECTOR)
    if (corner instanceof HTMLElement) {
      const rect = corner.getBoundingClientRect()
      // `display:none` when the seat is empty — its rect is all zeroes.
      if (rect.width > 0 && rect.height > 0) {
        barriers.push(corner)
        boundary = Math.min(boundary, rect.left)
      }
    }

    for (const panel of document.querySelectorAll(SIDEBAR_PANEL_OPEN_SELECTOR)) {
      if (!(panel instanceof HTMLElement)) continue
      // Only the visible session's panel counts (others are `hidden`).
      if (panel.closest('[hidden]') !== null) continue
      const rect = panel.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) continue
      barriers.push(panel)
      boundary = Math.min(boundary, rect.left)
    }
    observeBarriers(barriers)

    if (boundary === Number.POSITIVE_INFINITY) {
      // No right-side occupant at all: plain inset, and never stay hidden here.
      if (host.style.display === 'none') host.style.display = ''
      host.style.right = `${BASE_RIGHT}px`
      return
    }

    // A panel that spans (nearly) the full width — the sidebar's fullscreen mode
    // — leaves no room for the controls without covering its content: hide.
    const width = host.getBoundingClientRect().width
    const needed = (width > 0 ? width : 96) + CORNER_GAP
    if (boundary < needed) {
      host.style.display = 'none'
      return
    }
    if (host.style.display === 'none') host.style.display = ''
    host.style.right = `${Math.max(BASE_RIGHT, Math.round(window.innerWidth - boundary + CORNER_GAP))}px`
  }

  /** Whether the hero (blank session) is currently on screen. */
  let heroVisible = false

  const sync = (): void => {
    heroVisible = document.querySelector(HERO_MARK_SELECTOR) !== null
      || document.querySelector(HERO_SELECTOR) !== null
    if (!heroVisible) {
      host.style.display = 'none'
      observeBarriers([])
      return
    }
    host.style.display = ''
    place()
  }
  sync()

  // Window resizes move the corner seat; re-anchor without waiting for a DOM
  // mutation (sidebar drags and window snaps do not always produce one).
  window.addEventListener('resize', sync)

  // Expanding / collapsing the right sidebar toggles an ATTRIBUTE only: no node
  // is inserted and the collapsed panel already spans its final width (its
  // content just slides in), so neither the body childList observer nor the
  // ResizeObserver would notice. Watch exactly those two attributes.
  const stateObserver = new MutationObserver(() => { sync() })
  stateObserver.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['data-sidebar-right-open', 'data-sidebar-right-panel'],
  })

  return {
    sync,
    dispose: () => {
      window.removeEventListener('resize', sync)
      stateObserver.disconnect()
      barrierResize?.disconnect()
      observedBarriers.clear()
      root.unmount()
      host.remove()
    },
  }
}
