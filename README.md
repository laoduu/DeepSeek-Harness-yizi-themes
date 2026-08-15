<div align="center">

# 🎨 DeepSeek Harness Yizi Themes

**19 个精品风格主题 for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI**

完整移植自 [YiziMarkdown](https://github.com/laoduu/YiziMarkdown) 的设计语言，
为 Harness 的 `--dsw-alias-*` 语义 token 体系量身定制。

**学术蓝 · 极光 · 赛博朋克 · Facebook · 液态玻璃 · 荔枝红 · 杂志感 · 黑客帝国 · 极简风 · 薄荷冰沙 · 莫兰迪 · 自然风 · 故宫朱砂 · 落日熔金 · 科技感 · 复古打字机 · 蒸汽波 · 活力橙 · 紫罗兰**

每个主题都同时支持 **亮色 / 深色** 两套配色，并跟随你的「浅色 / 深色 / 跟随系统」设置。

[English](README.en.md) · [安装教程](#-安装教程) · [主题预览](#-主题预览) · [自定义主题](#-自定义主题)

</div>

---

## ✨ 特色

- 🎭 **19 个主题**：从极光流光到赛博朋克霓虹，从莫兰迪高级灰到故宫朱砂，总有一款配得上你的审美
- 🌗 **双模式**：每个主题都有精心调配的亮色 / 深色两套 token，跟随系统自动切换
- 🧩 **原生融入**：不是皮肤覆盖，而是 Harness 主题系统的一等公民 —— 选择持久化到 `settings.yaml`，重启不丢失
- 🎚️ **正交双维度**：明暗模式（浅色/深色/跟随系统）与风格主题完全独立，可自由组合
- 🖌️ **token 级定制**：所有主题基于 `--dsw-alias-*` 语义变量，改一个变量即可全局换肤
- 📦 **一键安装**：跨平台安装脚本，自动备份、复制、校验，无需手工改文件

---

## 🖼️ 主题预览

![DeepSeek Harness Yizi Themes 截图](assets/dsh-yizi-themes.png)

| 主题 | 亮色基调 | 深色基调 | 设计语言 |
|---|---|---|---|
| **学术蓝** `academic` | 淡蓝白 `#f5f8ff` | 深蓝黑 `#0d1117` | #002FA7 深蓝品牌，沉稳专业 |
| **极光** `aurora` | 冰蓝 `#f0f5fa` | 深墨 `#0a0e1a` | 北极光流动的色彩 |
| **赛博朋克** `cyberpunk` | 冷白 `#f0f4f8` | 深黑 `#050508` | 霓虹青粉撞色，未来感 |
| **Facebook** `facebook` | 灰白 `#f0f2f5` | 深灰 `#18191a` | #1877F2 品牌蓝，社交卡片风 |
| **液态玻璃** `liquidglass` | 冰晶白 `#f6f9fe` | 深靛 `#0c1222` | 半透明玻璃质感 |
| **荔枝红** `lychee` | 淡红白 `#fff5f5` | 暗红黑 `#171212` | #E63946 热情红调 |
| **杂志感** `magazine` | 暖纸 `#faf8f5` | 深褐 `#1a1612` | 咖啡棕衬线阅读 |
| **黑客帝国** `matrix` | 白底 `#f5faf5` | 纯黑 `#000000` | 矩阵绿终端风 |
| **极简风** `minimal` | 纯白 `#ffffff` | 深灰 `#1a1a1a` | 清爽原始 |
| **薄荷冰沙** `mint` | 奶白 `#f5fbf8` | 深绿 `#0a1a14` | #10B981 清透薄荷 |
| **莫兰迪** `morandi` | 米白 `#f7f3ef` | 深褐 `#2c2926` | 低饱和高级灰 |
| **自然风** `nature` | 米黄纸 `#f5f2eb` | 深墨绿 `#1a1f1a` | 纸感森林绿 |
| **故宫朱砂** `palace` | 宣纸 `#faf6f0` | 深墨 `#201812` | 朱砂红 + 琉璃金 |
| **落日熔金** `sunset` | 暖白 `#fef8f0` | 深紫 `#0d0812` | 琥珀色暮光 |
| **科技感** `tech` | 冷蓝白 `#f0f4f8` | GitHub 深 `#0d1117` | 经典开发工具风 |
| **复古打字机** `typewriter` | 老纸 `#f5f0e8` | 深灰 `#1a1a18` | 深褐墨色书房 |
| **蒸汽波** `vaporwave` | 浅粉紫 `#f8f0f6` | 深紫黑 `#140a1e` | 粉紫霓虹复古未来 |
| **活力橙** `vibrant` | 暖橙白 `#fff8f2` | 深褐 `#1a1410` | #F3641E 鲜明醒目 |
| **紫罗兰** `violet` | 淡紫白 `#faf5fe` | 深紫黑 `#16101f` | #7209B7 雅致文艺 |

---

## 📦 安装教程

> **前置条件**：你需要一个能运行的 DeepSeek Harness 仓库（即能执行 `pnpm dsh web`）。
> 如果还没有，先：
>
> ```bash
> git clone https://github.com/deepseek-ai/deepseek-harness.git
> cd deepseek-harness
> pnpm install
> ```

### 方式一：一键安装（推荐）

将本仓库克隆或下载到本地（建议与 `deepseek-harness` 仓库同级），然后运行安装脚本：

**Windows（PowerShell）：**

```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```

**macOS / Linux / WSL：**

```bash
bash install.sh
```

脚本会自动：
1. 在常见位置查找 `deepseek-harness` 仓库（找不到时可用参数指定路径，如 `bash install.sh ~/deepseek-harness`）；
2. 校验仓库版本并**自动备份**将被覆盖的文件（到 `.dsh-yizi-themes-backup/`）；
3. 复制 19 个主题样式与相关源码。

### 方式二：手动安装

将 `patch/` 下的文件按路径合并到 Harness 仓库：

| 来源（本仓库 `patch/` 下） | 目标（Harness 仓库） |
|---|---|
| `patch/packages/client/ui-theme/**` | `packages/client/ui-theme/` |
| `patch/packages/client/ui-layout/**` | `packages/client/ui-layout/` |
| `patch/packages/client/web/src/base.css` | `packages/client/web/src/base.css` |
| `patch/packages/extensions/cordis-client-runner/**` | `packages/extensions/cordis-client-runner/` |
| `patch/scripts/gen-cordis-inspect-catalog.ts` | `scripts/gen-cordis-inspect-catalog.ts` |

### 安装后构建

无论哪种方式，最后都要**重新构建**：

```bash
cd <你的 deepseek-harness 路径>

# 首次安装才需要
pnpm install

# 重新构建前端（约 1-3 分钟）
pnpm run build

# 启动 Web UI
pnpm dsh web
```

打开终端打印的地址（默认 `http://127.0.0.1:3080`），进入 **设置 → 外观**，
点击任意主题色卡即可切换，选择会自动保存。

---

## 🛠️ 自定义主题

每个主题的配色都在 `patch/packages/client/ui-theme/src/styles/themes/<名字>.css`：

```css
body.theme-aurora {
  --dsw-alias-bg-base: #f0f5fa;        /* 应用底色 */
  --dsw-alias-label-primary: #1a2a3a;  /* 主文字 */
  --dsw-alias-brand-primary: #4a90d9;  /* 品牌强调色 */
  /* ... */
}
body.theme-aurora[data-ds-dark-theme] { /* 深色变体 */ }
```

**想新增一个自己的主题？**

1. 复制任意一个主题 CSS 为 `<名字>.css`，改写里面的 `--dsw-alias-*` 变量；
2. 在 `packages/client/ui-theme/src/client/index.ts` 的 `BUILTIN_THEMES` 数组加一条定义（id / name / swatch 色卡 / desc）；
3. 在 `packages/client/web/src/base.css` 加上对应的 `@import`；
4. 重新 `pnpm run build` 即可，外观设置里会自动出现你的主题卡片。

完整的 token 目录见 Harness 的 [`design-platform.css`](https://github.com/deepseek-ai/deepseek-harness/blob/main/packages/client/ui-theme/src/styles/design-platform.css)。

---

## 🗑️ 卸载 / 回滚

安装脚本把原始文件备份在 `<Harness仓库>/.dsh-yizi-themes-backup/`，恢复：

```bash
cd <你的 deepseek-harness 路径>
cp -r .dsh-yizi-themes-backup/* packages/ scripts/   # Windows: Copy-Item -Recurse -Force
rm -rf packages/client/ui-theme/src/styles/themes     # 删除新增主题 CSS
pnpm run build
pnpm dsh web
```

---

## ❓ 常见问题

**Q: 安装后界面没有变化？**
重新执行 `pnpm run build` 并完全重启 `dsh web`（Ctrl+C 后重启）。浏览器强刷 Ctrl+Shift+R。

**Q: 构建报错？**
确保 Node.js ≥ 22；先执行 `pnpm install`；如果之前装过旧版，先按「卸载/回滚」恢复再重装。

**Q: 版本不匹配警告？**
脚本对比 Harness 仓库版本与目标版本（`0.1.0-rc.5`）。Harness 更新后文件结构可能变化，可按提示继续（一般兼容），或等待本仓库发布适配版本。

**Q: 只想要其中几个主题？**
删掉 `patch/.../themes/` 下不想要的 CSS，并编辑 `BUILTIN_THEMES` 数组后安装。

---

## 🤝 贡献

欢迎提交 Pull Request：

- **新主题**：按照「自定义主题」章节的规范，附上亮/暗双套 token 与一张渐变色卡；
- **Bug 修复**：Harness 版本更新导致的适配问题；
- **文档改进**：安装教程、常见问题。

---

## ⚖️ 许可

[MIT](LICENSE) © [老独](https://github.com/laoduu)

本项目是对 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（MIT）的第三方主题扩展；
主题设计语言移植自 [YiziMarkdown](https://github.com/laoduu/YiziMarkdown)。

---

<div align="center">

> A third-party `dsh-plugin` that brings 19 YiziMarkdown themes to DeepSeek Harness.

**如果这个项目对你有帮助，欢迎 ⭐ Star 支持！**

</div>
