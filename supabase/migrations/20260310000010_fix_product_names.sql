-- 製品名の修正
-- 1. シンフォニーワンプラ → symphony ワンプラ®︎
-- 2. データ分析・可視化システム → symphony insight

-- ============================================================
-- trainings テーブル
-- ============================================================

-- title
UPDATE public.trainings
SET title = REPLACE(title, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')
WHERE title LIKE '%シンフォニーワンプラ%';

-- detail (JSONB)
UPDATE public.trainings
SET detail = REPLACE(
  REPLACE(detail::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎'),
  'データ分析・可視化システム', 'symphony insight'
)::jsonb
WHERE detail::text LIKE '%シンフォニーワンプラ%'
   OR detail::text LIKE '%データ分析・可視化システム%';

-- ============================================================
-- session_contents テーブル
-- ============================================================

-- title
UPDATE public.session_contents
SET title = REPLACE(title, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')
WHERE title LIKE '%シンフォニーワンプラ%';

-- story (JSONB)
UPDATE public.session_contents
SET story = REPLACE(story::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb
WHERE story::text LIKE '%シンフォニーワンプラ%';

-- simulation (JSONB)
UPDATE public.session_contents
SET simulation = REPLACE(simulation::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb
WHERE simulation IS NOT NULL AND simulation::text LIKE '%シンフォニーワンプラ%';

-- infographic (JSONB)
UPDATE public.session_contents
SET infographic = REPLACE(infographic::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb
WHERE infographic IS NOT NULL AND infographic::text LIKE '%シンフォニーワンプラ%';

-- review_quiz (JSONB)
UPDATE public.session_contents
SET review_quiz = REPLACE(review_quiz::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb
WHERE review_quiz IS NOT NULL AND review_quiz::text LIKE '%シンフォニーワンプラ%';

-- quick_check (JSONB)
UPDATE public.session_contents
SET quick_check = REPLACE(quick_check::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb
WHERE quick_check IS NOT NULL AND quick_check::text LIKE '%シンフォニーワンプラ%';

-- action_options (JSONB)
UPDATE public.session_contents
SET action_options = REPLACE(action_options::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb
WHERE action_options IS NOT NULL AND action_options::text LIKE '%シンフォニーワンプラ%';

-- reflection (JSONB)
UPDATE public.session_contents
SET reflection = REPLACE(reflection::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb
WHERE reflection IS NOT NULL AND reflection::text LIKE '%シンフォニーワンプラ%';

-- quote (JSONB)
UPDATE public.session_contents
SET quote = REPLACE(quote::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb
WHERE quote IS NOT NULL AND quote::text LIKE '%シンフォニーワンプラ%';

-- deep_dive (JSONB)
UPDATE public.session_contents
SET deep_dive = REPLACE(deep_dive::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb
WHERE deep_dive IS NOT NULL AND deep_dive::text LIKE '%シンフォニーワンプラ%';

-- work (JSONB)
UPDATE public.session_contents
SET work = REPLACE(work::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb
WHERE work IS NOT NULL AND work::text LIKE '%シンフォニーワンプラ%';

-- ============================================================
-- final_exam_questions テーブル
-- ============================================================
UPDATE public.final_exam_questions
SET question    = REPLACE(question,    'シンフォニーワンプラ', 'symphony ワンプラ®︎'),
    options     = REPLACE(options::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb,
    explanation = REPLACE(explanation, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')
WHERE question LIKE '%シンフォニーワンプラ%'
   OR options::text LIKE '%シンフォニーワンプラ%'
   OR explanation LIKE '%シンフォニーワンプラ%';

-- ============================================================
-- category_test_questions テーブル（念のため）
-- ============================================================
UPDATE public.category_test_questions
SET question    = REPLACE(question,    'シンフォニーワンプラ', 'symphony ワンプラ®︎'),
    options     = REPLACE(options::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb,
    explanation = REPLACE(explanation, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')
WHERE question LIKE '%シンフォニーワンプラ%'
   OR options::text LIKE '%シンフォニーワンプラ%'
   OR explanation LIKE '%シンフォニーワンプラ%';

-- ============================================================
-- deep_dive_contents テーブル（念のため）
-- ============================================================
UPDATE public.deep_dive_contents
SET introduction = REPLACE(introduction, 'シンフォニーワンプラ', 'symphony ワンプラ®︎'),
    conclusion   = REPLACE(conclusion,   'シンフォニーワンプラ', 'symphony ワンプラ®︎'),
    sections     = REPLACE(sections::text, 'シンフォニーワンプラ', 'symphony ワンプラ®︎')::jsonb
WHERE introduction LIKE '%シンフォニーワンプラ%'
   OR conclusion   LIKE '%シンフォニーワンプラ%'
   OR sections::text LIKE '%シンフォニーワンプラ%';
