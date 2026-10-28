/**
 * Doctor — the plugin's runtime self-check panel, rendered as a collapsible
 * section at the bottom of the Appearance row. It inspects only what the
 * browser can see (injected sheets, body classes, rendered plugin marks,
 * platform icon exports, localStorage documents, and every stylesheet's
 * custom-property surface) — no core internals, so the checks themselves
 * stay upgrade-proof.
 *
 * The token-coverage scan is the audit from docs/COMPAT-0.2.1-rc.3.md turned
 * into a live check: collect every `var(--dsw-…)` reference outside the
 * plugin's own sheet, subtract what the plugin defines and what the core
 * defines, and surface the remaining never-defined tokens by reference
 * frequency — the next coverage candidates, visible on demand.
 */
import { useState } from 'react'
import { resolveIcon } from './primitives-compat.ts'

/** Severity of one check row. */
export type DoctorStatus = 'ok' | 'warn' | 'fail' | 'info'

/** One check result. */
export interface DoctorCheck {
  readonly id: string
  readonly label: string
  readonly status: DoctorStatus
  readonly detail: string
}

/** One never-defined token referenced by the core, with its reference count. */
export interface DoctorGap {
  readonly token: string
  readonly refs: number
}

/** Full doctor report for one run. */
export interface DoctorReport {
  /** Epoch milliseconds of the run. */
  readonly ranAt: number
  readonly checks: readonly DoctorCheck[]
  /** Unique `--dsw-*` tokens referenced outside the plugin's sheet. */
  readonly referencedTotal: number
  /** How many of those the plugin also defines (theme coverage). */
  readonly coveredTotal: number
  /** Referenced tokens defined nowhere in the document, most-referenced first. */
  readonly gaps: readonly DoctorGap[]
}

/** Inputs the runner needs from the plugin fiber. */
export interface DoctorDeps {
  /** Read the current style-theme id (backend-agnostic). */
  themeId(): string
  /** Whether the core itself owns theme-id persistence. */
  readonly coreThemeApi: boolean
  /** Read the current light/dark preference. */
  preference(): string
  /** Whether the core provides the commandUi service (/theme command). */
  commandUiAvailable(): boolean
  /** Bound translate for the plugin's settings namespace. */
  translate(key: string): string
}

/** Collect `var(--…)` references from one rule, recursing into nested rules. */
function collectRefs(cssText: string, refs: Map<string, number>): void {
  const pattern = /var\(\s*(--dsw-[a-zA-Z0-9-]+)/g
  for (let match = pattern.exec(cssText); match !== null; match = pattern.exec(cssText)) {
    refs.set(match[1], (refs.get(match[1]) ?? 0) + 1)
  }
}

/** Walk one stylesheet's rules into the reference map; returns defined tokens. */
function scanSheet(sheet: StyleSheet, refs: Map<string, number>, defined: Set<string>): void {
  const rules = (sheet as CSSStyleSheet).cssRules
  if (rules === undefined) return
  const visit = (rule: CSSRule): void => {
    const text = rule.cssText
    if (typeof text === 'string') {
      collectRefs(text, refs)
      const declPattern = /(?:^|[;{\s])(--dsw-[a-zA-Z0-9-]+)\s*:/g
      for (let match = declPattern.exec(text); match !== null; match = declPattern.exec(text)) {
        defined.add(match[1])
      }
    }
    const nested = (rule as CSSRule & { cssRules?: CSSRuleList }).cssRules
    if (nested !== undefined) for (const child of Array.from(nested)) visit(child)
  }
  for (const rule of Array.from(rules)) visit(rule)
}

/**
 * Run every check and return the report. Pure DOM reads — safe to call
 * repeatedly; the panel triggers it on demand.
 * @param deps - plugin-fiber inputs.
 * @returns the full report.
 */
export function runDoctorChecks(deps: DoctorDeps): DoctorReport {
  const t = deps.translate
  const checks: DoctorCheck[] = []

  // ── 1. Injected sheets ────────────────────────────────────────────────
  const sheetEl = document.getElementById('dsw-yizi-themes-sheets')
  const sheetBytes = sheetEl?.textContent?.length ?? 0
  checks.push({
    id: 'sheets',
    label: t('doctor.check.sheets'),
    status: sheetEl !== null && sheetEl !== undefined ? 'ok' : 'fail',
    detail: sheetEl !== null && sheetEl !== undefined
      ? `${Math.max(1, Math.round(sheetBytes / 1024))} KB`
      : t('doctor.detail.missing'),
  })

  // ── 2. Theme state (id + body class) ──────────────────────────────────
  const themeId = deps.themeId()
  const wantsClass = themeId !== '' && themeId !== 'default'
  const hasClass = wantsClass && document.body.classList.contains(`theme-${themeId}`)
  const classOk = !wantsClass || deps.coreThemeApi || hasClass
  checks.push({
    id: 'theme',
    label: t('doctor.check.theme'),
    status: classOk ? 'ok' : 'warn',
    detail: `${themeId || 'default'} · ${deps.preference()} · `
      + (deps.coreThemeApi ? t('doctor.path.core') : t('doctor.path.plugin')),
  })

  // ── 3. Brand slots rendered ───────────────────────────────────────────
  const brandMarks = document.querySelectorAll('[data-yizi-logo], [data-yizi-brand-name]').length
  checks.push({
    id: 'brand',
    label: t('doctor.check.brand'),
    status: brandMarks > 0 ? 'ok' : 'warn',
    detail: brandMarks > 0
      ? t('doctor.brand.rendered')
      : t('doctor.brand.missing'),
  })

  // ── 4. Picker entry points (view-dependent, informational) ────────────
  const floating = document.getElementById('dsw-yizi-floating-controls')
  checks.push({
    id: 'controls',
    label: t('doctor.check.controls'),
    status: 'info',
    detail: floating !== null
      ? t('doctor.controls.floating')
      : t('doctor.controls.header'),
  })

  // ── 5. Platform icon resolution ───────────────────────────────────────
  const iconNames = [
    'IconDarkOutlineRegular', 'IconDarkOutlineMedium', 'IconDarkOutline16',
    'IconLightOutlineRegular', 'IconLightOutlineMedium', 'IconLightOutline16',
  ]
  const missing: string[] = []
  for (const name of iconNames) {
    const icon = resolveIcon(name)
    if (icon === undefined) missing.push(name)
  }
  // resolveIcon returns the FIRST resolvable name, so per-name misses are
  // only meaningful per generation set: all three of one generation missing
  // means the glyph is gone. Report the set outcome.
  const darkOk = resolveIcon(...iconNames.slice(0, 3)) !== undefined
  const lightOk = resolveIcon(...iconNames.slice(3)) !== undefined
  checks.push({
    id: 'icons',
    label: t('doctor.check.icons'),
    status: darkOk && lightOk ? 'ok' : 'warn',
    detail: darkOk && lightOk
      ? 'dark ✓ · light ✓'
      : `${t('doctor.icons.missing')}: ${missing.join(', ')}`,
  })

  // ── 6. /theme command availability ────────────────────────────────────
  const commandOk = deps.commandUiAvailable()
  checks.push({
    id: 'command',
    label: t('doctor.check.command'),
    status: commandOk ? 'ok' : 'info',
    detail: commandOk ? '/theme' : t('doctor.command.absent'),
  })

  // ── 7. localStorage documents ─────────────────────────────────────────
  let storageOk = true
  try {
    const raw = localStorage.getItem('dsh-yizi-themes:brand')
    if (raw !== null) {
      const parsed = JSON.parse(raw) as { logo?: unknown; wordmark?: unknown }
      if (typeof parsed !== 'object' || parsed === null) storageOk = false
    }
    localStorage.getItem('dsh-yizi-themes:themeId')
  } catch {
    storageOk = false
  }
  checks.push({
    id: 'storage',
    label: t('doctor.check.storage'),
    status: storageOk ? 'ok' : 'warn',
    detail: storageOk ? 'localStorage ✓' : t('doctor.storage.broken'),
  })

  // ── 8. Token coverage scan (all stylesheets except the plugin's own) ──
  const refs = new Map<string, number>()
  const coreDefined = new Set<string>()
  for (const sheet of Array.from(document.styleSheets)) {
    if (sheet.ownerNode === sheetEl) continue
    try {
      scanSheet(sheet, refs, coreDefined)
    } catch {
      // Cross-origin or otherwise unreadable sheet — skip it.
    }
  }
  // Tokens the PLUGIN defines (its own sheet, read as text).
  const pluginDefined = new Set<string>()
  const pluginText = sheetEl?.textContent ?? ''
  const declPattern = /(?:^|[;{\s])(--dsw-[a-zA-Z0-9-]+)\s*:/g
  for (let match = declPattern.exec(pluginText); match !== null; match = declPattern.exec(pluginText)) {
    pluginDefined.add(match[1])
  }
  const referenced = [...refs.keys()]
  const covered = referenced.filter((token) => pluginDefined.has(token)).length
  const gaps: DoctorGap[] = referenced
    .filter((token) => !pluginDefined.has(token) && !coreDefined.has(token))
    .map((token) => ({ token, refs: refs.get(token) ?? 0 }))
    .sort((a, b) => b.refs - a.refs)
  checks.push({
    id: 'coverage',
    label: t('doctor.check.coverage'),
    status: gaps.length === 0 ? 'ok' : 'warn',
    detail: `${referenced.length} ${t('doctor.coverage.refs')} · ${covered} ${t('doctor.coverage.covered')} · ${gaps.length} ${t('doctor.coverage.undefined')}`,
  })

  return { ranAt: Date.now(), checks, referencedTotal: referenced.length, coveredTotal: covered, gaps }
}

const STATUS_SYMBOL: Record<DoctorStatus, string> = { ok: '✓', warn: '!', fail: '✕', info: '·' }

/** Props of the collapsible diagnostics section. */
export interface DoctorSectionProps {
  /** Run the checks; pure DOM reads. */
  run: () => DoctorReport
  /** Bound translate. */
  t: (key: string) => string
}

/** The collapsible "诊断" section rendered inside the Appearance row. */
export function DoctorSection({ run, t }: DoctorSectionProps) {
  const [report, setReport] = useState<DoctorReport | null>(null)
  const runNow = (): void => { setReport(run()) }
  return (
    <details className="dsw-yizi-doctor">
      <summary className="dsw-yizi-doctor-summary">{t('doctor.title')}</summary>
      <div className="dsw-yizi-doctor-body">
        <button type="button" className="dsw-yizi-doctor-run" onClick={runNow}>
          {report === null ? t('doctor.run') : t('doctor.rerun')}
        </button>
        {report !== null && (
          <ul className="dsw-yizi-doctor-list">
            {report.checks.map((check) => (
              <li key={check.id} className="dsw-yizi-doctor-item">
                <span className={`dsw-yizi-doctor-status dsw-yizi-doctor-${check.status}`}>
                  {STATUS_SYMBOL[check.status]}
                </span>
                <span className="dsw-yizi-doctor-label">{check.label}</span>
                <span className="dsw-yizi-doctor-detail">{check.detail}</span>
              </li>
            ))}
          </ul>
        )}
        {report !== null && report.gaps.length > 0 && (
          <>
            <p className="dsw-yizi-field-hint-subtle">{t('doctor.gap.hint')}</p>
            <div className="dsw-yizi-doctor-gaps">
              {report.gaps.slice(0, 24).map((gap) => (
                <span key={gap.token} className="dsw-yizi-doctor-gap-chip" title={`${gap.refs}×`}>
                  {gap.token}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </details>
  )
}
