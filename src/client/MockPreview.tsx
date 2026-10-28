/**
 * Mini mock-UI preview for theme cards: a tiny app window (brand rail + chat
 * area) painted from the theme's two swatch colors, with every other tone
 * mixed inline via CSS `color-mix` so both light and dark palettes read
 * correctly without extra per-theme data.
 */
export function MockPreview({ swatch }: { swatch: readonly [string, string] }) {
  const [bg, accent] = swatch
  return (
    <span className="dsw-yizi-mock" style={{ background: bg }} aria-hidden="true">
      <span className="dsw-yizi-mock-rail" style={{ background: `color-mix(in srgb, ${bg} 90%, ${accent})` }}>
        <span className="dsw-yizi-mock-dot" style={{ background: accent }} />
        <span className="dsw-yizi-mock-bar" style={{ background: `color-mix(in srgb, ${bg} 62%, ${accent})` }} />
        <span className="dsw-yizi-mock-bar" style={{ background: `color-mix(in srgb, ${bg} 74%, ${accent})` }} />
      </span>
      <span className="dsw-yizi-mock-main">
        <span className="dsw-yizi-mock-line" style={{ background: `color-mix(in srgb, ${bg} 78%, ${accent})` }} />
        <span className="dsw-yizi-mock-bubble" style={{ background: `color-mix(in srgb, ${accent} 24%, ${bg})` }} />
        <span className="dsw-yizi-mock-bubble left" style={{ background: `color-mix(in srgb, ${bg} 86%, ${accent})` }} />
      </span>
    </span>
  )
}
