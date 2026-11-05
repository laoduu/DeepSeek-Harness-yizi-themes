/**
 * Self-check: bundle the plugin's PURE client modules with esbuild and run
 * assertions against them in Node.
 *
 * Scope: the logic that has actually caused incidents or that a release could
 * silently break — the OKLCH derivation engine, WCAG contrast math, transfer
 * parse/merge, and the custom-theme normalization. (DOM/React surfaces are
 * covered by the runtime Doctor panel, which runs inside the real app.)
 *
 * The bundle uses esbuild from the Harness checkout (same resolver as the
 * build), so no extra dev dependency is needed.
 */
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { resolveHarness } from './harness-resolve.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const harness = resolveHarness()
if (harness === null) {
  console.error('dsh-yizi-themes: self-check needs a Harness checkout for esbuild.')
  process.exit(1)
}
const esbuild = require(join(harness.dir, 'node_modules', '.pnpm', 'node_modules', 'esbuild'))

const tempDir = mkdtempSync(join(tmpdir(), 'dsh-yizi-selfcheck-'))
const entry = join(tempDir, 'entry.ts')
const outfile = join(tempDir, 'bundle.cjs')

// One entry re-exporting the pure modules under test.
writeFileSync(entry, `
export * from ${JSON.stringify(join(root, 'src/client/custom-themes.ts'))}
export * from ${JSON.stringify(join(root, 'src/client/contrast.ts'))}
export * from ${JSON.stringify(join(root, 'src/client/transfer.ts'))}
export * from ${JSON.stringify(join(root, 'src/client/themes-list.ts'))}
export { zh, en, ja, es, fr, de, ru, pt } from ${JSON.stringify(join(root, 'src/client/locales.ts'))}
export { createThemesStore as createThemesStoreForTest, setStoreTranslate } from ${JSON.stringify(join(root, 'src/client/themes-store.ts'))}
`, 'utf8')

await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'node24',
  outfile,
  logLevel: 'error',
  // localStorage is only touched by the persistence helpers, which the check
  // calls with an explicit stub injected below.
})

// Minimal localStorage stub so load/save helpers are safe to exercise.
const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => { store.set(k, String(v)) },
  removeItem: (k) => { store.delete(k) },
}

const mod = require(outfile)

/** All eight dictionaries, keyed by language. */
mod.DICTIONARIES = {
  zh: mod.zh, en: mod.en, ja: mod.ja, es: mod.es,
  fr: mod.fr, de: mod.de, ru: mod.ru, pt: mod.pt,
}

let passed = 0
const failures = []
function check(name, fn) {
  try {
    fn()
    passed += 1
  } catch (error) {
    failures.push(`${name}: ${error.message}`)
  }
}
function assert(condition, message) {
  if (!condition) throw new Error(message)
}
function assertEqual(actual, expected, message) {
  if (actual !== expected) throw new Error(`${message} (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`)
}

// ── OKLCH derivation engine ──────────────────────────────────────────────
check('deriveLightBg returns a hex color', () => {
  const bg = mod.deriveLightBg('#002fa7')
  assert(/^#[0-9a-f]{6}$/.test(bg), `not hex: ${bg}`)
})

check('deriveLightBg is near-white for any accent', () => {
  const r = parseInt(mod.deriveLightBg('#000000').slice(1, 3), 16)
  assert(r > 200, `light bg too dark: ${mod.deriveLightBg('#000000')}`)
})

check('deriveDarkBg is near-black for any accent', () => {
  const r = parseInt(mod.deriveDarkBg('#ffffff').slice(1, 3), 16)
  assert(r < 80, `dark bg too bright: ${mod.deriveDarkBg('#ffffff')}`)
})

check('deriveInk produces a readable non-white tone', () => {
  const ink = mod.deriveInk('#0066cc')
  const lum = mod.relativeLuminance(ink)
  assert(lum < 0.2, `ink too light: ${ink} (L=${lum.toFixed(3)})`)
})

// The 0.5.6 incident: the neutral-ink border voice threw because `inkL`
// was undeclared in deriveDarkPalette. Exercises both border voices.
check('customThemeCss emits light and dark blocks for the brand border voice', () => {
  const css = mod.customThemeCss({
    id: 'custom-b', name: 'B', accent: '#0066cc',
    lightBg: mod.deriveLightBg('#0066cc'), darkBg: mod.deriveDarkBg('#0066cc'),
    borderStyle: 'brand',
  })
  assert(css.includes('body.theme-custom-b'), 'missing light selector')
  assert(css.includes('[data-ds-dark-theme]'), 'missing dark selector')
  assert(!css.includes('undefined'), 'emitted undefined value')
  assert(!css.includes('NaN'), 'emitted NaN value')
})

check('customThemeCss survives the neutral-ink border voice', () => {
  const css = mod.customThemeCss({
    id: 'custom-i', name: 'I', accent: '#ff6ec7',
    lightBg: mod.deriveLightBg('#ff6ec7'), darkBg: mod.deriveDarkBg('#ff6ec7'),
    borderStyle: 'ink',
  })
  assert(css.includes('body.theme-custom-i'), 'missing selector')
  assert(!css.includes('undefined') && !css.includes('NaN'), 'bad value emitted')
})

check('every declaration in a custom theme block is !important', () => {
  const css = mod.customThemeCss({
    id: 'custom-x', name: 'X', accent: '#123456',
    lightBg: '#f7f8fa', darkBg: '#111318',
  })
  const decls = css.split('\n').filter((line) => line.trim().startsWith('--'))
  assert(decls.length > 0, 'no declarations emitted')
  for (const decl of decls) assert(decl.trim().endsWith('!important;'), `not important: ${decl}`)
})

// ── WCAG contrast ───────────────────────────────────────────────────────
check('black on white is 21:1 (AAA)', () => {
  const ratio = mod.contrastRatio('#000000', '#ffffff')
  assert(Math.abs(ratio - 21) < 0.01, `ratio=${ratio}`)
  assertEqual(mod.rateContrast(ratio), 'AAA', 'rating')
})

check('identical colors are 1:1 and fail', () => {
  const ratio = mod.contrastRatio('#777777', '#777777')
  assertEqual(ratio, 1, 'ratio')
  assertEqual(mod.rateContrast(ratio), 'fail', 'rating')
})

check('rating thresholds land on AA and AA-large', () => {
  assertEqual(mod.rateContrast(4.5), 'AA', '4.5 should be AA')
  assertEqual(mod.rateContrast(3), 'AA-large', '3 should be AA-large')
  assertEqual(mod.rateContrast(2.9), 'fail', '2.9 should fail')
  assertEqual(mod.rateContrast(7), 'AAA', '7 should be AAA')
})

check('evaluatePalette returns one check per readable pair', () => {
  const checks = mod.evaluatePalette({
    brand: '#0050a0', ink: '#202020', lightBg: '#f7f9fc', darkBg: '#111318',
    darkBrand: '#6fa8e0', darkLabel: '#e6e8ec',
  })
  assertEqual(checks.length, 4, 'pair count')
  for (const check of checks) {
    assert(check.ratio >= 1 && check.ratio <= 21, `ratio out of range: ${check.ratio}`)
    assert(mod.RATING_ORDER.includes(check.rating), `bad rating ${check.rating}`)
  }
})

// ── Transfer (export / import) ──────────────────────────────────────────
const sampleTheme = {
  id: 'custom-abc', name: '海之蓝', accent: '#0066cc',
  lightBg: '#f2f7ff', darkBg: '#0b1220',
}
const sampleBrand = {
  logo: '', wordmark: 'DEEPSEEK', wordmarkBadge: 'HARNESS', headline: '探索未至之境', scale: 1,
  mappings: { enabled: false, deepseek: 'DeepSeek', deepseekChinese: '深度求索', harness: 'Harness', deepseekHarness: 'DeepSeek Harness' },
}

check('export → parse roundtrip preserves themes, brand, themeId', () => {
  const payload = mod.buildTransferPayload([sampleTheme], sampleBrand, 'custom-abc')
  assertEqual(payload.format, 'dsh-yizi-themes', 'format marker')
  const text = mod.serializeTransfer(payload)
  const parsed = mod.parseTransfer(text)
  assert(parsed.ok, 'parse should succeed')
  assertEqual(parsed.result.themes.length, 1, 'theme count')
  assertEqual(parsed.result.themes[0].name, '海之蓝', 'theme name')
  assertEqual(parsed.result.brand.wordmark, 'DEEPSEEK', 'brand wordmark')
  assertEqual(parsed.result.themeId, 'custom-abc', 'theme id')
})

check('export omits the themeId when the default theme is active', () => {
  const payload = mod.buildTransferPayload([], sampleBrand, 'default')
  assert(!('themeId' in payload), 'themeId should be omitted for default')
})

check('parse rejects malformed JSON, shapes and foreign files', () => {
  assertEqual(mod.parseTransfer('{not json').error, 'transfer.error.json', 'invalid json')
  assertEqual(mod.parseTransfer('[]').error, 'transfer.error.shape', 'array is not an object')
  assertEqual(mod.parseTransfer('{"format":"other"}').error, 'transfer.error.format', 'foreign format')
})

check('parse tolerates a partial document (themes only)', () => {
  const parsed = mod.parseTransfer(JSON.stringify({
    format: 'dsh-yizi-themes', version: 1,
    themes: [sampleTheme],
  }))
  assert(parsed.ok, 'should still parse')
  assertEqual(parsed.result.themes.length, 1, 'theme count')
  assertEqual(parsed.result.brand.wordmark, 'DEEPSEEK', 'brand defaults filled in')
})

check('parse drops unusable theme entries with a warning', () => {
  const parsed = mod.parseTransfer(JSON.stringify({
    format: 'dsh-yizi-themes', version: 1,
    themes: [sampleTheme, 'garbage', null],
    brand: sampleBrand,
  }))
  assert(parsed.ok, 'should parse')
  assertEqual(parsed.result.themes.length, 1, 'kept the valid theme only')
  assert(parsed.result.warnings.length >= 1, 'should warn about dropped entries')
})

check('importing an existing theme updates it in place (no duplicates)', () => {
  const updated = { ...sampleTheme, name: '海之蓝 v2' }
  const merged = mod.mergeThemes([sampleTheme], [updated])
  assertEqual(merged.length, 1, 'no duplicate id')
  assertEqual(merged[0].name, '海之蓝 v2', 'updated name wins')
})

check('importing new themes appends and keeps existing order', () => {
  const other = { ...sampleTheme, id: 'custom-zzz', name: '樱花粉' }
  const merged = mod.mergeThemes([sampleTheme], [other])
  assertEqual(merged.length, 2, 'both kept')
  assertEqual(merged[0].id, 'custom-abc', 'existing first')
  assertEqual(merged[1].id, 'custom-zzz', 'new appended')
})

check('normalizeCustomTheme derives missing colors from the accent', () => {
  const doc = mod.normalizeCustomTheme({ name: 'T', accent: '#0066cc' }, 0)
  assert(doc !== null, 'should normalize')
  assert(/^#[0-9a-f]{6}$/.test(doc.lightBg), `lightBg: ${doc.lightBg}`)
  assert(/^#[0-9a-f]{6}$/.test(doc.darkBg), `darkBg: ${doc.darkBg}`)
  assert(doc.id.startsWith('custom-'), `id: ${doc.id}`)
})

check('normalizeCustomTheme rejects non-objects', () => {
  assertEqual(mod.normalizeCustomTheme('nope', 0), null, 'string rejected')
  assertEqual(mod.normalizeCustomTheme(null, 0), null, 'null rejected')
})

check('normalizeHex ignores invalid input and keeps valid colors', () => {
  assertEqual(mod.normalizeHex('#abc', '#zzz'), '#aabbcc', 'short hex expands')
  assertEqual(mod.normalizeHex('not-a-color', '#123456'), '#123456', 'fallback')
})

// ── Shipped theme list integrity ───────────────────────────────────────
check('the shipped theme list keeps 19 unique ids with swatches', () => {
  assertEqual(mod.SHIPPED_THEMES.length, 19, 'theme count')
  const ids = new Set(mod.SHIPPED_THEMES.map((theme) => theme.id))
  assertEqual(ids.size, 19, 'ids are unique')
  for (const theme of mod.SHIPPED_THEMES) {
    assert(/^#[0-9a-fA-F]{6}$/.test(theme.swatch[0]), `bad swatch for ${theme.id}`)
    assert(theme.nameKey === `theme.${theme.id}.name`, `bad nameKey for ${theme.id}`)
    assert(theme.descKey === `theme.${theme.id}.desc`, `bad descKey for ${theme.id}`)
  }
})

// ── Theme text localization ───────────────────────────────────────────
// Regression for the reported bug: switching the UI language must change the
// theme names/descriptions everywhere, not only after some other action.
check('every shipped theme has a name and description in every dictionary', () => {
  for (const [lang, dict] of Object.entries(mod.DICTIONARIES)) {
    for (const theme of mod.SHIPPED_THEMES) {
      assert(typeof dict[theme.nameKey] === 'string' && dict[theme.nameKey] !== '',
        `${lang}: missing ${theme.nameKey}`)
      assert(typeof dict[theme.descKey] === 'string' && dict[theme.descKey] !== '',
        `${lang}: missing ${theme.descKey}`)
    }
  }
})

check('the dictionaries answer the same theme text in different languages', () => {
  const zhAcademic = mod.DICTIONARIES.zh['theme.academic.name']
  const jaAcademic = mod.DICTIONARIES.ja['theme.academic.name']
  const ruAcademic = mod.DICTIONARIES.ru['theme.academic.name']
  assert(zhAcademic !== jaAcademic, 'ja name should differ from zh')
  assert(zhAcademic !== ruAcademic, 'ru name should differ from zh')
  assert(/[\u3040-\u30ff]/.test(jaAcademic), `ja name is not Japanese: ${jaAcademic}`)
  assert(/[\u0400-\u04ff]/.test(ruAcademic), `ru name is not Cyrillic: ${ruAcademic}`)
})

check('themesStore resolves names through the translate function it is given', () => {
  const store = mod.createThemesStoreForTest([])
  const translateEn = (key) => mod.DICTIONARIES.en[key] ?? key
  const translateJa = (key) => mod.DICTIONARIES.ja[key] ?? key
  const en = store.all(translateEn)
  const ja = store.all(translateJa)
  const enAcademic = en.find((theme) => theme.id === 'academic')
  const jaAcademic = ja.find((theme) => theme.id === 'academic')
  assertEqual(enAcademic.name, mod.DICTIONARIES.en['theme.academic.name'], 'en name')
  assertEqual(jaAcademic.name, mod.DICTIONARIES.ja['theme.academic.name'], 'ja name')
  assert(enAcademic.name !== jaAcademic.name, 'the two languages must differ')
})

check('themesStore reports a language change so pickers re-render', () => {
  const store = mod.createThemesStoreForTest([])
  let notifications = 0
  const off = store.subscribe(() => { notifications += 1 })
  const before = store.all((key) => mod.DICTIONARIES.en[key] ?? key)
  assert(before.length === 19, `expected 19 themes, got ${before.length}`)
  store.notifyLanguageChange()
  off()
  assert(notifications >= 1, 'a language change must notify subscribers')
})

rmSync(tempDir, { recursive: true, force: true })

// ── Report ─────────────────────────────────────────────────────────────
if (failures.length > 0) {
  console.error(`\ndsh-yizi-themes self-check: ${failures.length} FAILED, ${passed} passed\n`)
  for (const failure of failures) console.error(`  ✗ ${failure}`)
  process.exit(1)
}
console.log(`dsh-yizi-themes self-check: ${passed} checks passed`)
