# Symphony 営業研修

Symphony営業研修システムのリポジトリです。

## 概要

営業スタッフ向けの研修・トレーニングプラットフォームです。カテゴリ別の学習コンテンツ、インタラクティブなトレーニングセッション、プロンプト編集機能などを提供します。

## 技術スタック

- **フレームワーク**: Next.js 16
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: Radix UI
- **バックエンド**: Supabase (認証・データベース)
- **パッケージマネージャー**: pnpm / bun

## セットアップ

### 必要な環境

- Node.js 18以上
- pnpm または bun
- Docker Desktop（ローカルSupabase開発用）
- Supabase CLI

### インストール

```bash
# 依存関係のインストール
pnpm install
# または
bun install
```

### Supabase CLIのセットアップ

ローカル開発環境でSupabaseを使用する場合は、Supabase CLIとDockerが必要です。

#### 1. Supabase CLIのインストール

```bash
# macOS / Linux
brew install supabase/tap/supabase

# または npm経由
npm install -g supabase
```

#### 2. Docker Desktopの起動

Supabase CLIはDockerを使用してローカル環境を構築するため、Docker Desktopを起動しておく必要があります。

#### 3. リモートSupabaseプロジェクトとのリンク

```bash
# Supabase CLIでログイン
supabase login

# リモートプロジェクトとリンク（プロジェクトIDが必要）
supabase link --project-ref your-project-ref
```

#### 4. マイグレーションの取得

リモートのマイグレーションをローカルに取得する場合：

```bash
# リモートのマイグレーション履歴を取得
supabase db pull
```

#### 5. Edge Functionsの取得（使用している場合）

```bash
#### 6. ローカルSupabase環境の起動

```bash
# ローカルSupabaseを起動（Dockerコンテナが起動します）
supabase start
```

起動後、以下の情報が表示されます：
- **API URL**: `http://127.0.0.1:54321`
- **Studio URL**: `http://127.0.0.1:54323`（管理画面）
- **Anon Key**: ローカル開発用のキー

#### 7. ローカル環境用の環境変数設定

ローカルのSupabaseを使用する場合、`.env.local`に以下を設定してください：

```env
# ローカルSupabase設定
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase startで表示されるPublishable Key>
SUPABASE_SERVICE_ROLE_KEY=<supabase startで表示されるSecret Key>

# Google OAuth（ローカル開発用）
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=<Google OAuth Client Secret>
```

**注意**: リモートのSupabaseを使用する場合は、リモートのURLとキーを設定してください。

### 環境変数

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 開発サーバーの起動

```bash
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## プロジェクト構造

```
symphony-sales-training/
├── app/                    # Next.js App Router
│   ├── actions/           # Server Actions
│   ├── api/               # API Routes
│   ├── category/         # カテゴリページ
│   ├── training/          # トレーニングページ
│   └── dashboard/         # ダッシュボード
├── components/            # Reactコンポーネント
│   └── ui/               # UIコンポーネント（Radix UI）
├── lib/                   # ユーティリティ・ヘルパー
│   ├── db/               # データベース関連
│   └── supabase/         # Supabaseクライアント
├── supabase/             # Supabase設定
│   └── migrations/       # データベースマイグレーション
└── public/               # 静的ファイル
```

## 主な機能

- **カテゴリ管理**: カテゴリ別の学習コンテンツ管理
- **トレーニングセッション**: インタラクティブな研修セッション
- **プロンプト編集**: カスタムプロンプトの作成・編集
- **ディープダイブ**: 詳細な学習コンテンツ
- **テスト機能**: カテゴリ別のテスト実施

## スクリプト

```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

# リント
pnpm lint
```

## データベース

Supabaseを使用しています。マイグレーションスクリプトは `supabase/migrations/` ディレクトリにあります。

### ローカル開発でのデータベース操作

```bash
# ローカルSupabaseの起動
supabase start

# ローカルSupabaseの停止
supabase stop

# ローカルデータベースのリセット（マイグレーションを再実行）
supabase db reset

# 新しいマイグレーションの作成
supabase migration new migration_name

# リモートにマイグレーションをプッシュ
supabase db push

# リモートのマイグレーションを取得
supabase db pull
```

### Supabase Studio

ローカルSupabase起動後、管理画面にアクセスできます：
- URL: `http://127.0.0.1:54323`
- データベースの確認、テーブルの編集、認証ユーザーの管理などが可能です

## Edge Functions

Supabase Edge Functionsを使用してサーバーレス関数を作成・デプロイできます。

### ローカルでのEdge Functions開発

#### 1. 新しいEdge Functionの作成

```bash
# 新しい関数を作成
supabase functions new <function-name>

# 例: my-functionという名前の関数を作成
supabase functions new my-function
```

これにより、`supabase/functions/<function-name>/index.ts` が作成されます。

#### 2. ローカルでEdge Functionsをテスト

```bash
# ローカルSupabaseを起動
supabase start

# すべてのEdge Functionsをローカルで実行（開発モード）
supabase functions serve

# 特定の関数のみを実行
supabase functions serve <function-name>
```

ローカルで実行すると、`http://127.0.0.1:54321/functions/v1/<function-name>` でアクセスできます。

#### 3. Edge Functionsのデプロイ

**自動デプロイ（推奨）**

mainブランチにマージされると、GitHub Actionsが自動的にすべてのEdge Functionsをデプロイします。

**手動デプロイ**

ローカルでテストした後、手動でデプロイする場合：

```bash
# リモートプロジェクトとリンク（初回のみ）
supabase link --project-ref your-project-ref

# 特定の関数をデプロイ
supabase functions deploy <function-name>

# 例: smooth-functionをデプロイ
supabase functions deploy smooth-function

# すべての関数をデプロイ
supabase functions deploy
```

**GitHub Actionsの設定**

自動デプロイを有効にするには、GitHubリポジトリのSecretsに以下を設定してください：

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」に移動
2. 以下のSecretsを追加：
   - `SUPABASE_ACCESS_TOKEN`: Supabaseのアクセストークン（`supabase login`で取得、または[Supabase Dashboard](https://supabase.com/dashboard/account/tokens)で生成）
   - `SUPABASE_PROJECT_REF`: Supabaseプロジェクトの参照ID（プロジェクト設定から確認可能）

#### 4. Edge Functionsの削除

```bash
# リモートから関数を削除
supabase functions delete <function-name>
```

### Edge Functionsの開発のヒント

- **型定義**: `import "jsr:@supabase/functions-js/edge-runtime.d.ts"` を追加すると、型補完が効きます
- **環境変数**: `supabase/config.toml`の`[edge_runtime.secrets]`セクションで設定できます
- **JWT認証**: デフォルトでJWT認証が有効です。無効にする場合は`--no-verify-jwt`フラグを使用
- **デバッグ**: `supabase/config.toml`の`inspector_port`でChrome DevToolsを使用できます

## ライセンス

Private
