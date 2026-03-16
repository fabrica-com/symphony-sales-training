-- コンテンツ修正
-- 1. オークション会費 → オークション相場
-- 2. Slack・Teams等 → チャットワーク等 / Slack関連をチャットワークに統一
-- 3. 長文はメールで / 長文はメールか別途MTGで → 長文は別途MTGで

-- ============================================================
-- 1. オークション会費 → オークション相場
-- ============================================================

-- trainings.detail (id=14)
UPDATE public.trainings
SET detail = REPLACE(detail::text, 'オークション会費', 'オークション相場')::jsonb
WHERE detail::text LIKE '%オークション会費%';

-- session_contents (id=54): quick_check, story, simulation, infographic 等
UPDATE public.session_contents
SET quick_check = REPLACE(quick_check::text, 'オークション会費', 'オークション相場')::jsonb
WHERE quick_check IS NOT NULL AND quick_check::text LIKE '%オークション会費%';

UPDATE public.session_contents
SET story = REPLACE(story::text, 'オークション会費', 'オークション相場')::jsonb
WHERE story::text LIKE '%オークション会費%';

UPDATE public.session_contents
SET simulation = REPLACE(simulation::text, 'オークション会費', 'オークション相場')::jsonb
WHERE simulation IS NOT NULL AND simulation::text LIKE '%オークション会費%';

UPDATE public.session_contents
SET infographic = REPLACE(infographic::text, 'オークション会費', 'オークション相場')::jsonb
WHERE infographic IS NOT NULL AND infographic::text LIKE '%オークション会費%';

UPDATE public.session_contents
SET review_quiz = REPLACE(review_quiz::text, 'オークション会費', 'オークション相場')::jsonb
WHERE review_quiz IS NOT NULL AND review_quiz::text LIKE '%オークション会費%';

UPDATE public.session_contents
SET action_options = REPLACE(action_options::text, 'オークション会費', 'オークション相場')::jsonb
WHERE action_options IS NOT NULL AND action_options::text LIKE '%オークション会費%';

-- category_test_questions
UPDATE public.category_test_questions
SET question    = REPLACE(question,    'オークション会費', 'オークション相場'),
    options     = REPLACE(options::text, 'オークション会費', 'オークション相場')::jsonb,
    explanation = REPLACE(explanation, 'オークション会費', 'オークション相場')
WHERE question LIKE '%オークション会費%'
   OR options::text LIKE '%オークション会費%'
   OR explanation LIKE '%オークション会費%';

-- final_exam_questions
UPDATE public.final_exam_questions
SET question    = REPLACE(question,    'オークション会費', 'オークション相場'),
    options     = REPLACE(options::text, 'オークション会費', 'オークション相場')::jsonb,
    explanation = REPLACE(explanation, 'オークション会費', 'オークション相場')
WHERE question LIKE '%オークション会費%'
   OR options::text LIKE '%オークション会費%'
   OR explanation LIKE '%オークション会費%';

-- deep_dive_contents
UPDATE public.deep_dive_contents
SET sections     = REPLACE(sections::text, 'オークション会費', 'オークション相場')::jsonb,
    introduction = REPLACE(introduction,   'オークション会費', 'オークション相場'),
    conclusion   = REPLACE(conclusion,     'オークション会費', 'オークション相場')
WHERE sections::text LIKE '%オークション会費%'
   OR introduction LIKE '%オークション会費%'
   OR conclusion   LIKE '%オークション会費%';

-- ============================================================
-- 2. Slack・Teams → チャットワーク に統一
--    "Slack・Teams等" → "チャットワーク等"
--    "Slack、Zoom、LINE" → "チャットワーク"
--    残る単体の "Slack" → "チャットワーク"
-- ============================================================

-- trainings.title / detail
UPDATE public.trainings
SET title  = REPLACE(REPLACE(title,
    'Slack・Teams等', 'チャットワーク等'),
    'Slack', 'チャットワーク'),
    detail = REPLACE(REPLACE(detail::text,
    'Slack・Teams等', 'チャットワーク等'),
    'Slack', 'チャットワーク')::jsonb
WHERE title LIKE '%Slack%' OR detail::text LIKE '%Slack%';

-- session_contents: story
UPDATE public.session_contents
SET story = REPLACE(REPLACE(story::text,
    'Slack・Teams等', 'チャットワーク等'),
    'Slack', 'チャットワーク')::jsonb
WHERE story::text LIKE '%Slack%';

-- session_contents: action_options
UPDATE public.session_contents
SET action_options = REPLACE(REPLACE(action_options::text,
    'Slack・Teams等', 'チャットワーク等'),
    'Slack', 'チャットワーク')::jsonb
WHERE action_options IS NOT NULL AND action_options::text LIKE '%Slack%';

-- session_contents: infographic
UPDATE public.session_contents
SET infographic = REPLACE(REPLACE(infographic::text,
    'Slack・Teams等', 'チャットワーク等'),
    'Slack', 'チャットワーク')::jsonb
WHERE infographic IS NOT NULL AND infographic::text LIKE '%Slack%';

-- session_contents: quick_check
UPDATE public.session_contents
SET quick_check = REPLACE(REPLACE(quick_check::text,
    'Slack・Teams等', 'チャットワーク等'),
    'Slack', 'チャットワーク')::jsonb
WHERE quick_check IS NOT NULL AND quick_check::text LIKE '%Slack%';

-- session_contents: simulation
UPDATE public.session_contents
SET simulation = REPLACE(REPLACE(simulation::text,
    'Slack・Teams等', 'チャットワーク等'),
    'Slack', 'チャットワーク')::jsonb
WHERE simulation IS NOT NULL AND simulation::text LIKE '%Slack%';

-- session_contents: review_quiz
UPDATE public.session_contents
SET review_quiz = REPLACE(REPLACE(review_quiz::text,
    'Slack・Teams等', 'チャットワーク等'),
    'Slack', 'チャットワーク')::jsonb
WHERE review_quiz IS NOT NULL AND review_quiz::text LIKE '%Slack%';

-- deep_dive_contents (id=22, 56, 88, 91)
UPDATE public.deep_dive_contents
SET sections     = REPLACE(REPLACE(sections::text,
    'Slack・Teams等', 'チャットワーク等'),
    'Slack', 'チャットワーク')::jsonb,
    introduction = REPLACE(REPLACE(introduction,
    'Slack・Teams等', 'チャットワーク等'),
    'Slack', 'チャットワーク'),
    conclusion   = REPLACE(REPLACE(conclusion,
    'Slack・Teams等', 'チャットワーク等'),
    'Slack', 'チャットワーク')
WHERE sections::text LIKE '%Slack%'
   OR introduction LIKE '%Slack%'
   OR conclusion   LIKE '%Slack%';

-- category_test_questions
UPDATE public.category_test_questions
SET question    = REPLACE(REPLACE(question,    'Slack・Teams等','チャットワーク等'), 'Slack','チャットワーク'),
    options     = REPLACE(REPLACE(options::text,'Slack・Teams等','チャットワーク等'), 'Slack','チャットワーク')::jsonb,
    explanation = REPLACE(REPLACE(explanation,  'Slack・Teams等','チャットワーク等'), 'Slack','チャットワーク')
WHERE question LIKE '%Slack%' OR options::text LIKE '%Slack%' OR explanation LIKE '%Slack%';

-- final_exam_questions
UPDATE public.final_exam_questions
SET question    = REPLACE(REPLACE(question,    'Slack・Teams等','チャットワーク等'), 'Slack','チャットワーク'),
    options     = REPLACE(REPLACE(options::text,'Slack・Teams等','チャットワーク等'), 'Slack','チャットワーク')::jsonb,
    explanation = REPLACE(REPLACE(explanation,  'Slack・Teams等','チャットワーク等'), 'Slack','チャットワーク')
WHERE question LIKE '%Slack%' OR options::text LIKE '%Slack%' OR explanation LIKE '%Slack%';

-- ============================================================
-- 3. 長文はメールで / 長文はメールか別途MTGで → 長文は別途MTGで
-- ============================================================

-- deep_dive_contents (id=22)
UPDATE public.deep_dive_contents
SET sections = REPLACE(REPLACE(sections::text,
    '長文はメールか別途MTGで', '長文は別途MTGで'),
    '長文はメールで', '長文は別途MTGで')::jsonb
WHERE sections::text LIKE '%長文はメール%';

-- session_contents (念のため全フィールド)
UPDATE public.session_contents
SET story = REPLACE(REPLACE(story::text,
    '長文はメールか別途MTGで', '長文は別途MTGで'),
    '長文はメールで', '長文は別途MTGで')::jsonb
WHERE story::text LIKE '%長文はメール%';

UPDATE public.session_contents
SET infographic = REPLACE(REPLACE(infographic::text,
    '長文はメールか別途MTGで', '長文は別途MTGで'),
    '長文はメールで', '長文は別途MTGで')::jsonb
WHERE infographic IS NOT NULL AND infographic::text LIKE '%長文はメール%';

UPDATE public.session_contents
SET action_options = REPLACE(REPLACE(action_options::text,
    '長文はメールか別途MTGで', '長文は別途MTGで'),
    '長文はメールで', '長文は別途MTGで')::jsonb
WHERE action_options IS NOT NULL AND action_options::text LIKE '%長文はメール%';

-- category_test_questions
UPDATE public.category_test_questions
SET explanation = REPLACE(REPLACE(explanation, '長文はメールか別途MTGで','長文は別途MTGで'), '長文はメールで','長文は別途MTGで'),
    options     = REPLACE(REPLACE(options::text,'長文はメールか別途MTGで','長文は別途MTGで'), '長文はメールで','長文は別途MTGで')::jsonb
WHERE explanation LIKE '%長文はメール%' OR options::text LIKE '%長文はメール%';

-- final_exam_questions
UPDATE public.final_exam_questions
SET explanation = REPLACE(REPLACE(explanation, '長文はメールか別途MTGで','長文は別途MTGで'), '長文はメールで','長文は別途MTGで'),
    options     = REPLACE(REPLACE(options::text,'長文はメールか別途MTGで','長文は別途MTGで'), '長文はメールで','長文は別途MTGで')::jsonb
WHERE explanation LIKE '%長文はメール%' OR options::text LIKE '%長文はメール%';
