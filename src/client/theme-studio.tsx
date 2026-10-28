/**
 * Theme Studio — the custom-theme editor section of the Appearance row.
 *
 * Balance between "one click" and "as rich as the presets": the BASIC editor
 * is a single accent picker (the derivation does everything); an ADVANCED
 * disclosure exposes the refinement decisions the presets actually make by
 * hand — the ink hue (second voice: text/toast/dark tint), surface tint
 * strength, border voice, and the explicit page backgrounds. Everything
 * advanced is optional; untouched fields stay automatic.
 * All persistence and CSS emission live in custom-themes.ts; this component
 * only edits documents and calls the injected handlers.
 */
import { useState } from 'react'
import {
  CUSTOM_THEME_PREFIX,
  deriveDarkBg,
  deriveDarkBrand,
  deriveInk,
  deriveLightBg,
  normalizeHex,
} from './custom-themes.ts'
import type { CustomThemeDoc } from './custom-themes.ts'
import { MockPreview } from './MockPreview.tsx'

/** Props of the studio section. */
export interface StudioSectionProps {
  /** The saved custom documents, read fresh each render. */
  customs: readonly CustomThemeDoc[]
  /** Bound translate for the plugin's settings namespace. */
  t: (key: string) => string
  /** Apply a theme id. */
  onApply: (id: string) => void
  /** Persist a document (insert or update). */
  onSave: (doc: CustomThemeDoc) => void
  /** Delete a document by id (reverts to default when it was active). */
  onRemove: (id: string) => void
}

/** Default accent for a fresh editor. */
const DEFAULT_ACCENT = '#0066cc'

/** Fresh-editor state (new theme). */
function blankEditor(): { name: string; accent: string } {
  return { name: '', accent: DEFAULT_ACCENT }
}

/** Deterministic document id: djb2 over name + accent, base36. The same
 * name+accent pair always yields the same id, so repeated 添加 clicks (or an
 * impatient double-click) upsert one document instead of stacking duplicates;
 * a different name OR accent still gets its own theme. */
function themeId(name: string, accent: string): string {
  const input = `${name}\u0000${accent}`
  let hash = 5381
  for (let i = 0; i < input.length; i++) hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0
  return `${CUSTOM_THEME_PREFIX}${(hash >>> 0).toString(36)}`
}

/** One segmented choice. */
interface ChipOption {
  readonly value: string
  readonly label: string
}

/** Segmented chip row (tint strength / border voice). */
function ChipRow({
  options,
  value,
  onChange,
}: {
  options: readonly ChipOption[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <span className="dsw-yizi-studio-chips">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`dsw-yizi-studio-chip${option.value === value ? ' active' : ''}`}
          onClick={() => { onChange(option.value) }}
        >
          {option.label}
        </button>
      ))}
    </span>
  )
}

/**
 * The Theme Studio section.
 * @param props - section props.
 * @returns the editor element tree.
 */
export function StudioSection({ customs, t, onApply, onSave, onRemove }: StudioSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [accent, setAccent] = useState(DEFAULT_ACCENT)
  const [lightBg, setLightBg] = useState(() => deriveLightBg(DEFAULT_ACCENT))
  const [darkBg, setDarkBg] = useState(() => deriveDarkBg(DEFAULT_ACCENT))
  const [ink, setInk] = useState('')
  const [tint, setTint] = useState(1)
  const [borderStyle, setBorderStyle] = useState<'brand' | 'ink'>('brand')
  const [bgDirty, setBgDirty] = useState(false)

  const startNew = (): void => {
    setEditingId(null)
    const fresh = blankEditor()
    setName(fresh.name)
    setAccent(fresh.accent)
    setLightBg(deriveLightBg(fresh.accent))
    setDarkBg(deriveDarkBg(fresh.accent))
    setInk('')
    setTint(1)
    setBorderStyle('brand')
    setBgDirty(false)
  }
  const startEdit = (doc: CustomThemeDoc): void => {
    setEditingId(doc.id)
    setName(doc.name)
    setAccent(doc.accent)
    setLightBg(doc.lightBg)
    setDarkBg(doc.darkBg)
    setInk(doc.ink ?? '')
    setTint(doc.surfaceTint ?? 1)
    setBorderStyle(doc.borderStyle ?? 'brand')
    setBgDirty(true)
  }
  const changeAccent = (value: string): void => {
    setAccent(value)
    if (!bgDirty) {
      setLightBg(deriveLightBg(value))
      setDarkBg(deriveDarkBg(value))
    }
  }
  const save = (): void => {
    const resolvedName = name.trim() !== '' ? name.trim() : t('studio.defaultName')
    const resolvedAccent = normalizeHex(accent, DEFAULT_ACCENT)
    const id = editingId ?? themeId(resolvedName, resolvedAccent)
    onSave({
      id,
      name: resolvedName,
      accent: resolvedAccent,
      lightBg: normalizeHex(lightBg, deriveLightBg(accent)),
      darkBg: normalizeHex(darkBg, deriveDarkBg(accent)),
      ...(ink.trim() !== '' ? { ink: normalizeHex(ink, '') } : {}),
      ...(tint !== 1 ? { surfaceTint: tint } : {}),
      ...(borderStyle !== 'brand' ? { borderStyle } : {}),
    })
    startNew()
  }

  return (
    <div className="dsw-yizi-studio">
      <div className="dsw-yizi-studio-editor">
        <div className="dsw-yizi-studio-row">
          <input
            className="dsw-yizi-input dsw-yizi-studio-name"
            value={name}
            placeholder={t('studio.name.placeholder')}
            onChange={(e) => { setName(e.target.value) }}
          />
          <span className="dsw-yizi-studio-previews">
            <MockPreview swatch={[lightBg, accent]} />
            <MockPreview swatch={[darkBg, deriveDarkBrand(accent)]} />
          </span>
        </div>
        <div className="dsw-yizi-studio-colors">
          <label className="dsw-yizi-studio-color">
            <span>{t('studio.accent')}</span>
            <input type="color" value={accent} onChange={(e) => { changeAccent(e.target.value) }} />
          </label>
        </div>
        <details className="dsw-yizi-studio-advanced">
          <summary>{t('studio.advanced')}</summary>
          <div className="dsw-yizi-studio-colors">
            <label className="dsw-yizi-studio-color">
              <span>{t('studio.ink')}</span>
              <input
                type="color"
                value={ink !== '' ? ink : deriveInk(accent)}
                onChange={(e) => { setInk(e.target.value) }}
              />
              <button
                type="button"
                className={`dsw-yizi-studio-chip${ink === '' ? ' active' : ''}`}
                onClick={() => { setInk('') }}
              >
                {t('studio.ink.auto')}
              </button>
            </label>
            <label className="dsw-yizi-studio-color">
              <span>{t('studio.lightBg')}</span>
              <input
                type="color"
                value={lightBg}
                onChange={(e) => { setLightBg(e.target.value); setBgDirty(true) }}
              />
            </label>
            <label className="dsw-yizi-studio-color">
              <span>{t('studio.darkBg')}</span>
              <input
                type="color"
                value={darkBg}
                onChange={(e) => { setDarkBg(e.target.value); setBgDirty(true) }}
              />
            </label>
          </div>
          <div className="dsw-yizi-studio-chipsrow">
            <span className="dsw-yizi-studio-chipslabel">{t('studio.tint')}</span>
            <ChipRow
              value={String(tint)}
              onChange={(value) => { setTint(Number(value)) }}
              options={[
                { value: '0.5', label: t('studio.tint.subtle') },
                { value: '1', label: t('studio.tint.standard') },
                { value: '1.8', label: t('studio.tint.rich') },
              ]}
            />
          </div>
          <div className="dsw-yizi-studio-chipsrow">
            <span className="dsw-yizi-studio-chipslabel">{t('studio.border')}</span>
            <ChipRow
              value={borderStyle}
              onChange={(value) => { setBorderStyle(value === 'ink' ? 'ink' : 'brand') }}
              options={[
                { value: 'brand', label: t('studio.border.brand') },
                { value: 'ink', label: t('studio.border.ink') },
              ]}
            />
          </div>
        </details>
        <div className="dsw-yizi-studio-actions">
          <button type="button" className="dsw-yizi-doctor-run" onClick={save}>
            {editingId === null ? t('studio.add') : t('studio.update')}
          </button>
          {editingId !== null && (
            <button type="button" className="dsw-yizi-doctor-run" onClick={startNew}>
              {t('studio.cancel')}
            </button>
          )}
        </div>
      </div>
      {customs.length > 0 && (
        <div className="dsw-yizi-studio-list">
          {customs.map((doc) => (
            <div key={doc.id} className="dsw-yizi-studio-item">
              <MockPreview swatch={[doc.lightBg, doc.accent]} />
              <span className="dsw-yizi-studio-item-name">{doc.name}</span>
              <span className="dsw-yizi-studio-item-actions">
                <button type="button" className="dsw-yizi-studio-action" onClick={() => { onApply(doc.id) }}>
                  {t('studio.apply')}
                </button>
                <button type="button" className="dsw-yizi-studio-action" onClick={() => { startEdit(doc) }}>
                  {t('studio.edit')}
                </button>
                <button
                  type="button"
                  className="dsw-yizi-studio-action"
                  onClick={() => {
                    if (editingId === doc.id) startNew()
                    onRemove(doc.id)
                  }}
                >
                  {t('studio.delete')}
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
      <p className="dsw-yizi-field-hint-subtle">{t('studio.hint')}</p>
    </div>
  )
}
