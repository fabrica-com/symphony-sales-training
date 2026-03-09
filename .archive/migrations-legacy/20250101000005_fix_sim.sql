-- Fix simulation options to have balanced answer lengths
-- Training ID 13: Symphony整備請求

UPDATE session_contents
SET simulation = '[
  {
    "title": "車検フォローの場面",
    "scene": "顧客:\n「車検の時期が近づいたら連絡してほしいんですが...」",
    "question": "あなたの対応は？",
    "options": [
      "手帳にメモして、自分で管理しておきます",
      "Symphony整備請求で自動通知できます",
      "お客様ご自身で覚えておいてください"
    ],
    "correctIndex": 1,
    "explanation": "Symphony整備請求には車検時期を自動で管理し、時期が近づくとアラートで通知する機能があります。手動管理ではフォロー漏れのリスクがあり、お客様任せでは信頼関係を損ないます。"
  }
]'::jsonb
WHERE training_id = 13;

-- Training ID 15: ワンプラの競合比較
UPDATE session_contents
SET simulation = '[
  {
    "title": "競合サービスとの比較質問",
    "scene": "顧客:\n「他社の業販サービスも検討しているんですが、ワンプラは何が違うんですか？」",
    "question": "最も効果的な回答は？",
    "options": [
      "他社より安いのでお得ですよ",
      "手数料と連携メリットで比較しましょう",
      "とにかく一度使ってみてください"
    ],
    "correctIndex": 1,
    "explanation": "具体的な数字（手数料の差額）とSymphony連携による業務効率化を示すことで、感覚的ではなく論理的に優位性を伝えられます。"
  }
]'::jsonb
WHERE training_id = 15;

-- Training ID 17: 導入事例研究①小規模店舗
UPDATE session_contents
SET simulation = '[
  {
    "title": "小規模店舗オーナーとの商談",
    "scene": "オーナー:\n「うちは小さい店だから、そんな大げさなシステムは要らないよ」",
    "question": "どう返答しますか？",
    "options": [
      "確かに小規模店には不要かもしれません",
      "小さい店舗だからこそ時間が大切です",
      "将来のために今から導入しましょう"
    ],
    "correctIndex": 1,
    "explanation": "小規模店舗こそ、オーナー1人で全業務をこなすため時間が最も貴重です。事務作業削減→接客時間増加→売上アップのストーリーで価値を伝えます。"
  }
]'::jsonb
WHERE training_id = 17;

-- Training ID 18: 導入事例研究②中規模店舗
UPDATE session_contents
SET simulation = '[
  {
    "title": "中規模店舗での情報共有課題",
    "scene": "店長:\n「スタッフ間で顧客情報がうまく共有できなくて、フォロー漏れが多いんです」",
    "question": "どの製品を提案しますか？",
    "options": [
      "まずワンプラで仕入れを効率化しましょう",
      "販売管理で顧客情報を一元管理しましょう",
      "整備請求で車検管理を始めましょう"
    ],
    "correctIndex": 1,
    "explanation": "情報共有の課題には、Symphony販売管理の顧客管理（CRM）機能が最適です。全スタッフが同じ情報を見られることでフォロー漏れを防げます。"
  }
]'::jsonb
WHERE training_id = 18;

-- Training ID 19: 導入事例研究③大規模・多店舗
UPDATE session_contents
SET simulation = '[
  {
    "title": "多店舗展開企業への提案",
    "scene": "本部長:\n「3店舗あるけど、店舗ごとにバラバラのシステムで困っている」",
    "question": "どのようなアプローチが効果的？",
    "options": [
      "全店舗に一斉導入を提案する",
      "1店舗でパイロット導入を提案する",
      "本部用の管理ツールだけ提案する"
    ],
    "correctIndex": 1,
    "explanation": "大規模導入はリスクが高いため、まず1店舗でパイロット導入し、効果を実証してから他店舗に展開する段階的アプローチが成功率を高めます。"
  }
]'::jsonb
WHERE training_id = 19;
