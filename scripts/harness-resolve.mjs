/**
 * Locate a DeepSeek Harness checkout and its toolchain without machine-specific
 * hardcoded paths. Shared by prepare.mjs (tsdown bundler) and the typecheck
 * script (typescript + the @deepseek-ai/* platform packages).
 *
 * Resolution order:
 *   1. $DSH_HARNESS — explicit, wins outright;
 *   2. every ancestor of the current working directory — covers developing the
 *      plugin INSIDE the Harness monorepo (node_modules hoisted at the root);
 *   3. sibling checkouts of each ancestor — covers a standalone plugin folder
 *      next to a `deepseek-harness` checkout (E:/mycode/dsh-yizi-themes +
 *      E:/mycode/deepseek-harness), one level deep only so the scan stays cheap.
 */
import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve, sep } from 'node:path'

/** Candidate package relative paths that mark a directory as a Harness checkout. */
const TSDOWN_ENTRY = join('node_modules', 'tsdown', 'dist', 'index.mjs')
const TSC_BIN = join('node_modules', 'typescript', 'bin', 'tsc')

/**
 * @param {string} dir
 * @returns {boolean}
 */
function hasTsdown(dir) {
  return existsSync(join(dir, TSDOWN_ENTRY))
}

/**
 * Direct sibling directories of `dir` (non-recursive), swallowing permission
 * and read errors so an unreadable folder never aborts the scan.
 * @param {string} dir
 * @returns {string[]}
 */
function siblingDirs(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(dir, entry.name))
  } catch {
    return []
  }
}

/**
 * Every ancestor path of `start`, shortest first (start itself, then parents).
 * @param {string} start
 * @returns {string[]}
 */
function ancestorsOf(start) {
  const out = []
  let current = resolve(start)
  while (true) {
    out.push(current)
    const parent = dirname(current)
    if (parent === current) break
    current = parent
  }
  return out
}

/**
 * Resolve the Harness checkout directory.
 * @returns {{ dir: string, tsdown: string } | null}
 */
export function resolveHarness() {
  // 1. Explicit override.
  const explicit = process.env.DSH_HARNESS
  if (explicit) {
    const dir = resolve(explicit)
    if (hasTsdown(dir)) return { dir, tsdown: join(dir, TSDOWN_ENTRY) }
    throw new Error(
      `$DSH_HARNESS points at "${dir}" but node_modules/tsdown was not found there.\n` +
      'Point it at the root of a DeepSeek Harness checkout with installed dependencies.',
    )
  }

  const cwd = process.cwd()
  const visited = new Set()

  // 2. Ancestors (in-tree development).
  for (const ancestor of ancestorsOf(cwd)) {
    if (visited.has(ancestor)) continue
    visited.add(ancestor)
    if (hasTsdown(ancestor)) {
      return { dir: ancestor, tsdown: join(ancestor, TSDOWN_ENTRY) }
    }
    // 3. Sibling checkouts of each ancestor, one level deep.
    for (const sibling of siblingDirs(ancestor)) {
      if (visited.has(sibling)) continue
      visited.add(sibling)
      try {
        if (statSync(sibling).isDirectory() && hasTsdown(sibling)) {
          return { dir: sibling, tsdown: join(sibling, TSDOWN_ENTRY) }
        }
      } catch { /* unreadable entry: ignore */ }
    }
  }
  return null
}

/**
 * Resolve tsdown or exit with actionable guidance.
 * @returns {{ dir: string, entry: string }}
 */
export function requireTsdown() {
  const found = resolveHarness()
  if (found !== null) return { dir: found.dir, entry: found.tsdown }
  console.error(
    'dsh-yizi-themes: could not locate tsdown in any Harness checkout.\n' +
    'Set $DSH_HARNESS to the root of your DeepSeek Harness checkout (with dependencies installed),\n' +
    'or place this plugin next to / inside that checkout so node_modules/tsdown resolves automatically.',
  )
  process.exit(1)
}

/**
 * Resolve the TypeScript compiler binary inside the Harness checkout.
 * @returns {{ harnessDir: string, tsc: string }}
 */
export function requireTsc() {
  const found = resolveHarness()
  if (found === null) {
    console.error(
      'dsh-yizi-themes: typecheck needs a Harness checkout for typescript and the @deepseek-ai/* packages.\n' +
      'Set $DSH_HARNESS or place this plugin next to / inside the checkout.',
    )
    process.exit(1)
  }
  const tsc = join(found.dir, TSC_BIN)
  if (!existsSync(tsc)) {
    console.error(`dsh-yizi-themes: typescript not found at ${tsc}. Install the Harness dependencies first.`)
    process.exit(1)
  }
  return { harnessDir: found.dir, tsc }
}

/** Path separator re-export for callers that build module maps. */
export { sep }
