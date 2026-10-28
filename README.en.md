# 🎨 DeepSeek Harness Yizi Themes

**19 premium style themes + custom branding for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI**

A faithful port of the [YiziMarkdown](https://github.com/laoduu/YiziMarkdown) design language,
tailored for Harness's `--dsw-alias-*` semantic token system.

**Academic · Aurora · Cyberpunk · Facebook · Liquid Glass · Lychee · Magazine · Matrix · Minimal · Mint · Morandi · Nature · Palace · Sunset · Tech · Typewriter · Vaporwave · Vibrant · Violet**

Every theme ships both **light / dark** palettes and follows your "Light / Dark / System" setting.

A standard **Cordis plugin**: install with `dsh plugin` — no Harness source changes.

[中文](README.md) · [Installation](#-installation) · [Custom branding](#-custom-branding) · [Changelog](CHANGELOG.md) · [Dev log](docs/DEVLOG.md) · [Agent install guide](docs/AGENT-SKILL.md)

---

## ✨ Highlights

- 🎭 **19 themes**: from flowing auroras to cyberpunk neon, from Morandi greys to Forbidden-City vermilion
- 🌗 **Dual mode**: every theme has hand-tuned light/dark token pairs, auto-switching with your system
- 🧩 **Standard plugin**: a Cordis plugin installed via `dsh plugin` — zero changes to the Harness source tree
- ✅ **Works on stock Harness out of the box**: style themes are implemented by the plugin itself (persistence + `body.theme-<id>` application) — no core patch needed
- 🧩 **Upgrade-proof (official slots)**: branding (top-left logo / wordmark / badge / new-session headline) renders through Harness's official brand slots (`sidebar.brand.mark` / `sidebar.brand.name` / `conversation.hero.brand.mark`), registered at a lower `priority` so it coexists with — and wins over — the stock official brand plugin; cores without the slots fall back to the old viewBox injection path automatically
- 🧱 **Current-generation support (0.5.2)**: targets the `dsh-client-store` / `configForms` generation (Harness ≥ `v0.1.2-alpha.1`, including the `0.2.0-rc.2` / `0.2.1-rc.2` / `0.2.1-rc.3` desktop apps); custom branding persists in browser-local storage (`localStorage`) and needs no Harness settings transport
- 🎚️ **Orthogonal dimensions**: color mode (light/dark/system) and style theme are fully independent
- 🖌️ **Custom branding**: top-left logo / wordmark / badge / new-session headline, all following the **theme color and light/dark mode automatically**
- 📐 **Adjustable brand size** (0.5.4): one overall scale (75%–200%) for the top-left logo, wordmark and badge (Settings → Appearance → Custom → Brand size), applied live — no restart needed
- 🔤 **Prompt mapping** (experimental, off by default): replace "DeepSeek / 深度求索 / Harness" in the UI/output with your brand words (never rewrites what you are typing)
- 📍 **Controls everywhere**: theme picker + mode toggle in the session header, and floating controls on blank new sessions

---

## 🖼️ Theme Preview

![DeepSeek Harness Yizi Themes screenshot](assets/dsh-yizi-themes.png)

| Theme | Light base | Dark base | Design language |
|---|---|---|---|
| **Academic** `academic` | pale blue `#f5f8ff` | deep navy `#0d1117` | #002FA7 deep blue, professional |
| **Aurora** `aurora` | ice blue `#f0f5fa` | deep ink `#0a0e1a` | flowing northern lights |
| **Cyberpunk** `cyberpunk` | cold white `#f0f4f8` | deep black `#050508` | neon cyan/pink, futuristic |
| **Facebook** `facebook` | grey-white `#f0f2f5` | dark grey `#18191a` | #1877F2 brand blue, social card |
| **Liquid Glass** `liquidglass` | crystal white `#f6f9fe` | deep indigo `#0c1222` | translucent glass |
| **Lychee** `lychee` | pale pink-white `#fff5f5` | dark red `#171212` | #E63946 warm red |
| **Magazine** `magazine` | warm paper `#faf8f5` | deep brown `#1a1612` | coffee-brown serif reading |
| **Matrix** `matrix` | white `#f5faf5` | pure black `#000000` | matrix-green terminal |
| **Minimal** `minimal` | pure white `#ffffff` | dark grey `#1a1a1a` | clean and raw |
| **Mint** `mint` | creamy `#f5fbf8` | deep green `#0a1a14` | #10B981 refreshing mint |
| **Morandi** `morandi` | beige `#f7f3ef` | dark brown `#2c2926` | low-saturation premium grey |
| **Nature** `nature` | rice paper `#f5f2eb` | deep green `#1a1f1a` | paper forest green |
| **Palace** `palace` | rice paper `#faf6f0` | deep ink `#201812` | vermilion + gold |
| **Sunset** `sunset` | warm white `#fef8f0` | deep purple `#0d0812` | amber twilight |
| **Tech** `tech` | cool blue-white `#f0f4f8` | GitHub dark `#0d1117` | classic dev-tools |
| **Typewriter** `typewriter` | aged paper `#f5f0e8` | dark grey `#1a1a18` | sepia study |
| **Vaporwave** `vaporwave` | pale pink-purple `#f8f0f6` | deep purple `#140a1e` | pink-purple neon retro-future |
| **Vibrant** `vibrant` | warm orange-white `#fff8f2` | dark brown `#1a1410` | #F3641E vivid |
| **Violet** `violet` | pale purple-white `#faf5fe` | deep purple `#16101f` | #7209B7 elegant |

---

## 📦 Installation

> **Prerequisite**: Harness **≥ v0.1.2-alpha.1** (the `dsh-client-store` generation, including the 0.2.0-rc.2 / 0.2.1-rc.2 / 0.2.1-rc.3 desktop apps).
> For older rc.5 / rc.8 cores (client runtime still `@deepseek-ai/dsh-client-runtime`), use the 0.3.x line.

### Option 1: Download the tgz from GitHub Releases (recommended)

1. Download `dsh-yizi-themes-0.5.6.tgz` — from the [Releases page](https://github.com/laoduu/DeepSeek-Harness-yizi-themes/releases), or straight from the CLI:

```bash
curl -L -o dsh-yizi-themes-0.5.6.tgz https://github.com/laoduu/DeepSeek-Harness-yizi-themes/releases/download/v0.5.6/dsh-yizi-themes-0.5.6.tgz```

2. Stop the running `dsh web` (Ctrl+C);
3. Install:

```bash
cd <your deepseek-harness path>
pnpm dsh plugin --profile web add /path/to/dsh-yizi-themes-0.5.6.tgz```

> 💡 **DSH Desktop App users**: use `--profile desktop` instead — the desktop app
> and the web profile are separate profiles (`$DSH_HOME/profiles/<desktop|web>`),
> plugin installs do not cross over.

4. Restart:

```bash
pnpm dsh web
```

### Option 2: Build from source

```bash
git clone https://github.com/laoduu/DeepSeek-Harness-yizi-themes.git
cd DeepSeek-Harness-yizi-themes

node prepare.mjs    # prepare.mjs resolves tsdown from the Harness checkout
npm pack            # produces dsh-yizi-themes-<version>.tgz
```

Then follow Option 1 steps 2–4.

### ⚠️ Updating an existing install (same-version trap)

Re-`add` of a tarball with the **same version** does nothing (pnpm says `Already up to date`).

- Version **changed**: a plain `add` works.
- Version **unchanged**: remove first, then add:

```bash
pnpm dsh plugin --profile web remove dsh-yizi-themes
pnpm dsh plugin --profile web add  /path/to/dsh-yizi-themes-<version>.tgz
```

### Usage

- **Switch theme / mode**: the palette button + light/dark toggle at the top right of the session header; on a blank new session they appear as floating controls in the same spot.
- **Custom branding**: Settings → Appearance → Custom (below).

---

## 🖌️ Custom Branding

Settings → Appearance → **Custom**:

| Field | Description |
|---|---|
| **Logo SVG** | Paste SVG markup or a data URI. Used for the **top-left brand, the collapsed sidebar icon, and the new-session page icon**. Leave empty for the built-in whale mark |
| **Wordmark** | Top-left brand text (default `DEEPSEEK`, 18px base, scales with Brand size) |
| **Badge** | Small badge next to the wordmark (default `HARNESS`) |
| **Headline** | New-session page headline (default `探索未至之境`) |
| **Brand size** | One slider scaling the top-left logo, wordmark and badge together (75%–200%, default 100%); applied live, no restart — the sidebar brand row grows to fit, so nothing gets clipped |
| **Brand mappings** | Toggle (off by default, experimental) + mapping table replacing "DeepSeek Harness / DeepSeek / 深度求索 / Harness" in the UI/output; never rewrites input fields |

**Colors follow the theme automatically**: wordmark, badge background, and the logo container all use
`--dsw-alias-brand-primary`, so they change with any style theme and light/dark mode.

> **Want your own SVG to follow the theme too?** Replace hardcoded colors in the SVG with:
> - `fill="var(--dsw-alias-brand-primary)"` — follows theme and light/dark automatically;
> - `fill="currentColor"` — inherits the container color (already set to the theme color).
>
> Other tokens: primary text `--dsw-alias-label-primary`, secondary `--dsw-alias-label-secondary` /
> `--dsw-alias-label-caption`, inverted text `--dsw-alias-label-primary-inverted`,
> background `--dsw-alias-bg-layer-1`, border `--dsw-alias-border-l1`, etc.

**Persistence**: all branding settings (including the brand `scale`) live in **browser-local storage**
(`localStorage` key `dsh-yizi-themes:brand`) — desktop and web, and each browser, store their own copy;
survives restarts.

---

## ⚙️ Configuration (cordis.patch.yml)

Default plugin-row config (overridable in the profile's `cordis.patch.yml`):

| Field | Default | Description |
|---|---|---|
| `wordmark` | `DEEPSEEK` | Brand wordmark |
| `wordmarkBadge` | `HARNESS` | Badge text |
| `headline` | `探索未至之境` | New-session headline |
| `mappingEnabled` | `false` | Enable brand-string replacement |
| `mappingDeepSeek` / `mappingDeepSeekChinese` / `mappingHarness` / `mappingDeepSeekHarness` | original | Replacement targets |

Settings-page edits take precedence over this config (config seeds the base layer; the user layer overrides it).

---

## 🗑️ Uninstall

```bash
cd <your deepseek-harness path>
pnpm dsh plugin --profile web remove dsh-yizi-themes
```

Restart `dsh web` to restore the default appearance. `ui-theme.customBrand` belongs to the core
namespace and remains after uninstall (harmless; remove manually if you like).

---

## ❓ FAQ

**Q: Nothing changed after updating?**
If the version did not change you must `remove → add` (see above), fully restart `dsh web` (Ctrl+C), and hard-refresh the browser (Ctrl+Shift+R).

**Q: Settings accept input but are lost after refresh?**
Since 0.5.0 custom branding and style themes persist in **browser-local storage** (`localStorage`: `dsh-yizi-themes:brand` / `dsh-yizi-themes:themeId`) and no longer touch `$DSH_HOME/settings.yaml`. If values are lost after refresh: make sure you are not in private/incognito mode (localStorage may be disabled); desktop and web store data **independently** (not synced).

**Q: Top-left brand color does not follow the theme?**
Make sure the logo/wordmark is set and uses `currentColor` or `var(--dsw-alias-brand-primary)`; hardcoded colors never adapt.

**Q: Blank sidebar after collapse/expand?**
Old bug — upgrade to 0.2.2+.

**Q: DeepSeek Harness Desktop won't start after installing the plugin?**
Versions ≤ 0.4.0 still `require`d `@deepseek-ai/dsh-client-runtime/client`, and that package was **deleted** in the `dsh-client-store` generation. The desktop web bootstrap is all-or-nothing — one entry failing to activate aborts the whole client boot — so the app blank-screens. 0.5.0 moves to the current platform module (`@deepseek-ai/dsh-client-store`) and adapts to the narrowed `ui-theme` schema.
If it is already broken and the UI won't open: run `dsh plugin --profile desktop remove dsh-yizi-themes` from a terminal (no GUI needed), fully quit and restart the desktop app, then install the latest release (0.5.6).

**Q: Does it work on stock Harness (official source / npm-published rc.5)?**
0.5.x targets the `dsh-client-store` generation (Harness ≥ `v0.1.2-alpha.1`, including the `0.2.0-rc.2` / `0.2.1-rc.2` desktop apps); older rc.5 / rc.8 cores should use 0.3.x. Style themes have always been implemented by the plugin itself (`localStorage` + `body.theme-<id>`), so no core patch is needed; light/dark still goes through the core `ctx.theme`.

**Q: Console reports `single slot "sidebar.brand.mark" already has a registration at priority 0`?**
Older builds registered the brand slots at the default priority 0, colliding with the stock official brand plugin (`dsh-client-ui-brand-official`) — a single slot rejects a second occupant at the same priority (the "registered by X" in the message names the **existing** occupant). Since 0.5.0 the plugin registers at `priority: -100`; a single slot renders its lowest-priority occupant, so both coexist and the plugin's branding wins.

**Q: Custom branding stopped working after upgrading Harness to v0.1.0-rc.8?**
Adapted since 0.3.x (starting 0.3.0). rc.8 replaced the sidebar's single `BrandWordmark` (`viewBox="0 0 182 24"`) with official brand slots (`sidebar.brand.mark` / `sidebar.brand.name` / `conversation.hero.brand.mark`). The plugin registers those slots to render the custom logo / wordmark / badge / new-session headline — the slots are the official extension surface, so **future Harness upgrades keep working as long as the slot contract survives**; cores without the slots fall back to the old viewBox injection path automatically. If a same-version reinstall is ignored ("Already up to date"), `remove` then `add`.

**Q: After upgrading Harness to v0.1.2-alpha.1 the plugin fails with `dsh-client-runtime` missed the module table?**
New Harness builds removed the `@deepseek-ai/dsh-client-runtime` package, which the old plugin (0.3.x) still references — hence the load failure. **Upgrade to 0.4.0 or later (latest is 0.5.6)** (migrated to `@deepseek-ai/dsh-client-store` / `@deepseek-ai/cordis`). If you have 0.3.x installed, `remove` first, then `add` the latest release, fully restart `dsh web` (Ctrl+C) and hard-refresh the browser (Ctrl+Shift+R).

**Q: Want an agent to install it for you?**
Hand the [Agent install guide](docs/AGENT-SKILL.md) to the agent.

---

## 🤝 Contributing

Pull requests welcome:

- **New themes**: see the [dev log](docs/DEVLOG.md) and `scripts/gen-themes.mjs` (CSS → TS generator);
- **Bug fixes**: adaptations for newer Harness versions;
- **Docs**: installation guide and FAQ improvements.

---

## 📄 Docs

- [Changelog](CHANGELOG.md)
- [Development log](docs/DEVLOG.md)
- [Agent install guide](docs/AGENT-SKILL.md)

---

## ⚖️ License

[MIT](LICENSE) © [laoduu](https://github.com/laoduu)

This project is a third-party [`dsh-plugin`](https://github.com/topics/dsh-plugin) that brings 19 YiziMarkdown themes to [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness);
the theme design language is ported from [YiziMarkdown](https://github.com/laoduu/YiziMarkdown).

> The legacy `install.sh` / `install.ps1` / `MANIFEST.json` / `patch/` files belong to the earlier
> "overwrite Harness source" approach — deprecated, kept for reference only. Do not use them.
