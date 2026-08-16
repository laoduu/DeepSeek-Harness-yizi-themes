# Skill: Install / Update / Restart the dsh-yizi-themes plugin

> 用途：当用户让你（agent）帮他在 DeepSeek Harness 里安装、更新或重启 `dsh-yizi-themes`
> 主题插件时，按本文档执行。文档同时可作为人类用户的对照清单。
>
> 适用场景：用户说"帮我装一下主题插件 / 更新插件 / 主题没生效帮我看看 / 重新打包安装"。

---

## 0. 先弄清两件事（避免白忙）

1. **Harness 仓库位置**（下文 `$HARNESS`，例如 `C:\Users\Administrator\deepseek-harness`）；
2. **插件源码位置**（下文 `$PLUGIN`，例如 `E:\mycode\dsh-yizi-themes`）。

> 铁律（重要约束）：
> - **绝不修改 Harness 仓库 `packages/` 源码**来安装本插件 —— 插件是标准 Cordis 插件，走 `dsh plugin` CLI。
> - **绝不用 `pnpm add file://...` 直接装** —— 必须用 `dsh plugin --profile web add <tgz>`，它会维护 profile 的 bundle 层与补丁合成。
> - 安装/更新前**需要用户先停掉正在运行的 `dsh web`**（Ctrl+C）；装完由用户重启。若你是运行在 `dsh web` 里的 agent，停服会中断你自己 —— 务必把"需要用户手动停服重启"这一步讲清楚，或让用户执行命令。

---

## 1. 下载 / 获取插件

**方式 A：从 GitHub 克隆源码（推荐，可自建与调试）**

```bash
git clone https://github.com/laoduu/DeepSeek-Harness-yizi-themes.git "$PLUGIN"
```

**方式 B：直接下载发布包 tgz**（若 GitHub Releases 提供）
下载 `dsh-yizi-themes-<version>.tgz` 到本地即可，跳过第 2 步构建。

---

## 2. 构建发布包（tgz）— 源码方式需要

插件源码里的 `prepare.mjs` 会从 **Harness 仓库的 node_modules 解析 tsdown** 来打包，因此：

1. 确认 `$HARNESS` 已 `pnpm install` 过（`$HARNESS\node_modules\tsdown` 存在）；
2. 在插件目录构建并打包：

```bash
cd "$PLUGIN"
node prepare.mjs          # 生成 dist/index.js + dist/client.js + dist/cordis.patch.yml
npm pack                  # 生成 dsh-yizi-themes-<version>.tgz
```

产物：`$PLUGIN/dsh-yizi-themes-<version>.tgz`。

> 若 `prepare.mjs` 里 tsdown 路径写死（绝对路径），按实际 Harness 仓库位置修正该路径后再跑。

---

## 3. 安装

```bash
cd "$HARNESS"
pnpm dsh plugin --profile web add "$PLUGIN/dsh-yizi-themes-<version>.tgz"
```

CLI 会：在 profile（`$DSH_HOME/profiles/web`）里加依赖 → pnpm 安装 → 把声明了 `dsh.bundle` 的插件自动加入 bundle 层 → 启动时其 `cordis.patch.yml` 把插件行插入组合。

---

## 4. 更新已有安装（关键陷阱）

**同版本 tgz 内容变了再 `add` 是无效的** —— pnpm 报 `Already up to date`，`node_modules` 里还是旧代码。

- 版本号变了（如 0.1.0 → 0.2.0）：直接 `add` 即可，pnpm 会重新安装；
- 版本号没变：必须**先 remove 再 add**：

```bash
cd "$HARNESS"
pnpm dsh plugin --profile web remove dsh-yizi-themes
pnpm dsh plugin --profile web add  "$PLUGIN/dsh-yizi-themes-<version>.tgz"
```

---

## 5. 重启生效

插件的 host 半区与 bundle 补丁在启动时加载，**必须完全重启**：

1. 用户在运行 `dsh web` 的终端按 **Ctrl+C** 停掉；
2. 重新启动：

```bash
cd "$HARNESS"
pnpm dsh web
```

3. 浏览器打开打印的地址（默认 `http://127.0.0.1:3080`），必要时强刷 `Ctrl+Shift+R`。

---

## 6. 验证是否生效

| 检查点 | 期望 |
|---|---|
| 右上角主题按钮 | 出现**调色板图标**按钮 + 明暗切换按钮（会话头部右侧） |
| 新会话（无对话） | 右上角出现**浮动**的主题/明暗按钮 |
| 设置 → 外观 | 出现"自定义"板块（Logo SVG / 品牌字样 / 徽章字样 / 新会话标题 / 品牌映射） |
| 持久化 | `$DSH_HOME/settings.yaml` 的 `ui-theme:` 下出现 `customBrand:` 节 |
| 切换主题 | `body.theme-<id>` 生效，左上角品牌色随主题/明暗变化 |

确认 host 半区是否加载了新代码：

```bash
grep -c "customBrand" "$DSH_HOME/profiles/web/node_modules/dsh-yizi-themes/dist/client.js"
```

---

## 7. 常见问题排查

| 现象 | 处理 |
|---|---|
| 更新后界面没变化 | 版本号是否变了？没变则 remove → add；检查 `dsh web` 是否完全重启 |
| 设置能输入但刷新后丢失 | 数据应写在 `$DSH_HOME/settings.yaml` 的 `ui-theme.customBrand`；没有则说明写入被拒（浏览器 F12 → Network 看 `settings.mutate` 响应是否为 `settings-not-exposed`） |
| 侧边栏折叠后展开空白 | 老版本 bug，升级到 0.2.0+ |
| `settings-not-exposed` | 只有白名单命名空间可被浏览器读写；插件数据走核心 `ui-theme` 命名空间，不要改成自定义命名空间 |
| `dsh plugin` 报 pnpm 失败 | 按提示查看 pnpm-workspace.yaml / allowBuilds 提示，处理后重试 |

---

## 8. 卸载

```bash
cd "$HARNESS"
pnpm dsh plugin --profile web remove dsh-yizi-themes
```

重启 `dsh web` 后，插件行从组合中移除；`settings.yaml` 里 `ui-theme.customBrand` 属于核心命名空间，卸载后仍保留（无副作用，可手工删除）。

---

## 9. 相关路径速查

| 路径 | 说明 |
|---|---|
| `$DSH_HOME/profiles/web` | web profile（`package.json` 依赖 + `dsh.profile.bundles` + `cordis.patch.yml`） |
| `$DSH_HOME/settings.yaml` | 用户设置文档（主题偏好、自定义品牌、模型等） |
| `$DSH_HOME/profiles/node_modules` | 内置包回退目录（host 半区的外部依赖由此解析） |
| `$PLUGIN/dist/client.js` | 浏览器半区（`__ModuleLoader__` 封装） |
| `$PLUGIN/dist/index.js` | host 半区（Node） |
