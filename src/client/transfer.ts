/**
 * Configuration transfer: export / import the whole personalization state —
 * Theme Studio documents, the custom brand, and the active style-theme id —
 * as one JSON document.
 *
 * Why this exists: every setting is browser-local localStorage (the core
 * settings transport has no namespace for a third-party appearance plugin), so
 * the Web and Desktop profiles and different browsers cannot share state. A
 * transfer file is the bridge: it also doubles as a shareable "theme pack" and
 * as a backup before editing.
 *
 * This module is pure logic (parse / normalize / merge). File downloads,
 * clipboard and the file picker live in the UI layer so the functions here
 * stay trivially testable and never touch the DOM.
 */
import {
  normalizeCustomTheme,
  type CustomThemeDoc,
} from './custom-themes.ts'
import { normalizeBrand } from './brand-persistence.ts'
import type { CustomBrandConfig } from './theme-settings.ts'

/** Magic format marker stored in every transfer document. */
export const TRANSFER_FORMAT = 'dsh-yizi-themes'

/** Current payload version; older versions normalize through the same path. */
export const TRANSFER_VERSION = 1

/** The on-disk transfer shape. */
export interface TransferPayload {
  readonly format: typeof TRANSFER_FORMAT
  readonly version: number
  readonly exportedAt: string
  readonly themes: readonly CustomThemeDoc[]
  readonly brand: CustomBrandConfig
  readonly themeId?: string
}

/** A fully normalized, import-ready result plus non-fatal warnings. */
export interface TransferResult {
  readonly themes: CustomThemeDoc[]
  readonly brand: CustomBrandConfig
  readonly themeId: string | undefined
  readonly themeCount: number
  readonly warnings: readonly string[]
}

/** Successful parse. */
export interface TransferOk {
  readonly ok: true
  readonly result: TransferResult
}

/** Failed parse with a displayable reason. */
export interface TransferError {
  readonly ok: false
  readonly error: string
}

/**
 * Build the transfer document from the live configuration.
 * @param themes - the saved custom themes.
 * @param brand - the custom brand config.
 * @param themeId - the active style-theme id, when one is selected.
 * @returns a JSON-ready payload.
 */
export function buildTransferPayload(
  themes: readonly CustomThemeDoc[],
  brand: CustomBrandConfig,
  themeId: string | undefined,
): TransferPayload {
  return {
    format: TRANSFER_FORMAT,
    version: TRANSFER_VERSION,
    exportedAt: new Date().toISOString(),
    themes: themes.map((doc) => ({ ...doc })),
    brand: {
      ...brand,
      mappings: { ...brand.mappings },
    },
    ...(themeId !== undefined && themeId !== '' && themeId !== 'default' ? { themeId } : {}),
  }
}

/**
 * Serialize a payload to pretty JSON text.
 * @param payload - the transfer document.
 * @returns JSON text suitable for a file or the clipboard.
 */
export function serializeTransfer(payload: TransferPayload): string {
  return JSON.stringify(payload, null, 2)
}

/**
 * Parse and normalize arbitrary transfer text. Every unrecognized or malformed
 * piece is dropped with a warning instead of rejecting the whole document, so
 * a hand-edited or partially corrupted file still imports what it can.
 * @param text - JSON text from a file or clipboard.
 * @returns a normalized result, or a structured error.
 */
export function parseTransfer(text: string): TransferOk | TransferError {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, error: 'transfer.error.json' }
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ok: false, error: 'transfer.error.shape' }
  }
  const source = raw as Partial<TransferPayload>
  if (source.format !== TRANSFER_FORMAT) {
    return { ok: false, error: 'transfer.error.format' }
  }

  const warnings: string[] = []
  const themes: CustomThemeDoc[] = []
  if (Array.isArray(source.themes)) {
    source.themes.forEach((entry, index) => {
      const doc = normalizeCustomTheme(entry, index)
      if (doc !== null) themes.push(doc)
      else warnings.push('transfer.warning.theme')
    })
  } else {
    warnings.push('transfer.warning.noThemes')
  }

  const brand = normalizeBrand(source.brand)
  const themeId = typeof source.themeId === 'string' && source.themeId.trim() !== ''
    ? source.themeId.trim()
    : undefined

  return {
    ok: true,
    result: {
      themes: dedupeThemes(themes),
      brand,
      themeId,
      themeCount: themes.length,
      warnings,
    },
  }
}

/**
 * Merge incoming themes into the existing set by id: an incoming document
 * overwrites the same id, new ids append. Order keeps the existing sequence
 * first so the grid does not jump.
 * @param existing - the currently saved themes.
 * @param incoming - the imported themes.
 * @returns the merged array.
 */
export function mergeThemes(
  existing: readonly CustomThemeDoc[],
  incoming: readonly CustomThemeDoc[],
): CustomThemeDoc[] {
  const byId = new Map<string, CustomThemeDoc>()
  for (const doc of existing) byId.set(doc.id, doc)
  for (const doc of incoming) byId.set(doc.id, doc)
  return [...byId.values()]
}

/**
 * Drop duplicate ids inside one imported batch, keeping the first occurrence.
 * @param docs - normalized documents.
 * @returns the deduplicated array.
 */
function dedupeThemes(docs: readonly CustomThemeDoc[]): CustomThemeDoc[] {
  const seen = new Set<string>()
  const out: CustomThemeDoc[] = []
  for (const doc of docs) {
    if (seen.has(doc.id)) continue
    seen.add(doc.id)
    out.push(doc)
  }
  return out
}
