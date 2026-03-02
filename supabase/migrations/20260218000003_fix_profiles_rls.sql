-- ============================================================
-- profiles テーブルの RLS ポリシー修正
-- ============================================================
-- 問題: 既存ポリシーが auth.jwt() の 'role' クレームに依存しているが、
--       Supabase の JWT にはアプリの role カラムは含まれない。
--       そのため profiles_select_managers / profiles_delete_admin が
--       期待通りに機能していない。
-- 修正: JWT 参照 → profiles テーブル自身を参照するサブクエリに変更
-- ============================================================

-- マネージャー・管理者が全プロフィールを参照できるポリシー（JWT依存→テーブル参照）
DROP POLICY IF EXISTS "profiles_select_managers" ON public.profiles;

CREATE POLICY "profiles_select_managers"
  ON public.profiles
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS p
      WHERE p.id = auth.uid()
        AND p.role IN ('manager', 'admin')
    )
  );

-- 管理者が全プロフィールを削除できるポリシー（JWT依存→テーブル参照）
DROP POLICY IF EXISTS "profiles_delete_admin" ON public.profiles;

CREATE POLICY "profiles_delete_admin"
  ON public.profiles
  FOR DELETE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  );

-- 管理者がすべてのプロフィールを更新できるポリシーを追加
-- （既存の profiles_update_own は自分のプロフィールのみ対象）
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

CREATE POLICY "profiles_update_admin"
  ON public.profiles
  FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  );
