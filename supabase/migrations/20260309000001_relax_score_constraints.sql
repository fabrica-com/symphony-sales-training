-- ============================================================
-- overall_score の上限制約を撤廃
-- ============================================================
-- 背景:
--   computeMaxScore() は研修コンテンツ（quickCheck数・simulation配点・
--   deepDive有無など）に基づいて満点を動的計算するため、200pt を
--   超えることがある。固定上限の CHECK 制約が INSERT を弾いていた。
-- 対応:
--   上限を撤廃し「0以上」のみに変更する。
-- ============================================================

ALTER TABLE public.training_sessions
  DROP CONSTRAINT IF EXISTS training_sessions_overall_score_check;

ALTER TABLE public.training_sessions
  ADD CONSTRAINT training_sessions_overall_score_check
  CHECK (overall_score >= 0);
