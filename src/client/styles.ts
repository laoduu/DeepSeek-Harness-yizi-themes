/** Standalone stylesheet: rowStyles. */
export default `/* dsh-yizi-themes appearance-row styles (plain CSS, injected at runtime). */

.dsw-yizi-group {
  /* Typography scale — follows the user's content font-size setting through
     the core's delta variable (--dsh-content-font-delta = setting − 14px,
     defined on body by the core token sheet). Every ratio below renders
     EXACTLY the legacy fixed px at the default setting (14), and scales with
     the setting otherwise; the 0px fallback keeps old cores unchanged. */
  --dsw-yizi-fs-xl: calc(14px + var(--dsh-content-font-delta, 0px));
  --dsw-yizi-fs-lg: calc(13px + var(--dsh-content-font-delta, 0px));
  --dsw-yizi-fs-md: calc(12px + var(--dsh-content-font-delta, 0px));
  --dsw-yizi-fs-sm: calc(11px + var(--dsh-content-font-delta, 0px));
  --dsw-yizi-lh-xl: calc(22px + var(--dsh-content-font-delta, 0px));
  --dsw-yizi-lh-lg: calc(20px + var(--dsh-content-font-delta, 0px));
  --dsw-yizi-lh-md: calc(18px + var(--dsh-content-font-delta, 0px));
  --dsw-yizi-lh-sm: calc(17px + var(--dsh-content-font-delta, 0px));
  --dsw-yizi-lh-xs: calc(16px + var(--dsh-content-font-delta, 0px));

  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.dsw-yizi-title,
.dsw-yizi-section-title {
  font-size: var(--dsw-yizi-fs-xl);
  font-weight: 400;
  line-height: var(--dsw-yizi-lh-xl);
  color: var(--dsw-alias-label-primary);
}

.dsw-yizi-section-title {
  margin-top: 8px;
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

.dsw-yizi-card-label {
  font-size: var(--dsw-yizi-fs-lg);
  font-weight: 500;
  line-height: var(--dsw-yizi-lh-lg);
}

.dsw-yizi-card-desc {
  font-size: var(--dsw-yizi-fs-sm);
  line-height: var(--dsw-yizi-lh-xs);
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
  font-size: var(--dsw-yizi-fs-lg);
  font-weight: 500;
  line-height: var(--dsw-yizi-lh-lg);
  color: var(--dsw-alias-label-primary);
}

.dsw-yizi-field-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dsw-yizi-field-hint {
  margin: 0;
  font-size: var(--dsw-yizi-fs-md);
  line-height: var(--dsw-yizi-lh-md);
  color: var(--dsw-alias-label-secondary);
}

/* Subtle one-liner guidance under the logo input (light small print). */
.dsw-yizi-field-hint-subtle {
  margin: 0;
  font-size: var(--dsw-yizi-fs-sm);
  line-height: var(--dsw-yizi-lh-sm);
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
  font-size: var(--dsw-yizi-fs-xl);
  line-height: var(--dsw-yizi-lh-xl);
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
  /* Code content follows the code-size setting (11px base), not the text one. */
  font-size: calc(12px + var(--dsh-code-font-delta, 0px));
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
  font-size: var(--dsw-yizi-fs-sm);
  line-height: var(--dsw-yizi-lh-xs);
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
  font-size: var(--dsw-yizi-fs-lg);
  line-height: var(--dsw-yizi-lh-lg);
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
}

.dsw-yizi-toggle-row input[type="checkbox"] {
  accent-color: var(--dsw-alias-brand-primary);
}

/* Brand-scale slider row: range on the left, live percentage readout right. */
.dsw-yizi-scale-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dsw-yizi-range {
  flex: 1;
  min-width: 0;
  accent-color: var(--dsw-alias-brand-primary);
  cursor: pointer;
}

.dsw-yizi-scale-value {
  flex: none;
  min-width: 44px;
  text-align: right;
  font-size: var(--dsw-yizi-fs-md);
  line-height: var(--dsw-yizi-lh-md);
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-secondary);
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
  font-size: var(--dsw-yizi-fs-md);
  line-height: var(--dsw-yizi-lh-md);
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

/* ── Doctor (diagnostics) section ────────────────────────────────────── */

.dsw-yizi-doctor {
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  padding: 0 12px;
}

.dsw-yizi-doctor-summary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 0;
  font-size: var(--dsw-yizi-fs-lg);
  line-height: var(--dsw-yizi-lh-lg);
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  list-style: none;
}

.dsw-yizi-doctor-summary::-webkit-details-marker {
  display: none;
}

.dsw-yizi-doctor-summary::before {
  content: '▸';
  flex: none;
  color: var(--dsw-alias-label-secondary);
  transition: transform 0.15s ease;
}

.dsw-yizi-doctor[open] .dsw-yizi-doctor-summary::before {
  transform: rotate(90deg);
}

.dsw-yizi-doctor-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2px 0 12px;
}

.dsw-yizi-doctor-run {
  align-self: flex-start;
  padding: 4px 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: var(--dsw-yizi-fs-lg);
  line-height: var(--dsw-yizi-lh-lg);
  cursor: pointer;
}

.dsw-yizi-doctor-run:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dsw-yizi-doctor-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dsw-yizi-doctor-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: var(--dsw-yizi-fs-md);
  line-height: var(--dsw-yizi-lh-md);
}

.dsw-yizi-doctor-status {
  flex: none;
  width: 14px;
  text-align: center;
  font-weight: 600;
}

.dsw-yizi-doctor-ok {
  color: var(--dsw-alias-state-success-primary, var(--dsw-alias-brand-primary));
}

.dsw-yizi-doctor-warn {
  color: var(--dsw-alias-state-warn-label);
}

.dsw-yizi-doctor-fail {
  color: var(--dsw-alias-label-error);
}

.dsw-yizi-doctor-info {
  color: var(--dsw-alias-label-secondary);
}

.dsw-yizi-doctor-label {
  flex: none;
  color: var(--dsw-alias-label-primary);
}

.dsw-yizi-doctor-detail {
  color: var(--dsw-alias-label-secondary);
}

.dsw-yizi-doctor-gaps {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Mini mock-UI theme preview: a tiny app window (brand rail + chat area)
   painted from the theme's swatch pair; the inner tones are color-mix'd
   inline by the component, so one rule set serves light and dark. */
.dsw-yizi-mock {
  display: flex;
  overflow: hidden;
  height: 40px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
}

.dsw-yizi-mock-rail {
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 16px;
  padding-top: 4px;
}

.dsw-yizi-mock-dot {
  flex: none;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dsw-yizi-mock-bar {
  flex: none;
  width: 10px;
  height: 3px;
  border-radius: 2px;
}

.dsw-yizi-mock-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  gap: 3px;
  padding: 5px 6px 4px;
}

.dsw-yizi-mock-line {
  display: block;
  flex: none;
  width: 55%;
  height: 3px;
  border-radius: 2px;
}

.dsw-yizi-mock-bubble {
  display: block;
  align-self: flex-end;
  width: 46%;
  height: 6px;
  border-radius: 4px 4px 2px 4px;
}

.dsw-yizi-mock-bubble.left {
  align-self: flex-start;
  width: 58%;
  border-radius: 4px 4px 4px 2px;
}

/* ── Theme Studio (custom themes) ────────────────────────────────────── */

.dsw-yizi-studio {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
}

.dsw-yizi-studio-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dsw-yizi-studio-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dsw-yizi-studio-name {
  flex: 1;
}

.dsw-yizi-studio-previews {
  display: flex;
  flex: none;
  gap: 6px;
}

.dsw-yizi-studio-previews .dsw-yizi-mock {
  width: 84px;
}

.dsw-yizi-studio-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.dsw-yizi-studio-color {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--dsw-yizi-fs-md);
  line-height: var(--dsw-yizi-lh-md);
  color: var(--dsw-alias-label-secondary);
}

.dsw-yizi-studio-color input[type="color"] {
  box-sizing: border-box;
  width: 34px;
  height: 26px;
  padding: 2px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-1);
  cursor: pointer;
}

.dsw-yizi-studio-advanced {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
}

.dsw-yizi-studio-advanced > summary {
  font-size: var(--dsw-yizi-fs-md);
  line-height: var(--dsw-yizi-lh-md);
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  user-select: none;
}

.dsw-yizi-studio-advanced > summary:hover {
  color: var(--dsw-alias-label-primary);
}

.dsw-yizi-studio-chipsrow {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dsw-yizi-studio-chipslabel {
  flex: none;
  font-size: var(--dsw-yizi-fs-md);
  line-height: var(--dsw-yizi-lh-md);
  color: var(--dsw-alias-label-secondary);
}

.dsw-yizi-studio-chips {
  display: inline-flex;
  gap: 4px;
}

.dsw-yizi-studio-chip {
  padding: 2px 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: var(--dsw-yizi-fs-sm);
  line-height: var(--dsw-yizi-lh-xs);
  cursor: pointer;
}

.dsw-yizi-studio-chip:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.dsw-yizi-studio-chip.active {
  background: var(--dsw-alias-interactive-bg-hover-accent);
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-label-primary);
}

.dsw-yizi-studio-actions {
  display: flex;
  gap: 8px;
}

.dsw-yizi-studio-actions .dsw-yizi-doctor-run {
  align-self: auto;
}

.dsw-yizi-studio-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dsw-yizi-studio-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
}

.dsw-yizi-studio-item .dsw-yizi-mock {
  flex: none;
  width: 72px;
}

.dsw-yizi-studio-item-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--dsw-yizi-fs-lg);
  line-height: var(--dsw-yizi-lh-lg);
  color: var(--dsw-alias-label-primary);
}

.dsw-yizi-studio-item-actions {
  display: flex;
  flex: none;
  gap: 6px;
}

.dsw-yizi-studio-action {
  padding: 2px 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: var(--dsw-yizi-fs-sm);
  line-height: var(--dsw-yizi-lh-xs);
  cursor: pointer;
}

.dsw-yizi-studio-action:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
`
