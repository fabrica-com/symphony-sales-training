-- Test: staging ブランチへの push で Supabase が自動 Migration を適用するか確認するテスト
-- このファイルは動作確認後に削除します

COMMENT ON TABLE public.profiles IS 'ユーザープロファイル（auth.users の拡張）';
