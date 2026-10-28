/**
 * Theme Studio — the custom-theme editor section of the Appearance row.
 * Three inputs (accent + optional explicit light/dark page backgrounds,
 * auto-derived from the accent until the user overrides them) with a live
 * mini mock preview, plus the saved-themes list (apply / edit / delete).
 * All persistence and CSS emission live in custom-themes.ts; this component
 * only edits documents and calls the injected handlers.
 */
import { useState } from 'react'
import { CUSTOM_THEME_PREFIX, deriveDarkBg, deriveLightBg, normalizeHex } from './custom-themes.ts'
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

/** Fresh-editor state (new theme). */
function blankEditor(): { name: string; accent: string } {
  return { name: '', accent: '#0066cc' }
}

/**
 * The Theme Studio section.
 * @param props - section props.
 * @returns the editor element tree.
 */
export function StudioSection({ customs, t, onApply, onSave, onRemove }: StudioSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [accent, setAccent] = useState('#0066cc')
  const [lightBg, setLightBg] = useState(() => deriveLightBg('#0066cc'))
  const [darkBg, setDarkBg] = useState(() => deriveDarkBg('#0066cc'))
  const [bgDirty, setBgDirty] = useState(false)

  const startNew = (): void => {
    setEditingId(null)
    const fresh = blankEditor()
    setName(fresh.name)
    setAccent(fresh.accent)
    setLightBg(deriveLightBg(fresh.accent))
    setDarkBg(deriveDarkBg(fresh.accent))
    setBgDirty(false)
  }
  const startEdit = (doc: CustomThemeDoc): void => {
    setEditingId(doc.id)
    setName(doc.name)
    setAccent(doc.accent)
    setLightBg(doc.lightBg)
    setDarkBg(doc.darkBg)
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
    const id = editingId ?? `${CUSTOM_THEME_PREFIX}${Date.now().toString(36)}`
    onSave({
      id,
      name: name.trim() !== '' ? name.trim() : t('studio.defaultName'),
      accent: normalizeHex(accent, '#0066cc'),
      lightBg: normalizeHex(lightBg, deriveLightBg(accent)),
      darkBg: normalizeHex(darkBg, deriveDarkBg(accent)),
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
          <MockPreview swatch={[lightBg, accent]} />
        </div>
        <div className="dsw-yizi-studio-colors">
          <label className="dsw-yizi-studio-color">
            <span>{t('studio.accent')}</span>
            <input type="color" value={accent} onChange={(e) => { changeAccent(e.target.value) }} />
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
