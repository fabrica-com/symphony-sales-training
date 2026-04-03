# symphony 営業研修

営業スタッフ向けの研修・トレーニング SaaS。  
カテゴリ別カリキュラム、インタラクティブセッション、テスト、Deep Dive 読み物、学習進捗ダッシュボードを提供。

## 技術スタック

最新の技術スタックで構築された営業研修 SaaS です。

| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js 16（App Router） |
| 言語 | TypeScript 5 |
| React | 19 |
| スタイリング | Tailwind CSS 4 |
| UI | Radix UI / shadcn/ui |
| BaaS | Supabase（認証 + PostgreSQL） |
| 認証 | Google OAuth 2.0（Supabase Auth） |
| パッケージマネージャー | **bun**（npm/yarn/pnpm は使わない） |
| テスト | Vitest（ユニット）/ Playwright（E2E） |
| デプロイ | Vercel |

## クイックスタート

### 前提条件

- [bun](https://bun.sh) v1.3+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)

### ワンコマンドセットアップ

```bash
bash scripts/setup.sh
```

これで以下が自動実行されます:
1. `bun install`（依存パッケージ）
2. `.env.local` テンプレートコピー（なければ）
3. `supabase start`（Docker でローカル DB 起動）
4. `supabase db reset`（マイグレーション適用 + シード）
5. Playwright ブラウザインストール

### 手動セットアップ

```bash
# 1. 依存パッケージ
bun install

# 2. 環境変数
cp .env.local.example .env.local
# .env.local を編集して実際の値を設定

# 3. ローカル Supabase 起動（Docker 必須）
supabase start
supabase db reset

# 4. 開発サーバー
bun run dev
```

http://localhost:3000 で開きます。

## スクリプト一覧

| コマンド | 説明 |
|---------|------|
| `bun run setup` | ワンコマンドセットアップ |
| `bun run dev` | 開発サーバー起動 |
| `bun run build` | 本番ビルド |
| `bun run start` | 本番サーバー起動 |
| `bun run test` | Vitest ユニットテスト |
| `bun run test:e2e` | Playwright E2E テスト |
| `bun run lint` | ESLint |
| `bun run db:start` | Supabase 起動 |
| `bun run db:stop` | Supabase 停止 |
| `bun run db:reset` | DB リセット（マイグレーション再適用） |

## プロジェクト構造

```
app/                  Next.js App Router
  actions/            Server Actions（DB 書き込み）
  api/                API Routes
  auth/               認証コールバック
  category/[id]/      カテゴリ詳細・テスト・Deep Dive
  dashboard/          学習進捗ダッシュボード
  final-exam/         修了テスト
  login/              ログインページ
  training/[id]/      研修セッション・Deep Dive
components/           React コンポーネント
  ui/                 shadcn/ui（自動生成、編集不要）
lib/                  ビジネスロジック
  db/                 DB クエリ・型定義
  supabase/           Supabase クライアント（client/server/admin/proxy）
  auth-context.tsx    認証コンテキスト（クライアント）
  auth-server.ts      認証ヘルパー（サーバー）
  score-calc.ts       採点ロジック
  session-data.ts     セッションデータ取得
  training-data.ts    研修データ取得
  training-results.ts 研修結果処理
e2e/                  Playwright E2E テスト
  fixtures/           認証フィクスチャ
  helpers/            DB 検証ヘルパー
  specs/              テストスペック
__tests__/            Vitest ユニットテスト
supabase/             Supabase 設定
  migrations/         DB マイグレーション（PostgreSQL）
  functions/          Edge Functions
  config.toml         ローカル Supabase 設定
proxy.ts              認証ガード（Next.js 16 proxy 機能）
```

## 認証

- Google OAuth 2.0（Supabase Auth 経由）
- `proxy.ts` で認証ガード（Next.js 16 の proxy 機能）
- 未ログインは `/login` にリダイレクト
- `/login`, `/auth/callback` は認証不要

## データベース

Supabase（PostgreSQL）。マイグレーションは `supabase/migrations/` に格納。

```bash
supabase start          # ローカル DB 起動
supabase db reset       # マイグレーション再適用
supabase db pull        # リモートからスキーマ取得
supabase migration up   # 未適用マイグレーションのみ適用
```

### リモート DB（本番）

リモート Supabase は CEO が管理。リモートへの変更は CEO の指示がある場合のみ。

## AI エージェント向け注意事項

- パッケージマネージャーは **bun のみ**。`npm`, `yarn`, `pnpm` は使わない
- `components/ui/` は shadcn/ui の自動生成。手動編集しない
- DB のコンテンツに `**` マーカーがある場合、フロントエンドで太字/見出しとしてパース表示する
- カテゴリ B にはテストデータがまだない（remote/local 両方）
- `.agents/skills/` に Supabase/PostgreSQL ベストプラクティスのスキルがある
- `.kiro/specs/` に E2E テストの設計書がある
- `.archive/` は参照用の旧シードスクリプト（本番では使わない）

## ライセンス
Private
