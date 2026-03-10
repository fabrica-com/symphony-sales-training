-- 重複している名言を適切な有名人の言葉に置き換える
-- 対象: training_id 8, 16, 71, 73, 79, 84, 85, 102

-- #8 プロフェッショナルとしての身だしなみ
-- チャーチル「続ける勇気」→ アルマーニ「エレガンスとは記憶に残ること」
UPDATE public.session_contents
SET quote = jsonb_build_object(
  'text',   'Elegance is not about being noticed, it''s about being remembered.',
  'textJa', '優雅さとは、目立つことではなく、記憶に残ることだ。',
  'author',  'ジョルジオ・アルマーニ'
)
WHERE training_id = 8;

-- #16 製品間連携の価値
-- アリストテレス「全体は部分の総和以上」→ ニュートン「巨人の肩の上に立つ」
UPDATE public.session_contents
SET quote = jsonb_build_object(
  'text',   'If I have seen further, it is by standing on the shoulders of giants.',
  'textJa', '私が遠くを見渡せたのは、巨人の肩の上に立っていたからだ。',
  'author',  'アイザック・ニュートン'
)
WHERE training_id = 16;

-- #71 価格交渉の原則
-- バフェット「価格は払うもの〜」→ カーネギー「相手が欲しいものを与えよ」
UPDATE public.session_contents
SET quote = jsonb_build_object(
  'text',   'You can get everything in life you want if you will just help enough other people get what they want.',
  'textJa', '相手が欲しいものを手に入れる手助けをすれば、自分が欲しいものは自然と手に入る。',
  'author',  'ジグ・ジグラー'
)
WHERE training_id = 71;

-- #73 膠着状態の打開
-- アインシュタイン「困難の中に機会がある」→ アインシュタイン「同じ思考では解決できない」
UPDATE public.session_contents
SET quote = jsonb_build_object(
  'text',   'We cannot solve our problems with the same thinking we used when we created them.',
  'textJa', '問題は、それを生み出したのと同じ思考レベルでは解決できない。',
  'author',  'アルベルト・アインシュタイン'
)
WHERE training_id = 73;

-- #79 慎重型（C）オーナーへの対応
-- デミング「数字を持ってこい」→ パスツール「準備のできた心にチャンスが訪れる」
UPDATE public.session_contents
SET quote = jsonb_build_object(
  'text',   'Chance favors the prepared mind.',
  'textJa', 'チャンスは、準備のできた心にのみ訪れる。',
  'author',  'ルイ・パスツール'
)
WHERE training_id = 79;

-- #84 ソリューションセリング
-- レビット「ドリルの穴」→ コヴィー「まず診断し、その後に処方せよ」
UPDATE public.session_contents
SET quote = jsonb_build_object(
  'text',   'Diagnose before you prescribe.',
  'textJa', 'まず診断し、その後に処方せよ。それが信頼される専門家の条件だ。',
  'author',  'スティーブン・R・コヴィー'
)
WHERE training_id = 84;

-- #85 コンサルティブセリング
-- ルーズベルト「気にかけているかを知るまで」→ ソクラテス「自分が何も知らないことを知っている」
UPDATE public.session_contents
SET quote = jsonb_build_object(
  'text',   'I know that I know nothing.',
  'textJa', '真の知恵とは、自分が何を知らないかを知ることだ。',
  'author',  'ソクラテス'
)
WHERE training_id = 85;

-- #102 市場分析の基本 - 3C分析
-- 孫子「敵を知り己を知れば」→ ケタリング「正しく問いを立てれば答えの半分は得られる」
UPDATE public.session_contents
SET quote = jsonb_build_object(
  'text',   'A problem well stated is a problem half solved.',
  'textJa', '問いを正しく立てれば、答えの半分は得られたも同然だ。',
  'author',  'チャールズ・ケタリング'
)
WHERE training_id = 102;
