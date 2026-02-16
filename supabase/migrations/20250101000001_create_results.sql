-- 修了テスト結果テーブルの作成
CREATE TABLE IF NOT EXISTS final_exam_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  correct_count INTEGER NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 100,
  duration INTEGER NOT NULL, -- 秒数
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_final_exam_results_user_id ON final_exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_final_exam_results_passed ON final_exam_results(passed);
CREATE INDEX IF NOT EXISTS idx_final_exam_results_completed_at ON final_exam_results(completed_at);

-- RLSポリシーの有効化
ALTER TABLE final_exam_results ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成（認証済みユーザーは自分の結果のみアクセス可能）
CREATE POLICY "Users can view own final exam results"
  ON final_exam_results
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own final exam results"
  ON final_exam_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 匿名ユーザー用のポリシー（結果の保存のみ許可）
CREATE POLICY "Allow anonymous insert for final exam results"
  ON final_exam_results
  FOR INSERT
  WITH CHECK (true);
