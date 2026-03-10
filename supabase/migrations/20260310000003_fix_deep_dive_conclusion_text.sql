-- deep_dive_contents training_id=5 の conclusion 内のテキストを修正
-- 「緊急ではないが重要」な活動 → 「緊急ではないが重要」という活動

UPDATE public.deep_dive_contents
SET conclusion = REPLACE(
  conclusion,
  '「緊急ではないが重要」な活動に意識的に時間を投資している',
  '「緊急ではないが重要」という活動に意識的に時間を投資している'
)
WHERE training_id = 5;
