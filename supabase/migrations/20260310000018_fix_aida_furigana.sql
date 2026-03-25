-- 「AIDAモデルの誕生」→「AIDA（アイダ）モデルの誕生」にふりがな追加
-- deep_dive_contents.sections (id=28) のみ対象

UPDATE public.deep_dive_contents
SET sections = REPLACE(sections::text, 'AIDAモデルの誕生', 'AIDA（アイダ）モデルの誕生')::jsonb
WHERE sections::text LIKE '%AIDAモデルの誕生%';

-- 念のため他テーブルも確認・更新
UPDATE public.trainings
SET detail = REPLACE(detail::text, 'AIDAモデルの誕生', 'AIDA（アイダ）モデルの誕生')::jsonb
WHERE detail::text LIKE '%AIDAモデルの誕生%';

UPDATE public.session_contents
SET story = REPLACE(story::text, 'AIDAモデルの誕生', 'AIDA（アイダ）モデルの誕生')::jsonb
WHERE story::text LIKE '%AIDAモデルの誕生%';

UPDATE public.category_test_questions
SET question    = REPLACE(question,    'AIDAモデルの誕生', 'AIDA（アイダ）モデルの誕生'),
    explanation = REPLACE(explanation, 'AIDAモデルの誕生', 'AIDA（アイダ）モデルの誕生')
WHERE question LIKE '%AIDAモデルの誕生%' OR explanation LIKE '%AIDAモデルの誕生%';
