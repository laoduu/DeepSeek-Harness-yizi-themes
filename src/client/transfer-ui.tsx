/**
 * Configuration transfer UI: the export / import controls shown under the
 * Theme Studio, plus the DOM-side plumbing (file download, file picker,
 * clipboard) that the pure `transfer.ts` module deliberately avoids.
 *
 * Import is MERGE-oriented: incoming themes upsert by id (so re-importing an
 * updated pack refreshes entries instead of duplicating them) and the brand is
 * replaced wholesale only when the file carries one. Nothing is destructive
 * without the user having picked the file explicitly.
 */
import { useRef, useState } from 'react'
import {
  buildTransferPayload,
  parseTransfer,
  serializeTransfer,
  mergeThemes,
} from './transfer.ts'
import type { CustomThemeDoc } from './custom-themes.ts'
import type { CustomBrandConfig } from './theme-settings.ts'

/** Result banner shown after an import. */
interface ImportFeedback {
  readonly tone: 'ok' | 'error'
  readonly lines: readonly string[]
}

/** Props of the transfer section. */
export interface TransferSectionProps {
  /** Live custom themes. */
  customs: readonly CustomThemeDoc[]
  /** Live brand config. */
  brand: CustomBrandConfig
  /** Active style-theme id (`default` when none). */
  themeId: string
  /** Bound translate. */
  t: (key: string) => string
  /** Replace the merged theme set. */
  onThemes: (docs: CustomThemeDoc[]) => void
  /** Replace the brand config. */
  onBrand: (brand: CustomBrandConfig) => void
  /** Select a style-theme id. */
  onThemeId: (id: string) => void
}

/** Default export file name. */
function exportFileName(): string {
  const stamp = new Date().toISOString().slice(0, 10)
  return `dsh-yizi-themes-${stamp}.json`
}

/**
 * Trigger a browser download of the given text.
 * @param text - file content.
 * @param fileName - suggested name.
 */
export function downloadText(text: string, fileName: string = exportFileName()): void {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.rel = 'noopener'
  document.body.append(link)
  link.click()
  link.remove()
  // Revoke on the next task so the click has consumed the URL.
  setTimeout(() => { URL.revokeObjectURL(url) }, 0)
}

/**
 * Open the OS file picker and hand back the chosen file's text.
 *
 * Must be called from a user gesture (a click handler) — browsers block
 * synthetic file dialogs otherwise. Resolves to null when the user cancels.
 * @returns the file text, or null.
 */
export function pickTransferFile(): Promise<string | null> {
  return new Promise((resolveText) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;'
    document.body.append(input)
    let settled = false
    const finish = (value: string | null): void => {
      if (settled) return
      settled = true
      input.remove()
      resolveText(value)
    }
    input.addEventListener('change', () => {
      const file = input.files?.[0]
      if (file === undefined) { finish(null); return }
      file.text().then((text) => { finish(text) }, () => { finish(null) })
    })
    // Cancelling fires no change event in most browsers; the resize/visibility
    // fallback keeps a dangling hidden input from accumulating.
    window.addEventListener('focus', () => {
      setTimeout(() => { if (!settled && input.files?.length === 0) finish(null) }, 500)
    }, { once: true })
    input.click()
  })
}

/**
 * The backup / restore block.
 * @param props - section props.
 * @returns the transfer controls.
 */
export function TransferSection({
  customs, brand, themeId, t, onThemes, onBrand, onThemeId,
}: TransferSectionProps) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [feedback, setFeedback] = useState<ImportFeedback | null>(null)

  const doExport = (): void => {
    const payload = buildTransferPayload(customs, brand, themeId)
    downloadText(serializeTransfer(payload), exportFileName())
    setFeedback(null)
  }

  const doImport = (text: string): void => {
    const parsed = parseTransfer(text)
    if (!parsed.ok) {
      setFeedback({ tone: 'error', lines: [t(parsed.error)] })
      return
    }
    const { themes, brand: incomingBrand, themeId: incomingThemeId, warnings } = parsed.result
    const merged = mergeThemes(customs, themes)
    const added = merged.length - customs.length
    const lines: string[] = []
    if (themes.length === 0) {
      lines.push(t('transfer.result.empty'))
    } else {
      lines.push(t('transfer.result.imported').replace('{themes}', String(themes.length)))
      if (added <= 0) lines.push(t('transfer.result.overwritten'))
    }
    lines.push(t('transfer.result.brand'))
    if (incomingThemeId !== undefined) lines.push(t('transfer.result.themeid'))
    for (const warning of warnings) lines.push(t(warning))

    // Apply in dependency order: themes first (the sheets rebuild), then the
    // brand (slots re-render), then the selected theme.
    onThemes(merged)
    onBrand(incomingBrand)
    if (incomingThemeId !== undefined) onThemeId(incomingThemeId)
    setFeedback({ tone: 'ok', lines })
  }

  const pickFile = (): void => {
    fileRef.current?.click()
  }

  const onFileChosen = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    // Reset immediately so choosing the same file twice still fires a change.
    event.target.value = ''
    if (file === undefined) return
    try {
      doImport(await file.text())
    } catch {
      setFeedback({ tone: 'error', lines: [t('transfer.error.json')] })
    }
  }

  return (
    <div className="dsw-yizi-transfer">
      <p className="dsw-yizi-field-hint-subtle">{t('transfer.hint')}</p>
      <div className="dsw-yizi-transfer-actions">
        <button type="button" className="dsw-yizi-doctor-run" onClick={doExport}>
          {t('transfer.export')}
        </button>
        <button type="button" className="dsw-yizi-doctor-run" onClick={pickFile}>
          {t('transfer.import')}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="dsw-yizi-transfer-file"
          aria-label={t('transfer.import.pick')}
          onChange={(e) => { void onFileChosen(e) }}
        />
      </div>
      {feedback !== null && (
        <ul
          className={`dsw-yizi-transfer-feedback ${feedback.tone === 'ok' ? 'ok' : 'error'}`}
        >
          {feedback.lines.map((line, index) => (
            <li key={`${index}-${line}`}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
