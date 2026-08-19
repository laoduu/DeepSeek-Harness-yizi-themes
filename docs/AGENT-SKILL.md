# Skill: Install / Update / Restart the dsh-yizi-themes plugin

> 用途：当用户让你（agent）帮他在 DeepSeek Harness 里安装、更新或重启 `dsh-yizi-themes`
> 主题插件时，按本文档执行。文档同时可作为人类用户的对照清单。
>
> 适用场景：用户说"帮我装一下主题插件 / 更新插件 / 主题没生效帮我看看 / 重新打包安装"。

---

## 0. 最重要：先诊断"用户用的到底是哪个 Harness"

DeepSeek Harness 有两种形态，**一台电脑上可以同时存在、同时运行**，各自的插件互不相通：

| 形态 | 是什么 | 用什么 profile | 怎么跑起来 |
|---|---|---|---|
| **桌面版（Desktop App）** | Electron 桌面应用（自带 dsh 运行时） | `$DSH_HOME/profiles/desktop` | 双击应用启动 |
| **Web 版（仓库启动）** | 源码仓库里 `pnpm dsh web` 起的网页服务 | `$DSH_HOME/profiles/web` | 终端里 `pnpm dsh web`，浏览器访问 `http://127.0.0.1:3080` |

**安装前必须确认用户实际使用的是哪一个**（装错 profile = 界面没变化，白忙一场）。按以下顺序诊断：

**① 看进程**（哪个在跑）：
- Windows：`Get-Process | Where-Object { $_.ProcessName -match 'DSH Desktop' }` → 有结果 = 桌面版在跑；
- 通用：`ps aux | grep -i "dsh desktop"`；
- Web 版在跑的特征：端口 `3080` 在监听（`Get-NetTCPConnection -LocalPort 3080` / `ss -ltnp | grep 3080`），且对应进程是 `node`。

**② 看 `dsh` 命令属于谁**：
- `Get-Command dsh`（Windows）`/ which dsh`——若 Source 里含 `DSH Desktop` / `AppData\Roaming\DSH Desktop`，说明 PATH 上的 `dsh` 是**桌面版自带**的 CLI；若指向源码仓库或 pnpm，则是 Web 版。
- `dsh --version` 可看版本号（桌面版自带 CLI 会回如 `0.1.0-rc.7`）。

**③ 看已装过的痕迹**（用户可能已经装过一边）：
- `$DSH_HOME/profiles/<desktop|web>/node_modules/dsh-yizi-themes` 是否存在；
- `$DSH_HOME/profiles/<desktop|web>/package.json` 的 `dependencies` 里是否有 `dsh-yizi-themes`——**已装的那边通常就是用户正在用的那边**。

**④ 分不清就问用户**：直接问"你是在浏览器打开 127.0.0.1:3080 用，还是用桌面的 Harness 应用？"——比猜可靠。

> 注意：`$DSH_HOME` 默认是 `~/.dsh`（Windows 为 `C:\Users\<用户>\.dsh`）；桌面版与 Web 版**共用同一个 `$DSH_HOME/settings.yaml`**（主题/品牌设置两边通），但 **profile 各自独立**（插件、bundle 层互不相通）。

---

## 1. 确定目标 profile

- 用户用**桌面版** → 目标 profile = `desktop`；
- 用户用**浏览器里的 Web 版** → 目标 profile = `web`。

确认对应目录存在：`$DSH_HOME/profiles/<desktop|web>`（含 `package.json` / `pnpm-workspace.yaml`）。不存在说明该形态还没初始化过，先让用户把对应版本跑起来一次（首次运行会自动初始化 profile）。

---

## 2. 获取插件

**默认方式：直接下载发布包 tgz（无需源码、无需构建）**

当前版本 **v0.2.4** 的准确下载地址：

```bash
curl -L -o dsh-yizi-themes-0.2.4.tgz https://github.com/laoduu/DeepSeek-Harness-yizi-themes/releases/download/v0.2.4/dsh-yizi-themes-0.2.4.tgz
```

新版本请在 [Releases 页面](https://github.com/laoduu/DeepSeek-Harness-yizi-themes/releases) 获取，URL 格式固定为：
`https://github.com/laoduu/DeepSeek-Harness-yizi-themes/releases/download/v<version>/dsh-yizi-themes-<version>.tgz`

**源码构建（仅限插件开发者/要改插件代码时）**：克隆插件仓库 + 需要有 Harness 仓库（`prepare.mjs` 从 Harness 的 node_modules 解析 tsdown），`node prepare.mjs && npm pack`。**普通用户不需要这一步，也默认没有源码目录**——不要假设用户电脑里有插件源码或 Harness 源码。

---

## 3. 安装到目标 profile

用 `dsh` CLI（PATH 上的 `dsh` 即可，它按 profile 名操作同一个 `$DSH_HOME`）：

```bash
dsh plugin --profile <desktop|web> add /path/to/dsh-yizi-themes-<version>.tgz
```

CLI 会：往该 profile 加依赖 → pnpm 安装 → 把声明了 `dsh.bundle` 的插件自动加入 bundle 层 → 启动时其 `cordis.patch.yml` 把插件行插入组合。

> 铁律：
> - **绝不修改 Harness 源码**来装插件（它现在是一个标准 Cordis 插件）。
> - **绝不用 `pnpm add file://...` 直接装**——必须走 `dsh plugin` CLI，否则 bundle 层与补丁合成不会被维护。
> - 桌面版与 Web 版是两个独立 profile，**给 desktop 装不会出现在 web 里**，反之亦然。

---

## 4. 更新已有安装（关键陷阱）

**同版本 tgz 内容变了再 `add` 是无效的** —— pnpm 报 `Already up to date`，`node_modules` 里还是旧代码。

- 版本号变了（如 0.2.3 → 0.2.4）：直接 `add` 即可；
- 版本号没变：必须**先 remove 再 add**：

```bash
dsh plugin --profile <desktop|web> remove dsh-yizi-themes
dsh plugin --profile <desktop|web> add  /path/to/dsh-yizi-themes-<version>.tgz
```

---

## 5. 重启生效（两种形态不同）

插件的 host 半区与 bundle 补丁在启动时加载，**必须完全重启**：

- **桌面版**：让用户完全退出桌面应用（所有进程）再重新打开。Agent 若正运行在该桌面应用里，**由用户手动退出并重启**，否则会把自己掐断。
- **Web 版**：在运行 `dsh web` / `pnpm dsh web` 的终端按 **Ctrl+C** 停掉，再重新执行启动命令；浏览器强刷 `Ctrl+Shift+R`。Agent 若正由这个 Web 实例托管，同样**必须由用户手动停/启**。

---

## 6. 验证是否生效

| 检查点 | 期望 |
|---|---|
| 右上角主题按钮 | 出现**调色板图标**按钮 + 明暗切换按钮（会话头部右侧） |
| 新会话（无对话） | 右上角出现**浮动**的主题/明暗按钮 |
| 设置 → 外观 | 出现"自定义"板块（Logo SVG / 品牌字样 / 徽章字样 / 新会话标题 / 品牌映射） |
| 持久化 | `$DSH_HOME/settings.yaml` 的 `ui-theme:` 下出现 `customBrand:` 节 |
| 切换主题 | `body.theme-<id>` 生效，左上角品牌色随主题/明暗变化 |

确认 host 半区已加载新代码（注意检查**目标 profile**，不是别的 profile）：

```bash
grep -c "customBrand" "$DSH_HOME/profiles/<desktop|web>/node_modules/dsh-yizi-themes/dist/client.js"
```

---

## 7. 常见问题排查

| 现象 | 处理 |
|---|---|
| 装完界面没变化 | ① 装错 profile 了？确认用户用的是 desktop 还是 web；② 版本号没变要 remove → add；③ 是否完全重启 |
| 主题切换没反应 | 看浏览器 F12 → Console 是否报 `runtime.setThemeId is not a function`（极旧构建）；升级到 0.2.1+（插件自带风格主题实现，干净 Harness 开箱即用） |
| 设置能输入但刷新后丢失 | 数据应写在 `$DSH_HOME/settings.yaml` 的 `ui-theme.customBrand`；没有则看 `settings.mutate` 是否回 `settings-not-exposed` |
| `settings-not-exposed` | 只有白名单命名空间可被浏览器读写；插件数据走核心 `ui-theme` 命名空间，不要改成自定义命名空间 |
| 侧边栏折叠后展开空白 | 老版本 bug，升级到 0.2.2+ |
| `dsh plugin` 报 pnpm 失败 | 按提示查看对应 profile 的 pnpm-workspace.yaml / allowBuilds 提示 |
| 桌面版装不上/装错 | 确认用的 `--profile desktop`；PATH 上的 `dsh` 可能属于桌面版（见第 0 节），它也能管理同一 DSH_HOME 下的其它 profile |

---

## 8. 卸载

```bash
dsh plugin --profile <desktop|web> remove dsh-yizi-themes
```

重启对应形态后，插件行从组合中移除；`settings.yaml` 里 `ui-theme.customBrand` 属于核心命名空间，卸载后仍保留（无副作用，可手工删除）。

---

## 9. 路径速查

| 路径 | 说明 |
|---|---|
| `$DSH_HOME`（默认 `~/.dsh`） | 用户数据根目录；桌面版与 Web 版共用 |
| `$DSH_HOME/profiles/<desktop\|web>` | 对应形态的 profile（依赖 + `dsh.profile.bundles` + `cordis.patch.yml`），互不相通 |
| `$DSH_HOME/settings.yaml` | 用户设置文档（主题偏好、自定义品牌等，两边共享） |
| `$DSH_HOME/profiles/node_modules` | 内置包回退目录（host 半区外部依赖由此解析） |
| `AppData\Roaming\DSH Desktop\host-commands\desktop\bin\dsh.cmd` | 桌面版自带的 `dsh` CLI（若 `Get-Command dsh` 指向它） |
