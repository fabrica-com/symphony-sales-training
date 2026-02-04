-- Symphonyシリーズ インタラクティブセッション (ID: 11-22)
-- ワンプラの手数料：出品成約料と落札料の2種類

-- 研修11: Symphonyシリーズ全体像
INSERT INTO session_contents (
  training_id, title, key_phrase, badge, mood_options, review_quiz, story, infographic, quick_check, quote, simulation, reflection, action_options, work
) VALUES (
  11,
  'Symphonyシリーズ全体像',
  'すべての業務が、つながる',
  '{"name": "Symphony入門", "icon": "sparkles"}',
  '[
    {"emoji": "😤", "label": "気合い十分！", "response": "その調子！Symphonyの全体像をマスターしましょう！"},
    {"emoji": "😊", "label": "まあまあ", "response": "いい感じですね。今日の15分で製品知識がパワーアップしますよ！"},
    {"emoji": "😴", "label": "ちょっと眠い...", "response": "大丈夫、Symphonyの話は面白いですよ！"},
    {"emoji": "😰", "label": "正直キツい", "response": "製品を知れば提案の幅が広がります。一緒に頑張りましょう！"}
  ]',
  '{"question": "中古車販売店の主な課題として多いのは？", "options": ["人手が余っている", "入力作業の二重手間", "在庫が多すぎる", "お客様が多すぎる"], "correctIndex": 1, "explanation": "中古車販売店では、複数システムへの二重入力、手書き管理の非効率さが大きな課題です。"}',
  '{
    "part1": [
      {"title": "田中オーナーの悩み", "content": "田中オーナー（50代）は、創業20年の中古車販売店を経営している。\n\n「最近、仕事が回らなくなってきた...」\n\n在庫30台を管理しながら、カーセンサーとグーネットへの入力、手書きの顧客管理、整備の請求書作成...\n\n「同じことを何度も入力するのが本当に無駄だ」", "duration": 15},
      {"title": "営業担当・健太の提案", "content": "健太は田中オーナーの話を聞いて、課題を整理した。\n\n「田中さん、お話を聞いていると、3つの『困った』があるように思います」\n\n1. 入力作業が二度手間\n2. 仕入れルートが限られている\n3. 整備の管理がバラバラ\n\n「これ、全部つなげられたら楽になりませんか？」", "duration": 15},
      {"title": "Symphonyという選択肢", "content": "健太はタブレットを取り出した。\n\n「Symphonyシリーズなら、すべてがつながります」\n\n・販売管理：一度入力すれば全メディアに掲載\n・ワンプラ：7万台から仕入れ、売れない車は業販\n・整備請求：顧客情報と連携した整備管理\n\n田中オーナーの目が輝いた。「それ、詳しく聞かせてくれ」", "duration": 15}
    ],
    "part2": [
      {"title": "3ヶ月後の変化", "content": "Symphony導入から3ヶ月。田中オーナーは笑顔で語った。\n\n「入力作業が半分以下になったよ。おかげで接客に集中できるようになった」\n\n・広告掲載の手間：70%削減\n・在庫回転率：20%向上\n・整備からの売上：月50万円増\n\n「全部つながるって、こういうことか」", "duration": 15}
    ]
  }',
  '{"title": "Symphonyシリーズの3つの価値", "content": "┌─────────────────────────────┐\n│     分かりやすい     │\n│  ワンストップで完結  │\n│  誰でもすぐ使える    │\n└─────────────────────────────┘\n           ↓\n┌─────────────────────────────┐\n│      つながる        │\n│  全国の業者と仕入れ  │\n│  10+メディアに一括   │\n└─────────────────────────────┘\n           ↓\n┌─────────────────────────────┐\n│    売上が伸びる      │\n│  在庫回転率アップ    │\n│  整備で収益源追加    │\n└─────────────────────────────┘", "highlight": "すべての業務が、つながる。すべてのデータが、活きる。", "audioText": "Symphonyは単なるシステムではなく、中古車販売店の経営を変える統合プラットフォームです。"}',
  '[
    {"question": "Symphonyシリーズの製品でないのは？", "options": ["Symphony販売管理", "Symphonyオークション", "Symphony整備請求", "シンフォニーワンプラ"], "correctIndex": 1, "explanation": "Symphonyシリーズは販売管理、整備請求、ワンプラの3製品です。オークションは製品名ではありません。"},
    {"question": "Symphony導入で期待できる効果は？", "options": ["人員を増やせる", "入力作業の削減と業務効率化", "店舗を増やせる", "価格を上げられる"], "correctIndex": 1, "explanation": "Symphonyの導入効果は、二重入力の解消による業務効率化が最も大きいです。"}
  ]',
  '{"text": "The whole is greater than the sum of its parts.", "textJa": "全体は部分の総和以上である", "author": "アリストテレス"}',
  '[
    {"situation": "初めて会う中古車販売店のオーナーに、Symphonyを紹介する場面", "customerLine": "うちは今のやり方で困ってないんだけど...", "options": [
      {"text": "でもSymphonyを使えば効率が上がりますよ", "isCorrect": false, "feedback": "「困っていない」という発言を否定するのはNG。まず現状を聞きましょう。", "points": 0},
      {"text": "なるほど。ちなみに今、どんなシステムをお使いですか？", "isCorrect": true, "feedback": "まず現状を聞くことで、潜在的な課題を発見できます。", "points": 15},
      {"text": "他社さんは皆さんSymphonyを使っていますよ", "isCorrect": false, "feedback": "他社の話より、この店舗の状況を理解することが先です。", "points": 5}
    ]},
    {"situation": "課題を聞き出した後、製品を提案する場面", "customerLine": "確かに入力作業は面倒だね。でもシステム変えるのも大変そう...", "options": [
      {"text": "Symphonyは3製品ありますが、まずは販売管理だけでも始められます", "isCorrect": true, "feedback": "「全部導入」ではなく「小さく始める」提案は、導入障壁を下げます。", "points": 15},
      {"text": "3製品すべて導入すると最大効果が出ますよ", "isCorrect": false, "feedback": "最大効果は正しいですが、導入障壁を高く感じさせてしまいます。", "points": 5},
      {"text": "変えないと、どんどん遅れますよ", "isCorrect": false, "feedback": "脅しのような提案はNG。メリットを伝えましょう。", "points": 0}
    ]}
  ]',
  '{"question": "Symphonyを提案する際、最初に確認すべきことは何だと思いますか？", "placeholder": "例：お客様の現状のシステムや業務フローを聞く..."}',
  '["お客様の現状システムを必ず確認する", "3つの価値（分かりやすい・つながる・売上が伸びる）を説明できるようにする", "小さく始める提案を準備する", "導入事例を1つ覚える"]',
  '{"title": "Symphonyシリーズ 製品マップ作成", "description": "お客様の課題と製品を紐づけて整理しましょう", "fields": [
    {"label": "入力作業が大変な店舗に提案する製品", "placeholder": "製品名と理由を書いてください"},
    {"label": "仕入れルートを増やしたい店舗に提案する製品", "placeholder": "製品名と理由を書いてください"},
    {"label": "整備収益を増やしたい店舗に提案する製品", "placeholder": "製品名と理由を書いてください"}
  ]}'
)
ON CONFLICT (training_id) DO UPDATE SET
  title = EXCLUDED.title,
  key_phrase = EXCLUDED.key_phrase,
  badge = EXCLUDED.badge,
  mood_options = EXCLUDED.mood_options,
  review_quiz = EXCLUDED.review_quiz,
  story = EXCLUDED.story,
  infographic = EXCLUDED.infographic,
  quick_check = EXCLUDED.quick_check,
  quote = EXCLUDED.quote,
  simulation = EXCLUDED.simulation,
  reflection = EXCLUDED.reflection,
  action_options = EXCLUDED.action_options,
  work = EXCLUDED.work,
  updated_at = NOW();

-- 研修12: Symphony販売管理
INSERT INTO session_contents (
  training_id, title, key_phrase, badge, mood_options, review_quiz, story, infographic, quick_check, quote, simulation, reflection, action_options, work
) VALUES (
  12,
  'Symphony販売管理',
  '一度の入力で、すべて完結',
  '{"name": "販売管理マスター", "icon": "target"}',
  '[
    {"emoji": "😤", "label": "気合い十分！", "response": "よし！販売管理の機能を完璧にマスターしましょう！"},
    {"emoji": "😊", "label": "まあまあ", "response": "いい感じ！今日は販売管理の強みを深堀りしますよ。"},
    {"emoji": "😴", "label": "ちょっと眠い...", "response": "販売管理の話、実は面白いんですよ！"},
    {"emoji": "😰", "label": "正直キツい", "response": "製品知識は営業の武器です。一緒に頑張りましょう！"}
  ]',
  '{"question": "Symphonyシリーズで中心となる製品は？", "options": ["シンフォニーワンプラ", "Symphony販売管理", "Symphony整備請求", "Symphonyオークション"], "correctIndex": 1, "explanation": "販売管理が中心製品で、ワンプラや整備請求と連携してさらに価値を発揮します。"}',
  '{
    "part1": [
      {"title": "佐藤店長の日常", "content": "佐藤店長は毎日、同じ作業の繰り返しに疲れていた。\n\n朝：エクセルで在庫確認\n午前：カーセンサーに車両情報を入力\n午後：グーネットにも同じ情報を入力\n夕方：手書きで顧客情報をノートに記入\n\n「同じことを何度書かせるんだ...」\n\n1台登録するのに30分かかっていた。", "duration": 15},
      {"title": "健太のデモンストレーション", "content": "健太は佐藤店長にSymphony販売管理のデモを見せた。\n\n「佐藤さん、この画面で車両情報を入力してみてください」\n\n佐藤店長が入力を終えると...\n\n「はい、これでカーセンサーにも、グーネットにも、ヤフオクにも同時掲載されました」\n\n「え？もう？たった5分で？」", "duration": 15},
      {"title": "主要機能の紹介", "content": "健太は続けて説明した。\n\n「販売管理の主な機能をご紹介しますね」\n\n✓ 車両管理：写真もドラッグ&ドロップで簡単登録\n✓ 広告連携：10以上のメディアに一括掲載\n✓ 顧客管理：商談履歴もワンクリックで確認\n✓ 契約書作成：ペーパーレスで効率化\n✓ 粗利計算：仕入れから販売まで自動計算\n\n「全部、この一つの画面でできるんです」", "duration": 15}
    ],
    "part2": [
      {"title": "導入1ヶ月後", "content": "導入から1ヶ月。佐藤店長からの報告。\n\n「健太さん、すごいことになってるよ」\n\n・入力時間：30分→5分（83%削減）\n・広告掲載の手間：70%削減\n・顧客フォロー漏れ：ほぼゼロに\n\n「空いた時間で接客を増やしたら、成約率が15%上がったんだ」\n\n健太は嬉しそうに答えた。「それがSymphonyの本当の価値です」", "duration": 15}
    ]
  }',
  '{"title": "Symphony販売管理 6つの機能", "content": "┌────────────────────────────────┐\n│   🚗 車両管理                 │\n│   写真・スペック一元管理      │\n├────────────────────────────────┤\n│   📢 広告連携                 │\n│   10+メディア一括掲載         │\n├────────────────────────────────┤\n│   👥 顧客管理（CRM）          │\n│   商談履歴・フォロー管理      │\n├────────────────────────────────┤\n│   📝 契約書作成               │\n│   ペーパーレス化              │\n├────────────────────────────────┤\n│   🚚 納車管理                 │\n│   スケジュール・ToDo          │\n├────────────────────────────────┤\n│   💰 粗利計算                 │\n│   仕入れ〜販売を自動計算      │\n└────────────────────────────────┘", "highlight": "一度の入力で、すべて完結。本質的な営業活動に集中できます。", "audioText": "販売管理は単なる業務効率化ツールではありません。空いた時間で接客を増やし、売上アップにつなげるためのツールです。"}',
  '[
    {"question": "Symphony販売管理が連携できる広告メディアの数は？", "options": ["3以上", "5以上", "10以上", "20以上"], "correctIndex": 2, "explanation": "カーセンサー、グーネット、Yahoo!オークションなど10以上のメディアに一括掲載できます。"},
    {"question": "販売管理のCRM機能でできないことは？", "options": ["商談履歴の確認", "フォロー予定の管理", "自動架電", "顧客情報の検索"], "correctIndex": 2, "explanation": "CRMは顧客情報と商談履歴の管理機能です。自動架電機能はありません。"}
  ]',
  '{"text": "Simplicity is the ultimate sophistication.", "textJa": "シンプルさは究極の洗練である", "author": "レオナルド・ダ・ヴィンチ"}',
  '[
    {"situation": "販売管理を提案中、競合製品と比較される場面", "customerLine": "他社の〇〇も同じようなことできるって聞いたけど...", "options": [
      {"text": "他社製品は使いにくいですよ", "isCorrect": false, "feedback": "他社批判はNG。自社の強みを伝えましょう。", "points": 0},
      {"text": "Symphony最大の強みは、ワンプラや整備請求との連携です。他製品にはできない一元管理が可能です", "isCorrect": true, "feedback": "製品連携という独自の強みを伝えることで、差別化できます。", "points": 15},
      {"text": "どちらも同じようなものですね", "isCorrect": false, "feedback": "差別化ポイントを伝えないと、価格競争になってしまいます。", "points": 5}
    ]},
    {"situation": "「使いこなせるか不安」と言われた場面", "customerLine": "便利そうだけど、うちのスタッフに使いこなせるかな...", "options": [
      {"text": "簡単なので大丈夫ですよ", "isCorrect": false, "feedback": "不安を軽視するような回答は信頼を損ないます。", "points": 5},
      {"text": "導入時の研修と、専任サポートがつきます。実際、ITが苦手な方でも1週間で使いこなせています", "isCorrect": true, "feedback": "具体的なサポート体制と実績を伝えることで、安心感を与えられます。", "points": 15},
      {"text": "使えなかったら解約できます", "isCorrect": false, "feedback": "解約の話は不安を強める可能性があります。", "points": 0}
    ]}
  ]',
  '{"question": "販売管理を提案する際、最も効果的なアピールポイントは何だと思いますか？", "placeholder": "例：入力時間の削減効果を具体的な数字で示す..."}',
  '["「一度の入力で全メディア掲載」を必ず伝える", "入力時間の削減効果（83%削減）を数字で示す", "他製品との連携メリットを説明する", "導入サポート体制を説明できるようにする"]',
  '{"title": "販売管理の競合比較シート作成", "description": "販売管理の強みを整理しましょう", "fields": [
    {"label": "販売管理の最大の強みは？", "placeholder": "一番のアピールポイントを書いてください"},
    {"label": "競合製品にない機能は？", "placeholder": "差別化ポイントを書いてください"},
    {"label": "お客様の不安への対処法は？", "placeholder": "「使いこなせるか不安」への回答を書いてください"}
  ]}'
)
ON CONFLICT (training_id) DO UPDATE SET
  title = EXCLUDED.title,
  key_phrase = EXCLUDED.key_phrase,
  badge = EXCLUDED.badge,
  mood_options = EXCLUDED.mood_options,
  review_quiz = EXCLUDED.review_quiz,
  story = EXCLUDED.story,
  infographic = EXCLUDED.infographic,
  quick_check = EXCLUDED.quick_check,
  quote = EXCLUDED.quote,
  simulation = EXCLUDED.simulation,
  reflection = EXCLUDED.reflection,
  action_options = EXCLUDED.action_options,
  work = EXCLUDED.work,
  updated_at = NOW();

-- 研修14: シンフォニーワンプラ
INSERT INTO session_contents (
  training_id, title, key_phrase, badge, mood_options, review_quiz, story, infographic, quick_check, quote, simulation, reflection, action_options, work
) VALUES (
  14,
  'シンフォニーワンプラ',
  '在庫を流動化、コストを最小化',
  '{"name": "ワンプラエキスパート", "icon": "flame"}',
  '[
    {"emoji": "😤", "label": "気合い十分！", "response": "よし！ワンプラの魅力を完璧に理解しましょう！"},
    {"emoji": "😊", "label": "まあまあ", "response": "いい感じ！ワンプラは営業の強い武器になりますよ。"},
    {"emoji": "😴", "label": "ちょっと眠い...", "response": "ワンプラの話は面白いですよ。仕入れの常識が変わります！"},
    {"emoji": "😰", "label": "正直キツい", "response": "ワンプラを知れば提案の幅が広がります。一緒に頑張りましょう！"}
  ]',
  '{"question": "シンフォニーワンプラの共有在庫数は？", "options": ["約1万台", "約3万台", "約7万台", "約10万台"], "correctIndex": 2, "explanation": "シンフォニーワンプラは約7万台の共有在庫から仕入れができます。"}',
  '{
    "part1": [
      {"title": "山田社長の悩み", "content": "山田社長は、仕入れに頭を悩ませていた。\n\n「オークションだけじゃ、欲しい車が見つからない」\n「見つかっても、競り負けて仕入れ単価が上がってしまう」\n「かといって、在庫を増やすと売れ残りリスクが...」\n\n中古車販売の永遠のジレンマだった。", "duration": 15},
      {"title": "健太の提案", "content": "健太は山田社長に切り出した。\n\n「山田社長、オークション以外の仕入れルート、考えたことありますか？」\n\n「あるけど、どれもイマイチでね」\n\n「シンフォニーワンプラなら、7万台の共有在庫から24時間いつでも仕入れができます。しかも、売れない在庫は業販で他店に売れるんです」\n\n「仕入れも販売もできるってこと？」", "duration": 15},
      {"title": "2つの使い方", "content": "健太はワンプラの画面を見せながら説明した。\n\n「ワンプラには2つの使い方があります」\n\n【仕入れ】\n・7万台から検索、24時間交渉可能\n・オークションより手数料が安い\n\n【業販出品】\n・長期在庫を全国の業者に販売\n・出品成約料と落札料のシンプルな料金体系\n\n「オークションの会費もかからないんですか？」\n「はい、固定費はゼロです」", "duration": 15}
    ],
    "part2": [
      {"title": "3ヶ月後の成果", "content": "ワンプラ導入から3ヶ月。山田社長の報告。\n\n「健太さん、ワンプラすごいね」\n\n・仕入れルート：オークション依存から脱却\n・長期在庫：業販で3台処分（損失最小化）\n・在庫回転率：25%向上\n\n「仕入れで買って、売れなかったら業販。この流れが作れたのが大きいよ」", "duration": 15}
    ]
  }',
  '{"title": "ワンプラ手数料体系", "content": "┌─────────────────────────────────────┐\n│   💰 手数料体系（2種類のみ）    │\n├─────────────────────────────────────┤\n│                                   │\n│  【出品成約料】                   │\n│   出品した車が売れた時に発生      │\n│                                   │\n│  【落札料】                       │\n│   他店の車を仕入れた時に発生      │\n│                                   │\n├─────────────────────────────────────┤\n│   ✓ 固定費ゼロ                   │\n│   ✓ 成約時のみ手数料発生         │\n│   ✓ 業界最安水準                 │\n└─────────────────────────────────────┘\n\n★ オークション会費・出品料不要！", "highlight": "シンプルな料金体系：出品成約料と落札料のみ。固定費ゼロで始められます。", "audioText": "ワンプラの手数料は出品成約料と落札料の2種類のみ。固定費がかからないので、気軽に始められます。"}',
  '[
    {"question": "ワンプラの手数料体系として正しいのは？", "options": ["月額固定のみ", "出品成約料と落札料", "成果報酬のみ", "従量課金のみ"], "correctIndex": 1, "explanation": "ワンプラの手数料は出品成約料（出品車が売れた時）と落札料（仕入れた時）の2種類です。"},
    {"question": "ワンプラで「できない」ことは？", "options": ["24時間仕入れ検索", "長期在庫の業販出品", "オークション入札", "全国の業者との取引"], "correctIndex": 2, "explanation": "ワンプラはオークションとは別のプラットフォームです。オークション入札はできません。"}
  ]',
  '{"text": "In the middle of difficulty lies opportunity.", "textJa": "困難の中に機会がある", "author": "アルベルト・アインシュタイン"}',
  '[
    {"situation": "仕入れに困っている店舗にワンプラを提案する場面", "customerLine": "オークションで十分だと思うんだけど...", "options": [
      {"text": "オークションは古いですよ", "isCorrect": false, "feedback": "既存の方法を否定するのはNG。補完的な価値を伝えましょう。", "points": 0},
      {"text": "ワンプラはオークションの「補完」です。オークションで見つからない時の第2の選択肢として使えます", "isCorrect": true, "feedback": "「補完」という位置づけなら、既存の方法を否定せずに提案できます。", "points": 15},
      {"text": "ワンプラの方が安いです", "isCorrect": false, "feedback": "価格だけの比較は本質的な価値を伝えられません。", "points": 5}
    ]},
    {"situation": "手数料について質問された場面", "customerLine": "手数料ってどうなってるの？複雑じゃない？", "options": [
      {"text": "出品成約料と落札料の2種類だけで、固定費はゼロです。成約した時だけ手数料がかかるシンプルな体系です", "isCorrect": true, "feedback": "シンプルな料金体系を明確に説明できています。", "points": 15},
      {"text": "詳しくは資料を見てください", "isCorrect": false, "feedback": "その場で説明できないと信頼を失います。", "points": 0},
      {"text": "他社より安いです", "isCorrect": false, "feedback": "具体的な説明がないと納得してもらえません。", "points": 5}
    ]}
  ]',
  '{"question": "ワンプラを提案する際、最も響くポイントは何だと思いますか？", "placeholder": "例：オークションで見つからない車の仕入れ先として..."}',
  '["手数料体系（出品成約料・落札料）を説明できるようにする", "「オークションの補完」という位置づけで提案する", "仕入れと業販の両方のメリットを伝える", "固定費ゼロで始められることを強調する"]',
  '{"title": "ワンプラ提案シート作成", "description": "ワンプラの提案ポイントを整理しましょう", "fields": [
    {"label": "ワンプラの手数料を説明してください", "placeholder": "出品成約料と落札料について説明を書いてください"},
    {"label": "「仕入れ」で使うメリットは？", "placeholder": "オークションと比較したメリットを書いてください"},
    {"label": "「業販出品」で使うメリットは？", "placeholder": "長期在庫処分のメリットを書いてください"}
  ]}'
)
ON CONFLICT (training_id) DO UPDATE SET
  title = EXCLUDED.title,
  key_phrase = EXCLUDED.key_phrase,
  badge = EXCLUDED.badge,
  mood_options = EXCLUDED.mood_options,
  review_quiz = EXCLUDED.review_quiz,
  story = EXCLUDED.story,
  infographic = EXCLUDED.infographic,
  quick_check = EXCLUDED.quick_check,
  quote = EXCLUDED.quote,
  simulation = EXCLUDED.simulation,
  reflection = EXCLUDED.reflection,
  action_options = EXCLUDED.action_options,
  work = EXCLUDED.work,
  updated_at = NOW();

-- 研修16: 製品間連携の価値
INSERT INTO session_contents (
  training_id, title, key_phrase, badge, mood_options, review_quiz, story, infographic, quick_check, quote, simulation, reflection, action_options, work
) VALUES (
  16,
  '製品間連携の価値',
  '1+1を3にする',
  '{"name": "クロスセルマスター", "icon": "sparkles"}',
  '[
    {"emoji": "😤", "label": "気合い十分！", "response": "よし！クロスセルの技術をマスターしましょう！"},
    {"emoji": "😊", "label": "まあまあ", "response": "いい感じ！製品連携の価値を深く理解しましょう。"},
    {"emoji": "😴", "label": "ちょっと眠い...", "response": "製品連携の話、営業の武器になりますよ！"},
    {"emoji": "😰", "label": "正直キツい", "response": "クロスセルができると売上が変わります。一緒に頑張りましょう！"}
  ]',
  '{"question": "Symphony製品を複数導入するメリットは？", "options": ["割引がある", "データが連携して二重入力が不要になる", "サポートが手厚くなる", "特になし"], "correctIndex": 1, "explanation": "製品間でデータが連携し、二重入力が解消されることが最大のメリットです。"}',
  '{
    "part1": [
      {"title": "成長する店舗の課題", "content": "田中オーナーの店舗は、Symphony販売管理の導入で成長していた。\n\n「健太さん、おかげで入力作業が減って、接客に集中できるようになったよ」\n\n「それは良かったです。ところで、仕入れや整備はどうされていますか？」\n\n「仕入れはオークションだけど、最近なかなか見つからなくて...整備の管理は相変わらず手書きだね」\n\n「実は、それも解決できるんです」", "duration": 15},
      {"title": "製品連携の提案", "content": "健太は製品連携の価値を説明した。\n\n「販売管理とワンプラを連携すると、在庫データが自動でワンプラに出品されます」\n\n「え、また入力しなくていいの？」\n\n「はい。さらに、整備請求と連携すれば、販売したお客様の車検時期に自動でアラートが出ます」\n\n「顧客フォローも自動化できるってこと？」\n\n「そうです。1+1が3になる、それが製品連携の価値です」", "duration": 15}
    ],
    "part2": [
      {"title": "フル導入の効果", "content": "3製品フル導入から6ヶ月。田中オーナーの店舗は変わっていた。\n\n・入力作業：さらに50%削減（連携による自動化）\n・在庫回転率：30%向上（ワンプラ活用）\n・整備売上：月80万円増（顧客フォロー強化）\n\n「全部つながると、こんなに楽になるんだね」\n\n「これがSymphonyの本当の価値です。すべてがつながる統合プラットフォーム」", "duration": 15}
    ]
  }',
  '{"title": "製品連携マップ", "content": "       ┌─────────────────┐\n       │  Symphony販売管理 │ ← 中心\n       └────────┬────────┘\n                │\n     ┌──────────┼──────────┐\n     ↓          ↓          ↓\n┌─────────┐ ┌─────────┐ ┌─────────┐\n│ワンプラ │ │整備請求 │ │データ分析│\n│         │ │         │ │(将来)   │\n└─────────┘ └─────────┘ └─────────┘\n\n【連携効果】\n販売管理×ワンプラ → 在庫自動出品\n販売管理×整備請求 → 顧客情報共有\n全製品連携 → 入力作業50%削減", "highlight": "1+1を3にする。それがSymphony連携の価値。", "audioText": "単体でも価値がありますが、連携することで価値が何倍にもなります。"}',
  '[
    {"question": "販売管理とワンプラの連携で実現することは？", "options": ["自動架電", "在庫データの自動出品", "自動値引き", "自動納車"], "correctIndex": 1, "explanation": "販売管理の在庫情報がワンプラに自動連携され、手動での出品作業が不要になります。"},
    {"question": "クロスセルの適切なタイミングは？", "options": ["初回訪問時", "1つの製品で効果を実感した後", "契約直後", "解約直前"], "correctIndex": 1, "explanation": "まず1製品で成功体験を作り、その後に追加提案するのが効果的です。"}
  ]',
  '{"text": "The whole is greater than the sum of its parts.", "textJa": "全体は部分の総和以上である", "author": "アリストテレス"}',
  '[
    {"situation": "販売管理を導入済みの店舗にワンプラを追加提案する場面", "customerLine": "販売管理で十分満足してるんだけど...", "options": [
      {"text": "ワンプラも入れないとダメですよ", "isCorrect": false, "feedback": "押し売りになっています。課題を聞きましょう。", "points": 0},
      {"text": "ご満足いただけて嬉しいです。ところで、仕入れで困っていることはありませんか？", "isCorrect": true, "feedback": "満足を受け止めた上で、次の課題を探る良いアプローチです。", "points": 15},
      {"text": "連携するともっと便利ですよ", "isCorrect": false, "feedback": "具体的なメリットがないと響きません。", "points": 5}
    ]},
    {"situation": "複数製品の導入を検討中の店舗への提案", "customerLine": "全部入れるとなると、ちょっと不安だな...", "options": [
      {"text": "まずは販売管理から始めて、効果を実感してから次を検討しましょう", "isCorrect": true, "feedback": "段階的な導入提案は、お客様の不安を和らげます。", "points": 15},
      {"text": "全部入れた方が効果が出ますよ", "isCorrect": false, "feedback": "不安を無視した押し売りになっています。", "points": 5},
      {"text": "不安なら無理に入れなくていいですよ", "isCorrect": false, "feedback": "提案を放棄しています。", "points": 0}
    ]}
  ]',
  '{"question": "クロスセル提案で最も大切なことは何だと思いますか？", "placeholder": "例：お客様の課題を理解してから提案する..."}',
  '["まず1製品で成功体験を作ってから追加提案", "製品連携の具体的なメリットを説明できるようにする", "段階的な導入プランを提案できるようにする", "お客様の成長に合わせたタイミングで提案"]',
  '{"title": "クロスセル提案シナリオ作成", "description": "製品連携の提案シナリオを作りましょう", "fields": [
    {"label": "販売管理導入済み店舗への追加提案は？", "placeholder": "ワンプラまたは整備請求の提案シナリオを書いてください"},
    {"label": "製品連携の具体的メリットは？", "placeholder": "数字を使って説明してください"},
    {"label": "段階的導入の提案方法は？", "placeholder": "お客様の不安を和らげる提案を書いてください"}
  ]}'
)
ON CONFLICT (training_id) DO UPDATE SET
  title = EXCLUDED.title,
  key_phrase = EXCLUDED.key_phrase,
  badge = EXCLUDED.badge,
  mood_options = EXCLUDED.mood_options,
  review_quiz = EXCLUDED.review_quiz,
  story = EXCLUDED.story,
  infographic = EXCLUDED.infographic,
  quick_check = EXCLUDED.quick_check,
  quote = EXCLUDED.quote,
  simulation = EXCLUDED.simulation,
  reflection = EXCLUDED.reflection,
  action_options = EXCLUDED.action_options,
  work = EXCLUDED.work,
  updated_at = NOW();

-- 研修20: ROI計算の実践
INSERT INTO session_contents (
  training_id, title, key_phrase, badge, mood_options, review_quiz, story, infographic, quick_check, quote, simulation, reflection, action_options, work
) VALUES (
  20,
  'ROI計算の実践',
  '数字で語れば、顧客は動く',
  '{"name": "ROI計算マスター", "icon": "target"}',
  '[
    {"emoji": "😤", "label": "気合い十分！", "response": "よし！数字で語る営業をマスターしましょう！"},
    {"emoji": "😊", "label": "まあまあ", "response": "いい感じ！ROI計算は営業の最強武器になりますよ。"},
    {"emoji": "😴", "label": "ちょっと眠い...", "response": "数字の話、意外と面白いですよ！"},
    {"emoji": "😰", "label": "正直キツい", "response": "ROIが計算できれば提案の説得力が変わります。頑張りましょう！"}
  ]',
  '{"question": "ROIとは何の略？", "options": ["Return On Investment", "Rate Of Interest", "Revenue Of Income", "Result Of Implementation"], "correctIndex": 0, "explanation": "ROIはReturn On Investment（投資対効果）の略で、投資に対するリターンを示す指標です。"}',
  '{
    "part1": [
      {"title": "数字を求める顧客", "content": "鈴木社長は厳しい表情で言った。\n\n「便利なのは分かった。でも、いくら儲かるの？」\n\n健太は以前なら言葉に詰まっていた。\n\nでも今は違う。\n\n「鈴木社長、具体的に計算してみましょう」\n\nタブレットを取り出し、ROI試算シートを開いた。", "duration": 15},
      {"title": "ROI計算の実演", "content": "健太は鈴木社長と一緒に数字を入れていった。\n\n「現在、車両登録に1台何分かかっていますか？」\n「30分くらいかな」\n\n「Symphonyなら5分です。月に20台登録するとして...」\n\n・削減時間：25分 × 20台 = 500分/月（約8時間）\n・時給換算：8時間 × 1,500円 = 12,000円/月\n・年間効果：144,000円\n\n「これが時間削減だけの効果です」", "duration": 15},
      {"title": "トータルの投資対効果", "content": "健太は続けた。\n\n「さらに、広告掲載の効率化、顧客フォローによる成約率向上を加えると...」\n\n・時間削減：年間144,000円\n・成約率向上（5%）：年間約500,000円\n・合計効果：年間約644,000円\n\n「Symphony費用が年間〇〇円として、ROIは〇〇%。約〇ヶ月で回収できます」\n\n鈴木社長の表情が変わった。「なるほど、具体的だね」", "duration": 15}
    ],
    "part2": [
      {"title": "数字で勝った商談", "content": "後日、鈴木社長から連絡があった。\n\n「健太さん、導入することにしたよ」\n\n「ありがとうございます！決め手は何でしたか？」\n\n「数字で見せてくれたことだね。感覚じゃなくて、投資として判断できた」\n\n健太は学んだ。数字で語れば、顧客は動く。", "duration": 15}
    ]
  }',
  '{"title": "ROI計算の基本式", "content": "┌─────────────────────────────────────┐\n│         ROI計算式                  │\n├─────────────────────────────────────┤\n│                                     │\n│  ROI = (効果 - コスト) ÷ コスト × 100% │\n│                                     │\n│  回収期間 = コスト ÷ 月間効果       │\n│                                     │\n├─────────────────────────────────────┤\n│         効果の算出項目              │\n├─────────────────────────────────────┤\n│  1. 時間削減効果                    │\n│     削減時間 × 時給 = 金額          │\n│                                     │\n│  2. 売上増加効果                    │\n│     成約率向上 × 平均単価           │\n│                                     │\n│  3. コスト削減効果                  │\n│     手数料削減、人件費削減など      │\n└─────────────────────────────────────┘", "highlight": "数字で語れば、顧客は動く。感覚ではなく投資として判断してもらう。", "audioText": "ROI計算は難しくありません。お客様の現状を聞いて、効果を数字に変換するだけです。"}',
  '[
    {"question": "ROI計算で「効果」に含まれないのは？", "options": ["時間削減", "売上増加", "競合情報", "コスト削減"], "correctIndex": 2, "explanation": "ROI計算の効果は、時間削減、売上増加、コスト削減など、金額換算できるものです。"},
    {"question": "ROI計算で最初に確認すべきことは？", "options": ["競合の価格", "お客様の現状（作業時間、コストなど）", "自社の利益", "契約期間"], "correctIndex": 1, "explanation": "まずお客様の現状を数字で把握することが、ROI計算の第一歩です。"}
  ]',
  '{"text": "In God we trust; all others must bring data.", "textJa": "神は信じる。それ以外は数字を持ってこい", "author": "W・エドワーズ・デミング"}',
  '[
    {"situation": "「いくら儲かるの？」と聞かれた場面", "customerLine": "便利なのは分かったけど、いくら儲かるの？", "options": [
      {"text": "他のお客様は満足されていますよ", "isCorrect": false, "feedback": "質問に答えていません。数字で回答しましょう。", "points": 0},
      {"text": "具体的に計算してみましょう。まず、現在の作業時間を教えていただけますか？", "isCorrect": true, "feedback": "現状を聞いてROI計算を始める良いアプローチです。", "points": 15},
      {"text": "導入すれば必ず効果が出ますよ", "isCorrect": false, "feedback": "根拠のない約束は信頼を損ないます。", "points": 5}
    ]},
    {"situation": "ROI計算結果を説明する場面", "customerLine": "なるほど。でも本当にその効果が出るの？", "options": [
      {"text": "これはあくまで試算です。実際はお客様の運用次第で変わりますが、同規模の店舗では〇〇%の効果が出ています", "isCorrect": true, "feedback": "正直に伝えつつ、実績で裏付けるバランスの良い回答です。", "points": 15},
      {"text": "必ず出ます", "isCorrect": false, "feedback": "断言は危険です。", "points": 0},
      {"text": "やってみないと分かりません", "isCorrect": false, "feedback": "これでは提案の説得力がなくなります。", "points": 5}
    ]}
  ]',
  '{"question": "ROI計算を使った提案で、最も大切なことは何だと思いますか？", "placeholder": "例：お客様と一緒に数字を確認すること..."}',
  '["お客様の現状を数字で把握する習慣をつける", "ROI計算シートを使いこなせるようにする", "効果の根拠（実績）を説明できるようにする", "「試算」と「実績」を区別して説明する"]',
  '{"title": "ROI試算練習", "description": "架空の店舗でROI計算を練習しましょう", "fields": [
    {"label": "【設定】在庫20台、車両登録に1台30分かかっている店舗の時間削減効果は？", "placeholder": "計算式と結果を書いてください（時給1,500円で計算）"},
    {"label": "その他に見込める効果は？", "placeholder": "売上増加、コスト削減など"},
    {"label": "投資回収期間の説明方法は？", "placeholder": "お客様にどう説明するか書いてください"}
  ]}'
)
ON CONFLICT (training_id) DO UPDATE SET
  title = EXCLUDED.title,
  key_phrase = EXCLUDED.key_phrase,
  badge = EXCLUDED.badge,
  mood_options = EXCLUDED.mood_options,
  review_quiz = EXCLUDED.review_quiz,
  story = EXCLUDED.story,
  infographic = EXCLUDED.infographic,
  quick_check = EXCLUDED.quick_check,
  quote = EXCLUDED.quote,
  simulation = EXCLUDED.simulation,
  reflection = EXCLUDED.reflection,
  action_options = EXCLUDED.action_options,
  work = EXCLUDED.work,
  updated_at = NOW();
