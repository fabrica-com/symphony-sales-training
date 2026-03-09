-- manager/admin用ポリシーを削除（roleベースの権限管理を廃止）
DROP POLICY IF EXISTS profiles_select_managers ON public.profiles;
DROP POLICY IF EXISTS "Allow admin update on final_exam_config" ON public.final_exam_config;
DROP POLICY IF EXISTS "Allow admin insert on final_exam_questions" ON public.final_exam_questions;
DROP POLICY IF EXISTS "Allow admin update on final_exam_questions" ON public.final_exam_questions;

-- user_training_progressの重複ポリシーを削除
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_training_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_training_progress;

-- final_exam_resultsの重複INSERTポリシーを削除
DROP POLICY IF EXISTS "Allow authenticated insert for final exam results" ON public.final_exam_results;

-- is_manager()関数を削除
DROP FUNCTION IF EXISTS public.is_manager();

-- profiles.roleカラムを削除（コードで未使用）
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- PostgRESTのスキーマキャッシュをリロード
NOTIFY pgrst, 'reload schema';
