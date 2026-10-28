/**
 * Custom palette glyph shared by the header controls and the /theme command
 * row: outlined paint plate + four paint dots, single-color currentColor to
 * match the platform icon style (the platform icon set has no palette icon).
 */
export function PaletteIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 1.6C4.3 1.6 1.5 4.3 1.5 7.8c0 3.4 2.6 5.7 5.9 5.7h1.2c.8 0 1.4-.6 1.4-1.4 0-.4-.2-.8-.4-1.1-.3-.4-.5-.8-.5-1.2 0-.8.7-1.5 1.5-1.5h1.5c1.8 0 3.1-1.2 3.1-2.9C15.2 4 12 1.6 8 1.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="4.8" cy="5.1" r="1" fill="currentColor" />
      <circle cx="7.7" cy="3.9" r="0.9" fill="currentColor" />
      <circle cx="10.7" cy="4.9" r="0.9" fill="currentColor" />
      <circle cx="3.7" cy="8.8" r="0.8" fill="currentColor" />
    </svg>
  )
}
