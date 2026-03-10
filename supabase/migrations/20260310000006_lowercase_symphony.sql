-- 製品名 "Symphony" を正式表記 "symphony"（全小文字）に統一
-- 対象: trainings, session_contents（テキスト・JSONB全フィールド）, deep_dive_contents

-- ============================================================
-- trainings テーブル
-- ============================================================
UPDATE public.trainings
SET title = REPLACE(title, 'Symphony', 'symphony')
WHERE title LIKE '%Symphony%';

-- ============================================================
-- session_contents テーブル
-- ============================================================

-- title
UPDATE public.session_contents
SET title = REPLACE(title, 'Symphony', 'symphony')
WHERE title LIKE '%Symphony%';

-- quote (JSONB)
UPDATE public.session_contents
SET quote = REPLACE(quote::text, 'Symphony', 'symphony')::jsonb
WHERE quote::text LIKE '%Symphony%';

-- story (JSONB)
UPDATE public.session_contents
SET story = REPLACE(story::text, 'Symphony', 'symphony')::jsonb
WHERE story::text LIKE '%Symphony%';

-- infographic (JSONB)
UPDATE public.session_contents
SET infographic = REPLACE(infographic::text, 'Symphony', 'symphony')::jsonb
WHERE infographic::text LIKE '%Symphony%';

-- quick_check (JSONB)
UPDATE public.session_contents
SET quick_check = REPLACE(quick_check::text, 'Symphony', 'symphony')::jsonb
WHERE quick_check::text LIKE '%Symphony%';

-- review_quiz (JSONB)
UPDATE public.session_contents
SET review_quiz = REPLACE(review_quiz::text, 'Symphony', 'symphony')::jsonb
WHERE review_quiz::text LIKE '%Symphony%';

-- simulation (JSONB)
UPDATE public.session_contents
SET simulation = REPLACE(simulation::text, 'Symphony', 'symphony')::jsonb
WHERE simulation::text LIKE '%Symphony%';

-- action_options (JSONB)
UPDATE public.session_contents
SET action_options = REPLACE(action_options::text, 'Symphony', 'symphony')::jsonb
WHERE action_options::text LIKE '%Symphony%';

-- reflection (JSONB)
UPDATE public.session_contents
SET reflection = REPLACE(reflection::text, 'Symphony', 'symphony')::jsonb
WHERE reflection::text LIKE '%Symphony%';

-- roleplay (JSONB)
UPDATE public.session_contents
SET roleplay = REPLACE(roleplay::text, 'Symphony', 'symphony')::jsonb
WHERE roleplay IS NOT NULL AND roleplay::text LIKE '%Symphony%';

-- work (JSONB)
UPDATE public.session_contents
SET work = REPLACE(work::text, 'Symphony', 'symphony')::jsonb
WHERE work::text LIKE '%Symphony%';

-- deep_dive (JSONB)
UPDATE public.session_contents
SET deep_dive = REPLACE(deep_dive::text, 'Symphony', 'symphony')::jsonb
WHERE deep_dive::text LIKE '%Symphony%';

-- badge (JSONB)
UPDATE public.session_contents
SET badge = REPLACE(badge::text, 'Symphony', 'symphony')::jsonb
WHERE badge::text LIKE '%Symphony%';

-- ============================================================
-- deep_dive_contents テーブル
-- ============================================================
UPDATE public.deep_dive_contents
SET conclusion = REPLACE(conclusion, 'Symphony', 'symphony')
WHERE conclusion LIKE '%Symphony%';

UPDATE public.deep_dive_contents
SET introduction = REPLACE(introduction, 'Symphony', 'symphony')
WHERE introduction LIKE '%Symphony%';
