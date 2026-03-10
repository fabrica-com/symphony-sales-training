-- Symphony → symphony 残存箇所の修正
-- 対象: training_categories, final_exam_questions, category_deep_dive_contents

-- ============================================================
-- training_categories テーブル
-- ============================================================
UPDATE public.training_categories
SET description = REPLACE(description, 'Symphony', 'symphony')
WHERE description LIKE '%Symphony%';

UPDATE public.training_categories
SET name = REPLACE(name, 'Symphony', 'symphony')
WHERE name LIKE '%Symphony%';

-- ============================================================
-- final_exam_questions テーブル
-- ============================================================
UPDATE public.final_exam_questions
SET question = REPLACE(question, 'Symphony', 'symphony')
WHERE question LIKE '%Symphony%';

UPDATE public.final_exam_questions
SET options = REPLACE(options::text, 'Symphony', 'symphony')::jsonb
WHERE options::text LIKE '%Symphony%';

UPDATE public.final_exam_questions
SET explanation = REPLACE(explanation, 'Symphony', 'symphony')
WHERE explanation LIKE '%Symphony%';

UPDATE public.final_exam_questions
SET source = REPLACE(source, 'Symphony', 'symphony')
WHERE source LIKE '%Symphony%';

-- ============================================================
-- category_deep_dive_contents テーブル
-- ============================================================
UPDATE public.category_deep_dive_contents
SET title = REPLACE(title, 'Symphony', 'symphony')
WHERE title LIKE '%Symphony%';

UPDATE public.category_deep_dive_contents
SET body_html = REPLACE(body_html, 'Symphony', 'symphony')
WHERE body_html LIKE '%Symphony%';

UPDATE public.category_deep_dive_contents
SET subtitle = REPLACE(subtitle, 'Symphony', 'symphony')
WHERE subtitle IS NOT NULL AND subtitle LIKE '%Symphony%';
