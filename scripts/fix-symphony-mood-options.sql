-- Symphonyシリーズのmood_optionsを修正
-- 「今日の調子は？」に対する適切な選択肢に更新

-- 共通のmood_optionsを定義（responseフィールドを含む）
UPDATE session_contents
SET mood_options = '[
  {"emoji": "😤", "label": "気合い十分！", "response": "その調子！今日も全力でいきましょう！"},
  {"emoji": "😊", "label": "まあまあ", "response": "いい感じですね。今日の研修で更にパワーアップしましょう！"},
  {"emoji": "😴", "label": "ちょっと眠い...", "response": "大丈夫、今日の研修で目が覚めますよ！"},
  {"emoji": "😰", "label": "正直キツい", "response": "そんな日もある。今日の研修で少し元気になれるよ。"}
]'::jsonb,
updated_at = NOW()
WHERE training_id IN (11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22);
