/** Standalone stylesheet: brandOverrides. */
export default `/**
 * Brand-accent overrides for core Harness components.
 *
 * Injected by the plugin so brand elements follow the ACTIVE theme's
 * \`--dsw-alias-brand-primary\` (theme + light/dark adaptive) instead of the
 * static blue / ink. The core's own CSS-module class names are hashed per
 * build, so every rule here anchors on STABLE DOM hooks (data attributes,
 * roles, SVG viewBox fingerprints) that survive any build:
 *
 *  - running status shimmer  → the \`[role="status"]\` inside \`[data-chat-flow=""]\`
 *  - state dot (ongoing)     → \`[data-state="ongoing"]\`
 *  - hero fish + headline    → the fish's \`viewBox\` + its sibling span
 *  - sidebar wordmark / rail → the brand SVG \`viewBox\` inside the button
 *
 * ContextMeter (\`--meter-tint\`) and TrajectoryTable accents have no stable
 * non-hashed hook and are intentionally not overridden here.
 */

/* ChatView running-status ("Deep diving...") shimmer follows the brand color.
   Only overrides the gradient image; position/size/clip come from the app. */
[data-chat-flow=""] [role="status"][aria-live="polite"] {
  background-image: linear-gradient(
    90deg,
    var(--dsw-alias-brand-primary) 0%,
    var(--dsw-alias-brand-primary) 40%,
    color-mix(in srgb, var(--dsw-alias-brand-primary) 30%, transparent) 50%,
    var(--dsw-alias-brand-primary) 60%,
    var(--dsw-alias-brand-primary) 100%
  );
}

/* StateDot ongoing chase rides the brand accent. */
[data-state="ongoing"] {
  --dsh-state-ongoing: var(--dsw-alias-brand-primary);
}

/* HeroShell: the fish hitbox (currentColor rides this) + the headline text
   that follows it. */
span:has(> svg[viewBox="0 0 23.16 17.04"][width="34"]) {
  color: var(--dsw-alias-brand-primary);
}
span:has(> svg[viewBox="0 0 23.16 17.04"][width="34"]) + span {
  color: var(--dsw-alias-brand-primary);
}

/* SidebarRoot: expanded wordmark button + collapsed rail toggle (fish mark). */
button:has(> svg[viewBox="0 0 182 24"]) {
  color: var(--dsw-alias-brand-primary);
}
button:has(> svg[viewBox="0 0 23.16 17.04"][width="24"]) {
  color: var(--dsw-alias-brand-primary);
}
`
