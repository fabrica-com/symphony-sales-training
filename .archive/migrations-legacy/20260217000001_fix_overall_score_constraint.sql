-- training_sessions の overall_score 上限を 100 → 200 に変更
-- セッションのスコアは 200pt 満点の加点制のため

ALTER TABLE training_sessions
  DROP CONSTRAINT IF EXISTS training_sessions_overall_score_check;

ALTER TABLE training_sessions
  ADD CONSTRAINT training_sessions_overall_score_check
  CHECK (overall_score >= 0 AND overall_score <= 200);
