/**
 * Defensive lookups into the platform UI-primitives module.
 *
 * The Harness icon/asset export names move between generations (the
 * `0.2`-generation rename `<Name>16` → `<Name>Regular` is one example). A hard
 * named import of a name the running build no longer exports evaluates to
 * `undefined`, and React then fails the whole render with "element type is
 * invalid". Resolving through the module namespace lets the plugin degrade
 * (no glyph) instead of breaking the page, and keeps older builds working.
 */
import * as uiPrimitives from '@deepseek-ai/dsh-client-ui-primitives'

/** Props accepted by the platform icon/asset components. */
export interface IconProps {
  /** Rendered width/height in px. */
  size?: number
  /** Extra class for layout placement. */
  className?: string
}

/** A platform icon/asset component. */
export type IconComponent = (props: IconProps) => unknown

/**
 * Return the first exported component among `names`.
 * @param names - candidate export names, newest generation first.
 * @returns the component, or undefined when the running build exports none.
 */
export function resolveIcon(...names: string[]): IconComponent | undefined {
  const table = uiPrimitives as unknown as Record<string, IconComponent | undefined>
  for (const name of names) {
    const icon = table[name]
    if (typeof icon === 'function') return icon
  }
  return undefined
}
