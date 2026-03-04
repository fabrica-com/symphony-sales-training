-- ============================================================
-- admin ロールの完全廃止
-- ============================================================
-- 目的:
--   1. 既存の admin ユーザーを manager に変更
--   2. profiles.role の CHECK 制約から 'admin' を除去
--   3. admin 専用の RLS ポリシーを削除
--   4. マスターデータの書き込みは service_role のみに制限
-- ============================================================

-- ============================================================
-- 1. 既存 admin ユーザーを manager に変更
-- ============================================================
UPDATE public.profiles SET role = 'manager' WHERE role = 'admin';

-- ============================================================
-- 2. profiles.role の CHECK 制約を更新（admin 除去）
-- ============================================================
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('employee', 'manager'));

-- ============================================================
-- 3. profiles テーブルの admin 専用 RLS ポリシーを削除
-- ============================================================

-- admin 削除ポリシー（20260218000003 で作成）
DROP POLICY IF EXISTS "profiles_delete_admin" ON public.profiles;

-- admin 更新ポリシー（20260218000003 で作成）
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

-- profiles_select_managers を manager のみに更新
DROP POLICY IF EXISTS "profiles_select_managers" ON public.profiles;

CREATE POLICY "profiles_select_managers"
  ON public.profiles
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS p
      WHERE p.id = auth.uid()
        AND p.role = 'manager'
    )
  );

-- ============================================================
-- 4. マスターデータの admin 専用 RLS ポリシーを削除
--    （書き込みは service_role 経由のみとする）
-- ============================================================

-- training_categories
DROP POLICY IF EXISTS "Allow admin insert on training_categories" ON training_categories;
DROP POLICY IF EXISTS "Allow admin update on training_categories" ON training_categories;

-- trainings
DROP POLICY IF EXISTS "Allow admin insert on trainings" ON trainings;
DROP POLICY IF EXISTS "Allow admin update on trainings" ON trainings;

-- deep_dive_contents
DROP POLICY IF EXISTS "Allow admin insert on deep_dive_contents" ON deep_dive_contents;
DROP POLICY IF EXISTS "Allow admin update on deep_dive_contents" ON deep_dive_contents;

-- session_contents
DROP POLICY IF EXISTS "session_contents_insert_policy" ON session_contents;
DROP POLICY IF EXISTS "session_contents_update_policy" ON session_contents;

-- category_deep_dive_contents
DROP POLICY IF EXISTS "Allow admin insert on category_deep_dive_contents" ON category_deep_dive_contents;
DROP POLICY IF EXISTS "Allow admin update on category_deep_dive_contents" ON category_deep_dive_contents;
