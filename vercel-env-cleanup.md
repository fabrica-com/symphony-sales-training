# Vercel環境変数クリーンアップ手順

## 削除する環境変数（Vercel Postgresを使っていないため不要）

Vercelダッシュボード → Settings → Environment Variables で以下を削除:

### POSTGRES関連（すべて削除）
- [ ] `POSTGRES_URL`
- [ ] `POSTGRES_PRISMA_URL`
- [ ] `POSTGRES_URL_NON_POOLING`
- [ ] `POSTGRES_USER`
- [ ] `POSTGRES_PASSWORD`
- [ ] `POSTGRES_DATABASE`
- [ ] `POSTGRES_HOST`

### Supabase重複変数（削除）
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_PUBLISHABLE_KEY`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [ ] `SUPABASE_JWT_SECRET`
- [ ] `SUPABASE_SECRET_KEY`

## 修正する環境変数

### `NEXT_PUBLIC_SUPABASE_URL`
- 現在: Production のみ
- 修正: **Production, Preview, Development すべてチェック**
- 値: `https://ihkatkbbfjufsvxtikch.supabase.co`

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 現在: Production のみ
- 修正: **Production, Preview, Development すべてチェック**
- 値: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloa2F0a2JiZmp1ZnN2eHRpa2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTcwNTYsImV4cCI6MjA4NDM3MzA1Nn0.nbLyd5YkEjogSPnmPkLAlFxSo-Ije6Eky84ify9eto0`

## 残す環境変数（変更不要）

- ✅ `SUPABASE_SERVICE_ROLE_KEY` (Production, Preview)
- ✅ `CHATWORK_API_TOKEN` (Production)
- ✅ `CHATWORK_ROOM_ID` (Production)
- ✅ `NEXT_PUBLIC_SITE_URL` (All Environments)
- ✅ `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` (All Environments)

## 実行後

すべて完了したら、Vercelで再デプロイしてください:
- Deployments → 最新のデプロイ → Redeploy

または新しいコミットをpushすれば自動的に再デプロイされます。
