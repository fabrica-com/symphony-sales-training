-- 修了テスト設定テーブル
CREATE TABLE IF NOT EXISTS final_exam_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_questions INTEGER NOT NULL DEFAULT 100,
  passing_score INTEGER NOT NULL DEFAULT 90,
  time_limit INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT final_exam_config_single_row CHECK (id = 1)
);

-- 修了テスト問題テーブル
CREATE TABLE IF NOT EXISTS final_exam_questions (
  id SERIAL PRIMARY KEY,
  question_number INTEGER NOT NULL UNIQUE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  source TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_final_exam_questions_difficulty
  ON final_exam_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_final_exam_questions_number
  ON final_exam_questions(question_number);

-- RLS
ALTER TABLE final_exam_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_exam_questions ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Allow public read access on final_exam_config"
  ON final_exam_config FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access on final_exam_questions"
  ON final_exam_questions FOR SELECT TO public USING (true);

-- Authenticated write
CREATE POLICY "Allow authenticated insert on final_exam_config"
  ON final_exam_config FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on final_exam_config"
  ON final_exam_config FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert on final_exam_questions"
  ON final_exam_questions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on final_exam_questions"
  ON final_exam_questions FOR UPDATE TO authenticated USING (true);

-- Service role
GRANT ALL ON TABLE final_exam_config TO service_role;
GRANT ALL ON TABLE final_exam_questions TO service_role;
GRANT ALL ON TABLE final_exam_config TO anon;
GRANT ALL ON TABLE final_exam_questions TO anon;
GRANT ALL ON TABLE final_exam_config TO authenticated;
GRANT ALL ON TABLE final_exam_questions TO authenticated;
