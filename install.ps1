# ============================================================================
#  dsh-yizi-themes installer (Windows / PowerShell)
#  YiziMarkdown theme pack for DeepSeek Harness - installs 19 style themes
#
#  Usage:
#     powershell -ExecutionPolicy Bypass -File install.ps1 [HarnessRepoPath]
#
#  With no argument the script probes common locations for the Harness repo;
#  if not found it asks you to pass the path explicitly.
# ============================================================================

[CmdletBinding()]
param(
    [string]$HarnessPath = ""
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PatchDir = Join-Path $ScriptDir "patch"
$ManifestPath = Join-Path $ScriptDir "MANIFEST.json"

function Write-Step([string]$msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Ok([string]$msg) { Write-Host "    [OK] $msg" -ForegroundColor Green }
function Write-Warn([string]$msg) { Write-Host "    [WARN] $msg" -ForegroundColor Yellow }
function Write-Err([string]$msg) { Write-Host "    [ERROR] $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "========================================================" -ForegroundColor Magenta
Write-Host "  dsh-yizi-themes v1.0 - YiziMarkdown theme pack installer" -ForegroundColor Magenta
Write-Host "  19 style themes for DeepSeek Harness" -ForegroundColor Magenta
Write-Host "========================================================" -ForegroundColor Magenta

# ---------- 1. Validate package integrity ----------
Write-Step "Validating installer package"
if (-not (Test-Path $ManifestPath)) { Write-Err "MANIFEST.json is missing - package may be corrupt"; exit 1 }
$manifest = Get-Content $ManifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
if (-not (Test-Path $PatchDir)) { Write-Err "patch/ directory is missing - package may be corrupt"; exit 1 }
Write-Ok "Manifest and patch directory present"

# ---------- 2. Locate Harness repo ----------
Write-Step "Locating DeepSeek Harness repo"
if ($HarnessPath -eq "") {
    $candidates = @(
        "$env:USERPROFILE\deepseek-harness",
        "$env:USERPROFILE\projects\deepseek-harness",
        "$env:USERPROFILE\dev\deepseek-harness",
        "$env:USERPROFILE\code\deepseek-harness",
        "C:\Users\Administrator\deepseek-harness",
        "D:\deepseek-harness",
        "E:\deepseek-harness"
    )
    foreach ($cand in $candidates) {
        if (Test-Path (Join-Path $cand "package.json")) { $HarnessPath = $cand; break }
    }
}
if ($HarnessPath -eq "" -or -not (Test-Path (Join-Path $HarnessPath "package.json"))) {
    Write-Err "Harness repo not found. Place this pack next to the deepseek-harness repo, or pass the path:"
    Write-Host "    powershell -ExecutionPolicy Bypass -File install.ps1 D:\path\to\deepseek-harness" -ForegroundColor Yellow
    exit 1
}
$HarnessPath = (Resolve-Path $HarnessPath).Path
Write-Ok "Harness repo: $HarnessPath"

# Verify repo identity
$harnessPkg = Get-Content (Join-Path $HarnessPath "package.json") -Raw | ConvertFrom-Json
if ($harnessPkg.name -ne "@deepseek-ai/dsh-root") {
    Write-Err "This directory is not a DeepSeek Harness repo root (package.json name mismatch)"
    exit 1
}
$expected = $manifest.target.harnessVersion
$actual = $harnessPkg.version
Write-Ok "Repo version: $actual (target: $expected)"
if ($actual -ne $expected) {
    Write-Warn "Version mismatch ($actual vs $expected) - file layout may differ, installing carries some risk."
    $confirm = Read-Host "    Continue anyway? (y/N)"
    if ($confirm -notin @("y", "Y", "yes", "YES")) { Write-Host "Cancelled"; exit 0 }
}

# ---------- 3. Backup files that will be replaced ----------
Write-Step "Backing up files that will be replaced"
$backupDir = Join-Path $HarnessPath ".dsh-yizi-themes-backup"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
$backupCount = 0
foreach ($rel in $manifest.files.replace) {
    $target = Join-Path $HarnessPath ($rel -replace "/", "\")
    if (Test-Path $target) {
        $backupTarget = Join-Path $backupDir ($rel -replace "/", "\")
        New-Item -ItemType Directory -Path (Split-Path $backupTarget) -Force | Out-Null
        Copy-Item $target $backupTarget -Force
        $backupCount++
    }
}
Write-Ok "Backed up $backupCount files to .dsh-yizi-themes-backup/"

# ---------- 4. Copy theme files ----------
Write-Step "Copying theme files into the Harness repo"
$copiedReplace = 0
foreach ($rel in $manifest.files.replace) {
    $from = Join-Path $PatchDir ($rel -replace "/", "\")
    $to = Join-Path $HarnessPath ($rel -replace "/", "\")
    if (-not (Test-Path $from)) { Write-Warn "Missing in patch: $rel - skipping"; continue }
    New-Item -ItemType Directory -Path (Split-Path $to) -Force | Out-Null
    Copy-Item $from $to -Force
    $copiedReplace++
}
Write-Ok "Replaced $copiedReplace files"

$copiedAdd = 0
foreach ($rel in $manifest.files.add) {
    $from = Join-Path $PatchDir ($rel -replace "/", "\")
    $to = Join-Path $HarnessPath ($rel -replace "/", "\")
    if (-not (Test-Path $from)) { Write-Warn "Missing in patch: $rel - skipping"; continue }
    New-Item -ItemType Directory -Path (Split-Path $to) -Force | Out-Null
    Copy-Item $from $to -Force
    $copiedAdd++
}
Write-Ok "Added $copiedAdd theme stylesheet files"

# ---------- 5. Done - build instructions ----------
Write-Step "Install complete"
Write-Host ""
Write-Host "  Theme files are in place! Now rebuild the frontend:" -ForegroundColor Green
Write-Host ""
Write-Host "  1) Enter the repo:" -ForegroundColor Yellow
Write-Host "     cd $HarnessPath" -ForegroundColor White
Write-Host ""
Write-Host "  2) (First install only) Install dependencies:" -ForegroundColor Yellow
Write-Host "     pnpm install" -ForegroundColor White
Write-Host ""
Write-Host "  3) Rebuild (about 1-3 minutes):" -ForegroundColor Yellow
Write-Host "     pnpm run build" -ForegroundColor White
Write-Host ""
Write-Host "  4) Start the Web UI:" -ForegroundColor Yellow
Write-Host "     pnpm dsh web" -ForegroundColor White
Write-Host ""
Write-Host "  Open the printed URL (default http://127.0.0.1:3080), then go to" -ForegroundColor Cyan
Write-Host "  Settings -> Appearance to pick from the 19 theme cards." -ForegroundColor Cyan
Write-Host ""
Write-Host "  Rollback: restore files from .dsh-yizi-themes-backup/ (see README.md)." -ForegroundColor DarkGray
Write-Host ""
