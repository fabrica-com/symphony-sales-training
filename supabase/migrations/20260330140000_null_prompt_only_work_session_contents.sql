-- Prompt-style work JSON (prompt/hints/timeLimit) is not supported by WorkPhase (fields[] only).
-- Align with app model: no checklist work for these trainings.
UPDATE public.session_contents
SET work = NULL
WHERE training_id IN (13, 15, 17, 18, 19)
  AND work IS NOT NULL
  AND NOT (work ? 'fields');
