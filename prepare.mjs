// prepare.mjs — builds the plugin's Node half and browser client bundle.
// Runs on `pnpm prepare` (git install) and `pnpm build`.
//
// Structure mirrors official client plugins:
//   package.json   → declares main/exports/dsh.client manifest (root)
//   dist/index.js  → Node half (host entry, ESM, external deps resolved by Harness)
//   dist/client.js → Browser half (CJS self-contained, served as /plugins/<id>/client.js)
//   dist/cordis.patch.yml → bundle patch
// Note: dist/ intentionally has NO package.json — the root manifest is authoritative.
import { mkdirSync, rmSync, copyFileSync, readdirSync, renameSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

// Resolve tsdown from the Harness checkout (not a dependency of this package).
// Try in order: $DSH_HARNESS (explicit), the original dev-machine path the
// plugin was authored against, the sibling checkout on this machine, then any
// path found by walking up from the cwd. Fail loudly with guidance.
import { existsSync } from 'node:fs'
const require = createRequire(import.meta.url)
const tsdownCandidates = [
  process.env.DSH_HARNESS,
  'C:/Users/Administrator/deepseek-harness',
  'E:/mycode/deepseek-harness',
].filter(Boolean).map((base) => `${base.replace(/[\\/]+$/, '')}/node_modules/tsdown/dist/index.mjs`)
let tsdownEntry
for (const candidate of tsdownCandidates) {
  if (existsSync(candidate)) { tsdownEntry = candidate; break }
}
if (tsdownEntry === undefined) {
  console.error(
    'dsh-yizi-themes: could not locate tsdown. Point $DSH_HARNESS at your DeepSeek Harness checkout,\n' +
    'or add its node_modules/tsdown/dist/index.mjs to the candidate list in prepare.mjs.',
  )
  process.exit(1)
}
const { build } = require(tsdownEntry)

const root = dirname(fileURLToPath(import.meta.url))
const dist = resolve(root, 'dist')

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

// Copy the patch file into dist so the installed package ships it alongside
// the bundle artifacts.
copyFileSync(resolve(root, 'cordis.patch.yml'), resolve(dist, 'cordis.patch.yml'))

// ── Node half (host) ──────────────────────────────────────────────────────
// ESM entry; dependency imports stay external (Harness resolves them).
await build({
  entry: resolve(root, 'src/index.ts'),
  outDir: resolve(dist),
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  dts: false,
  clean: false,
  silent: true,
})
for (const file of readdirSync(dist)) {
  if (file === 'index.mjs') {
    renameSync(resolve(dist, 'index.mjs'), resolve(dist, 'index.js'))
    break
  }
}

// ── Browser half (client) ─────────────────────────────────────────────────
// Must emit `client.js` wrapped in the loader registration handoff:
//   window.__ModuleLoader__.load({ id: 'dsh-yizi-themes', factory: (require) => { ... } })
// The client loader (dsh-client-modules) serves /plugins/dsh-yizi-themes/client.js
// and fails the bundle if it does not register via __ModuleLoader__.load.
await build({
  entry: { client: resolve(root, 'src/client/index.ts') },
  outDir: resolve(dist),
  format: 'cjs',
  platform: 'browser',
  target: 'es2024',
  dts: false,
  clean: false,
  silent: true,
  outputOptions: {
    entryFileNames: 'client.js',
    banner: 'window.__ModuleLoader__.load({ id: "dsh-yizi-themes", factory: (require) => {',
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
  // External only the platform seed modules the loader's module table
  // provides; everything else (clsx, our own code) is inlined into the bundle.
  // Mirrors the official clientBundle preset: external wins for table entries,
  // bundle all non-table dependencies.
  external: [
    '@deepseek-ai/dsh-client-runtime/client',
    '@deepseek-ai/dsh-client-ui-primitives',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-client-ui-settings',
    '@deepseek-ai/dsh-settings',
    '@deepseek-ai/dsh-client-connection',
    '@deepseek-ai/dsh-client-locale',
    '@deepseek-ai/dsh-client-ui-theme',
    'react',
    'react/jsx-runtime',
    'react-dom/client',
  ],
  noExternal: (id) => ([
    '@deepseek-ai/dsh-client-runtime/client',
    '@deepseek-ai/dsh-client-ui-primitives',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-client-ui-settings',
    '@deepseek-ai/dsh-settings',
    '@deepseek-ai/dsh-client-connection',
    '@deepseek-ai/dsh-client-locale',
    '@deepseek-ai/dsh-client-ui-theme',
    'react',
    'react/jsx-runtime',
    'react-dom/client',
  ].includes(id) ? undefined : true),
})
for (const file of readdirSync(dist)) {
  if (file === 'client.cjs') {
    renameSync(resolve(dist, 'client.cjs'), resolve(dist, 'client.js'))
    break
  }
}

console.log('dsh-yizi-themes: built dist/index.js + dist/client.js + dist/cordis.patch.yml')
