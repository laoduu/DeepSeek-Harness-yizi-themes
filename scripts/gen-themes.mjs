import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const cssDir = process.argv[2]
const outFile = process.argv[3]

const cssFiles = readdirSync(cssDir).filter(f => f.endsWith('.css')).sort()
const lines = [
  '/**',
  ' * Theme override sheets — imported as raw strings and injected into',
  ' * the document on plugin load. Each sheet keys off `body.theme-<id>`',
  ' * (light) and `body.theme-<id>[data-ds-dark-theme]` (dark).',
  ' */',
  '',
]

for (const file of cssFiles) {
  const id = file.replace(/\.css$/, '')
  const content = readFileSync(join(cssDir, file), 'utf8')
  const escaped = content.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
  lines.push(`export const ${id}Css = \`${escaped}\``)
  lines.push('')
}

writeFileSync(outFile, lines.join('\n'), 'utf8')
console.log(`generated themes.ts with ${cssFiles.length} themes`)

// Standalone CSS → TS string export (optional 4th+5th args: src.css exportName).
if (process.argv[4] && process.argv[5]) {
  const src = resolve(process.argv[4])
  const name = process.argv[5]
  const content = readFileSync(src, 'utf8')
  const escaped = content.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
  const out = resolve(process.argv[6] ?? join(process.argv[3], '..', `${name}.ts`))
  writeFileSync(out, `/** Standalone stylesheet: ${name}. */\nexport default \`${escaped}\`\n`, 'utf8')
  console.log(`generated ${out}`) 
}