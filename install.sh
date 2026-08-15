#!/usr/bin/env bash
# ============================================================================
#  dsh-yizi-themes 安装脚本 (macOS / Linux / WSL)
#  YiziMarkdown 主题包 for DeepSeek Harness — 一键安装 19 个风格主题
#
#  用法:
#     bash install.sh [Harness仓库路径]
#
#  不带参数时，脚本会在常见位置自动查找 Harness 仓库；
#  找不到时提示手动输入。
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PATCH_DIR="$SCRIPT_DIR/patch"
MANIFEST_PATH="$SCRIPT_DIR/MANIFEST.json"
HARNESS_PATH="${1:-}"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'; CYAN='\033[0;36m'; MAGENTA='\033[0;35m'; NC='\033[0m'

step() { echo -e "\n==> ${CYAN}$1${NC}"; }
ok()   { echo -e "    ${GREEN}[OK] $1${NC}"; }
warn() { echo -e "    ${YELLOW}[警告] $1${NC}"; }
err()  { echo -e "    ${RED}[错误] $1${NC}"; }

echo ""
echo -e "${MAGENTA}========================================================${NC}"
echo -e "${MAGENTA}  dsh-yizi-themes v1.0 — YiziMarkdown 主题包安装器${NC}"
echo -e "${MAGENTA}  19 个风格主题 for DeepSeek Harness${NC}"
echo -e "${MAGENTA}========================================================${NC}"

# ---------- 1. 校验安装包完整性 ----------
step "校验安装包完整性"
[ -f "$MANIFEST_PATH" ] || { err "缺少 MANIFEST.json，安装包可能损坏"; exit 1; }
[ -d "$PATCH_DIR" ] || { err "缺少 patch/ 目录，安装包可能损坏"; exit 1; }
ok "清单与补丁目录存在"

# ---------- 2. 定位 Harness 仓库 ----------
step "定位 DeepSeek Harness 仓库"
if [ -z "$HARNESS_PATH" ]; then
    for cand in "$HOME/deepseek-harness" "$HOME/projects/deepseek-harness" "$HOME/dev/deepseek-harness" "$HOME/code/deepseek-harness" "/opt/deepseek-harness" "$PWD/deepseek-harness"; do
        if [ -f "$cand/package.json" ]; then HARNESS_PATH="$cand"; break; fi
    done
fi
if [ -z "$HARNESS_PATH" ] || [ ! -f "$HARNESS_PATH/package.json" ]; then
    err "未找到 Harness 仓库。请把本安装包放到与 deepseek-harness 仓库同级，或用参数指定："
    echo -e "    ${YELLOW}bash install.sh /路径/deepseek-harness${NC}"
    exit 1
fi
HARNESS_PATH="$(cd "$HARNESS_PATH" && pwd)"
ok "Harness 仓库: $HARNESS_PATH"

# 校验仓库身份
HARNESS_NAME="$(node -e "console.log(require('$HARNESS_PATH/package.json').name || '')" 2>/dev/null || true)"
if [ "$HARNESS_NAME" != "@deepseek-ai/dsh-root" ]; then
    err "该目录不是 DeepSeek Harness 仓库根目录（package.json name 不匹配）"
    exit 1
fi
EXPECTED="$(node -e "console.log(require('$MANIFEST_PATH').target.harnessVersion)")"
ACTUAL="$(node -e "console.log(require('$HARNESS_PATH/package.json').version || '')")"
ok "仓库版本: $ACTUAL (目标: $EXPECTED)"
if [ "$ACTUAL" != "$EXPECTED" ]; then
    warn "版本不完全匹配（$ACTUAL vs $EXPECTED），文件结构可能不同，继续安装有风险。"
    read -r -p "    仍要继续吗？(y/N) " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then echo "已取消"; exit 0; fi
fi

# ---------- 3. 备份将被覆盖的文件 ----------
step "备份将被替换的现有文件"
BACKUP_DIR="$HARNESS_PATH/.dsh-yizi-themes-backup"
mkdir -p "$BACKUP_DIR"
BACKUP_COUNT=0
while IFS= read -r rel; do
    [ -z "$rel" ] && continue
    target="$HARNESS_PATH/$rel"
    if [ -f "$target" ]; then
        backup_target="$BACKUP_DIR/$rel"
        mkdir -p "$(dirname "$backup_target")"
        cp "$target" "$backup_target"
        BACKUP_COUNT=$((BACKUP_COUNT + 1))
    fi
done < <(node -e "for (const f of require('$MANIFEST_PATH').files.replace) console.log(f)")
ok "已备份 $BACKUP_COUNT 个将被覆盖的文件到 .dsh-yizi-themes-backup/"

# ---------- 4. 复制主题文件 ----------
step "复制主题文件到 Harness 仓库"
COPIED_REPLACE=0
while IFS= read -r rel; do
    [ -z "$rel" ] && continue
    from="$PATCH_DIR/$rel"
    to="$HARNESS_PATH/$rel"
    if [ ! -f "$from" ]; then warn "补丁中缺少 $rel，跳过"; continue; fi
    mkdir -p "$(dirname "$to")"
    cp "$from" "$to"
    COPIED_REPLACE=$((COPIED_REPLACE + 1))
done < <(node -e "for (const f of require('$MANIFEST_PATH').files.replace) console.log(f)")
ok "替换 $COPIED_REPLACE 个文件"

COPIED_ADD=0
while IFS= read -r rel; do
    [ -z "$rel" ] && continue
    from="$PATCH_DIR/$rel"
    to="$HARNESS_PATH/$rel"
    if [ ! -f "$from" ]; then warn "补丁中缺少 $rel，跳过"; continue; fi
    mkdir -p "$(dirname "$to")"
    cp "$from" "$to"
    COPIED_ADD=$((COPIED_ADD + 1))
done < <(node -e "for (const f of require('$MANIFEST_PATH').files.add) console.log(f)")
ok "新增 $COPIED_ADD 个主题样式文件"

# ---------- 5. 完成与构建指引 ----------
step "安装完成"
echo ""
echo -e "  ${GREEN}主题文件已就位！现在需要重新构建前端：${NC}"
echo ""
echo -e "  1) 进入仓库目录："
echo -e "     ${YELLOW}cd $HARNESS_PATH${NC}"
echo ""
echo -e "  2) （首次安装才需要）安装依赖："
echo -e "     ${YELLOW}pnpm install${NC}"
echo ""
echo -e "  3) 重新构建（约 1-3 分钟）："
echo -e "     ${YELLOW}pnpm run build${NC}"
echo ""
echo -e "  4) 启动 Web UI："
echo -e "     ${YELLOW}pnpm dsh web${NC}"
echo ""
echo -e "  ${CYAN}打开浏览器访问提示的地址（默认 http://127.0.0.1:3080），${NC}"
echo -e "  ${CYAN}进入 设置 → 外观，即可看到 19 个主题色卡，点击切换！${NC}"
echo ""
echo -e "  ${GRAY:-}卸载/回滚：删除被修改文件后，从 .dsh-yizi-themes-backup/ 恢复即可。${NC}"
echo ""
