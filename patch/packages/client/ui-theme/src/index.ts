/** Host registration for the browser theme preference and pre-plugin palette. */

import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { injectBootTheme } from './boot-theme.ts'
import {
  DEFAULT_PREFERENCE, DEFAULT_THEME, THEME_SETTINGS_NAMESPACE, ThemeSettingsSchema,
  type ThemeSettings,
} from './theme-settings.ts'

export {
  DEFAULT_PREFERENCE, DEFAULT_THEME, THEME_FIELD, THEME_PREFERENCE_FIELD,
  THEME_PREFERENCES, THEME_SETTINGS_NAMESPACE, type ThemePreference, type ThemeSettings,
} from './theme-settings.ts'

const THEME_NAMESPACE = settingsNamespace(THEME_SETTINGS_NAMESPACE)

/** Read the registered preference or use the schema default without a settings provider. */
function readSection(ctx: Context): ThemeSettings {
  const settings = ctx.get('settings')
  if (settings === undefined) return { preference: DEFAULT_PREFERENCE, theme: DEFAULT_THEME }
  const section = settings.get(THEME_NAMESPACE) as ThemeSettings | undefined
  if (section === undefined) return { preference: DEFAULT_PREFERENCE, theme: DEFAULT_THEME }
  return section
}

/**
 * Register the durable theme section and initial-theme index transform when
 * their optional Host services are composed.
 * @param ctx - Host context that may acquire settings and HTTP services.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(THEME_NAMESPACE, ThemeSettingsSchema)
  })
  ctx.inject(['webServer'], (httpCtx) => {
    httpCtx.effect(
      () => httpCtx.webServer.tapIndex(html => {
        const section = readSection(ctx)
        return injectBootTheme(html, section.preference, section.theme)
      }),
      'client-ui-theme: initial theme bootstrap',
    )
  })
}
