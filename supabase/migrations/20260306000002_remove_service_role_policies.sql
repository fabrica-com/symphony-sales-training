-- Service Role用のRLSポリシーを削除
-- ユーザーセッションを使用するため、authenticatedロールのポリシーのみで十分

-- training_sessions テーブル
DROP POLICY IF EXISTS "Service role can manage training sessions" ON public.training_sessions;

-- user_training_progress テーブル
DROP POLICY IF EXISTS "Service role can manage user progress" ON public.user_training_progress;

-- category_test_results テーブル
DROP POLICY IF EXISTS "Service role can manage test results" ON public.category_test_results;

-- final_exam_results テーブル
DROP POLICY IF EXISTS "Service role can manage final exam results" ON public.final_exam_results;
