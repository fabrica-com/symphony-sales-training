-- deep_dive_contents に残存していた "Teams" 表記を修正
-- id=88: "チャットワーク/Teams" → "チャットワーク"
-- id=56: "Zoom、Google Meet、Teams" → "Zoom、Google Meet"（Teams をビデオ会議ツール列から除去）

UPDATE public.deep_dive_contents
SET sections = REPLACE(
    REPLACE(sections::text,
      'チャットワーク/Teams', 'チャットワーク'),
    'Zoom、Google Meet、Teams', 'Zoom、Google Meet')::jsonb
WHERE id IN (88, 56);
