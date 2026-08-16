/** Standalone stylesheet: rowStyles. */
export default `/* dsh-yizi-themes appearance-row styles (plain CSS, injected at runtime). */

.dsw-yizi-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.dsw-yizi-title,
.dsw-yizi-section-title {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
}

.dsw-yizi-section-title {
  margin-top: 8px;
}

.dsw-yizi-cube-row {
  display: flex;
  align-items: stretch;
  gap: 8px;
  flex-wrap: wrap;
}

.dsw-yizi-theme-cube {
  box-sizing: border-box;
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 20px 32px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 16px;
  background: transparent;
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
}

.dsw-yizi-theme-cube:hover:not(.dsw-yizi-selected) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dsw-yizi-selected {
  background: var(--dsw-alias-bg-module-platform);
  border-color: var(--dsw-alias-brand-primary);
}

.dsw-yizi-theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
}

.dsw-yizi-theme-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  padding: 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  background: transparent;
  font: inherit;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  text-align: left;
}

.dsw-yizi-theme-card:hover:not(.dsw-yizi-selected) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dsw-yizi-swatch {
  display: block;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l1);
}

.dsw-yizi-card-label {
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.dsw-yizi-card-desc {
  font-size: 11px;
  line-height: 16px;
  color: var(--dsw-alias-label-secondary);
}

.dsw-yizi-custom-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dsw-yizi-field-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dsw-yizi-field-label {
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: var(--dsw-alias-label-primary);
}

.dsw-yizi-field-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dsw-yizi-field-hint {
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
}

/* Subtle one-liner guidance under the logo input (light small print). */
.dsw-yizi-field-hint-subtle {
  margin: 0;
  font-size: 11px;
  line-height: 17px;
  color: var(--dsw-alias-label-caption);
}

.dsw-yizi-input,
.dsw-yizi-textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  color: var(--dsw-alias-label-primary);
  outline: none;
}

.dsw-yizi-input:focus,
.dsw-yizi-textarea:focus {
  border-color: var(--dsw-alias-brand-primary);
}

.dsw-yizi-textarea {
  resize: vertical;
  min-height: 60px;
  font-family: var(--ds-font-family-code, monospace);
  font-size: 12px;
}

.dsw-yizi-preview-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
}

.dsw-yizi-preview-label {
  font-size: 11px;
  line-height: 16px;
  color: var(--dsw-alias-label-caption);
}

.dsw-yizi-logo-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-height: 32px;
  max-width: 120px;
}

.dsw-yizi-logo-preview svg {
  max-height: 32px;
  max-width: 120px;
  width: auto;
  height: auto;
}

.dsw-yizi-divider {
  height: 1px;
  margin: 4px 0;
  background: var(--dsw-alias-border-l1);
}

.dsw-yizi-toggle-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
}

.dsw-yizi-toggle-row input[type="checkbox"] {
  accent-color: var(--dsw-alias-brand-primary);
}

.dsw-yizi-mapping-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}

.dsw-yizi-mapping-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
}

.dsw-yizi-mapping-label .dsw-yizi-input {
  font-size: 13px;
}

/* Collapsed-rail brand swap: the app hides the default whale mark on toggle
   hover (revealing the expand panel icon) via a hashed CSS-module rule that
   cannot see our replacement node, so mirror it with a :has() rule. */
button:has(> [data-yizi-rail="1"]):hover [data-yizi-rail="1"] {
  display: none;
}
`
