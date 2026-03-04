#!/usr/bin/env bash
set -euo pipefail

# ============================================
# symphony 営業研修 - ローカル開発セットアップ
# ============================================
# 使い方: bash scripts/setup.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# --- 前提条件チェック ---
info "前提条件をチェック中..."

command -v bun >/dev/null 2>&1 || error "bun がインストールされていません。https://bun.sh を参照してください。"
command -v docker >/dev/null 2>&1 || error "Docker がインストールされていません。Docker Desktop をインストールしてください。"
command -v supabase >/dev/null 2>&1 || error "Supabase CLI がインストールされていません。\n  brew install supabase/tap/supabase"

# Docker が起動しているか確認
docker info >/dev/null 2>&1 || error "Docker が起動していません。Docker Desktop を起動してください。"

info "前提条件 OK ✓"

# --- 依存パッケージインストール ---
info "依存パッケージをインストール中..."
bun install

# --- 環境変数ファイル ---
if [ ! -f .env.local ]; then
  warn ".env.local が見つかりません。テンプレートからコピーします..."
  cp .env.local.example .env.local
  warn ".env.local を編集して実際の値を設定してください。"
fi

# --- Supabase 起動 ---
info "Supabase をローカルで起動中..."
supabase start

# --- マイグレーション適用 ---
info "データベースマイグレーションを適用中..."
supabase db reset

# --- Playwright ブラウザ（E2Eテスト用） ---
if [ "${SKIP_PLAYWRIGHT:-}" != "1" ]; then
  info "Playwright ブラウザをインストール中..."
  bunx playwright install chromium
fi

info "============================================"
info "セットアップ完了 ✓"
info ""
info "開発サーバーを起動:"
info "  bun run dev"
info ""
info "テスト実行:"
info "  bun run test        # ユニットテスト"
info "  bun run test:e2e    # E2Eテスト"
info "============================================"
