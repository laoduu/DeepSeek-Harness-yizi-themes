---

## 📢 更新（2026-08）：已改为标准插件（当前 v0.2.3），安装不再需要改源码

这篇写的是第一版「修改 Harness 源码」的方案，已废弃。新版本做成了**标准 Cordis 插件**，一条命令安装，不碰源码、不用重新构建——**干净 Harness（官方源码 / npm 发布的 rc.5）开箱即用**，无需打补丁：

```bash
# 下载 v0.2.3
curl -L -o dsh-yizi-themes-0.2.3.tgz \
  https://github.com/laoduu/DeepSeek-Harness-yizi-themes/releases/download/v0.2.3/dsh-yizi-themes-0.2.3.tgz

# 停掉 dsh web（Ctrl+C）后安装，再 pnpm dsh web 重启
pnpm dsh plugin --profile web add /path/to/dsh-yizi-themes-0.2.3.tgz
```

新版本在 19 套主题 + 亮暗双色之外，还多了不少"自定义"能力：

- ✅ **干净 Harness 开箱即用**：风格主题由插件自实现（含持久化），官方源码 / npm 发布的 rc.5 无需打补丁；
- 🖌️ **自定义品牌**：Logo SVG / 品牌字样 / 徽章 / 新会话标题，左上角、收起侧边栏、新会话页三处同步生效；
- 🎨 **品牌色跟随主题与明暗**：logo 与品牌文字用 `--dsw-alias-brand-primary`，切主题/切深色自动变色（你的 SVG 把硬编码颜色换成 `fill="var(--dsw-alias-brand-primary)"` 即可同款待遇）；
- 🔤 **品牌映射**：输出时替换提示词里的 DeepSeek / 深度求索 / Harness；
- 📍 **新会话浮动按钮**：还没有对话内容时，右上角也能切换主题和明暗；
- 💾 所有设置持久化到 `~/.dsh/settings.yaml`，卸载用 `dsh plugin remove`，干净利落。

**怕麻烦？** 把 [Agent 安装指引](https://github.com/laoduu/DeepSeek-Harness-yizi-themes/blob/main/docs/AGENT-SKILL.md) 甩给 Harness 里的 agent，它会帮你下载、安装、重启，一步不落。完整说明见 [README](https://github.com/laoduu/DeepSeek-Harness-yizi-themes/blob/main/README.md)。
