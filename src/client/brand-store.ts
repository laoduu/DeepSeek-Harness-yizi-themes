/**
 * Reactive custom-brand config store shared by the slot components and the
 * legacy DOM fallback.
 *
 * The rc.8+ Harness composes deployment branding through SLOTS
 * (`sidebar.brand.mark`, `sidebar.brand.name`, `conversation.hero.brand.mark`),
 * so the plugin renders the custom brand through those slots (React, reactive).
 * Older cores without the slots fall back to DOM surgery. Both paths read the
 * same config through this store, and the strategy flag below tells the DOM
 * path whether the modern (slot) path is already the source of truth.
 */
import { DEFAULT_CUSTOM_BRAND, type CustomBrandConfig } from './theme-settings.ts'

/** Current config; replaced wholesale on every change (stable snapshot identity). */
let current: CustomBrandConfig = DEFAULT_CUSTOM_BRAND
/** Config-change listeners (the useSyncExternalStore subscribe side). */
const listeners = new Set<() => void>()
/** True once the brand slots have registered (modern, rc.8+ path active). */
let modernActive = false

function emit(): void {
  for (const listener of [...listeners]) listener()
}

/** External store for React slot components. */
export const brandStore = {
  /** Stable snapshot reference between changes (uSES contract). */
  getSnapshot(): CustomBrandConfig {
    return current
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },
  /** Replace the config and notify every subscriber. */
  set(next: CustomBrandConfig): void {
    current = next
    emit()
  },
}

/** Whether the modern (brand-slot) path is the active brand renderer. */
export function isModernBrandPath(): boolean {
  return modernActive
}

/** Mark the modern slot path active (called when the brand slots register). */
export function markModernBrandPath(): void {
  modernActive = true
}
