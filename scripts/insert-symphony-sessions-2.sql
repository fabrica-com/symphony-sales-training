-- Symphonyシリーズ インタラクティブセッション追加 (ID 13, 15, 17, 18, 19)

-- 研修13: Symphony整備請求
INSERT INTO session_contents (
  training_id, title, key_phrase, badge, mood_options,
  story, quick_check, simulation, work, quote
) VALUES (
  13,
  'Symphony整備請求マスター',
  '販売後も、つながり続ける',
  '{"name": "整備マスター", "icon": "wrench"}',
  '[{"emoji": "🔧", "label": "整備に興味あり"}, {"emoji": "💰", "label": "収益アップしたい"}, {"emoji": "🤝", "label": "顧客関係を深めたい"}, {"emoji": "📊", "label": "効率化したい"}]',
  '{
    "part1": {
      "title": "整備部門の悩み",
      "content": "中古車販売店の鈴木さんは、整備部門の管理に悩んでいました。見積書は手書き、請求書はエクセル、顧客情報は別のノート...車検時期の管理も漏れがち。「せっかく車を買ってくれたお客様との関係が、納車後に途切れてしまう」",
      "character": "店長 鈴木さん",
      "emotion": "困っている"
    },
    "part2": {
      "title": "整備が第二の収益源に",
      "content": "Symphony整備請求を導入した鈴木さん。見積から請求まで一元管理、車検時期は自動アラート。販売管理との連携で、顧客情報も引き継がれます。「車を売って終わりじゃない。整備で長くお付き合いできるようになりました」リピート率は15%向上、整備売上も大幅アップ。",
      "character": "店長 鈴木さん",
      "emotion": "満足"
    }
  }',
  '{
    "question": "Symphony整備請求と販売管理を連携するメリットとして、最も重要なのは？",
    "options": [
      {"id": "a", "text": "コストが下がる"},
      {"id": "b", "text": "顧客情報の共有とLTV最大化"},
      {"id": "c", "text": "デザインが統一される"},
      {"id": "d", "text": "操作が簡単になる"}
    ],
    "correctAnswer": "b",
    "explanation": "販売管理との連携により、顧客情報が共有され、販売→整備→再販売のサイクルでLTV（顧客生涯価値）を最大化できます。"
  }',
  '{
    "scenario": "お客様から「車検の時期が近づいたら連絡してほしい」と言われました。Symphony整備請求の機能をどう説明しますか？",
    "options": [
      {"id": "a", "text": "「手帳に書いておきますね」", "feedback": "手動管理では漏れが発生しやすいです。システムの自動アラート機能を説明しましょう。", "isCorrect": false},
      {"id": "b", "text": "「Symphony整備請求が車検時期を自動で管理し、時期が近づいたらアラートでお知らせしますので、必ずご連絡いたします」", "feedback": "正解！自動アラート機能で確実なフォローができることを伝えられています。", "isCorrect": true},
      {"id": "c", "text": "「お客様の方で覚えておいてください」", "feedback": "顧客サービスとして不適切です。店舗側でフォローする姿勢を示しましょう。", "isCorrect": false}
    ]
  }',
  '{
    "title": "整備ビジネスの価値を説明する",
    "description": "お客様に整備・車検の継続利用を促す説明を考えてみましょう",
    "prompt": "以下の観点で、整備サービス継続のメリットを説明してください：\n1. 車両の状態を熟知したスタッフが担当する安心感\n2. 整備履歴の一元管理による適切なメンテナンス提案\n3. 販売時の下取り評価への好影響",
    "timeLimit": 180,
    "hints": ["購入時からの関係性を強調", "データに基づくメンテナンス提案", "長期的なメリットを伝える"]
  }',
  '{"text": "車を売って終わりじゃない。整備で長くお付き合いする。", "author": "導入店舗オーナー様の声"}'
) ON CONFLICT (training_id) DO UPDATE SET
  title = EXCLUDED.title,
  key_phrase = EXCLUDED.key_phrase,
  badge = EXCLUDED.badge,
  mood_options = EXCLUDED.mood_options,
  story = EXCLUDED.story,
  quick_check = EXCLUDED.quick_check,
  simulation = EXCLUDED.simulation,
  work = EXCLUDED.work,
  quote = EXCLUDED.quote,
  updated_at = NOW();

-- 研修15: ワンプラの競合比較
INSERT INTO session_contents (
  training_id, title, key_phrase, badge, mood_options,
  story, quick_check, simulation, work, quote
) VALUES (
  15,
  'ワンプラ競合比較マスター',
  '選ばれる理由を、数字で語る',
  '{"name": "比較分析マスター", "icon": "scale"}',
  '[{"emoji": "⚔️", "label": "競合に勝ちたい"}, {"emoji": "📊", "label": "データで説得したい"}, {"emoji": "💡", "label": "差別化を理解したい"}, {"emoji": "🎯", "label": "提案力を上げたい"}]',
  '{
    "part1": {
      "title": "競合との比較で迷う",
      "content": "営業の田中さんは商談で困っていました。「他社のサービスも検討しているんだけど、ワンプラは何が違うの？」というお客様の質問に、うまく答えられなかったのです。「なんとなく良いと思うんですが...」では説得力がありません。",
      "character": "営業 田中さん",
      "emotion": "困っている"
    },
    "part2": {
      "title": "数字で語る差別化",
      "content": "競合比較を学んだ田中さん。「ワンプラは出品成約料と落札料のみで固定費ゼロ。他社A社は月額費用がかかります。例えば月10台取引なら、年間で約○万円の差になります」と具体的に説明。「Symphony連携で二重入力も不要です」お客様は納得してワンプラを選んでくれました。",
      "character": "営業 田中さん",
      "emotion": "自信"
    }
  }',
  '{
    "question": "ワンプラの競合優位性として、最も強調すべきポイントは？",
    "options": [
      {"id": "a", "text": "デザインが良い"},
      {"id": "b", "text": "固定費ゼロ、Symphony連携による業務効率化"},
      {"id": "c", "text": "歴史が長い"},
      {"id": "d", "text": "サポートが日本語"}
    ],
    "correctAnswer": "b",
    "explanation": "ワンプラは成約時のみ手数料発生で固定費ゼロ、さらにSymphony連携で在庫データの自動出品ができる点が最大の差別化ポイントです。"
  }',
  '{
    "scenario": "お客様：「他社のB社も検討してるんだけど、どう違うの？」あなたならどう答えますか？",
    "options": [
      {"id": "a", "text": "「B社は良くないですよ」", "feedback": "競合の悪口は信頼を損ねます。自社の強みを具体的に伝えましょう。", "isCorrect": false},
      {"id": "b", "text": "「ワンプラは固定費ゼロで、成約時の出品成約料と落札料のみです。また、Symphony販売管理との連携で在庫データを自動出品でき、二重入力が不要です。具体的なコスト比較をお出ししましょうか？」", "feedback": "正解！自社の強みを具体的に説明し、数字での比較を提案できています。", "isCorrect": true},
      {"id": "c", "text": "「どちらでも同じだと思います」", "feedback": "差別化ポイントを説明できないと、価格だけの比較になってしまいます。", "isCorrect": false}
    ]
  }',
  '{
    "title": "競合比較トークを作る",
    "description": "お客様に響く競合比較の説明を作成しましょう",
    "prompt": "以下の情報を使って、お客様への説明トークを作成してください：\n\n【ワンプラの強み】\n・固定費ゼロ（出品成約料・落札料のみ）\n・7万台の共有在庫\n・Symphony連携で自動出品\n・24時間利用可能\n\n【想定する競合の特徴】\n・月額固定費あり\n・システム連携なし",
    "timeLimit": 240,
    "hints": ["具体的な金額差を示す", "年間コストで比較する", "連携による時間削減も金額換算"]
  }',
  '{"text": "数字は嘘をつかない。具体的に比較すれば、顧客は納得する。", "author": "Symphony営業格言"}'
) ON CONFLICT (training_id) DO UPDATE SET
  title = EXCLUDED.title,
  key_phrase = EXCLUDED.key_phrase,
  badge = EXCLUDED.badge,
  mood_options = EXCLUDED.mood_options,
  story = EXCLUDED.story,
  quick_check = EXCLUDED.quick_check,
  simulation = EXCLUDED.simulation,
  work = EXCLUDED.work,
  quote = EXCLUDED.quote,
  updated_at = NOW();

-- 研修17: 導入事例研究① 小規模店舗
INSERT INTO session_contents (
  training_id, title, key_phrase, badge, mood_options,
  story, quick_check, simulation, work, quote
) VALUES (
  17,
  '小規模店舗への提案マスター',
  '時間を作る、売上を作る',
  '{"name": "小規模店舗スペシャリスト", "icon": "store"}',
  '[{"emoji": "🏪", "label": "小規模店舗を担当"}, {"emoji": "⏰", "label": "時間の価値を伝えたい"}, {"emoji": "🎯", "label": "提案力を磨きたい"}, {"emoji": "💪", "label": "成約率を上げたい"}]',
  '{
    "part1": {
      "title": "一人で全部やる大変さ",
      "content": "在庫8台の小さな中古車店を営むAさん。仕入れ、写真撮影、広告掲載、接客、契約、納車準備...全てを一人でこなしています。「本当は接客に集中したいのに、事務作業で1日3時間も取られてしまう。ITは苦手だし、新しいシステムを覚える余裕もない...」",
      "character": "店主 Aさん",
      "emotion": "疲れている"
    },
    "part2": {
      "title": "空いた時間で売上アップ",
      "content": "「シンプルで使いやすい」という言葉を信じてSymphony販売管理を導入したAさん。広告掲載が一括でできるようになり、事務作業は1時間に短縮。「空いた2時間を接客に使えるようになって、成約率が15%上がりました。もっと早く導入すればよかった」",
      "character": "店主 Aさん",
      "emotion": "笑顔"
    }
  }',
  '{
    "question": "小規模店舗（10台以下）への提案で、最も響くメッセージは？",
    "options": [
      {"id": "a", "text": "「最新のテクノロジーです」"},
      {"id": "b", "text": "「大企業も使っています」"},
      {"id": "c", "text": "「事務作業を減らして、接客時間を増やせます」"},
      {"id": "d", "text": "「機能が100個以上あります」"}
    ],
    "correctAnswer": "c",
    "explanation": "小規模店舗は「時間がない」が最大の課題。事務作業削減→接客時間増加→売上アップというストーリーが最も響きます。"
  }',
  '{
    "scenario": "小規模店舗のオーナーから「ITは苦手で、難しそう...」と言われました。どう対応しますか？",
    "options": [
      {"id": "a", "text": "「最初は難しいですが、慣れれば大丈夫です」", "feedback": "不安を払拭できていません。具体的なサポート体制を伝えましょう。", "isCorrect": false},
      {"id": "b", "text": "「ご安心ください。Symphonyはシンプルな画面設計で、ITが苦手な方でもすぐに使いこなせます。導入時の研修と、困った時のサポート窓口もあります。同じくITが苦手だったお客様も、1週間で使いこなせるようになっています」", "feedback": "正解！具体的な安心材料（シンプルなUI、サポート、他の事例）を提示できています。", "isCorrect": true},
      {"id": "c", "text": "「では、導入は見送りましょうか」", "feedback": "お客様の課題解決を諦めてしまっています。不安を解消する説明をしましょう。", "isCorrect": false}
    ]
  }',
  '{
    "title": "小規模店舗向けROI試算",
    "description": "実際の数字を使って投資対効果を計算しましょう",
    "prompt": "以下の条件で、Symphony導入のROIを試算してください：\n\n【現状】\n・オーナー1人で運営\n・事務作業：1日3時間\n・時給換算：1,500円\n・月間営業日：20日\n\n【導入後の見込み】\n・事務作業：1日1時間に短縮\n\n計算してほしい項目：\n1. 月間削減時間\n2. 月間削減コスト（時給換算）\n3. 年間効果",
    "timeLimit": 180,
    "hints": ["削減時間 = (3時間-1時間) × 20日", "月間コスト = 削減時間 × 時給", "年間 = 月間 × 12"]
  }',
  '{"text": "小さく始めて、大きく育てる。まずは時間を作ることから。", "author": "Symphony営業格言"}'
) ON CONFLICT (training_id) DO UPDATE SET
  title = EXCLUDED.title,
  key_phrase = EXCLUDED.key_phrase,
  badge = EXCLUDED.badge,
  mood_options = EXCLUDED.mood_options,
  story = EXCLUDED.story,
  quick_check = EXCLUDED.quick_check,
  simulation = EXCLUDED.simulation,
  work = EXCLUDED.work,
  quote = EXCLUDED.quote,
  updated_at = NOW();

-- 研修18: 導入事例研究② 中規模店舗
INSERT INTO session_contents (
  training_id, title, key_phrase, badge, mood_options,
  story, quick_check, simulation, work, quote
) VALUES (
  18,
  '中規模店舗への提案マスター',
  '情報を共有し、成長を加速する',
  '{"name": "中規模店舗スペシャリスト", "icon": "building"}',
  '[{"emoji": "🏢", "label": "中規模店舗を担当"}, {"emoji": "👥", "label": "チーム連携を改善したい"}, {"emoji": "📈", "label": "成長を支援したい"}, {"emoji": "🔄", "label": "在庫回転を上げたい"}]',
  '{
    "part1": {
      "title": "チームの情報共有が課題",
      "content": "在庫40台、スタッフ7名のB店。営業3名、整備2名、事務2名の体制ですが、情報共有がうまくいきません。「あのお客様、誰が対応してたっけ？」「この車、商談中？」顧客フォロー漏れも頻発。仕入れはオークションのみで、欲しい車が見つからないことも。",
      "character": "店長 Bさん",
      "emotion": "悩んでいる"
    },
    "part2": {
      "title": "全員が同じ情報を見る",
      "content": "Symphony販売管理とワンプラを導入したB店。「誰でも顧客情報や商談状況が見られるようになり、フォロー漏れがなくなりました。ワンプラで仕入れルートも拡大し、在庫回転率は25%向上。年間売上は1.3倍に成長しました」スタッフ全員が同じ画面を見ることで、チームワークも向上。",
      "character": "店長 Bさん",
      "emotion": "満足"
    }
  }',
  '{
    "question": "中規模店舗（30〜50台）への提案で、最も効果的な訴求ポイントは？",
    "options": [
      {"id": "a", "text": "「価格が安いです」"},
      {"id": "b", "text": "「スタッフ全員で情報共有でき、在庫回転率も上がります」"},
      {"id": "c", "text": "「小規模店舗でも使えます」"},
      {"id": "d", "text": "「デザインがきれいです」"}
    ],
    "correctAnswer": "b",
    "explanation": "中規模店舗は「情報共有」と「在庫回転」が主な課題。チーム連携の改善と、ワンプラによる仕入れ・販売ルート拡大が響きます。"
  }',
  '{
    "scenario": "中規模店舗の店長から「うちはスタッフが7人いるから、全員に使い方を教えるのが大変そう」と言われました。どう対応しますか？",
    "options": [
      {"id": "a", "text": "「確かに大変ですね」", "feedback": "お客様の不安に同意するだけでは解決になりません。具体的な対策を提示しましょう。", "isCorrect": false},
      {"id": "b", "text": "「導入時に全スタッフ向けの研修を実施します。また、まずは1〜2名のキーパーソンに習熟していただき、その方から他のスタッフに広げていく方法もあります。シンプルな操作なので、1週間程度で皆さん使いこなせるようになっています」", "feedback": "正解！研修サポートと段階的な展開方法を提示できています。", "isCorrect": true},
      {"id": "c", "text": "「マニュアルを渡しますので、自分たちで学んでください」", "feedback": "サポート不足です。導入支援の手厚さをアピールしましょう。", "isCorrect": false}
    ]
  }',
  '{
    "title": "中規模店舗向けクロスセル提案",
    "description": "販売管理導入後のクロスセル提案を考えましょう",
    "prompt": "Symphony販売管理を導入済みの中規模店舗（在庫40台）に、ワンプラを追加提案するトークを作成してください：\n\n【現状の課題（ヒアリング済み）】\n・オークションだけでは欲しい車が見つからない\n・長期在庫が10台ほどある\n・仕入れコストを下げたい\n\n【提案のポイント】\n・販売管理との連携メリット\n・仕入れルート拡大\n・長期在庫の業販出品",
    "timeLimit": 240,
    "hints": ["現状の課題を確認してから提案", "連携による二重入力削減を強調", "具体的な効果を数字で示す"]
  }',
  '{"text": "成長には痛みが伴う。でもSymphonyがあれば、その痛みを最小化できる。", "author": "Symphony営業格言"}'
) ON CONFLICT (training_id) DO UPDATE SET
  title = EXCLUDED.title,
  key_phrase = EXCLUDED.key_phrase,
  badge = EXCLUDED.badge,
  mood_options = EXCLUDED.mood_options,
  story = EXCLUDED.story,
  quick_check = EXCLUDED.quick_check,
  simulation = EXCLUDED.simulation,
  work = EXCLUDED.work,
  quote = EXCLUDED.quote,
  updated_at = NOW();

-- 研修19: 導入事例研究③ 大規模・多店舗展開
INSERT INTO session_contents (
  training_id, title, key_phrase, badge, mood_options,
  story, quick_check, simulation, work, quote
) VALUES (
  19,
  '大規模・多店舗への提案マスター',
  '全店舗を、ひとつに',
  '{"name": "エンタープライズスペシャリスト", "icon": "buildings"}',
  '[{"emoji": "🏗️", "label": "大規模案件を担当"}, {"emoji": "📊", "label": "経営層に提案したい"}, {"emoji": "🔗", "label": "店舗間連携を提案したい"}, {"emoji": "🚀", "label": "大型案件を獲得したい"}]',
  '{
    "part1": {
      "title": "多店舗の壁",
      "content": "3店舗、在庫150台、スタッフ25名を抱えるC社。各店舗がバラバラにシステムを使い、本部での一元管理ができません。「A店に在庫がないのにB店にはある、でもそれが分からず機会損失」「月次の売上集計に3日かかる」経営判断のスピードが遅れがちでした。",
      "character": "本部長 Cさん",
      "emotion": "深刻"
    },
    "part2": {
      "title": "リアルタイムで全店舗を把握",
      "content": "Symphonyをグループ全店に導入したC社。全店舗の在庫・顧客・売上がリアルタイムで一元管理できるように。「店舗間で在庫を共有し、機会損失が激減。本部でのデータ分析も瞬時にでき、仕入れ戦略の精度が上がりました。グループ全体で年商20%増を達成」",
      "character": "本部長 Cさん",
      "emotion": "誇らしい"
    }
  }',
  '{
    "question": "大規模・多店舗企業への提案で、最も重要な訴求ポイントは？",
    "options": [
      {"id": "a", "text": "「使いやすいです」"},
      {"id": "b", "text": "「全店舗のデータをリアルタイムで一元管理し、経営判断を高速化できます」"},
      {"id": "c", "text": "「安いです」"},
      {"id": "d", "text": "「小さな店舗にも対応しています」"}
    ],
    "correctAnswer": "b",
    "explanation": "大規模企業は「一元管理」「経営判断のスピード」「店舗間連携」が課題。データの統合と意思決定の高速化が最大の価値です。"
  }',
  '{
    "scenario": "多店舗展開企業の経営者から「全店舗一斉に導入するのはリスクが高い」と言われました。どう対応しますか？",
    "options": [
      {"id": "a", "text": "「一斉導入の方が効果は高いですよ」", "feedback": "お客様の懸念を無視しています。段階的なアプローチを提案しましょう。", "isCorrect": false},
      {"id": "b", "text": "「おっしゃる通りです。まず1店舗でパイロット導入し、効果を検証してから他店舗に展開する方法をお勧めします。パイロット店舗で成功事例を作り、それを基に展開すればスムーズです」", "feedback": "正解！お客様の懸念を受け止め、段階的なアプローチを提案できています。", "isCorrect": true},
      {"id": "c", "text": "「では、1店舗だけの導入にしましょう」", "feedback": "全店舗導入の可能性を自ら閉ざしています。段階的な展開計画を示しましょう。", "isCorrect": false}
    ]
  }',
  '{
    "title": "大規模導入の提案書構成",
    "description": "多店舗企業への提案書の構成を考えましょう",
    "prompt": "3店舗展開の中古車販売グループに対する提案書の構成を作成してください：\n\n【顧客情報】\n・3店舗（A店40台、B店50台、C店60台）\n・スタッフ計25名\n・現状：各店舗バラバラのシステム\n\n【課題】\n・店舗間の在庫共有ができない\n・本部での売上把握に時間がかかる\n・顧客情報の引継ぎができない\n\n提案書に含めるべき項目を挙げてください。",
    "timeLimit": 300,
    "hints": ["現状課題の整理", "解決策と期待効果", "導入スケジュール（パイロット→展開）", "投資対効果（ROI）"]
  }',
  '{"text": "大きな船を動かすには、小さな舵から。パイロットで成功を証明せよ。", "author": "Symphony営業格言"}'
) ON CONFLICT (training_id) DO UPDATE SET
  title = EXCLUDED.title,
  key_phrase = EXCLUDED.key_phrase,
  badge = EXCLUDED.badge,
  mood_options = EXCLUDED.mood_options,
  story = EXCLUDED.story,
  quick_check = EXCLUDED.quick_check,
  simulation = EXCLUDED.simulation,
  work = EXCLUDED.work,
  quote = EXCLUDED.quote,
  updated_at = NOW();
