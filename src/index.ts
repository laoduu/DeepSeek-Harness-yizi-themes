/**
 * dsh-yizi-themes — host (Node) half.
 *
 * Registers the brand-mapping service that holds the plugin config and exposes
 * applyMappings(). The browser half persists custom-brand edits through the
 * CORE `ui-theme` settings namespace (the api-proxy only exposes that
 * allowlisted namespace to browsers; a plugin-registered namespace is not
 * remotely readable or writable). Config arrives from cordis.yml; no runtime
 * schema is declared here.
 */
import { Service, type Context } from '@deepseek-ai/cordis'
import { applyBrandMappings } from '../config.ts'
import type { Config } from '../config.ts'

export const name = 'dsh-yizi-themes'

/**
 * Brand-mapping service: holds the user config and rewrites brand strings.
 * Other plugins (or the browser half through the config transport) read the
 * current config and call applyMappings().
 */
export class BrandMappingService extends Service {
  private config: Config

  constructor(ctx: Context, config: Config) {
    super(ctx, 'brandMapping')
    this.config = config
  }

  /** Return a copy of the current config. */
  getConfig(): Config {
    return { ...this.config }
  }

  /** Apply the configured brand mappings to a piece of text. */
  applyMappings(text: string): string {
    return applyBrandMappings(this.config, text)
  }
}

export function apply(ctx: Context, config: Config): void {
  // The Service constructor registers itself via ctx.reflect.provide(name, this);
  // do NOT call ctx.provide() again or Cordis reports a duplicate registration.
  new BrandMappingService(ctx, config)
}
