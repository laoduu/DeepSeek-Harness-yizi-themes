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
- ✅ **Works on stock Harness out of the box**: style themes are implemented by the plugin itself (persistence + `body.theme-<id>` application) — no patch needed on official source or the npm-published rc.5
- 🎚️ **Orthogonal dimensions**: color mode (light/dark/system) and style theme are fully independent
- 🖌️ **Custom branding**: top-left logo / wordmark / badge / new-session headline, all following the **theme color and light/dark mode automatically**
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

> **Prerequisite**: a DeepSeek Harness checkout that can run `pnpm dsh web` (including its profile).

### Option 1: Download the tgz from GitHub Releases (recommended)

1. Download `dsh-yizi-themes-0.2.4.tgz` — from the [Releases page](https://github.com/laoduu/DeepSeek-Harness-yizi-themes/releases), or straight from the CLI:

```bash
curl -L -o dsh-yizi-themes-0.2.4.tgz https://github.com/laoduu/DeepSeek-Harness-yizi-themes/releases/download/v0.2.4/dsh-yizi-themes-0.2.4.tgz
```

2. Stop the running `dsh web` (Ctrl+C);
3. Install:

```bash
cd <your deepseek-harness path>
pnpm dsh plugin --profile web add /path/to/dsh-yizi-themes-0.2.4.tgz
```

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
| **Wordmark** | Top-left brand text (default `DEEPSEEK`, 18px) |
| **Badge** | Small badge next to the wordmark (default `HARNESS`) |
| **Headline** | New-session page headline (default `探索未至之境`) |
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

**Persistence**: all branding lives in `$DSH_HOME/settings.yaml` under `ui-theme.customBrand`,
alongside the theme preference — survives restarts.

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
Check whether `$DSH_HOME/settings.yaml` gained a `ui-theme.customBrand` section. If not, open F12 → Network and look for `settings.mutate` returning `settings-not-exposed` (write refused). The plugin writes through the core `ui-theme` namespace (the api-proxy allowlist) — do not switch to a custom namespace.

**Q: Top-left brand color does not follow the theme?**
Make sure the logo/wordmark is set and uses `currentColor` or `var(--dsw-alias-brand-primary)`; hardcoded colors never adapt.

**Q: Blank sidebar after collapse/expand?**
Old bug — upgrade to 0.2.2+.

**Q: Does it work on stock Harness (official source / npm-published rc.5)?**
Yes. Since 0.2.1 the plugin implements the style-theme dimension itself (persisted in localStorage + applies `body.theme-<id>` directly), so no core patch is needed; light/dark still goes through the core. On cores that DO expose setThemeId (old patch or a fork with the feature), it automatically uses the core path (persisted in settings.yaml).

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
