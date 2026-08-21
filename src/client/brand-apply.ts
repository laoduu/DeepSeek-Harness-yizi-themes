/**
 * Apply the persisted custom brand.
 *
 * Two render paths, selected automatically:
 *
 * 1. MODERN (Harness rc.8+, the official extension surface). The shell composes
 *    deployment branding through slots — `sidebar.brand.mark`,
 *    `sidebar.brand.name` and `conversation.hero.brand.mark`. The plugin
 *    registers those slots (see brand-slots.tsx) and renders the custom brand
 *    reactively. No DOM surgery: the React tree is the source of truth and
 *    survives any Harness upgrade that keeps the slot contract.
 *
 * 2. LEGACY (cores without the brand slots, e.g. the npm-published rc.5).
 *    DOM fingerprint surgery on stable SVG viewBox attributes, kept here so
 *    older builds keep working. React-safety rule: NEVER replace, move, or
 *    remove a React-managed node — React's fibers keep references to the
 *    originals, and removing one out from under React makes its next commit
 *    throw (NotFoundError on removeChild), blanking the sidebar. Instead each
 *    target is handled as:
 *     1. hide the ORIGINAL node with inline `display:none` (these components
 *        never pass a style prop, so React never touches the style back);
 *     2. insert OUR node as a sibling right after the original (React ignores
 *        nodes it did not create; our node leaves with the subtree on unmount);
 *     3. orphan cleanup: if the original is gone but our sibling remains,
 *        remove OUR node; a fresh original mount re-applies.
 *
 * Only the new-session HEADLINE has no slot on either path (the hero text is
 * `t('hero.headline')` with no seat), so the headline is always applied as a
 * single text write through the DOM — the one piece of brand DOM surgery that
 * survives on every build. On the modern path the headline is located by OUR
 * OWN `[data-yizi-hero-mark]` anchor (never core internals); on the legacy
 * path it is located by the fish viewBox.
 */
import { DEFAULT_CUSTOM_BRAND, type CustomBrandConfig } from './theme-settings.ts'
import { isModernBrandPath } from './brand-store.ts'

/** Stable SVG fingerprints of the built-in brand nodes (legacy path). */
const ART_SELECTOR = 'svg[viewBox="0 0 182 24"]'
const RAIL_SELECTOR = 'svg[viewBox="0 0 23.16 17.04"][width="24"]'
const HERO_SELECTOR = 'svg[viewBox="0 0 23.16 17.04"][width="34"]'

/** Markers on OUR replacement nodes (legacy path). */
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

/** The sidebar brand cluster: logo + wordmark + badge (legacy path). */
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

/** Expanded sidebar brand: replace the wordmark art with logo+wordmark+badge (legacy). */
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

/** Collapsed-rail fish → custom logo (legacy). */
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

/** New-session hero: fish → the custom logo (legacy). Headline handled below. */
function applyHeroBrandIcon(custom: CustomBrandConfig): void {
  const d = DEFAULT_CUSTOM_BRAND
  const fish = document.querySelector(HERO_SELECTOR)
  const mine = document.querySelector(`[${HERO_MARK}="1"]`)
  if (custom.logo === d.logo) {
    mine?.remove()
    setHidden(fish, false)
    lastHero = ''
    return
  }
  if (!fish) {
    mine?.remove()
    lastHero = ''
    return
  }
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

/**
 * Locate the new-session hero headline span.
 *
 * Modern path: OUR slot-rendered hero mark (`[data-yizi-hero-mark]`) is the
 * anchor — it sits inside the slot anchor div (display:contents) which sits
 * inside the hero's fish-hitbox span, and the headline is that span's next
 * sibling. Anchoring on our own element (not core internals) is what keeps
 * this stable across Harness upgrades.
 *
 * Legacy path: the core fish SVG (viewBox fingerprint) anchors the same chain.
 */
function locateHeroHeadline(): HTMLElement | null {
  const mine = document.querySelector('[data-yizi-hero-mark="1"]')
  if (mine !== null) {
    // my wrapper -> slot anchor div (display:contents) -> fish hitbox span.
    const anchor = mine.parentElement
    const hitbox = anchor?.parentElement
    const sibling = hitbox?.nextElementSibling
    if (sibling instanceof HTMLElement && (sibling.textContent ?? '').trim() !== '') return sibling
    // Structural safety: scan upward for the first element with a text sibling.
    let node: Element | null = mine
    for (let i = 0; i < 4 && node !== null; i++) {
      const sib = node.nextElementSibling
      if (sib instanceof HTMLElement && (sib.textContent ?? '').trim() !== '') return sib
      node = node.parentElement
    }
    return null
  }
  const fish = document.querySelector(HERO_SELECTOR)
  const hitbox = fish?.parentElement
  const sibling = hitbox?.nextElementSibling
  return sibling instanceof HTMLElement ? sibling : null
}

/** Apply the hero headline text (the one brand piece with no slot on any path). */
function applyHeroHeadline(custom: CustomBrandConfig): void {
  const d = DEFAULT_CUSTOM_BRAND
  const text = locateHeroHeadline()
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

/**
 * Remove every artifact the LEGACY DOM path inserted and restore the originals
 * it hid — called when the modern slot path takes over, so the slot-rendered
 * brand is the single source of truth (no duplicate logos).
 */
export function cleanupLegacyBrandDom(): void {
  document.querySelectorAll(`[${ART_MARK}="1"], [${RAIL_MARK}="1"], [${HERO_MARK}="1"]`)
    .forEach((node) => node.remove())
  document.querySelectorAll(`${ART_SELECTOR}, ${RAIL_SELECTOR}, ${HERO_SELECTOR}`)
    .forEach((node) => { (node as HTMLElement).style.display = '' })
  lastSidebar = ''
  lastRail = ''
  lastHero = ''
  savedHeadline = null
}

/** Apply every brand element for the current config (restores when reset). */
export function applyBrand(custom: CustomBrandConfig): void {
  if (isModernBrandPath()) {
    // The slots render the marks and the name; only the headline needs DOM.
    applyHeroHeadline(custom)
    return
  }
  applySidebarBrand(custom)
  applyRailBrand(custom)
  applyHeroBrandIcon(custom)
  applyHeroHeadline(custom)
}
