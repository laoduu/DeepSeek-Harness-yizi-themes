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

/** Hero fish presence ⇔ blank/new-session state (the header is hidden then). */
const HERO_SELECTOR = 'svg[viewBox="0 0 23.16 17.04"][width="34"]'

/** Handle to the mounted floating controls. */
export interface FloatingControlsHandle {
  /** Re-evaluate visibility against the current DOM (call on mutations). */
  sync(): void
  /** Unmount and remove the host. */
  dispose(): void
}

/** Mount the floating theme/mode controls; returns a visibility sync handle. */
export function mountFloatingControls(injected: HeaderControlsProps): FloatingControlsHandle {
  const host = document.createElement('div')
  host.id = 'dsw-yizi-floating-controls'
  // Aligned with the conversation column's chrome (root padding 12px 28px).
  host.style.cssText = [
    'position:fixed', 'top:12px', 'right:28px', 'z-index:200',
    'display:flex', 'align-items:center', 'gap:8px',
  ].join(';')
  document.body.append(host)

  const root = createRoot(host)
  root.render(<HeaderControls {...injected} />)

  const sync = (): void => {
    host.style.display = document.querySelector(HERO_SELECTOR) !== null ? '' : 'none'
  }
  sync()

  return {
    sync,
    dispose: () => {
      root.unmount()
      host.remove()
    },
  }
}
