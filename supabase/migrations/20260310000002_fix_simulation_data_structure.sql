-- training 11, 12, 14, 16, 20 の simulation が object 形式で保存されているため配列形式に変換する
-- 旧形式: { "scenario": "...", "customerProfile": "...", "options": [...] }
-- 新形式: [{ "situation": "...", "customerLine": "...", "options": [...] }]

UPDATE public.session_contents
SET simulation = jsonb_build_array(
  jsonb_build_object(
    'situation',    simulation ->> 'scenario',
    'customerLine', simulation ->> 'customerProfile',
    'options',      simulation -> 'options'
  )
)
WHERE jsonb_typeof(simulation) = 'object'
  AND simulation ? 'scenario';
