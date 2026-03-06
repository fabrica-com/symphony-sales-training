-- Service Role用のRLSポリシーを追加
-- Service Role Keyを使用する場合、RLSをバイパスできるようにする

-- training_sessions テーブル
DROP POLICY IF EXISTS "Service role can manage training sessions" ON public.training_sessions;
CREATE POLICY "Service role can manage training sessions" 
ON public.training_sessions 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- user_training_progress テーブル
DROP POLICY IF EXISTS "Service role can manage user progress" ON public.user_training_progress;
CREATE POLICY "Service role can manage user progress" 
ON public.user_training_progress 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- category_test_results テーブル
DROP POLICY IF EXISTS "Service role can manage test results" ON public.category_test_results;
CREATE POLICY "Service role can manage test results" 
ON public.category_test_results 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- final_exam_results テーブル
DROP POLICY IF EXISTS "Service role can manage final exam results" ON public.final_exam_results;
CREATE POLICY "Service role can manage final exam results" 
ON public.final_exam_results 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
