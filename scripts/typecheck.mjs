/**
 * Typecheck gate — LOCAL CODE ONLY.
 *
 * Every platform module (react, @deepseek-ai/*) is intentionally reached
 * through structural / defensive typing because the plugin must run against
 * several Harness generations whose exported types differ (icons renamed,
 * `setThemeId` present or absent, slot props reshaped). Full cross-generation
 * typing therefore cannot be clean, and pretending otherwise would either
 * force `as any` everywhere or pin the plugin to one Harness build.
 *
 * This gate keeps the value the DEVLOG asked for: it declares the platform
 * modules as `any` shims and typechecks OUR OWN sources, so a typo, an
 * undeclared identifier (the `inkL` incident), a wrong property on one of our
 * own types, or a dead import is caught before publishing — while platform API
 * drift stays a runtime concern handled by the compat audits.
 *
 * The shim file and generated tsconfig live in a temp directory; nothing is
 * written into the repository.
 */
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { requireTsc } from './harness-resolve.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { tsc } = requireTsc()

/** Ambient declarations: platform modules as `any`, plus the JSX surface. */
const SHIMS = `
declare module 'react' {
  export function useState<T>(initial: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void]
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void
  export function useRef<T>(initial: T | null): { current: T | null }
  export function useMemo<T>(factory: () => T, deps?: readonly unknown[]): T
  export function useCallback<T>(callback: T, deps?: readonly unknown[]): T
  export function useSyncExternalStore<T>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => T,
    getServerSnapshot?: () => T,
  ): T
  export const createElement: any
  export const Fragment: any
  const React: any
  export default React
}

declare namespace React {
  type CSSProperties = Record<string, string | number | undefined>
  type ReactElement = any
  type ReactNode = any
  type ReactNodeArray = any[]
  type ChangeEvent<T = any> = { target: T; currentTarget: T }
  type MouseEvent<T = any> = { target: T; currentTarget: T }
}

declare module 'react-dom/client' {
  export const createRoot: any
}

declare module 'react/jsx-runtime' {
  export const jsx: any
  export const jsxs: any
  export const Fragment: any
}

declare module '@deepseek-ai/cordis' {
  export type Context = any
  export class Service {
    constructor(ctx: unknown, name: string)
  }
}

declare module '@deepseek-ai/dsh-client-store' {
  export const defineStore: any
  export type EngineStoreHandle<A, B> = any
}

declare module '@deepseek-ai/dsh-client-ui-primitives' {
  export const FishLogo: any
  export const IconDarkOutlineRegular: any
  export const IconDarkOutlineMedium: any
  export const IconDarkOutline16: any
  export const IconLightOutlineRegular: any
  export const IconLightOutlineMedium: any
  export const IconLightOutline16: any
  export type IconComponent = any
  export const createIcon: any
}

declare module '@deepseek-ai/dsh-client-ui-theme/client' {
  export type ThemeRuntime = any
  export type ThemeSnapshot = any
  export type ThemeDefinition = any
  export type ThemePreference = any
}

declare module '@deepseek-ai/dsh-client-ui-settings/client' {}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  export type PropsLocale<K extends string = string> = any
  export type PropsRuntime<K extends string = string> = any
  export type PropsStore<S = any> = any
  export interface LocaleNamespaceMap {}
}

declare namespace JSX {
  interface Element {}
  interface ElementClass {}
  interface ElementAttributesProperty {}
  interface ElementChildrenAttribute { children: {} }
  interface IntrinsicAttributes {}
  interface IntrinsicClassAttributes<T> {}
  interface IntrinsicElements { [name: string]: any }
}

declare module '*.css' {
  const content: string
  export default content
}
`

const tempDir = mkdtempSync(join(tmpdir(), 'dsh-yizi-typecheck-'))
const shimPath = join(tempDir, 'platform-shims.d.ts')
const configPath = join(tempDir, 'tsconfig.json')

const generated = {
  extends: join(root, 'tsconfig.json'),
  compilerOptions: {
    jsx: 'react-jsx',
    // The platform shims are `any`, so callbacks that the real packages type
    // (store selectors, event handlers) arrive here as implicit `any`. That
    // noise is expected; the gate's job is the LOCAL code: undeclared
    // identifiers, wrong properties on our own types, dead imports.
    noImplicitAny: false,
  },
  include: [
    shimPath,
    join(root, 'src', '**', '*.ts'),
    join(root, 'src', '**', '*.tsx'),
    join(root, 'config.ts'),
  ],
}

writeFileSync(shimPath, SHIMS, 'utf8')
writeFileSync(configPath, JSON.stringify(generated, null, 2), 'utf8')

try {
  const result = spawnSync(
    process.execPath,
    [tsc, '-p', configPath, '--pretty', 'false', '--noEmit'],
    { cwd: root, stdio: 'inherit' },
  )
  process.exit(result.status ?? 1)
} finally {
  rmSync(tempDir, { recursive: true, force: true })
}
