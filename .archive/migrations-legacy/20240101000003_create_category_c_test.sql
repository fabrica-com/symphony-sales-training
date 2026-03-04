-- カテゴリC（業界知識：中古車ビジネス）の総合テストを作成
-- 制限時間: 30分

-- まず既存のカテゴリAの時間を30分に更新（カテゴリAのテストが存在する場合のみ）
UPDATE category_tests
SET time_limit = 30
WHERE category_id = 'A' AND EXISTS (SELECT 1 FROM training_categories WHERE id = 'A');

-- カテゴリCのテストを作成（カテゴリCが存在する場合のみ）
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM training_categories WHERE id = 'C') THEN
    INSERT INTO category_tests (category_id, category_name, total_questions, passing_score, time_limit)
    VALUES ('C', '業界知識：中古車ビジネス', 20, 80, 30)
    ON CONFLICT (category_id) DO UPDATE SET
      category_name = EXCLUDED.category_name,
      total_questions = EXCLUDED.total_questions,
      passing_score = EXCLUDED.passing_score,
      time_limit = EXCLUDED.time_limit;
  END IF;
END $$;

-- テストIDを取得して問題を挿入（カテゴリCが存在する場合のみ）
DO $$
DECLARE
  test_id INTEGER;
BEGIN
  -- カテゴリCが存在する場合のみテストIDを取得
  IF EXISTS (SELECT 1 FROM training_categories WHERE id = 'C') THEN
    SELECT id INTO test_id FROM category_tests WHERE category_id = 'C';
    
    -- test_idが存在する場合のみ問題を挿入
    IF test_id IS NOT NULL THEN
      -- 既存の問題を削除
      DELETE FROM category_test_questions WHERE category_test_id = test_id;
  
  -- 問題1: 中古車流通の全体像（研修23）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 1, 
    '日本の中古車市場の規模について正しいのはどれか？',
    '["新車市場と同程度の約4兆円規模である", "新車市場を上回る約7兆円規模である", "新車市場の半分程度の約2兆円規模である", "新車市場の2倍以上の約10兆円規模である"]',
    1,
    '日本の中古車市場は約7兆円規模で、新車市場（約4兆円）を大きく上回っています。',
    '研修23: 中古車流通の全体像');

  -- 問題2: 中古車流通の全体像（研修23）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 2, 
    '中古車の主な仕入れ先として最も取扱量が多いのはどれか？',
    '["個人間売買による直接買取", "新車ディーラーの下取り車", "オートオークション（業者間取引）", "海外からの逆輸入車"]',
    2,
    '中古車の仕入れ先として最も多いのはオートオークション（AA）で、業者間取引の中心となっています。',
    '研修23: 中古車流通の全体像');

  -- 問題3: 仕入れ構造の詳細分析（研修24）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 3, 
    'オートオークション（AA）の特徴として正しいのはどれか？',
    '["一般消費者も自由に参加できる", "古物商許可があれば参加可能である", "落札手数料は売り手のみが負担する", "出品された車両は必ず落札される"]',
    1,
    'AAは古物商許可を持つ業者のみが参加できる業者間市場です。買い手・売り手双方に手数料がかかります。',
    '研修24: 仕入れ構造の詳細分析');

  -- 問題4: 仕入れ構造の詳細分析（研修24）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 4, 
    '下取りと買取の違いについて正しいのはどれか？',
    '["下取りは新車購入が条件となる取引である", "買取は新車ディーラーのみが行える", "下取りの方が査定額が高くなる傾向がある", "買取は車検が残っていないとできない"]',
    0,
    '下取りは新車購入時に現在の車を引き取る取引で、新車購入が前提となります。買取は車両のみの取引です。',
    '研修24: 仕入れ構造の詳細分析');

  -- 問題5: 在庫から販売までのプロセス（研修25）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 5, 
    '中古車販売における「商品化」に含まれないのはどれか？',
    '["内外装のクリーニング", "点検整備と消耗品交換", "販売価格の設定と値付け", "ナンバープレートの取得"]',
    3,
    'ナンバープレートの取得は販売後の登録業務であり、商品化（仕入れ後の車両を販売可能な状態にする作業）には含まれません。',
    '研修25: 在庫から販売までのプロセス');

  -- 問題6: 在庫から販売までのプロセス（研修25）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 6, 
    '中古車の在庫回転率について正しいのはどれか？',
    '["回転率が高いほど資金効率が悪い", "一般的に45〜60日が目安とされる", "高額車ほど回転率を高くすべきである", "回転率は売上高で計算される"]',
    1,
    '在庫回転率は資金効率を示す指標で、一般的に45〜60日が適正とされています。回転率が高いほど資金効率は良くなります。',
    '研修25: 在庫から販売までのプロセス');

  -- 問題7: 流通における課題と変革（研修26）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 7, 
    '中古車業界における情報の非対称性とは何を指すか？',
    '["店舗間で価格情報が共有されないこと", "売り手と買い手で車の状態に関する情報量が異なること", "オークション結果が非公開であること", "整備記録が電子化されていないこと"]',
    1,
    '情報の非対称性とは、売り手（業者）が車の状態を詳しく知っている一方、買い手（消費者）は限られた情報しか持たない状況を指します。',
    '研修26: 流通における課題と変革');

  -- 問題8: 流通における課題と変革（研修26）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 8, 
    '中古車流通のDX化がもたらす変化として正しいのはどれか？',
    '["対面販売の重要性が増している", "オンライン商談や非対面取引が増加している", "紙の書類手続きが増えている", "仕入れ先がオークションに限定されている"]',
    1,
    'DX化により、オンライン商談、バーチャル内覧、電子契約など非対面での取引が増加しています。',
    '研修26: 流通における課題と変革');

  -- 問題9: 販売店の類型と特徴（研修27）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 9, 
    'フランチャイズ系中古車販売店の特徴として正しいのはどれか？',
    '["独自のブランドで自由に経営できる", "本部のブランドとノウハウを活用できる", "仕入れは全て本部が一括で行う", "加盟金や月額費用は発生しない"]',
    1,
    'フランチャイズ系は本部のブランド力とノウハウを活用できますが、加盟金やロイヤリティなどの費用が発生します。',
    '研修27: 販売店の類型と特徴');

  -- 問題10: 販売店の類型と特徴（研修27）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 10, 
    'ディーラー系中古車販売店（認定中古車店）の強みはどれか？',
    '["価格が最も安い傾向にある", "メーカー保証や品質基準がある", "どのメーカーの車も取り扱える", "即日納車が可能である"]',
    1,
    'ディーラー系は自社ブランドの車両を中心に、メーカー保証や厳格な品質基準を強みとしています。',
    '研修27: 販売店の類型と特徴');

  -- 問題11: 経営課題の類型別分析（研修28）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 11, 
    '中古車販売店の主な収益源として正しくないのはどれか？',
    '["車両販売の粗利（車両利益）", "整備・点検サービス収入", "保険代理店手数料", "オークション開催手数料"]',
    3,
    'オークション開催手数料はAA運営会社の収益であり、一般の中古車販売店の収益源ではありません。',
    '研修28: 経営課題の類型別分析');

  -- 問題12: 経営課題の類型別分析（研修28）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 12, 
    '中古車販売店が抱える人材に関する課題として最も多いのはどれか？',
    '["人件費が高すぎること", "採用難と人材の定着率の低さ", "営業スタッフの高齢化", "資格保有者の不足"]',
    1,
    '中古車業界では採用難と離職率の高さが課題となっており、人材の確保と育成が経営上の重要課題です。',
    '研修28: 経営課題の類型別分析');

  -- 問題13: 業界トレンドと市場動向（研修29）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 13, 
    '電気自動車（EV）の中古車市場における課題はどれか？',
    '["需要が高すぎて供給が追いつかない", "バッテリー劣化と残価評価の不確実性", "充電インフラが完備されている", "メンテナンスが容易すぎる"]',
    1,
    'EV中古車はバッテリーの劣化状態の把握と残価評価が難しく、市場形成の課題となっています。',
    '研修29: 業界トレンドと市場動向');

  -- 問題14: 業界トレンドと市場動向（研修29）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 14, 
    'サブスクリプション（定額利用サービス）が中古車業界に与える影響はどれか？',
    '["中古車の需要が完全になくなる", "所有から利用へという消費者意識の変化に対応できる", "新車販売だけが増加する", "整備需要が減少する"]',
    1,
    'サブスクリプションは「所有から利用へ」という消費トレンドに対応したサービスで、中古車も活用されています。',
    '研修29: 業界トレンドと市場動向');

  -- 問題15: 法規制と業界ルール（研修30）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 15, 
    '中古車販売に必要な許認可として正しいのはどれか？',
    '["飲食店営業許可", "古物商許可", "宅地建物取引業免許", "貸金業登録"]',
    1,
    '中古車販売には古物商許可が必要です。これは中古品の売買を行う際に必要な許可です。',
    '研修30: 法規制と業界ルール');

  -- 問題16: 法規制と業界ルール（研修30）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 16, 
    '自動車公正競争規約で定められている表示義務に含まれるのはどれか？',
    '["前所有者の個人情報", "走行距離と修復歴の有無", "仕入れ価格と利益率", "過去の事故の詳細内容"]',
    1,
    '自動車公正競争規約では、走行距離と修復歴の有無の表示が義務付けられています。',
    '研修30: 法規制と業界ルール');

  -- 問題17: 中古車価格のメカニズム（研修31）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 17, 
    '中古車価格に影響する要因として最も大きいのはどれか？',
    '["ボディカラーの人気度", "年式・走行距離・車種の需給バランス", "タイヤの残り溝の深さ", "カーナビの有無"]',
    1,
    '中古車価格は主に年式、走行距離、車種の需給バランスによって決まります。人気車種は高値を維持します。',
    '研修31: 中古車価格のメカニズム');

  -- 問題18: 中古車価格のメカニズム（研修31）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 18, 
    '「修復歴あり」の車両について正しいのはどれか？',
    '["ドアの板金修理をした車両のこと", "フレーム（骨格）部分を修理した車両のこと", "エンジンを載せ替えた車両のこと", "全塗装をした車両のこと"]',
    1,
    '修復歴とは、車体のフレーム（骨格）部分を修正・交換した履歴を指します。外装の板金修理は含まれません。',
    '研修31: 中古車価格のメカニズム');

  -- 問題19: 顧客心理と購買行動（研修32）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 19, 
    '中古車購入時に顧客が最も不安に感じることはどれか？',
    '["納車までの期間が長いこと", "品質・状態に対する不確実性", "値引き交渉が難しいこと", "試乗ができないこと"]',
    1,
    '中古車は一点モノであり、品質や状態が車両ごとに異なるため、顧客は「本当に大丈夫か」という不安を感じやすいです。',
    '研修32: 顧客心理と購買行動');

  -- 問題20: 顧客心理と購買行動（研修32）
  INSERT INTO category_test_questions (category_test_id, question_number, question, options, correct_answer, explanation, source)
  VALUES (test_id, 20, 
    '中古車購入における「認知的不協和」を軽減する方法として適切なのはどれか？',
    '["購入後は連絡しないようにする", "購入後も丁寧なフォローで選択の正しさを確認させる", "他の車両の良い点を伝える", "値引きをさらに提案する"]',
    1,
    '認知的不協和（買った後の不安）を軽減するには、購入後のフォローで「良い選択だった」と確認させることが重要です。',
    '研修32: 顧客心理と購買行動');
    END IF;
  END IF;
END $$;;
