-- Create tables for training data and deep dive content
-- This will allow us to reduce TypeScript file sizes

-- Training categories table
CREATE TABLE IF NOT EXISTS training_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  total_duration INTEGER NOT NULL,
  target_level TEXT NOT NULL,
  color TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trainings table
CREATE TABLE IF NOT EXISTS trainings (
  id INTEGER PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES training_categories(id),
  title TEXT NOT NULL,
  subtitle TEXT,
  duration INTEGER NOT NULL,
  level TEXT NOT NULL,
  detail JSONB,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deep dive content table
CREATE TABLE IF NOT EXISTS deep_dive_contents (
  id SERIAL PRIMARY KEY,
  training_id INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  introduction TEXT NOT NULL,
  sections JSONB NOT NULL,
  conclusion TEXT NOT NULL,
  reference_list JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_trainings_category ON trainings(category_id);
CREATE INDEX IF NOT EXISTS idx_deep_dive_training ON deep_dive_contents(training_id);

-- Enable RLS
ALTER TABLE training_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE deep_dive_contents ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on training_categories"
  ON training_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on trainings"
  ON trainings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on deep_dive_contents"
  ON deep_dive_contents FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert/update
CREATE POLICY "Allow authenticated insert on training_categories"
  ON training_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on training_categories"
  ON training_categories FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on trainings"
  ON trainings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on trainings"
  ON trainings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on deep_dive_contents"
  ON deep_dive_contents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on deep_dive_contents"
  ON deep_dive_contents FOR UPDATE
  TO authenticated
  USING (true);

-- Category tests table
CREATE TABLE IF NOT EXISTS category_tests (
  id SERIAL PRIMARY KEY,
  category_id TEXT NOT NULL UNIQUE REFERENCES training_categories(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  passing_score INTEGER NOT NULL,
  time_limit INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Category test questions table
CREATE TABLE IF NOT EXISTS category_test_questions (
  id SERIAL PRIMARY KEY,
  category_test_id INTEGER NOT NULL REFERENCES category_tests(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_category_test_questions_test ON category_test_questions(category_test_id);

-- Enable RLS
ALTER TABLE category_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_test_questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on category_tests"
  ON category_tests FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on category_test_questions"
  ON category_test_questions FOR SELECT
  TO public
  USING (true);
