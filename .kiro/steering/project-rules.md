---
inclusion: auto
---

# プロジェクトルール

## パッケージマネージャー
- **bun のみ使用**。npm, yarn, pnpm は使わない。
- `bun install`, `bun run dev`, `bun run test` 等。

## コーディング規約
- `components/ui/` は shadcn/ui の自動生成コンポーネント。手動編集しない。
- DB コンテンツの `**` マーカーはフロントエンドで太字/見出しとしてパース表示する。
- ページ幅は `max-w-7xl` で統一。
- 会社名は「株式会社ファブリカコミュニケーションズ」。

## データベース
- リモート DB は CEO が管理。リモートへの変更は CEO の指示がある場合のみ。
- カテゴリ B にはテストデータがまだない（remote/local 両方）。
- Supabase Admin Client（service_role）は RLS をバイパスする。サーバーサイドのみで使用。

## テスト
- ユニットテスト: `bun run test`（Vitest）
- E2E テスト: `bun run test:e2e`（Playwright）
- テスト実行前にローカル Supabase が起動していること。

## 認証
- Google OAuth 2.0（Supabase Auth）
- `proxy.ts` で認証ガード（Next.js 16 の proxy 機能）
- `/login`, `/auth/callback` は認証不要

## 注意事項
- v0 で初期生成されたプロジェクト。ハードコードデータの残骸に注意。
- `.archive/` は参照用の旧スクリプト。本番では使わない。
- `.agents/skills/` に Supabase/PostgreSQL ベストプラクティスのスキルがある。
