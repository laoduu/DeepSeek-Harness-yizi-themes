/**
 * Host-rendered theme bootstrap for the browser's pre-plugin interval. Each
 * index response embeds the current durable built-in preference; the browser
 * resolves only `system`, then writes the same DOM fields ui-layout's
 * ThemePresenter owns after the client plugin tree activates. When a durable
 * style theme is selected the bootstrap also adds the `theme-<id>` body class
 * so the overrides sheet paints before the plugin tree loads.
 */

import { DEFAULT_PREFERENCE, DEFAULT_THEME, type ThemePreference } from './theme-settings.ts'

/** Build the inline script for one schema-validated built-in preference and style theme. */
function bootThemeScript(preference: ThemePreference, theme = DEFAULT_THEME): string {
  return `<script>(() => {
  const preference = ${JSON.stringify(preference)}
  const theme = ${JSON.stringify(theme)}
  const systemDark = preference === 'system'
    && typeof matchMedia !== 'undefined'
    && matchMedia('(prefers-color-scheme: dark)').matches
  const dark = preference === 'dark' || systemDark
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  document.body.toggleAttribute('data-ds-dark-theme', dark)
  if (theme !== ${JSON.stringify(DEFAULT_THEME)}) document.body.classList.add('theme-' + theme)
})()</script>`
}

/**
 * Insert the theme bootstrap immediately after the opening body tag, before
 * the shell mount and module script. Body-less fragments receive it at the
 * end, where the HTML parser has already synthesized a body.
 * @param html - Raw application index HTML.
 * @param preference - Current Host-backed built-in preference.
 * @param theme - Current Host-backed style theme id (default when none).
 * @returns HTML containing the theme bootstrap.
 */
export function injectBootTheme(
  html: string,
  preference: ThemePreference = DEFAULT_PREFERENCE,
  theme = DEFAULT_THEME,
): string {
  const script = bootThemeScript(preference, theme)
  const body = /<body(?:\s[^>]*)?>/i.exec(html)
  if (body === null) return `${html}${script}`
  const at = body.index + body[0].length
  return `${html.slice(0, at)}${script}${html.slice(at)}`
}
