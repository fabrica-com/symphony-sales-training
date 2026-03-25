-- 「チャットワーク」→「Chatwork」に統一

-- trainings
UPDATE public.trainings
SET title  = REPLACE(title,        'チャットワーク', 'Chatwork'),
    detail = REPLACE(detail::text, 'チャットワーク', 'Chatwork')::jsonb
WHERE title LIKE '%チャットワーク%' OR detail::text LIKE '%チャットワーク%';

-- session_contents（全 jsonb 列 + text 列）
UPDATE public.session_contents
SET story          = REPLACE(story::text,          'チャットワーク', 'Chatwork')::jsonb,
    infographic    = REPLACE(infographic::text,    'チャットワーク', 'Chatwork')::jsonb,
    action_options = REPLACE(action_options::text, 'チャットワーク', 'Chatwork')::jsonb,
    quick_check    = REPLACE(quick_check::text,    'チャットワーク', 'Chatwork')::jsonb,
    simulation     = REPLACE(simulation::text,     'チャットワーク', 'Chatwork')::jsonb,
    review_quiz    = REPLACE(review_quiz::text,    'チャットワーク', 'Chatwork')::jsonb,
    title          = REPLACE(title,                'チャットワーク', 'Chatwork'),
    key_phrase     = REPLACE(key_phrase,           'チャットワーク', 'Chatwork')
WHERE story::text          LIKE '%チャットワーク%'
   OR infographic::text    LIKE '%チャットワーク%'
   OR action_options::text LIKE '%チャットワーク%'
   OR quick_check::text    LIKE '%チャットワーク%'
   OR simulation::text     LIKE '%チャットワーク%'
   OR review_quiz::text    LIKE '%チャットワーク%'
   OR title                LIKE '%チャットワーク%'
   OR key_phrase           LIKE '%チャットワーク%';

-- deep_dive_contents
UPDATE public.deep_dive_contents
SET sections     = REPLACE(sections::text, 'チャットワーク', 'Chatwork')::jsonb,
    introduction = REPLACE(introduction,   'チャットワーク', 'Chatwork'),
    conclusion   = REPLACE(conclusion,     'チャットワーク', 'Chatwork')
WHERE sections::text LIKE '%チャットワーク%'
   OR introduction   LIKE '%チャットワーク%'
   OR conclusion     LIKE '%チャットワーク%';

-- category_test_questions
UPDATE public.category_test_questions
SET question    = REPLACE(question,      'チャットワーク', 'Chatwork'),
    options     = REPLACE(options::text, 'チャットワーク', 'Chatwork')::jsonb,
    explanation = REPLACE(explanation,   'チャットワーク', 'Chatwork')
WHERE question      LIKE '%チャットワーク%'
   OR options::text LIKE '%チャットワーク%'
   OR explanation   LIKE '%チャットワーク%';

-- final_exam_questions
UPDATE public.final_exam_questions
SET question    = REPLACE(question,      'チャットワーク', 'Chatwork'),
    options     = REPLACE(options::text, 'チャットワーク', 'Chatwork')::jsonb,
    explanation = REPLACE(explanation,   'チャットワーク', 'Chatwork')
WHERE question      LIKE '%チャットワーク%'
   OR options::text LIKE '%チャットワーク%'
   OR explanation   LIKE '%チャットワーク%';

-- training_categories
UPDATE public.training_categories
SET description = REPLACE(description, 'チャットワーク', 'Chatwork')
WHERE description LIKE '%チャットワーク%';

-- category_deep_dive_contents
UPDATE public.category_deep_dive_contents
SET title     = REPLACE(title,     'チャットワーク', 'Chatwork'),
    body_html = REPLACE(body_html, 'チャットワーク', 'Chatwork')
WHERE title     LIKE '%チャットワーク%'
   OR body_html LIKE '%チャットワーク%';
