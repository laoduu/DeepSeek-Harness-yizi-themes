# DeepSeek Harness 主题包 v0.2.3：不再改源码，一条命令装好 19 套主题 + 自定义品牌

> 上一篇写了怎么把 YiziMarkdown 的 19 套主题搬到 DeepSeek Harness。但那个版本要**改 Harness 源码 + 重新构建**，升级一次麻烦一次。这次我把它彻底改造成了**标准 Cordis 插件**——一条命令安装，一行命令卸载，再也不碰源码。

---

## 还是先上结论

如果你已经在用 Harness，**三条命令**就能装上（Windows / macOS / Linux 通用）：

```bash
# 1. 下载插件包（v0.2.3）
curl -L -o dsh-yizi-themes-0.2.3.tgz \
  https://github.com/laoduu/DeepSeek-Harness-yizi-themes/releases/download/v0.2.3/dsh-yizi-themes-0.2.3.tgz

# 2. 停掉正在运行的 dsh web（Ctrl+C），然后安装
cd <你的 deepseek-harness 路径>
pnpm dsh plugin --profile web add /path/to/dsh-yizi-themes-0.2.3.tgz

# 3. 重启
pnpm dsh web
```

打开 `http://127.0.0.1:3080`，右上角出现一个**调色板按钮**——19 套主题 + 明暗切换，点开即用，选择自动保存。

**嫌麻烦？** 把这份 [Agent 安装指引](https://github.com/laoduu/DeepSeek-Harness-yizi-themes/blob/main/docs/AGENT-SKILL.md) 直接甩给 Harness 里的 agent（就是你自己在用的那个），它会帮你下载、构建、安装、重启，一步不落。

---

## 为什么要重写：改源码的方案，终究是权宜之计

第一版的核心思路是「把 CSS 覆盖表嫁接到 Harness 的 token 体系上」——可行，但代价很大：

- 要**复制文件进 Harness 仓库源码**，等于把插件和本体焊死；
- 每次升级要**重新构建前端**（1–3 分钟），Harness 更新后还可能文件对不上；
- 卸载要手动恢复备份文件，**不干净**。

Harness 本身就是 Cordis 插件化架构——**连主题都是插件**。既然如此，为什么不把「主题包」做成一个正经的插件？

于是有了插件版（当前 v0.2.3）：标准 Cordis 插件，`dsh plugin` 官方命令安装，**零 Harness 源码改动**——而且**干净 Harness（官方源码 / npm 发布的 rc.5）开箱即用**：风格主题由插件自己实现，不需要给核心打任何补丁（早期版本依赖核心的 `setThemeId`，在干净 Harness 上会失效，v0.2.1+ 已自带实现）。

---

## 它现在能做什么

### 🎭 19 套主题 × 亮暗双色

学术蓝、极光、赛博朋克、Facebook、液态玻璃、荔枝红、杂志感、黑客帝国、极简风、薄荷冰沙、莫兰迪、自然风、故宫朱砂、落日熔金、科技感、复古打字机、蒸汽波、活力橙、紫罗兰。

每套都基于 Harness 的 `--dsw-alias-*` 语义 token 体系，**亮色/深色两套配色**，跟随你的「浅色/深色/跟随系统」设置。切换零延迟——CSS 全量注入，没有任何网络请求。

### 🖌️ 自定义品牌：把它变成你自己的 Harness

这是插件版最有意思的部分。设置 → 外观 → **自定义**：

| 设置项 | 说明 |
|---|---|
| **Logo SVG** | 粘贴 SVG 代码，**左上角品牌、收起侧边栏图标、新会话页图标**三处同时生效 |
| **品牌字样** | 左上角品牌文字（默认 DEEPSEEK，18px） |
| **徽章字样** | 品牌文字旁的徽章标签（默认 HARNESS） |
| **新会话标题** | 新会话页的标题文案（默认「探索未至之境」） |
| **品牌映射** | 开关 + 映射表，输出时替换提示词里的 DeepSeek / 深度求索 / Harness |

**品牌色自动跟随主题与明暗**——品牌字样、徽章背景、Logo 容器统一使用 `--dsw-alias-brand-primary`，你切到荔枝红，左上角品牌就变红；切到深色，它自动换浅。你的 Logo SVG 想要同款待遇？把硬编码颜色替换成：

```xml
fill="var(--dsw-alias-brand-primary)"   <!-- 随主题+明暗自动变 -->
<!-- 或 -->
fill="currentColor"                       <!-- 继承容器颜色 -->
```

### 📍 随处可切换

- 会话头部右上角：调色板按钮（主题）+ 明暗切换按钮；
- **新会话（还没有任何对话）时**：同一位置自动变成浮动按钮——新用户第一眼就能切换，不用等聊完一轮。

### 🔤 品牌映射（输出时替换）

想让你的 Harness 不叫 "DeepSeek Harness"？打开品牌映射，把提示词里的品牌词替换成你想要的——**在输出时替换，不动系统提示词**，随时开关。

### 💾 一切持久化

主题偏好、自定义品牌全部存进 `~/.dsh/settings.yaml`，重启不丢。

---

## 安装（再说一遍，因为真的简单）

| 步骤 | 命令 |
|---|---|
| 下载 | `curl -L -o dsh-yizi-themes-0.2.3.tgz https://github.com/laoduu/DeepSeek-Harness-yizi-themes/releases/download/v0.2.3/dsh-yizi-themes-0.2.3.tgz` |
| 安装 | `pnpm dsh plugin --profile web add /path/to/dsh-yizi-themes-0.2.3.tgz` |
| 重启 | `pnpm dsh web` |
| 卸载 | `pnpm dsh plugin --profile web remove dsh-yizi-themes` + 重启 |

> **⚠️ 一个坑**：同版本的 tgz 内容变了，直接 `add` 不会更新（pnpm 会说 `Already up to date`）。升级时版本号变了就直接 `add`；没变就先 `remove` 再 `add`。

想从源码自己构建也可以：`git clone` 后 `node prepare.mjs && npm pack`，其余步骤一样。详细教程见 [README](https://github.com/laoduu/DeepSeek-Harness-yizi-themes/blob/main/README.md)。

---

## 懒人通道：让 agent 替你装

前面说了，把 [docs/AGENT-SKILL.md](https://github.com/laoduu/DeepSeek-Harness-yizi-themes/blob/main/docs/AGENT-SKILL.md) 甩给 agent 即可。这份文档写清楚了：

- 从哪下载、怎么构建、怎么安装（并明确**不许用 `pnpm add file://`**、**不许改 Harness 源码**）；
- 同版本陷阱怎么绕开；
- 装完怎么验证、出问题怎么排查；
- 卸载与相关路径速查。

你在会话里说一句「帮我按这个 skill 装上主题插件」，剩下的事交给它。

---

## 和旧版对比

| | v0.1.0（改源码） | 插件版（当前 v0.2.3） |
|---|---|---|
| 安装 | 跑脚本复制文件进 Harness | `dsh plugin add <tgz>` |
| 构建 | 每次都要 `pnpm run build`（1–3 分钟） | 不需要 |
| 卸载 | 手动恢复备份 | `dsh plugin remove` 一条命令 |
| Harness 源码 | 被修改 | **零改动** |
| 干净 Harness | 需要打补丁 | **开箱即用**（风格主题由插件自实现） |
| 自定义品牌 | 无 | ✅ Logo/字样/徽章/标题 + 主题色跟随 |
| 品牌映射 | 无 | ✅ 输出时替换 |
| 新会话切换 | 无 | ✅ 浮动按钮 |

旧版的 `install.sh` / `install.ps1` / `patch/` 已废弃，仅留作参考。

---

## 最后

这个项目最好的部分不是 19 套主题，而是「**换肤、换品牌、换一切**」这件事变得像呼吸一样自然：一条命令装上，点一下切换，重启还在；想换回默认，一条命令卸载，干净利落。

**项目地址：** https://github.com/laoduu/DeepSeek-Harness-yizi-themes

MIT 协议，欢迎 Star ⭐，也欢迎 PR——想加主题、想调色、想修 bug，都可以来。

以上。
