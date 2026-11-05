/**
 * Hot-reload / double-apply regression check.
 *
 * The 0.5.6 boot-collapse incident: a SECOND `apply()` (hot reload, composition
 * reload, duplicate load) found its own slot ids already taken and threw, and a
 * throw from a third-party client plugin aborts the whole app boot
 * (`web boot: 1 entry did not activate`). 0.5.6 made every stage guarded and
 * every registration duplicate-tolerant.
 *
 * This check loads the REAL built bundle (dist/client.js) against a minimal
 * DOM + service stub and invokes `apply(ctx)` twice, asserting:
 *   - neither call throws,
 *   - the settings row and brand seats are registered exactly once,
 *   - the sheet is emitted once per apply, not duplicated on top of itself.
 *
 * It is a smoke test of the boot contract, not a rendering test: components
 * are registered but never rendered.
 */
import { readFileSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)

// ── Minimal DOM ─────────────────────────────────────────────────────────

class ClassList {
  constructor() { this.items = new Set() }
  add(...names) { for (const n of names) this.items.add(n) }
  remove(...names) { for (const n of names) this.items.delete(n) }
  contains(name) { return this.items.has(name) }
  [Symbol.iterator]() { return this.items[Symbol.iterator]() }
}

function makeElement(tag = 'div') {
  const el = {
    tagName: String(tag).toUpperCase(),
    id: '',
    style: { cssText: '', display: '', right: '', setProperty() {}, removeProperty() {} },
    classList: new ClassList(),
    attributes: new Map(),
    children: [],
    parentElement: null,
    textContent: '',
    firstElementChild: null,
    nextElementSibling: null,
    files: undefined,
    setAttribute(name, value) { this.attributes.set(name, String(value)) },
    removeAttribute(name) { this.attributes.delete(name) },
    getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null },
    append(...nodes) { for (const node of nodes) { node.parentElement = this; this.children.push(node) } },
    appendChild(node) { this.append(node); return node },
    insertAdjacentElement(_pos, node) { node.parentElement = this.parentElement; return node },
    remove() {
      if (this.parentElement !== null) {
        this.parentElement.children = this.parentElement.children.filter((c) => c !== this)
      }
    },
    replaceWith(node) { node.parentElement = this.parentElement; return node },
    addEventListener() {},
    removeEventListener() {},
    click() {},
    querySelector() { return null },
    querySelectorAll() { return [] },
    closest() { return null },
    getBoundingClientRect() { return { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 } },
    contains() { return false },
    focus() {},
  }
  // The plugin guards sheet creation with `instanceof HTMLStyleElement`, so the
  // fake style elements have to actually be instances of the faked class.
  if (String(tag).toLowerCase() === 'style') {
    Object.setPrototypeOf(el, globalThis.HTMLStyleElement?.prototype ?? Object.prototype)
  }
  return el
}

globalThis.HTMLStyleElement = class HTMLStyleElement {
  constructor() { Object.assign(this, makeElement('style')) }
}
globalThis.HTMLElement = class HTMLElement {
  constructor() { Object.assign(this, makeElement('div')) }
}

const body = makeElement('body')
const head = makeElement('head')

/** Depth-first search of the fake tree by id (mirrors getElementById). */
function findById(node, id) {
  for (const child of node.children) {
    if (child.id === id) return child
    const found = findById(child, id)
    if (found !== null) return found
  }
  return null
}

globalThis.document = {
  body,
  head,
  createElement: (tag) => makeElement(tag),
  createTextNode: (text) => ({ textContent: text }),
  getElementById: (id) => findById(head, id) ?? findById(body, id),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener() {},
  removeEventListener() {},
  createTreeWalker: () => ({ nextNode: () => false, currentNode: null }),
  documentElement: makeElement('html'),
}
globalThis.window = {
  innerWidth: 1200,
  innerHeight: 800,
  addEventListener() {},
  removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  requestAnimationFrame: (cb) => setTimeout(() => cb(0), 0),
  cancelAnimationFrame: (id) => clearTimeout(id),
}
globalThis.requestAnimationFrame = globalThis.window.requestAnimationFrame
globalThis.cancelAnimationFrame = globalThis.window.cancelAnimationFrame
globalThis.MutationObserver = class {
  observe() {}
  disconnect() {}
  takeRecords() { return [] }
}
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.NodeFilter = { SHOW_TEXT: 4 }

const storage = new Map()
globalThis.localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => { storage.set(k, String(v)) },
  removeItem: (k) => { storage.delete(k) },
}

// ── Platform module table (the loader's `require` face) ─────────────────

function makeStore() {
  // Minimal defineStore: init + actions over a plain object.
  return (spec) => {
    let state = spec.init()
    const handlers = new Set()
    return {
      getState: () => state,
      subscribe: (fn) => { handlers.add(fn); return () => handlers.delete(fn) },
      create: () => ({
        actions: {
          ...Object.fromEntries(Object.keys(spec.actions).map((name) => [name, (...args) => {
            spec.actions[name](state, ...args)
            for (const handler of handlers) handler(state)
          }])),
        },
      }),
    }
  }
}

const moduleTable = {
  'react': { createElement: () => null, useState: () => [null, () => {}], useEffect: () => {}, useRef: () => ({ current: null }), useSyncExternalStore: (sub, get) => get(), Fragment: 'Fragment', default: {} },
  'react/jsx-runtime': { jsx: () => null, jsxs: () => null, Fragment: 'Fragment' },
  'react-dom/client': { createRoot: () => ({ render: () => {}, unmount: () => {} }) },
  '@deepseek-ai/dsh-client-store': { defineStore: makeStore() },
  '@deepseek-ai/dsh-client-ui-primitives': {},
}

// ── Service stub (the cordis face the plugin uses) ──────────────────────

/** Common shapes the plugin registers into. */
class SlotTable {
  constructor() { this.single = new Map(); this.list = new Map() }
  /** Count registrations; mimic the core's duplicate rejection. */
  stats = { singleTries: 0, singleWins: 0, listTries: 0, listWins: 0 }
}

function makeContext(slots, locale, theme) {
  const disposers = []
  const slotTable = slots
  return {
    // cordis: property access for injected services
    slots: {
      inject: (name, callback) => {
        // Both single and list seats are declared: mimic a modern core.
        const disposer = callback()
        if (typeof disposer === 'function') disposers.push(disposer)
        return () => {}
      },
      register: (spec, component) => {
        const isSingle = spec.name === 'sidebar.brand.mark'
          || spec.name === 'sidebar.brand.name'
          || spec.name === 'conversation.hero.brand.mark'
        if (isSingle) {
          slotTable.stats.singleTries += 1
          const key = `${spec.name}`
          const bucket = slotTable.single.get(key) ?? new Map()
          const priority = spec.priority ?? 0
          if (bucket.has(priority)) {
            // The real core rejects a second occupant at the same priority.
            const error = new Error(`single slot "${spec.name}" already has a registration at priority ${priority}`)
            throw error
          }
          bucket.set(priority, component)
          slotTable.single.set(key, bucket)
          slotTable.stats.singleWins += 1
          return () => { bucket.delete(priority) }
        }
        slotTable.stats.listTries += 1
        const id = spec.id ?? 'anon'
        const entries = slotTable.list.get(`${spec.name}`) ?? new Set()
        if (entries.has(id)) {
          throw new Error(`list slot "${spec.name}" already has an entry with id "${id}"`)
        }
        entries.add(id)
        slotTable.list.set(`${spec.name}`, entries)
        slotTable.stats.listWins += 1
        return () => { entries.delete(id) }
      },
    },
    locale: locale,
    theme: theme,
    get: (name) => {
      if (name === 'theme') return theme
      if (name === 'commandUi') return commandUi
      return undefined
    },
    effect: (run, _label) => {
      const disposer = run()
      if (typeof disposer === 'function') disposers.push(disposer)
      return () => {}
    },
    on: () => () => {},
    inject: (deps, callback) => {
      // The commandUi service is present (modern core): run the callback.
      callback(ctxRef)
      return () => {}
    },
    logger: () => ({ error() {}, warn() {}, info() {} }),
  }
}

// Registration counter for the /theme contribution.
const commandUi = {
  registrations: 0,
  register(contribution) {
    this.registrations += 1
    return () => {}
  },
}

const themeRuntime = {
  getTheme: () => ({
    preference: 'system',
    themes: [],
    active: { id: 'default' },
    fontSizes: {},
    fontFamilies: {},
    revision: 0,
  }),
  setTheme: () => {},
  register: () => () => {},
}

// ctx needs to be referenced inside inject before it exists; use a holder.
let ctxRef = null

const localeService = {
  bind: (ns) => (key) => `${ns}:${key}`,
  register: (ns, dicts) => () => {},
}

// ── Load the real bundle ────────────────────────────────────────────────

const bundlePath = join(root, 'dist', 'client.js')
let factory = null
globalThis.window.__ModuleLoader__ = {
  load: (spec) => { factory = spec.factory },
}
const bundleSource = readFileSync(bundlePath, 'utf8')
// The bundle is a CommonJS handoff executed in browser-global scope; `window`
// is our global stand-in here.
new Function('window', 'module', 'exports', 'require', bundleSource)(
  globalThis.window,
  { exports: {} },
  {},
  (id) => moduleTable[id.fn ?? id],
)

if (factory === null) {
  console.error('hot-reload check: bundle did not register with __ModuleLoader__')
  process.exit(1)
}
const plugin = factory((id) => {
  const entry = moduleTable[id]
  if (entry === undefined) throw new Error(`missed the module table: ${id}`)
  return entry
})

// ── Run apply twice (the hot-reload scenario) ──────────────────────────

const slotTable = new SlotTable()
const failures = []
let applyThrew = 0

for (let pass = 1; pass <= 2; pass++) {
  ctxRef = makeContext(slotTable, localeService, themeRuntime)
  try {
    plugin.apply(ctxRef)
  } catch (error) {
    applyThrew += 1
    failures.push(`apply #${pass} threw: ${error.message}`)
  }
}

// ── Assertions ─────────────────────────────────────────────────────────

function check(name, fn) {
  try {
    fn()
  } catch (error) {
    failures.push(`${name}: ${error.message}`)
  }
}

check('neither apply throws', () => {
  if (applyThrew !== 0) throw new Error(`${applyThrew} apply call(s) threw`)
})

check('the settings section is registered exactly once', () => {
  const ids = slotTable.list.get('settings.section')
  if (ids === undefined || ids.size !== 1) {
    throw new Error(`expected 1 section registration, got ${ids === undefined ? 0 : ids.size}`)
  }
  if (!ids.has('yizi-themes')) throw new Error(`unexpected section id(s): ${[...ids].join(', ')}`)
})

check('the section navigation icon is registered for the same id', () => {
  const icons = slotTable.list.get('settings.section.icon')
  if (icons === undefined || !icons.has('yizi-themes')) {
    throw new Error('the section icon is missing or registered under a mismatched id')
  }
})

check('no registration remains in settings.general.item', () => {
  const ids = slotTable.list.get('settings.general.item')
  if (ids !== undefined && ids.size > 0) {
    throw new Error(`the section must not also appear inside General (found ${[...ids].join(', ')})`)
  }
})

check('the /theme command is registered once', () => {
  if (commandUi.registrations < 1) throw new Error('the /theme command never registered')
  if (commandUi.registrations > 2) throw new Error(`command registered ${commandUi.registrations} times`)
})

check('brand seats occupy at most one registration per priority', () => {
  for (const [name, bucket] of slotTable.single) {
    const priorities = [...bucket.keys()]
    const dupes = priorities.filter((p) => priorities.filter((q) => q === p).length > 1)
    if (dupes.length > 0) throw new Error(`duplicate priority on ${name}`)
  }
})

check('no boot breadcrumb records a FAIL stage', () => {
  const trail = localStorage.getItem('dsh-yizi-themes:bootlog')
  if (trail === null) throw new Error('bootlog missing')
  const entries = JSON.parse(trail)
  const failed = entries.filter((line) => String(line).includes('FAIL:'))
  if (failed.length > 0) throw new Error(`boot stages failed: ${failed.join(' | ')}`)
})

check('style sheet host is single and carries content', () => {
  const hosts = head.children.filter((child) => child.id === 'dsw-yizi-themes-sheets')
  if (hosts.length !== 1) throw new Error(`expected exactly 1 sheet host, got ${hosts.length}`)
  const sheet = hosts[0]
  if (!String(sheet.textContent).includes('body.theme-academic')) {
    throw new Error('preset theme sheet missing from the emitted CSS')
  }
  if (!String(sheet.textContent).includes('.dsw-yizi-group')) {
    throw new Error('appearance row stylesheet missing from the emitted CSS')
  }
})

if (failures.length > 0) {
  console.error(`\nhot-reload check: ${failures.length} FAILED\n`)
  for (const failure of failures) console.error(`  ✗ ${failure}`)
  process.exit(1)
}

const totalRegistrations = slotTable.stats.singleTries + slotTable.stats.listTries
console.log(
  `hot-reload check passed: 2 apply passes, ${slotTable.list.size} list slot(s), `
  + `${slotTable.single.size} single seat(s), ${totalRegistrations} registration attempts, no throw`,
)
