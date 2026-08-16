/**
 * Apply the persisted custom brand to the DOM.
 *
 * React-safety rule: NEVER replace, move, or remove a React-managed node —
 * React's fibers keep references to the originals, and removing one out from
 * under React makes its next commit throw (NotFoundError on removeChild),
 * blanking the sidebar. Instead each target is handled as:
 *  1. hide the ORIGINAL node with inline `display:none` (these components
 *     never pass a style prop, so React never touches the style back);
 *  2. insert OUR node as a sibling right after the original (React ignores
 *     nodes it did not create; our node leaves with the subtree on unmount);
 *  3. orphan cleanup: if the original is gone but our sibling remains,
 *     remove OUR node; a fresh original mount re-applies.
 * A per-target signature makes content refresh cheap and idempotent.
 *
 * Targets (located by stable SVG viewBox attributes, since the app's
 * CSS-module class names are hashed):
 *  - expanded sidebar brand: BrandWordmark (`viewBox="0 0 182 24"`) →
 *    logo + wordmark + badge cluster;
 *  - collapsed rail: FishLogo (`viewBox="0 0 23.16 17.04"` width=24) → logo;
 *  - new-session hero: FishLogo width=34 → the custom logo, headline → custom.
 */
import { DEFAULT_CUSTOM_BRAND, type CustomBrandConfig } from './theme-settings.ts'

/** Stable SVG fingerprints of the built-in brand nodes. */
const ART_SELECTOR = 'svg[viewBox="0 0 182 24"]'
const RAIL_SELECTOR = 'svg[viewBox="0 0 23.16 17.04"][width="24"]'
const HERO_SELECTOR = 'svg[viewBox="0 0 23.16 17.04"][width="34"]'

/** Markers on OUR replacement nodes. */
const ART_MARK = 'data-yizi-brand'
const RAIL_MARK = 'data-yizi-rail'
const HERO_MARK = 'data-yizi-hero'

/** Last-applied per-target signatures (skip rebuilds when unchanged). */
let lastSidebar = ''
let lastRail = ''
let lastHero = ''
/** Original hero headline text, captured once, for reset. */
let savedHeadline: string | null = null

/** Clone user markup (SVG markup / data URI image / emoji text) sized to a height. */
function renderMarkup(markup: string, height: number): HTMLElement {
  const trim = markup.trim()
  if (trim.startsWith('<svg')) {
    const wrap = document.createElement('span')
    wrap.innerHTML = markup
    const svg = wrap.querySelector('svg')
    if (svg) {
      svg.removeAttribute('width')
      svg.setAttribute('height', String(height))
      svg.style.cssText = `height:${height}px;width:auto;max-width:100%;`
    }
    return (wrap.firstElementChild as HTMLElement) ?? wrap
  }
  if (trim.startsWith('data:image')) {
    const img = document.createElement('img')
    img.src = trim
    img.alt = ''
    img.style.cssText = `height:${height}px;width:auto;max-width:100%;display:inline-block;`
    return img
  }
  const el = document.createElement('span')
  el.textContent = markup
  el.style.cssText = `font-size:${Math.round(height * 0.8)}px;line-height:1;`
  return el
}

/** The sidebar brand cluster: logo + wordmark + badge. */
function buildCluster(custom: CustomBrandConfig): HTMLElement {
  const cluster = document.createElement('span')
  cluster.setAttribute(ART_MARK, '1')
  cluster.style.cssText = [
    'display:inline-flex', 'align-items:center', 'gap:6px',
    'height:24px', 'max-width:100%', 'overflow:hidden', 'white-space:nowrap',
    // Theme-adaptive brand ink: follows body.theme-<id> and light/dark, and
    // lets a logo drawn with fill="currentColor" ride the same color.
    'color:var(--dsw-alias-brand-primary)',
  ].join(';')
  if (custom.logo !== '') cluster.append(renderMarkup(custom.logo, 24))
  const wm = document.createElement('span')
  wm.style.cssText = [
    'font-size:18px', 'font-weight:600', 'letter-spacing:.02em',
    'line-height:24px', 'color:var(--dsw-alias-brand-primary)',
  ].join(';')
  wm.textContent = custom.wordmark
  cluster.append(wm)
  if (custom.wordmarkBadge !== '') {
    const badge = document.createElement('span')
    badge.style.cssText = [
      'font-size:10px', 'line-height:14px', 'padding:0 5px', 'border-radius:3px',
      // Background rides the theme brand color; the knocked-out text uses the
      // ink-inverted token (white in light / dark in dark) which stays legible
      // on the brand color both in the default state (ink) and under any
      // style theme (accent) — brand-primary-invert is only designed under
      // themes and equals brand-primary in the default state.
      'background:var(--dsw-alias-brand-primary)', 'color:var(--dsw-alias-label-primary-inverted)',
      'letter-spacing:.08em',
    ].join(';')
    badge.textContent = custom.wordmarkBadge
    cluster.append(badge)
  }
  return cluster
}

/** Hide (or unhide) the ORIGINAL node; safe because these components never
 * pass a style prop, so React does not manage the inline style back. */
function setHidden(node: Element | null, hidden: boolean): void {
  if (node === null) return
  ;(node as HTMLElement).style.display = hidden ? 'none' : ''
}

/** Expanded sidebar brand: replace the wordmark art with logo+wordmark+badge. */
function applySidebarBrand(custom: CustomBrandConfig): void {
  const d = DEFAULT_CUSTOM_BRAND
  const customized = custom.logo !== d.logo
    || custom.wordmark !== d.wordmark
    || custom.wordmarkBadge !== d.wordmarkBadge
  const art = document.querySelector(ART_SELECTOR)
  const mine = document.querySelector(`[${ART_MARK}="1"]`)
  if (!customized) {
    mine?.remove()
    setHidden(art, false)
    lastSidebar = ''
    return
  }
  if (!art) {
    mine?.remove()
    lastSidebar = ''
    return
  }
  setHidden(art, true)
  const sig = `${custom.logo}\u0000${custom.wordmark}\u0000${custom.wordmarkBadge}`
  if (sig === lastSidebar && mine !== null) return
  lastSidebar = sig
  const cluster = buildCluster(custom)
  if (mine !== null) mine.replaceWith(cluster)
  else art.insertAdjacentElement('afterend', cluster)
}

/** Collapsed-rail fish → custom logo. */
function applyRailBrand(custom: CustomBrandConfig): void {
  const d = DEFAULT_CUSTOM_BRAND
  const fish = document.querySelector(RAIL_SELECTOR)
  const mine = document.querySelector(`[${RAIL_MARK}="1"]`)
  if (custom.logo === d.logo) {
    mine?.remove()
    setHidden(fish, false)
    lastRail = ''
    return
  }
  if (!fish) {
    mine?.remove()
    lastRail = ''
    return
  }
  setHidden(fish, true)
  if (custom.logo === lastRail && mine !== null) return
  lastRail = custom.logo
  const repl = renderMarkup(custom.logo, 20)
  repl.style.color = 'var(--dsw-alias-brand-primary)'
  repl.setAttribute(RAIL_MARK, '1')
  if (mine !== null) mine.replaceWith(repl)
  else fish.insertAdjacentElement('afterend', repl)
}

/** New-session hero: fish → the custom logo (same SVG as the sidebar brand),
 * headline text → custom headline. */
function applyHeroBrand(custom: CustomBrandConfig): void {
  const d = DEFAULT_CUSTOM_BRAND
  const fish = document.querySelector(HERO_SELECTOR)
  const mine = document.querySelector(`[${HERO_MARK}="1"]`)

  // Icon (reuses the logo setting)
  if (custom.logo === d.logo) {
    mine?.remove()
    setHidden(fish, false)
    lastHero = ''
  } else if (fish) {
    setHidden(fish, true)
    if (custom.logo !== lastHero || mine === null) {
      lastHero = custom.logo
      const repl = renderMarkup(custom.logo, 26)
      repl.style.color = 'var(--dsw-alias-brand-primary)'
      repl.setAttribute(HERO_MARK, '1')
      if (mine !== null) mine.replaceWith(repl)
      else fish.insertAdjacentElement('afterend', repl)
    }
  }

  // Headline text — the span right after the fish hitbox. The original span
  // stays in place (React-managed text is overwritten safely); re-apply
  // whenever the text no longer matches the desired value.
  const hitbox = fish?.parentElement
  const text = hitbox?.nextElementSibling as HTMLElement | null
  if (!text) return
  if (custom.headline !== d.headline) {
    if (text.textContent !== custom.headline) {
      savedHeadline ??= text.textContent
      text.textContent = custom.headline
    }
  } else if (savedHeadline !== null && text.textContent !== savedHeadline) {
    text.textContent = savedHeadline
    savedHeadline = null
  }
}

/** Apply every brand element for the current config (restores when reset). */
export function applyBrand(custom: CustomBrandConfig): void {
  applySidebarBrand(custom)
  applyRailBrand(custom)
  applyHeroBrand(custom)
}
