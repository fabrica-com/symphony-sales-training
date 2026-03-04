-- Fix simulation options with correct structure (text + isCorrect)
-- Training ID 13: Symphony整備請求

UPDATE session_contents
SET simulation = '[
  {
    "situation": "車検フォローの場面",
    "customerLine": "車検の時期が近づいたら連絡してほしいんですが...",
    "options": [
      {"text": "手帳にメモして、自分で管理しておきます", "isCorrect": false},
      {"text": "Symphony整備請求で自動通知できます", "isCorrect": true},
      {"text": "お客様ご自身で覚えておいてください", "isCorrect": false}
    ],
    "explanation": "Symphony整備請求には車検時期を自動で管理し、時期が近づくとアラートで通知する機能があります。"
  }
]'::jsonb
WHERE training_id = 13;

-- Training ID 15: ワンプラの競合比較
UPDATE session_contents
SET simulation = '[
  {
    "situation": "競合サービスとの比較質問",
    "customerLine": "他社の業販サービスも検討しているんですが、ワンプラは何が違うんですか？",
    "options": [
      {"text": "他社より安いのでお得ですよ", "isCorrect": false},
      {"text": "手数料と連携メリットで比較しましょう", "isCorrect": true},
      {"text": "とにかく一度使ってみてください", "isCorrect": false}
    ],
    "explanation": "具体的な数字（手数料の差額）とSymphony連携による業務効率化を示すことで、論理的に優位性を伝えられます。"
  }
]'::jsonb
WHERE training_id = 15;

-- Training ID 17: 導入事例研究 小規模店舗
UPDATE session_contents
SET simulation = '[
  {
    "situation": "小規模店舗オーナーとの商談",
    "customerLine": "うちは小さい店だから、そんな大げさなシステムは要らないよ",
    "options": [
      {"text": "確かに小規模店には不要かもしれません", "isCorrect": false},
      {"text": "小さい店舗だからこそ時間が大切です", "isCorrect": true},
      {"text": "将来のために今から導入しましょう", "isCorrect": false}
    ],
    "explanation": "小規模店舗こそ、オーナー1人で全業務をこなすため時間が最も貴重です。事務作業削減で接客時間を増やせます。"
  }
]'::jsonb
WHERE training_id = 17;

-- Training ID 18: 導入事例研究 中規模店舗
UPDATE session_contents
SET simulation = '[
  {
    "situation": "中規模店舗での情報共有課題",
    "customerLine": "スタッフ間で顧客情報がうまく共有できなくて、フォロー漏れが多いんです",
    "options": [
      {"text": "まずワンプラで仕入れを効率化しましょう", "isCorrect": false},
      {"text": "販売管理で顧客情報を一元管理しましょう", "isCorrect": true},
      {"text": "整備請求で車検管理を始めましょう", "isCorrect": false}
    ],
    "explanation": "情報共有の課題には、Symphony販売管理の顧客管理（CRM）機能が最適です。全スタッフが同じ情報を見られます。"
  }
]'::jsonb
WHERE training_id = 18;

-- Training ID 19: 導入事例研究 大規模・多店舗
UPDATE session_contents
SET simulation = '[
  {
    "situation": "多店舗展開企業への提案",
    "customerLine": "3店舗あるけど、店舗ごとにバラバラのシステムで困っている",
    "options": [
      {"text": "全店舗に一斉導入を提案する", "isCorrect": false},
      {"text": "1店舗でパイロット導入を提案する", "isCorrect": true},
      {"text": "本部用の管理ツールだけ提案する", "isCorrect": false}
    ],
    "explanation": "大規模導入はリスクが高いため、まず1店舗でパイロット導入し、効果を実証してから展開します。"
  }
]'::jsonb
WHERE training_id = 19;
