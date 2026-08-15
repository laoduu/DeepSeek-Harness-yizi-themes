# 🎨 DeepSeek Harness Yizi Themes

**19 premium style themes for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI**

A faithful port of the [YiziMarkdown](https://github.com/laoduu/YiziMarkdown) design language,
tailored for Harness's `--dsw-alias-*` semantic token system.

**Academic · Aurora · Cyberpunk · Facebook · Liquid Glass · Lychee · Magazine · Matrix · Minimal · Mint · Morandi · Nature · Palace · Sunset · Tech · Typewriter · Vaporwave · Vibrant · Violet**

Every theme ships both **light / dark** palettes and follows your "Light / Dark / System" setting.

---

## ✨ Highlights

- 🎭 **19 themes**: from flowing auroras to cyberpunk neon, from Morandi greys to Forbidden-City vermilion
- 🌗 **Dual mode**: every theme has hand-tuned light/dark token pairs, auto-switching with your system
- 🧩 **First-class integration**: not a skin overlay — a native citizen of Harness's theme system, persisted to `settings.yaml`
- 🎚️ **Orthogonal dimensions**: color mode (light/dark/system) and style theme are fully independent
- 🖌️ **Token-level theming**: all themes are built on `--dsw-alias-*` variables; change one variable, restyle the world
- 📦 **One-command install**: cross-platform installers that auto-locate, back up, verify, and copy

---

## 🖼️ Theme Preview

![DeepSeek Harness Yizi Themes screenshot](assets/dsh-yizi-themes.png)

---

## 📦 Installation

> **Prerequisite**: a working DeepSeek Harness checkout (i.e. you can run `pnpm dsh web`).
> If you don't have one yet:
>
> ```bash
> git clone https://github.com/deepseek-ai/deepseek-harness.git
> cd deepseek-harness
> pnpm install
> ```

### Option 1: One-command installer (recommended)

Clone or download this repo (ideally next to your `deepseek-harness` checkout), then run:

**Windows (PowerShell):**

```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```

**macOS / Linux / WSL:**

```bash
bash install.sh
```

The script will:
1. Locate the `deepseek-harness` checkout (pass a path if auto-detection fails, e.g. `bash install.sh ~/deepseek-harness`);
2. Verify the repo version and **automatically back up** files it will replace (to `.dsh-yizi-themes-backup/`);
3. Copy the 19 theme stylesheets and related source.

### Option 2: Manual install

Merge `patch/` into the Harness checkout by path:

| Source (this repo `patch/`) | Destination (Harness checkout) |
|---|---|
| `patch/packages/client/ui-theme/**` | `packages/client/ui-theme/` |
| `patch/packages/client/ui-layout/**` | `packages/client/ui-layout/` |
| `patch/packages/client/web/src/base.css` | `packages/client/web/src/base.css` |
| `patch/packages/extensions/cordis-client-runner/**` | `packages/extensions/cordis-client-runner/` |
| `patch/scripts/gen-cordis-inspect-catalog.ts` | `scripts/gen-cordis-inspect-catalog.ts` |

### Rebuild after install

```bash
cd <your deepseek-harness path>

# First install only
pnpm install

# Rebuild the frontend (about 1-3 minutes)
pnpm run build

# Start the Web UI
pnpm dsh web
```

Open the printed URL (default `http://127.0.0.1:3080`), go to **Settings → Appearance**,
and click any theme card. Your selection is saved automatically.

---

## 🛠️ Custom themes

Each theme's palette lives in `patch/packages/client/ui-theme/src/styles/themes/<name>.css`:

```css
body.theme-aurora {
  --dsw-alias-bg-base: #f0f5fa;        /* app background */
  --dsw-alias-label-primary: #1a2a3a;  /* primary text */
  --dsw-alias-brand-primary: #4a90d9;  /* brand accent */
  /* ... */
}
body.theme-aurora[data-ds-dark-theme] { /* dark variant */ }
```

**Adding your own theme?**

1. Copy any theme CSS to `<name>.css` and rewrite the `--dsw-alias-*` variables;
2. Add an entry to the `BUILTIN_THEMES` array in `packages/client/ui-theme/src/client/index.ts` (id / name / swatch / desc);
3. Add the matching `@import` in `packages/client/web/src/base.css`;
4. Re-run `pnpm run build` — your theme card appears in the Appearance settings automatically.

The full token catalog lives in Harness's [`design-platform.css`](https://github.com/deepseek-ai/deepseek-harness/blob/main/packages/client/ui-theme/src/styles/design-platform.css).

---

## 🗑️ Uninstall / rollback

The installer backs up replaced files in `<Harness checkout>/.dsh-yizi-themes-backup/`:

```bash
cd <your deepseek-harness path>
cp -r .dsh-yizi-themes-backup/* packages/ scripts/
rm -rf packages/client/ui-theme/src/styles/themes
pnpm run build
pnpm dsh web
```

---

## ❓ FAQ

**Q: Nothing changed after install?**
Re-run `pnpm run build` and fully restart `dsh web`. Hard-refresh the browser (Ctrl+Shift+R).

**Q: Build errors?**
Ensure Node.js ≥ 22; run `pnpm install` first; if an older theme pack was installed, roll back first (see above).

**Q: Version mismatch warning?**
The script compares the checkout version against the target (`0.1.0-rc.5`). After Harness updates, file layout may differ — proceed with caution or wait for an updated release.

**Q: Only want a few themes?**
Delete the unwanted CSS files under `patch/.../themes/` and prune the `BUILTIN_THEMES` array before installing.

---

## 🤝 Contributing

Pull requests welcome:

- **New themes**: follow the custom-theme guide, with light/dark token pairs and a gradient swatch;
- **Bug fixes**: adaptations for newer Harness versions;
- **Docs**: installation guide and FAQ improvements.

---

## ⚖️ License

[MIT](LICENSE) © [laoduu](https://github.com/laoduu)

This project is a third-party [`dsh-plugin`](https://github.com/topics/dsh-plugin) that brings 19 YiziMarkdown themes to [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness);
the theme design language is ported from [YiziMarkdown](https://github.com/laoduu/YiziMarkdown).
