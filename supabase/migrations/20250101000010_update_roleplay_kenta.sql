-- Update Symphony series roleplay to use Kenta and Senpai format
-- Training IDs 11-22

-- Training 11: Symphony全体像
UPDATE session_contents SET roleplay = '[
  {
    "title": "Symphonyシリーズの紹介練習",
    "situation": "健太が先輩に、Symphonyシリーズの全体像を説明する練習をしている場面",
    "seniorOpening": "じゃあ健太、お客様にSymphonyシリーズを紹介するとしたら、どう説明する？",
    "dialogue": [
      {"speaker": "kenta", "line": "えっと...Symphonyは販売管理と整備請求とワンプラがあって..."},
      {"speaker": "senior", "line": "うん、それだけだとお客様に刺さらないな。3つの価値で説明してみて"},
      {"speaker": "kenta", "line": "3つの価値...売上を上げる、コストを下げる、リスクを減らす、ですね！"},
      {"speaker": "senior", "line": "そうそう！具体的にはどう説明する？"},
      {"speaker": "kenta", "line": "販売管理で顧客情報を一元管理して売上アップ、整備請求で業務効率化してコスト削減、ワンプラで仕入れ・販売のリスクを軽減します！"},
      {"speaker": "senior", "line": "いいね！お客様の課題に合わせて、どの価値を強調するか変えていこう"}
    ],
    "keyPoints": ["3つの価値（売上UP・コスト削減・リスク軽減）で説明する", "お客様の課題に合わせて強調点を変える", "製品名の羅列ではなく価値で語る"],
    "successCriteria": "製品の機能ではなく、お客様への価値で説明できるようになろう"
  }
]'::jsonb WHERE training_id = 11;

-- Training 12: Symphony販売管理
UPDATE session_contents SET roleplay = '[
  {
    "title": "販売管理の機能説明練習",
    "situation": "健太が先輩に、Symphony販売管理の主要機能を説明する練習をしている場面",
    "seniorOpening": "お客様から「販売管理って何ができるの？」と聞かれたら？",
    "dialogue": [
      {"speaker": "kenta", "line": "顧客管理、在庫管理、売上分析ができます"},
      {"speaker": "senior", "line": "機能の羅列だね。お客様の困りごとに紐づけて説明してみて"},
      {"speaker": "kenta", "line": "えーと...お客様情報がバラバラで困っていませんか？販売管理なら一元管理できます"},
      {"speaker": "senior", "line": "いいね！もう一歩踏み込んで、それによってどうなる？"},
      {"speaker": "kenta", "line": "過去の購入履歴がすぐ見れるので、お客様に合った提案ができて、リピート率が上がります！"},
      {"speaker": "senior", "line": "完璧！課題→解決策→効果の流れで説明できてるね"}
    ],
    "keyPoints": ["機能ではなく課題解決で説明する", "課題→解決策→効果の流れを意識", "具体的な効果を伝える"],
    "successCriteria": "お客様の課題に紐づけて機能を説明できるようになろう"
  }
]'::jsonb WHERE training_id = 12;

-- Training 13: Symphony整備請求
UPDATE session_contents SET roleplay = '[
  {
    "title": "整備請求の価値説明練習",
    "situation": "健太が先輩に、Symphony整備請求を整備工場に提案する練習をしている場面",
    "seniorOpening": "整備工場のお客様に整備請求を提案するなら、何から話す？",
    "dialogue": [
      {"speaker": "kenta", "line": "整備請求は見積書や請求書が簡単に作れます"},
      {"speaker": "senior", "line": "それは機能だね。整備工場さんの困りごとは何だと思う？"},
      {"speaker": "kenta", "line": "うーん...手書きで時間がかかる？計算ミスがある？"},
      {"speaker": "senior", "line": "そう！あと車検時期の管理も大変なんだよ。それを踏まえて説明してみて"},
      {"speaker": "kenta", "line": "車検時期を自動管理して、時期が近いお客様にDMを送れます。整備の予約が増えて売上アップにつながります！"},
      {"speaker": "senior", "line": "いいね！販売管理との連携メリットも伝えられるともっといいよ"}
    ],
    "keyPoints": ["整備工場特有の課題を理解する", "車検管理→DM→予約増→売上UPの流れ", "販売管理との連携価値も伝える"],
    "successCriteria": "整備工場の業務フローを理解した提案ができるようになろう"
  }
]'::jsonb WHERE training_id = 13;

-- Training 14: シンフォニーワンプラ
UPDATE session_contents SET roleplay = '[
  {
    "title": "ワンプラの使い方説明練習",
    "situation": "健太が先輩に、シンフォニーワンプラの2つの使い方を説明する練習をしている場面",
    "seniorOpening": "ワンプラの2つの使い方、説明してみて",
    "dialogue": [
      {"speaker": "kenta", "line": "仕入れと業販ができます！"},
      {"speaker": "senior", "line": "もう少し具体的に。どんなお客様にどっちを勧める？"},
      {"speaker": "kenta", "line": "在庫を増やしたいお客様には仕入れ、在庫を減らしたいお客様には業販ですね"},
      {"speaker": "senior", "line": "そうそう！手数料体系は説明できる？"},
      {"speaker": "kenta", "line": "仕入れは落札料がかかって、業販は出品成約料がかかります"},
      {"speaker": "senior", "line": "いいね！手数料を払っても得になる理由も説明できるといいよ"}
    ],
    "keyPoints": ["仕入れ＝在庫を増やす、業販＝在庫を減らす", "手数料体系（出品成約料・落札料）を正確に説明", "手数料以上のメリットを伝える"],
    "successCriteria": "お客様の状況に合わせて最適な使い方を提案できるようになろう"
  }
]'::jsonb WHERE training_id = 14;

-- Training 15: ワンプラの競合比較
UPDATE session_contents SET roleplay = '[
  {
    "title": "競合との差別化説明練習",
    "situation": "健太が先輩に、ワンプラと競合サービスの違いを説明する練習をしている場面",
    "seniorOpening": "お客様から「他のオークションと何が違うの？」と聞かれたら？",
    "dialogue": [
      {"speaker": "kenta", "line": "えーと...手数料が安い...ですか？"},
      {"speaker": "senior", "line": "それだけだと弱いな。ワンプラならではの強みは？"},
      {"speaker": "kenta", "line": "Symphony販売管理と連携できて、顧客データと紐づけられます！"},
      {"speaker": "senior", "line": "いいね！それによってお客様はどう嬉しい？"},
      {"speaker": "kenta", "line": "仕入れた車を誰に売るか、過去の購入履歴から最適なお客様がすぐわかります"},
      {"speaker": "senior", "line": "完璧！システム連携による業務効率化が最大の差別化ポイントだね"}
    ],
    "keyPoints": ["単体機能ではなくシステム連携が強み", "データ連携による業務効率化", "仕入れから販売までのワンストップ"],
    "successCriteria": "競合との明確な差別化ポイントを説明できるようになろう"
  }
]'::jsonb WHERE training_id = 15;

-- Training 16: 製品間連携の価値
UPDATE session_contents SET roleplay = '[
  {
    "title": "クロスセル提案練習",
    "situation": "健太が先輩に、複数製品の連携価値を説明するクロスセル提案の練習をしている場面",
    "seniorOpening": "販売管理を使っているお客様に、整備請求を追加提案するなら？",
    "dialogue": [
      {"speaker": "kenta", "line": "整備請求も便利ですよ、って言います"},
      {"speaker": "senior", "line": "それだと「今は必要ない」で終わっちゃう。連携のメリットは？"},
      {"speaker": "kenta", "line": "販売管理の顧客データと整備請求が連携して...二重入力が不要になります！"},
      {"speaker": "senior", "line": "いいね！もう一つ、顧客フォローの観点では？"},
      {"speaker": "kenta", "line": "販売したお客様の車検時期が自動で管理されて、フォローのタイミングを逃しません！"},
      {"speaker": "senior", "line": "そう！売って終わりじゃなく、長期的な関係構築ができることを伝えよう"}
    ],
    "keyPoints": ["二重入力不要で業務効率化", "顧客フォローの自動化", "長期的な顧客関係構築"],
    "successCriteria": "単品ではなく連携価値でクロスセル提案ができるようになろう"
  }
]'::jsonb WHERE training_id = 16;

-- Training 17: 導入事例（小規模店舗）
UPDATE session_contents SET roleplay = '[
  {
    "title": "小規模店舗への提案練習",
    "situation": "健太が先輩に、小規模店舗（従業員3名）への提案を練習している場面",
    "seniorOpening": "小規模店舗のお客様が「うちは小さいから不要」と言ったら？",
    "dialogue": [
      {"speaker": "kenta", "line": "うーん...小規模だからこそ効率化が大事、とか？"},
      {"speaker": "senior", "line": "そうそう！具体的な事例で説明してみて"},
      {"speaker": "kenta", "line": "3名の店舗様が導入して、月に10時間の事務作業を削減できた事例があります"},
      {"speaker": "senior", "line": "いいね！10時間あったら何ができる？"},
      {"speaker": "kenta", "line": "その時間でお客様対応や営業活動ができます。実際にその店舗様は月2台販売が増えました！"},
      {"speaker": "senior", "line": "完璧！時間削減→本業集中→売上アップの流れで説明できてるね"}
    ],
    "keyPoints": ["小規模だからこそ効率化が重要", "具体的な数字（時間・台数）で説明", "時間削減→売上アップのストーリー"],
    "successCriteria": "小規模店舗の状況に合わせた事例提案ができるようになろう"
  }
]'::jsonb WHERE training_id = 17;

-- Training 18: 導入事例（中規模店舗）
UPDATE session_contents SET roleplay = '[
  {
    "title": "中規模店舗への提案練習",
    "situation": "健太が先輩に、中規模店舗（従業員10名）への提案を練習している場面",
    "seniorOpening": "中規模店舗でよくある課題って何だと思う？",
    "dialogue": [
      {"speaker": "kenta", "line": "スタッフ間の情報共有...ですか？"},
      {"speaker": "senior", "line": "そう！人が増えると情報がバラバラになりがち。どう解決する？"},
      {"speaker": "kenta", "line": "販売管理で顧客情報を一元管理すれば、誰でも同じ情報を見られます"},
      {"speaker": "senior", "line": "いいね！導入事例ではどんな効果があった？"},
      {"speaker": "kenta", "line": "10名の店舗様で、引き継ぎミスがゼロになって、顧客満足度が20%向上しました！"},
      {"speaker": "senior", "line": "いいね！中規模は情報共有と属人化防止がキーワードだよ"}
    ],
    "keyPoints": ["情報共有の課題を解決", "属人化を防いで誰でも対応可能に", "引き継ぎミス削減→顧客満足度向上"],
    "successCriteria": "中規模店舗の組織課題に合わせた提案ができるようになろう"
  }
]'::jsonb WHERE training_id = 18;

-- Training 19: 導入事例（大規模・多店舗）
UPDATE session_contents SET roleplay = '[
  {
    "title": "大規模・多店舗への提案練習",
    "situation": "健太が先輩に、大規模・多店舗（5店舗展開）への提案を練習している場面",
    "seniorOpening": "多店舗展開のお客様には何を提案する？",
    "dialogue": [
      {"speaker": "kenta", "line": "各店舗でSymphonyを使ってもらう...？"},
      {"speaker": "senior", "line": "それだと各店舗バラバラだね。多店舗ならではの価値は？"},
      {"speaker": "kenta", "line": "あ、本部で全店舗のデータを一元管理できます！"},
      {"speaker": "senior", "line": "そう！具体的にはどんなことができる？"},
      {"speaker": "kenta", "line": "全店舗の在庫状況をリアルタイムで把握して、店舗間で在庫を融通できます。A店で売れない車をB店で売れる！"},
      {"speaker": "senior", "line": "いいね！スケールメリットを活かした提案ができてるよ"}
    ],
    "keyPoints": ["本部での一元管理", "店舗間の在庫融通", "全店舗データの分析・活用"],
    "successCriteria": "多店舗展開のスケールメリットを活かした提案ができるようになろう"
  }
]'::jsonb WHERE training_id = 19;

-- Training 20: ROI計算の実践
UPDATE session_contents SET roleplay = '[
  {
    "title": "ROI説明練習",
    "situation": "健太が先輩に、投資対効果（ROI）の説明練習をしている場面",
    "seniorOpening": "お客様から「費用対効果は？」と聞かれたら、どう計算する？",
    "dialogue": [
      {"speaker": "kenta", "line": "月額費用と削減できる時間で計算します..."},
      {"speaker": "senior", "line": "いいね！具体的な数字で説明してみて"},
      {"speaker": "kenta", "line": "月額3万円で、事務作業が月10時間削減。時給2000円なら2万円の削減です"},
      {"speaker": "senior", "line": "それだとマイナス1万円だね。他に効果は？"},
      {"speaker": "kenta", "line": "あ、売上アップ効果もあります！顧客フォローで月1台増えれば、粗利10万円で大幅プラスです！"},
      {"speaker": "senior", "line": "そう！コスト削減だけでなく売上効果も含めて計算しよう"}
    ],
    "keyPoints": ["コスト削減効果と売上アップ効果の両面で計算", "具体的な数字で説明する", "お客様の状況に合わせて試算"],
    "successCriteria": "費用対効果を数字で説明できるようになろう"
  }
]'::jsonb WHERE training_id = 20;

-- Training 21: よくある質問（FAQ）
UPDATE session_contents SET roleplay = '[
  {
    "title": "FAQ対応練習",
    "situation": "健太が先輩に、よくある質問への回答練習をしている場面",
    "seniorOpening": "お客様から「他社と比べて高いんじゃない？」と言われたら？",
    "dialogue": [
      {"speaker": "kenta", "line": "うーん...機能が充実しているので..."},
      {"speaker": "senior", "line": "それだと説得力がないね。価格の根拠を説明してみて"},
      {"speaker": "kenta", "line": "サポート体制が充実していて、導入後も安心して使えます"},
      {"speaker": "senior", "line": "いいね！もう一つ、ROIの観点では？"},
      {"speaker": "kenta", "line": "初期費用は他社より高いですが、月々の効果を考えると3ヶ月で元が取れます！"},
      {"speaker": "senior", "line": "完璧！価格ではなく投資として捉えてもらおう"}
    ],
    "keyPoints": ["価格ではなく価値で説明", "サポート体制の充実", "投資回収期間を具体的に提示"],
    "successCriteria": "価格への不安を投資価値で解消できるようになろう"
  }
]'::jsonb WHERE training_id = 21;

-- Training 22: デモンストレーションの技術
UPDATE session_contents SET roleplay = '[
  {
    "title": "デモ実施練習",
    "situation": "健太が先輩に、デモンストレーションの流れを練習している場面",
    "seniorOpening": "デモを始める前に、まず何をする？",
    "dialogue": [
      {"speaker": "kenta", "line": "画面を見せながら機能を説明します"},
      {"speaker": "senior", "line": "いきなり機能説明は NG。まず何を確認する？"},
      {"speaker": "kenta", "line": "お客様の課題や、今日見たいポイントを確認します！"},
      {"speaker": "senior", "line": "そう！それを踏まえてデモのストーリーを組み立てる。流れは？"},
      {"speaker": "kenta", "line": "課題確認→解決策のデモ→効果の説明→質疑応答、ですね"},
      {"speaker": "senior", "line": "完璧！お客様の課題に沿ったストーリーで見せると刺さるよ"}
    ],
    "keyPoints": ["デモ前に課題・ニーズを確認", "お客様の課題に沿ったストーリー構成", "機能説明ではなく課題解決のデモ"],
    "successCriteria": "お客様に刺さるデモストーリーを組み立てられるようになろう"
  }
]'::jsonb WHERE training_id = 22;
