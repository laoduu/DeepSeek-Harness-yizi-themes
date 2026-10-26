/** Standalone stylesheet: brand-overrides. */
export default `/**
 * Brand-accent overrides + post-0.5.0 token compatibility for core Harness
 * components.
 *
 * Injected by the plugin so brand elements follow the ACTIVE theme's
 * \`--dsw-alias-brand-primary\` (theme + light/dark adaptive) instead of the
 * static blue / ink. The core's own CSS-module class names are hashed per
 * build, so every rule here anchors on STABLE DOM hooks (data attributes,
 * roles, SVG viewBox fingerprints) that survive any build:
 *
 *  - hero fish + headline    → the fish's \`viewBox\` (+ its sibling span)
 *  - sidebar wordmark / rail → the brand SVG \`viewBox\` inside the button
 *
 * The 0.2.1 shell moved the running-status shimmer to the \`TextShimmer\`
 * primitive (a masked sweep painting \`--dsw-alias-label-shimmer\`) and dropped
 * the old \`[data-chat-flow] [role=status][aria-live]\` / \`--dsh-state-ongoing\`
 * hooks, so those are themed through the ALIAS BLOCK below instead of a
 * background-image override.
 *
 * Modern (rc.8+) brand slots render through OUR OWN wrappers, so the sizing
 * and ink for those come from the \`[data-yizi-*]\` rules at the bottom.
 * Full coverage audit against 0.2.1-rc.3: docs/COMPAT-0.2.1-rc.3.md.
 */

/* ── Alias compatibility (Harness 0.2.1) ─────────────────────────────────
   The 0.2.1 design system added/changed alias tokens that postdate the 19
   shipped palettes. Derive them from aliases each theme already owns, so these
   surfaces follow the theme instead of the static core blue-grey. Scoped to
   the plugin's own \`body.theme-<id>\` class: the stock \`default\` palette keeps
   the core values untouched. \`var()\` references resolve against the same
   element, so the light/dark palette still flows through.

   Cascade: the core declares its aliases on \`body {}\` (0,0,1) and
   \`body[data-ds-dark-theme] {}\` (0,1,1); this sheet ships LAST in the plugin's
   single injected <style> (after the core stylesheet), so the equal-specificity
   body[class*="theme-"] rules win in both modes; the dark-scoped block below
   uses (0,2,1) and wins outright. */
body[class*="theme-"] {
  /* ── 0.5.1 block (running status + rc.2 surfaces) ── */
  --dsw-alias-settings-card-fill: var(--dsw-alias-bg-layer-2);
  --dsw-alias-settings-card-stroke: var(--dsw-alias-border-l4);
  --dsw-alias-menu-icon: var(--dsw-alias-label-primary-dimmed);
  --dsw-alias-label-deep-diving: color-mix(in srgb, var(--dsw-alias-brand-primary) 72%, var(--dsw-alias-label-primary));
  --dsw-alias-label-deep-diving-shimmer: color-mix(in srgb, var(--dsw-alias-brand-primary) 32%, var(--dsw-alias-label-primary));
  --dsw-alias-label-shimmer: color-mix(in srgb, var(--dsw-alias-brand-primary) 30%, transparent);
  --dsw-alias-turn-trigger-bg: var(--dsw-alias-markdown-code-block);
  --dsw-alias-turn-trigger-bg-hover: var(--dsw-alias-interactive-bg-hover);
  --dsw-alias-switch-thumb: var(--dsw-alias-bg-base);
  /* 0.5.2 fix: the toast surface is ALWAYS dark (core paints bluish-800 in
     both modes) while the old derivation rode label-primary-inverted, which
     goes dark-grey in dark mode — dark toasts read the label at ~2:1. The
     core's own token is a flat near-white; mirror that. */
  --dsw-alias-toast-label: var(--dsw-static-neutral-bluish-00);

  /* ── 0.5.2 coverage audit (docs/COMPAT-0.2.1-rc.3.md) ── */

  /* Links everywhere followed the static DeepSeek blue; ride the theme brand. */
  --dsw-alias-link: var(--dsw-alias-brand-primary);
  /* The DeepSeek-brand blue statics are consumed DIRECTLY by components (toast
     action text, FileTypeIcon default ink). Remapping them at body level also
     re-derives every core color-mix built on them; ANSI/semantics use the
     separate blue-*/neutral-* scales and are untouched. */
  --dsw-static-deepseek-400: var(--dsw-alias-brand-primary);
  --dsw-static-deepseek-450: var(--dsw-alias-brand-primary);
  --dsw-static-deepseek-500: var(--dsw-alias-brand-primary);

  /* Menu / popup surfaces: core hard-codes neutral glass that clashes with
     tinted themes (e.g. cream, pine). */
  --dsw-menu-surface-fill: color-mix(in srgb, var(--dsw-alias-bg-overlay) 60%, transparent);
  --dsw-alias-menu-group-header-fill: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 94%, transparent);
  /* Keyboard hints inside tooltips (core mixes white into tooltip-bg). */
  --dsw-alias-tooltip-key-bg: color-mix(in srgb, var(--dsw-alias-tooltip-bg) 82%, var(--dsw-alias-bg-base));
  /* Hover toolbar over chat messages (core pins rgba(84,85,87,…)). */
  --dsw-alias-button-tool-bar-fill: color-mix(in srgb, var(--dsw-alias-label-tertiary) 50%, transparent);
  --dsw-alias-button-tool-bar-hover: color-mix(in srgb, var(--dsw-alias-label-tertiary) 60%, transparent);

  /* Right-hand document preview panel (core pins static neutral-bluish +
     blue-500 selection). */
  --dsw-alias-bg-document-preview: var(--dsw-alias-bg-layer-2);
  --dsw-alias-bg-document-selection: color-mix(in srgb, var(--dsw-alias-brand-primary) 40%, transparent);
  --dsw-alias-label-document-preview: var(--dsw-alias-label-secondary);

  /* State / semantic completion. */
  --dsw-alias-state-warn-label: var(--dsw-alias-state-warn-primary);
  --dsw-alias-state-idle-primary: var(--dsw-alias-label-dimmed);
  --dsw-alias-label-error: var(--dsw-alias-state-error-primary);
  --dsw-alias-interactive-bg-hover-danger: color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent);
  /* Text sitting on PRIMARY-FILLED surfaces (primary buttons, attachment
     chips, the brand wordmark): each theme already pairs its fill with an
     invert ink, so reuse it. */
  --dsw-alias-label-primary-foreground: var(--dsw-alias-brand-primary-invert);
  --dsw-alias-label-primary-inverted: var(--dsw-alias-brand-primary-invert);
  --dsw-alias-border-inverted: transparent;

  /* Tokens the 0.2.1 core CONSUMES but never defines (forward declarations):
     surfaces render transparent / fall back to neutral there. Defining them
     gives terminal sidebar, jobs list, subagent settings and attachment cards
     the theme's own layering. */
  --dsw-alias-bg-l1: var(--dsw-alias-bg-layer-1);
  --dsw-alias-bg-l2: var(--dsw-alias-bg-layer-2);
  --dsw-alias-bg-layer-4: var(--dsw-alias-bg-layer-3);
  --dsw-alias-fill-l1: var(--dsw-alias-interactive-bg-hover);
  --dsw-alias-fill-l2: var(--dsw-alias-interactive-bg-active);
  --dsw-alias-fill-tertiary: var(--dsw-alias-interactive-bg-hover);
  --dsw-alias-fill-tsp-secondary: var(--dsw-alias-interactive-bg-hover);
  --dsw-alias-label-quaternary: var(--dsw-alias-label-dimmed);
  --dsw-alias-separator-primary: var(--dsw-alias-border-l1);

  /* First-run onboarding wizard (core pins #3964fe + fixed gradients). */
  --dsw-alias-onboarding-accent: var(--dsw-alias-brand-primary);
  --dsw-alias-onboarding-card-fill: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 80%, transparent);
  --dsw-alias-onboarding-secondary-fill: var(--dsw-alias-bg-layer-2);
  --dsw-alias-onboarding-checkbox-border: color-mix(in srgb, var(--dsw-alias-label-primary) 20%, transparent);
}

/* Dark-mode-specific inversions: the core's dark palette flips these
   (danger hover deepens, the inverted border becomes a faint white line),
   and (0,2,1) outranks the core's (0,1,1) body[data-ds-dark-theme] rules. */
body[class*="theme-"][data-ds-dark-theme] {
  --dsw-alias-border-inverted: color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent);
  --dsw-alias-interactive-bg-hover-danger: color-mix(in srgb, var(--dsw-alias-state-error-primary) 15%, transparent);
}

/* ContextMeter's per-category segments pin their tint on the element (body
   values cannot reach them). Only the "messages" category rides the DeepSeek
   blue; retint it to the theme brand. The system/tools categories keep their
   semantic grey/violet. CSS-module hashes keep the source class name as a
   suffix, so this substring hook survives rebuilds; recheck on major cores. */
body[class*="theme-"] [class*="colorMessages"] {
  --meter-tint: var(--dsw-alias-brand-primary);
}

/* HeroShell: the fish hitbox (currentColor rides this) + the headline text
   that follows it. Matches both the legacy direct \`<svg>\` child and the modern
   slot wrapper (\`div[data-slot][display:contents]\` → \`[data-yizi-hero-mark]\` →
   svg), hence the descendant \`:has()\` form. */
span:has(svg[viewBox="0 0 23.16 17.04"][width="34"]) {
  color: var(--dsw-alias-brand-primary);
}
span:has(svg[viewBox="0 0 23.16 17.04"][width="34"]) + span {
  color: var(--dsw-alias-brand-primary);
}

/* SidebarRoot: expanded wordmark button + collapsed rail toggle (fish mark).
   Descendant form for the same reason (the slot wrapper sits in between). */
button:has(svg[viewBox="0 0 182 24"]) {
  color: var(--dsw-alias-brand-primary);
}
button:has(svg[viewBox="0 0 23.16 17.04"][width="24"]) {
  color: var(--dsw-alias-brand-primary);
}

/* ── Modern brand-slot sizing ─────────────────────────────────────────────
   Our slot occupants render user logo markup (or the fish) inside
   \`[data-yizi-logo]\` / \`[data-yizi-hero-mark]\` wrappers. The logo height is
   set per element through the \`--yizi-logo-size\` custom property so the same
   markup scales for the sidebar (24) and the hero (34) without attribute
   surgery. */
[data-yizi-logo] svg,
[data-yizi-logo] img {
  height: var(--yizi-logo-size, 24px);
  width: auto;
  max-width: 100%;
  display: inline-block;
  vertical-align: middle;
}
`
