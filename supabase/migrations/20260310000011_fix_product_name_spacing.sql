-- 製品名の表記修正
-- 1. （AS-NET）を削除
-- 2. symphony insight → symphony インサイト
-- 3. symphony販売管理 → symphony 販売管理（スペース追加）
-- 4. symphony整備請求 → symphony 整備請求（スペース追加）

-- 適用するテーブル: trainings, session_contents, deep_dive_contents,
--                  final_exam_questions, category_test_questions

-- ============================================================
-- 置換ヘルパー: 一度のテキスト変換で4種類を全て処理
-- ============================================================

-- trainings.title
UPDATE public.trainings SET title =
  REPLACE(REPLACE(REPLACE(REPLACE(title,
    '（AS-NET）',    ''),
    'symphony insight', 'symphony インサイト'),
    'symphony販売管理', 'symphony 販売管理'),
    'symphony整備請求', 'symphony 整備請求')
WHERE title LIKE '%AS-NET%'
   OR title LIKE '%symphony insight%'
   OR title LIKE '%symphony販売管理%'
   OR title LIKE '%symphony整備請求%';

-- trainings.detail (JSONB)
UPDATE public.trainings SET detail =
  REPLACE(REPLACE(REPLACE(REPLACE(detail::text,
    '（AS-NET）',    ''),
    'symphony insight', 'symphony インサイト'),
    'symphony販売管理', 'symphony 販売管理'),
    'symphony整備請求', 'symphony 整備請求')::jsonb
WHERE detail::text LIKE '%AS-NET%'
   OR detail::text LIKE '%symphony insight%'
   OR detail::text LIKE '%symphony販売管理%'
   OR detail::text LIKE '%symphony整備請求%';

-- session_contents.title
UPDATE public.session_contents SET title =
  REPLACE(REPLACE(REPLACE(REPLACE(title,
    '（AS-NET）',    ''),
    'symphony insight', 'symphony インサイト'),
    'symphony販売管理', 'symphony 販売管理'),
    'symphony整備請求', 'symphony 整備請求')
WHERE title LIKE '%AS-NET%'
   OR title LIKE '%symphony insight%'
   OR title LIKE '%symphony販売管理%'
   OR title LIKE '%symphony整備請求%';

-- session_contents の全 JSONB カラム（個別 UPDATE）
UPDATE public.session_contents SET story = REPLACE(REPLACE(REPLACE(REPLACE(story::text,'（AS-NET）',''),'symphony insight','symphony インサイト'),'symphony販売管理','symphony 販売管理'),'symphony整備請求','symphony 整備請求')::jsonb WHERE story IS NOT NULL AND (story::text LIKE '%AS-NET%' OR story::text LIKE '%symphony insight%' OR story::text LIKE '%symphony販売管理%' OR story::text LIKE '%symphony整備請求%');
UPDATE public.session_contents SET simulation = REPLACE(REPLACE(REPLACE(REPLACE(simulation::text,'（AS-NET）',''),'symphony insight','symphony インサイト'),'symphony販売管理','symphony 販売管理'),'symphony整備請求','symphony 整備請求')::jsonb WHERE simulation IS NOT NULL AND (simulation::text LIKE '%AS-NET%' OR simulation::text LIKE '%symphony insight%' OR simulation::text LIKE '%symphony販売管理%' OR simulation::text LIKE '%symphony整備請求%');
UPDATE public.session_contents SET infographic = REPLACE(REPLACE(REPLACE(REPLACE(infographic::text,'（AS-NET）',''),'symphony insight','symphony インサイト'),'symphony販売管理','symphony 販売管理'),'symphony整備請求','symphony 整備請求')::jsonb WHERE infographic IS NOT NULL AND (infographic::text LIKE '%AS-NET%' OR infographic::text LIKE '%symphony insight%' OR infographic::text LIKE '%symphony販売管理%' OR infographic::text LIKE '%symphony整備請求%');
UPDATE public.session_contents SET review_quiz = REPLACE(REPLACE(REPLACE(REPLACE(review_quiz::text,'（AS-NET）',''),'symphony insight','symphony インサイト'),'symphony販売管理','symphony 販売管理'),'symphony整備請求','symphony 整備請求')::jsonb WHERE review_quiz IS NOT NULL AND (review_quiz::text LIKE '%AS-NET%' OR review_quiz::text LIKE '%symphony insight%' OR review_quiz::text LIKE '%symphony販売管理%' OR review_quiz::text LIKE '%symphony整備請求%');
UPDATE public.session_contents SET quick_check = REPLACE(REPLACE(REPLACE(REPLACE(quick_check::text,'（AS-NET）',''),'symphony insight','symphony インサイト'),'symphony販売管理','symphony 販売管理'),'symphony整備請求','symphony 整備請求')::jsonb WHERE quick_check IS NOT NULL AND (quick_check::text LIKE '%AS-NET%' OR quick_check::text LIKE '%symphony insight%' OR quick_check::text LIKE '%symphony販売管理%' OR quick_check::text LIKE '%symphony整備請求%');
UPDATE public.session_contents SET action_options = REPLACE(REPLACE(REPLACE(REPLACE(action_options::text,'（AS-NET）',''),'symphony insight','symphony インサイト'),'symphony販売管理','symphony 販売管理'),'symphony整備請求','symphony 整備請求')::jsonb WHERE action_options IS NOT NULL AND (action_options::text LIKE '%AS-NET%' OR action_options::text LIKE '%symphony insight%' OR action_options::text LIKE '%symphony販売管理%' OR action_options::text LIKE '%symphony整備請求%');
UPDATE public.session_contents SET reflection = REPLACE(REPLACE(REPLACE(REPLACE(reflection::text,'（AS-NET）',''),'symphony insight','symphony インサイト'),'symphony販売管理','symphony 販売管理'),'symphony整備請求','symphony 整備請求')::jsonb WHERE reflection IS NOT NULL AND (reflection::text LIKE '%AS-NET%' OR reflection::text LIKE '%symphony insight%' OR reflection::text LIKE '%symphony販売管理%' OR reflection::text LIKE '%symphony整備請求%');
UPDATE public.session_contents SET work = REPLACE(REPLACE(REPLACE(REPLACE(work::text,'（AS-NET）',''),'symphony insight','symphony インサイト'),'symphony販売管理','symphony 販売管理'),'symphony整備請求','symphony 整備請求')::jsonb WHERE work IS NOT NULL AND (work::text LIKE '%AS-NET%' OR work::text LIKE '%symphony insight%' OR work::text LIKE '%symphony販売管理%' OR work::text LIKE '%symphony整備請求%');
UPDATE public.session_contents SET deep_dive = REPLACE(REPLACE(REPLACE(REPLACE(deep_dive::text,'（AS-NET）',''),'symphony insight','symphony インサイト'),'symphony販売管理','symphony 販売管理'),'symphony整備請求','symphony 整備請求')::jsonb WHERE deep_dive IS NOT NULL AND (deep_dive::text LIKE '%AS-NET%' OR deep_dive::text LIKE '%symphony insight%' OR deep_dive::text LIKE '%symphony販売管理%' OR deep_dive::text LIKE '%symphony整備請求%');
UPDATE public.session_contents SET quote = REPLACE(REPLACE(REPLACE(REPLACE(quote::text,'（AS-NET）',''),'symphony insight','symphony インサイト'),'symphony販売管理','symphony 販売管理'),'symphony整備請求','symphony 整備請求')::jsonb WHERE quote IS NOT NULL AND (quote::text LIKE '%AS-NET%' OR quote::text LIKE '%symphony insight%' OR quote::text LIKE '%symphony販売管理%' OR quote::text LIKE '%symphony整備請求%');
UPDATE public.session_contents SET badge = REPLACE(REPLACE(REPLACE(REPLACE(badge::text,'（AS-NET）',''),'symphony insight','symphony インサイト'),'symphony販売管理','symphony 販売管理'),'symphony整備請求','symphony 整備請求')::jsonb WHERE badge IS NOT NULL AND (badge::text LIKE '%AS-NET%' OR badge::text LIKE '%symphony insight%' OR badge::text LIKE '%symphony販売管理%' OR badge::text LIKE '%symphony整備請求%');
UPDATE public.session_contents SET roleplay = REPLACE(REPLACE(REPLACE(REPLACE(roleplay::text,'（AS-NET）',''),'symphony insight','symphony インサイト'),'symphony販売管理','symphony 販売管理'),'symphony整備請求','symphony 整備請求')::jsonb WHERE roleplay IS NOT NULL AND (roleplay::text LIKE '%AS-NET%' OR roleplay::text LIKE '%symphony insight%' OR roleplay::text LIKE '%symphony販売管理%' OR roleplay::text LIKE '%symphony整備請求%');

-- deep_dive_contents
UPDATE public.deep_dive_contents SET
  title        = REPLACE(REPLACE(REPLACE(REPLACE(title,        '（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求'),
  subtitle     = REPLACE(REPLACE(REPLACE(REPLACE(COALESCE(subtitle,''), '（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求'),
  introduction = REPLACE(REPLACE(REPLACE(REPLACE(introduction, '（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求'),
  conclusion   = REPLACE(REPLACE(REPLACE(REPLACE(conclusion,   '（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求'),
  sections     = REPLACE(REPLACE(REPLACE(REPLACE(sections::text,'（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求')::jsonb
WHERE sections::text LIKE '%AS-NET%' OR introduction LIKE '%AS-NET%' OR conclusion LIKE '%AS-NET%'
   OR sections::text LIKE '%symphony insight%'
   OR sections::text LIKE '%symphony販売管理%' OR introduction LIKE '%symphony販売管理%' OR conclusion LIKE '%symphony販売管理%'
   OR sections::text LIKE '%symphony整備請求%' OR introduction LIKE '%symphony整備請求%' OR conclusion LIKE '%symphony整備請求%';

-- final_exam_questions
UPDATE public.final_exam_questions SET
  question    = REPLACE(REPLACE(REPLACE(REPLACE(question,    '（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求'),
  options     = REPLACE(REPLACE(REPLACE(REPLACE(options::text,'（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求')::jsonb,
  explanation = REPLACE(REPLACE(REPLACE(REPLACE(explanation, '（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求'),
  source      = REPLACE(REPLACE(REPLACE(REPLACE(source,      '（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求')
WHERE question LIKE '%AS-NET%' OR options::text LIKE '%AS-NET%' OR explanation LIKE '%AS-NET%'
   OR question LIKE '%symphony insight%'
   OR question LIKE '%symphony販売管理%' OR options::text LIKE '%symphony販売管理%' OR explanation LIKE '%symphony販売管理%'
   OR question LIKE '%symphony整備請求%' OR options::text LIKE '%symphony整備請求%' OR explanation LIKE '%symphony整備請求%';

-- category_test_questions
UPDATE public.category_test_questions SET
  question    = REPLACE(REPLACE(REPLACE(REPLACE(question,    '（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求'),
  options     = REPLACE(REPLACE(REPLACE(REPLACE(options::text,'（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求')::jsonb,
  explanation = REPLACE(REPLACE(REPLACE(REPLACE(explanation, '（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求'),
  source      = REPLACE(REPLACE(REPLACE(REPLACE(source,      '（AS-NET）',''), 'symphony insight','symphony インサイト'), 'symphony販売管理','symphony 販売管理'), 'symphony整備請求','symphony 整備請求')
WHERE question LIKE '%AS-NET%' OR options::text LIKE '%AS-NET%' OR explanation LIKE '%AS-NET%'
   OR question LIKE '%symphony insight%'
   OR question LIKE '%symphony販売管理%' OR options::text LIKE '%symphony販売管理%' OR explanation LIKE '%symphony販売管理%'
   OR question LIKE '%symphony整備請求%' OR options::text LIKE '%symphony整備請求%' OR explanation LIKE '%symphony整備請求%';
