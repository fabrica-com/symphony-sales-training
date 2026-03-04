-- session_contents テーブルの作成
-- セッションのコンテンツデータをSupabaseに保存

CREATE TABLE IF NOT EXISTS session_contents (
  id SERIAL PRIMARY KEY,
  training_id INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  key_phrase TEXT NOT NULL,
  badge JSONB NOT NULL,
  mood_options JSONB NOT NULL,
  review_quiz JSONB,
  story JSONB NOT NULL,
  infographic JSONB,
  quick_check JSONB,
  quote JSONB,
  simulation JSONB,
  reflection JSONB,
  action_options JSONB,
  work JSONB,
  deep_dive JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_session_contents_training_id ON session_contents(training_id);

-- RLSポリシーの設定
ALTER TABLE session_contents ENABLE ROW LEVEL SECURITY;

-- 一度削除する命令を追加（これで二重定義エラーを防ぐ）
DROP POLICY IF EXISTS "session_contents_read_policy" ON session_contents;
CREATE POLICY "session_contents_read_policy" ON session_contents
  FOR SELECT USING (true);

-- こっちも念のため、削除命令を入れておくと安全です
DROP POLICY IF EXISTS "session_contents_insert_policy" ON session_contents;
CREATE POLICY "session_contents_insert_policy" ON session_contents
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "session_contents_update_policy" ON session_contents;
CREATE POLICY "session_contents_update_policy" ON session_contents
  FOR UPDATE USING (true);

COMMENT ON TABLE session_contents IS 'インタラクティブセッションのコンテンツデータ';
COMMENT ON COLUMN session_contents.training_id IS '研修ID（trainings.idと対応）';
COMMENT ON COLUMN session_contents.title IS 'セッションのタイトル';
COMMENT ON COLUMN session_contents.key_phrase IS 'キーフレーズ';
COMMENT ON COLUMN session_contents.badge IS 'バッジ情報（name, icon）';
COMMENT ON COLUMN session_contents.mood_options IS '気分選択オプション';
COMMENT ON COLUMN session_contents.review_quiz IS '復習クイズ';
COMMENT ON COLUMN session_contents.story IS 'ストーリーコンテンツ（part1, part2）';
COMMENT ON COLUMN session_contents.infographic IS 'インフォグラフィック情報';
COMMENT ON COLUMN session_contents.quick_check IS 'クイックチェック問題';
COMMENT ON COLUMN session_contents.quote IS '名言';
COMMENT ON COLUMN session_contents.simulation IS 'シミュレーション問題';
COMMENT ON COLUMN session_contents.reflection IS '振り返り設問';
COMMENT ON COLUMN session_contents.action_options IS 'アクションオプション';
COMMENT ON COLUMN session_contents.work IS 'ワーク課題';
COMMENT ON COLUMN session_contents.deep_dive IS '深掘りコンテンツ';
