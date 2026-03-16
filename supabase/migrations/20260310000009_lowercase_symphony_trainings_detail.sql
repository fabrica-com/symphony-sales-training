-- trainings.detail（JSONB）に残っていた Symphony を symphony に統一
-- 前回の Migration（20260310000006）で trainings.title のみ対応し、detail が漏れていた

UPDATE public.trainings
SET detail = REPLACE(detail::text, 'Symphony', 'symphony')::jsonb
WHERE detail::text LIKE '%Symphony%';

-- deep_dive_contents.sections（JSONB）も念のため確認・修正
UPDATE public.deep_dive_contents
SET sections = REPLACE(sections::text, 'Symphony', 'symphony')::jsonb
WHERE sections::text LIKE '%Symphony%';

-- trainings.subtitle も念のため確認・修正
UPDATE public.trainings
SET subtitle = REPLACE(subtitle, 'Symphony', 'symphony')
WHERE subtitle LIKE '%Symphony%';
