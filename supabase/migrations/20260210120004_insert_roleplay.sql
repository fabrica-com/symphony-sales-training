-- Symphonyシリーズ（研修11〜22）にロールプレイデータを追加

-- 研修11: Symphonyシリーズ全体像
UPDATE session_contents 
SET roleplay = '[
  {
    "title": "初回訪問での製品紹介",
    "situation": "新規開拓で訪問した中古車販売店。店長との初回面談で、Symphonyシリーズを紹介する場面です。",
    "customerProfile": "従業員5名の中古車販売店。現在は紙とExcelで管理。業務効率化に興味あり。",
    "customerOpening": "うちは小さい店だから、大げさなシステムは必要ないと思うんだけど...",
    "dialogue": [
      {"speaker": "sales", "line": "おっしゃる通り、規模に合ったものが大切ですね。実は当社のSymphonyは、御社のような店舗様にこそ最適なんです。", "hint": "否定せず、共感から入る"},
      {"speaker": "customer", "line": "へえ、どういうこと？大手向けじゃないの？"},
      {"speaker": "sales", "line": "いえ、むしろ5名規模の店舗様に一番お喜びいただいています。必要な機能だけ選べて、月々の費用も抑えられます。", "hint": "具体的な規模感を示す"},
      {"speaker": "customer", "line": "それなら少し話を聞いてみようかな。"}
    ],
    "keyPoints": ["顧客の懸念に共感してから提案", "規模に合った提案ができることを強調", "コスト面のメリットを伝える"],
    "successCriteria": "顧客の警戒心を解き、詳しい説明を聞いてもらえる状態を作れました"
  }
]'::jsonb
WHERE training_id = 11;

-- 研修12: Symphony販売管理
UPDATE session_contents 
SET roleplay = '[
  {
    "title": "在庫管理の課題を深掘り",
    "situation": "商談2回目。前回の訪問で在庫管理に課題があることがわかりました。具体的な困りごとを聞き出します。",
    "customerProfile": "在庫30台の中古車販売店。在庫回転率の把握ができていない。",
    "customerOpening": "在庫管理は確かに大変だけど、今のやり方でなんとかなってるよ。",
    "dialogue": [
      {"speaker": "sales", "line": "なるほど、今のやり方で回せているんですね。ちなみに、今月の在庫回転率はどのくらいですか？", "hint": "具体的な数字を質問"},
      {"speaker": "customer", "line": "えーと...正確にはわからないな。感覚的には2ヶ月くらい？"},
      {"speaker": "sales", "line": "感覚で把握されてるんですね。もし正確な数字がすぐわかったら、どんなことに活かせそうですか？", "hint": "課題を自覚させる質問"},
      {"speaker": "customer", "line": "そうだな...仕入れの判断がもっと的確になるかも。"},
      {"speaker": "sales", "line": "Symphony販売管理なら、その数字がリアルタイムで見えます。仕入れの意思決定にすぐ活かせますよ。", "hint": "解決策を提示"}
    ],
    "keyPoints": ["現状を否定せず質問で課題を引き出す", "数字で把握できていない点を明確化", "解決後のメリットを具体的に伝える"],
    "successCriteria": "顧客自身が課題を認識し、解決策に興味を持ってもらえました"
  }
]'::jsonb
WHERE training_id = 12;

-- 研修13: Symphony整備請求
UPDATE session_contents 
SET roleplay = '[
  {
    "title": "整備収益アップの提案",
    "situation": "整備工場併設の中古車販売店。整備売上を伸ばしたいという相談を受けています。",
    "customerProfile": "販売と整備を行う店舗。整備の売上管理が曖昧で、収益性が見えていない。",
    "customerOpening": "整備の売上を伸ばしたいんだけど、何から手をつければいいかわからなくて。",
    "dialogue": [
      {"speaker": "sales", "line": "整備売上を伸ばしたいとのこと、具体的にはどのくらいを目指されていますか？", "hint": "目標を明確にする"},
      {"speaker": "customer", "line": "今月200万くらいだから、300万くらいにはしたいな。"},
      {"speaker": "sales", "line": "50%アップですね。現在の整備1件あたりの平均単価は把握されていますか？", "hint": "現状の数字を確認"},
      {"speaker": "customer", "line": "うーん、たぶん3万円くらいだと思うけど..."},
      {"speaker": "sales", "line": "Symphony整備請求を使うと、単価や作業別の収益が一目でわかります。まずは現状を可視化するところから始めませんか？", "hint": "提案につなげる"}
    ],
    "keyPoints": ["目標数字を具体化させる", "現状把握の重要性を伝える", "可視化から改善が始まることを理解してもらう"],
    "successCriteria": "売上アップの第一歩として、現状把握の重要性を理解してもらえました"
  }
]'::jsonb
WHERE training_id = 13;

-- 研修14: シンフォニーワンプラ
UPDATE session_contents 
SET roleplay = '[
  {
    "title": "業販仕入れの提案",
    "situation": "仕入れルートを増やしたいという相談。オークション以外の選択肢としてワンプラを提案します。",
    "customerProfile": "月10台仕入れの中古車販売店。オークション仕入れがメインだが、競争が激しい。",
    "customerOpening": "最近オークションで欲しい車がなかなか落とせなくてね。",
    "dialogue": [
      {"speaker": "sales", "line": "オークションの競争が激しくなっているんですね。欲しい車種は決まっているのですか？", "hint": "具体的なニーズを確認"},
      {"speaker": "customer", "line": "軽自動車とコンパクトカーが売れ筋なんだけど、相場が上がってて。"},
      {"speaker": "sales", "line": "実は、ワンプラという業販プラットフォームをご存知ですか？同業者間で直接取引できるんです。", "hint": "新しい選択肢を提示"},
      {"speaker": "customer", "line": "業販？手数料とか高いんじゃないの？"},
      {"speaker": "sales", "line": "出品成約料と落札料だけで、月額費用はかかりません。オークションより安く仕入れられるケースも多いですよ。", "hint": "コストメリットを説明"}
    ],
    "keyPoints": ["現状の課題を具体化する", "新しい選択肢として提案", "手数料体系をシンプルに説明"],
    "successCriteria": "ワンプラという新しい仕入れ手段に興味を持ってもらえました"
  }
]'::jsonb
WHERE training_id = 14;

-- 研修15: ワンプラの競合比較
UPDATE session_contents 
SET roleplay = '[
  {
    "title": "競合サービスとの違いを説明",
    "situation": "他社の業販サービスも検討していると言われた場面。ワンプラの強みを伝えます。",
    "customerProfile": "複数のサービスを比較検討中。コストと使いやすさを重視。",
    "customerOpening": "他社のサービスも見てるんだけど、正直どれがいいかわからなくて。",
    "dialogue": [
      {"speaker": "sales", "line": "比較検討されているんですね。特にどの点を重視されていますか？", "hint": "判断基準を確認"},
      {"speaker": "customer", "line": "やっぱりコストかな。あと、使いやすさも大事。"},
      {"speaker": "sales", "line": "コストでいうと、ワンプラは月額無料で、取引時の手数料のみです。他社は月額がかかるところが多いですよね。", "hint": "コスト優位性を説明"},
      {"speaker": "customer", "line": "確かに月額は気になってた。使い勝手はどう？"},
      {"speaker": "sales", "line": "スマホアプリで出品も検索も数タップでできます。実際に画面をお見せしましょうか？", "hint": "デモの提案"}
    ],
    "keyPoints": ["顧客の判断基準を確認", "競合との違いを明確に", "デモで体験してもらう提案"],
    "successCriteria": "競合との違いを理解し、デモを見てもらえることになりました"
  }
]'::jsonb
WHERE training_id = 15;

-- 研修16: 製品間連携の価値
UPDATE session_contents 
SET roleplay = '[
  {
    "title": "クロスセルの提案",
    "situation": "Symphony販売管理を導入済みの顧客。整備請求の追加導入を提案します。",
    "customerProfile": "販売管理を1年利用中。整備も行っているが、別システムで管理。",
    "customerOpening": "販売管理は便利に使ってるよ。整備の方も同じようにできないの？",
    "dialogue": [
      {"speaker": "sales", "line": "ありがとうございます！実は整備請求も連携できるんです。今、整備はどのように管理されていますか？", "hint": "現状を確認"},
      {"speaker": "customer", "line": "別の会計ソフトに手入力してる。二度手間なんだよね。"},
      {"speaker": "sales", "line": "それは大変ですね。Symphony整備請求なら、販売管理と顧客情報が連携するので、入力は1回で済みます。", "hint": "連携メリットを説明"},
      {"speaker": "customer", "line": "顧客情報が連携するのはいいね。"},
      {"speaker": "sales", "line": "車検の案内も自動でできるので、整備の来店促進にもつながりますよ。", "hint": "追加のメリット"}
    ],
    "keyPoints": ["既存導入への感謝を伝える", "二度手間の解消を提案", "連携による追加価値を説明"],
    "successCriteria": "製品連携のメリットを理解し、追加導入を前向きに検討してもらえました"
  }
]'::jsonb
WHERE training_id = 16;

-- 研修17: 導入事例研究 小規模店舗
UPDATE session_contents 
SET roleplay = '[
  {
    "title": "小規模店舗への導入提案",
    "situation": "従業員3名の小さな中古車販売店。ITに不安を感じている店長への提案です。",
    "customerProfile": "家族経営の小規模店。パソコン操作に自信がない。コストを重視。",
    "customerOpening": "うちみたいな小さい店でも使いこなせるのかな...パソコン苦手なんだよね。",
    "dialogue": [
      {"speaker": "sales", "line": "パソコンが苦手とのこと、ご安心ください。スマホで操作できる機能も多いんです。", "hint": "不安を解消"},
      {"speaker": "customer", "line": "スマホならまだ使えるかも。でも高いんでしょ？"},
      {"speaker": "sales", "line": "実は同じような規模のA店様では、月額費用は〇〇円から始められました。紙代やFAX代が減って、実質負担は軽くなったそうです。", "hint": "事例を交えて説明"},
      {"speaker": "customer", "line": "へえ、そのお店はうまくいってるの？"},
      {"speaker": "sales", "line": "はい、導入6ヶ月で事務作業が半分になり、その分接客に集中できるようになったと喜ばれています。", "hint": "成果を具体的に"}
    ],
    "keyPoints": ["IT不安に寄り添う", "コストを具体的に示す", "同規模の成功事例を紹介"],
    "successCriteria": "IT不安とコスト不安を解消し、前向きに検討してもらえました"
  }
]'::jsonb
WHERE training_id = 17;

-- 研修18: 導入事例研究 中規模店舗
UPDATE session_contents 
SET roleplay = '[
  {
    "title": "中規模店舗の情報共有課題",
    "situation": "従業員10名の中古車販売店。店舗間の情報共有に課題を感じています。",
    "customerProfile": "本店と支店の2拠点。スタッフ間の情報共有がうまくいかず、機会損失が発生。",
    "customerOpening": "支店のスタッフが本店の在庫を把握できてなくて、お客さんを逃がしちゃうことがあるんだよね。",
    "dialogue": [
      {"speaker": "sales", "line": "それは大きな機会損失ですね。具体的にはどのくらいの頻度で起きていますか？", "hint": "問題を数値化"},
      {"speaker": "customer", "line": "月に2〜3件はあると思う。金額にすると結構な額だよ。"},
      {"speaker": "sales", "line": "月2〜3件ですと、年間で30件近く...平均単価が100万円なら、3000万円の機会損失ですね。", "hint": "インパクトを可視化"},
      {"speaker": "customer", "line": "そう言われると大きいな...何か解決策ある？"},
      {"speaker": "sales", "line": "Symphonyなら両店舗の在庫がリアルタイムで共有できます。支店でもすぐに本店の車を案内できますよ。", "hint": "解決策を提示"}
    ],
    "keyPoints": ["機会損失を数値化する", "年間インパクトを計算", "解決策をシンプルに提示"],
    "successCriteria": "課題の大きさを認識し、解決策に強い関心を持ってもらえました"
  }
]'::jsonb
WHERE training_id = 18;

-- 研修19: 導入事例研究 大規模・多店舗
UPDATE session_contents 
SET roleplay = '[
  {
    "title": "大規模店舗への段階導入提案",
    "situation": "5店舗展開の大規模ディーラー。全社導入は不安があるため、段階的な導入を提案します。",
    "customerProfile": "従業員50名、5店舗展開。システム刷新を検討中だが、リスクを懸念。",
    "customerOpening": "全店舗一斉に変えるのはリスクが高いと思ってて、なかなか踏み出せないんだ。",
    "dialogue": [
      {"speaker": "sales", "line": "おっしゃる通り、一斉導入はリスクがありますね。実は、パイロット導入という方法がおすすめです。", "hint": "懸念に共感"},
      {"speaker": "customer", "line": "パイロット導入？どういうこと？"},
      {"speaker": "sales", "line": "まず1店舗で3ヶ月ほど試していただき、効果を確認してから他店舗に展開する方法です。", "hint": "段階導入を説明"},
      {"speaker": "customer", "line": "それなら試しやすいかも。どの店舗から始めるのがいい？"},
      {"speaker": "sales", "line": "課題が一番明確な店舗か、ITリテラシーの高いスタッフがいる店舗がおすすめです。成功事例を作りやすいので。", "hint": "具体的なアドバイス"}
    ],
    "keyPoints": ["リスク懸念に共感する", "段階導入のメリットを説明", "成功しやすい条件をアドバイス"],
    "successCriteria": "パイロット導入という現実的な選択肢を提案し、前向きな検討につながりました"
  }
]'::jsonb
WHERE training_id = 19;

-- 研修20: ROI計算の実践
UPDATE session_contents 
SET roleplay = '[
  {
    "title": "ROIを使った投資説得",
    "situation": "社長への最終プレゼン。投資対効果を数字で示して、決裁を得る場面です。",
    "customerProfile": "導入を検討中の中古車販売店社長。数字に基づいた判断を重視する。",
    "customerOpening": "導入したい気持ちはあるんだけど、本当に元が取れるのか不安でね。",
    "dialogue": [
      {"speaker": "sales", "line": "投資対効果、重要ですよね。前回のヒアリングを元に、御社のROIを計算してきました。", "hint": "準備してきたことを伝える"},
      {"speaker": "customer", "line": "おお、それは助かる。見せてもらえる？"},
      {"speaker": "sales", "line": "現在の業務コストが月50万円、導入後は30万円に削減できる見込みです。月20万円の削減で、年間240万円のコスト削減になります。", "hint": "削減効果を具体的に"},
      {"speaker": "customer", "line": "導入費用はいくらだっけ？"},
      {"speaker": "sales", "line": "初期費用100万円、月額5万円で年間60万円。つまり初年度で80万円、2年目以降は年間180万円のプラスになります。", "hint": "投資回収を明確に"}
    ],
    "keyPoints": ["事前に計算して準備する", "コスト削減を具体的な数字で", "投資回収期間を明確に示す"],
    "successCriteria": "数字に基づいた説得で、投資対効果を納得してもらえました"
  }
]'::jsonb
WHERE training_id = 20;

-- 研修21: よくある質問（FAQ）
UPDATE session_contents 
SET roleplay = '[
  {
    "title": "価格交渉への対応",
    "situation": "商談の終盤で、値引き交渉を受けた場面。価値を伝えながら対応します。",
    "customerProfile": "導入を決めかけているが、最後に値引きを求めてきた顧客。",
    "customerOpening": "導入したいんだけど、もう少し安くならない？他社はもっと安いって聞いたんだけど。",
    "dialogue": [
      {"speaker": "sales", "line": "ご検討ありがとうございます。他社との比較ですが、具体的にどのサービスと比べていらっしゃいますか？", "hint": "具体的に確認"},
      {"speaker": "customer", "line": "○○っていうサービス。月額が半分くらいらしいよ。"},
      {"speaker": "sales", "line": "○○様ですね。機能面では、サポート体制が大きく異なります。当社は導入後も専任担当がつきます。", "hint": "差別化ポイントを説明"},
      {"speaker": "customer", "line": "サポートはいいんだけど、やっぱり価格がね..."},
      {"speaker": "sales", "line": "では、初年度の支払いを分割にするプランをご提案できます。月々の負担を軽くしながら始められますよ。", "hint": "代替案を提示"}
    ],
    "keyPoints": ["競合を具体的に確認する", "価格以外の価値を伝える", "値引きではなく条件変更を提案"],
    "successCriteria": "単純な値引きではなく、価値と条件で納得してもらえました"
  }
]'::jsonb
WHERE training_id = 21;

-- 研修22: デモンストレーションの技術
UPDATE session_contents 
SET roleplay = '[
  {
    "title": "効果的なデモの実施",
    "situation": "初めてのデモを実施する場面。顧客の関心を引きながら操作を見せます。",
    "customerProfile": "システム導入を検討中の店長。実際の画面を見て判断したいと考えている。",
    "customerOpening": "話はわかったから、実際の画面を見せてもらえる？",
    "dialogue": [
      {"speaker": "sales", "line": "もちろんです！まず、御社の課題だった在庫管理の画面からお見せしますね。", "hint": "課題に紐づけて開始"},
      {"speaker": "customer", "line": "おお、これが管理画面か。"},
      {"speaker": "sales", "line": "はい、ここで在庫一覧が見えます。御社の場合、30台の在庫がこのように表示されます。気になる車をタップすると..."},
      {"speaker": "customer", "line": "詳細が出てくるのか。写真も見れるんだね。"},
      {"speaker": "sales", "line": "この画面、スタッフの方が一番よく使う画面です。実際に触ってみますか？", "hint": "体験を促す"},
      {"speaker": "customer", "line": "いいの？じゃあちょっと触らせて。"}
    ],
    "keyPoints": ["顧客の課題に紐づけてデモを開始", "実際の利用シーンを想像させる", "触ってもらう機会を作る"],
    "successCriteria": "デモを通じて製品の価値を体感してもらい、導入イメージを持ってもらえました"
  }
]'::jsonb
WHERE training_id = 22;
