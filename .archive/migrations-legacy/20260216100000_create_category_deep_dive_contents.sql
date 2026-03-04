-- カテゴリ単位の深掘りコンテンツ（C の「中古車流通の構造と現状」など）
CREATE TABLE IF NOT EXISTS category_deep_dive_contents (
  id SERIAL PRIMARY KEY,
  category_id TEXT NOT NULL UNIQUE REFERENCES training_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  body_html TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_category_deep_dive_category_id ON category_deep_dive_contents(category_id);

ALTER TABLE category_deep_dive_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on category_deep_dive_contents"
  ON category_deep_dive_contents FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated insert on category_deep_dive_contents"
  ON category_deep_dive_contents FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on category_deep_dive_contents"
  ON category_deep_dive_contents FOR UPDATE TO authenticated USING (true);

GRANT ALL ON TABLE category_deep_dive_contents TO anon;
GRANT ALL ON TABLE category_deep_dive_contents TO authenticated;
GRANT ALL ON TABLE category_deep_dive_contents TO service_role;
GRANT USAGE, SELECT ON SEQUENCE category_deep_dive_contents_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE category_deep_dive_contents_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE category_deep_dive_contents_id_seq TO service_role;
