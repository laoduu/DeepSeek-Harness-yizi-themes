/**
 * Settings navigation icon for the "Appearance / 主题外观" section.
 *
 * Deliberately distinct from PaletteIcon (which already marks the header
 * picker and the /theme row): this glyph pairs a paint plate with a
 * light/dark split dot, so the section reads as "appearance and colour
 * mode" rather than "pick a palette". Single-color `currentColor`, matching
 * the platform icon style; the shell owns the row, label and hover state.
 *
 * Registered into `settings.section.icon` under the same id as the
 * `settings.section` contribution — an unmatched id never renders.
 */
export function ThemeSectionIcon({ size = 16, active }: { size?: number; active?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      data-yizi-section-icon={active === true ? 'active' : undefined}
    >
      {/* Paint plate. */}
      <path
        d="M6.9 1.9C3.9 2.3 1.6 4.8 1.6 7.9c0 3.3 2.6 5.8 5.9 5.8h1.1c.8 0 1.4-.6 1.4-1.4 0-.4-.2-.8-.4-1.1-.3-.4-.5-.8-.5-1.2 0-.8.7-1.4 1.5-1.4h1.2c1.7 0 2.9-1.1 2.9-2.7C14.7 3.1 11.2 1.3 6.9 1.9Z"
        fill={active === true ? 'currentColor' : 'none'}
        fillOpacity={active === true ? 0.14 : undefined}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {/* Three paint dots on the plate. */}
      <circle cx="4.6" cy="5.6" r="0.95" fill="currentColor" />
      <circle cx="7.2" cy="4.3" r="0.85" fill="currentColor" />
      <circle cx="9.6" cy="5.2" r="0.8" fill="currentColor" />
      {/* Light/dark split dot: the "appearance" half of the meaning. */}
      <circle cx="12.1" cy="11.1" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.15" />
      <path d="M12.1 8.8a2.3 2.3 0 0 0 0 4.6V8.8Z" fill="currentColor" />
    </svg>
  )
}
