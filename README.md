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

### インストール

```bash
# 依存関係のインストール
pnpm install
# または
bun install
```

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
├── scripts/              # SQLマイグレーションスクリプト
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

Supabaseを使用しています。マイグレーションスクリプトは `scripts/` ディレクトリにあります。

## ライセンス

Private
