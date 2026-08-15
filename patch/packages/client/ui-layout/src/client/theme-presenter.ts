/**
 * Global theme DOM applier: projects the resolved ThemeSnapshot onto the
 * document — `html { color-scheme }` for native UA chrome (scrollbars, form
 * controls), `body[data-ds-dark-theme]` for the token palette, the active
 * theme's alias-token overrides as inline CSS variables on body, a
 * `theme-<id>` class on body when a style theme is active (the
 * `body.theme-<id>` overrides sheet keys off it), and one presenter-owned
 * `meta[name="theme-color"]` for surrounding browser UI. Pure DOM writes, no
 * React involvement; the presenter only ever retracts what it wrote itself,
 * so foreign attributes, metadata, and inline styles survive.
 */
import type { ThemeSnapshot } from '@deepseek-ai/dsh-client-ui-theme/client'

/** Body attribute selecting the dark base palette in the token stylesheets. */
export const DARK_ATTRIBUTE = 'data-ds-dark-theme'

/** Class prefix of the style-theme overrides sheet (`body.theme-<id>`). */
const THEME_CLASS_PREFIX = 'theme-'

/** Id meaning "no style theme": the built-in light/dark token palettes apply.
 *  Kept package-local — the client bundle purity gate forbids a value import
 *  from ui-theme; the id is part of the shared settings contract. */
const DEFAULT_THEME = 'default'

/** Applies theme snapshots to the document; one instance per plugin fiber. */
export class ThemePresenter {
  /** Token names this presenter wrote in the last apply (its retraction set). */
  private appliedTokens: string[] = []
  /** The single metadata node this presenter inserts and removes. */
  private readonly themeColorMeta: HTMLMetaElement

  /** Create the presenter-owned metadata node before the first snapshot arrives. */
  constructor() {
    this.themeColorMeta = document.createElement('meta')
    this.themeColorMeta.name = 'theme-color'
  }

  /**
   * Project a snapshot onto the document: set root `color-scheme` and the body
   * palette attribute from `active.colorScheme` (never the id — `system` is
   * resolved upstream), retint the style-theme class from `snapshot.theme`,
   * then replace the previously applied token variables with `active.tokens`.
   * Browser theme-color metadata follows the computed body background after
   * those writes, so the rendered palette remains the color authority.
   * @param snapshot - resolved theme snapshot from ctx.theme.
   */
  apply(snapshot: ThemeSnapshot): void {
    const scheme = snapshot.active.colorScheme
    document.documentElement.style.colorScheme = scheme
    const body = document.body
    if (scheme === 'dark') body.setAttribute(DARK_ATTRIBUTE, '')
    else body.removeAttribute(DARK_ATTRIBUTE)
    this.applyThemeClass(body, snapshot.theme)
    for (const name of this.appliedTokens) body.style.removeProperty(name)
    this.appliedTokens = []
    for (const [name, value] of Object.entries(snapshot.active.tokens)) {
      body.style.setProperty(name, value)
      this.appliedTokens.push(name)
    }
    this.themeColorMeta.content = getComputedStyle(body).backgroundColor
    if (!this.themeColorMeta.isConnected) document.head.append(this.themeColorMeta)
  }

  /**
   * Retract root color-scheme, the palette attribute, token variables, the
   * style-theme class, and the owned metadata node.
   */
  dispose(): void {
    document.documentElement.style.removeProperty('color-scheme')
    const body = document.body
    body.removeAttribute(DARK_ATTRIBUTE)
    this.removeThemeClass(body)
    for (const name of this.appliedTokens) body.style.removeProperty(name)
    this.appliedTokens = []
    this.themeColorMeta.remove()
  }

  /** Set the body class of the active style theme, retracting the previous one. */
  private applyThemeClass(body: HTMLElement, id: string): void {
    const next = id === DEFAULT_THEME ? undefined : `${THEME_CLASS_PREFIX}${id}`
    for (const cls of [...body.classList]) {
      if (cls.startsWith(THEME_CLASS_PREFIX)) body.classList.remove(cls)
    }
    if (next !== undefined) body.classList.add(next)
  }

  /** Remove every style-theme class this presenter may have set. */
  private removeThemeClass(body: HTMLElement): void {
    for (const cls of [...body.classList]) {
      if (cls.startsWith(THEME_CLASS_PREFIX)) body.classList.remove(cls)
    }
  }
}
