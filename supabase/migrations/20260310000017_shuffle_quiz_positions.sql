-- review_quiz（object）と quick_check（array）の正解位置偏りをシャッフルで修正
-- review_quiz: pos=3 が 13.8%と少ない（目標 各 25%前後）
-- quick_check: pos=0,1 が 30%超と偏っている（目標 各 25%前後）

-- ── review_quiz（object形式）──────────────────────────────────────
DO $$
DECLARE
  rec RECORD;
  opts jsonb;
  correct_opt jsonb;
  new_opts jsonb;
  i int;
BEGIN
  FOR rec IN
    SELECT id, review_quiz
    FROM session_contents
    WHERE review_quiz IS NOT NULL
      AND jsonb_typeof(review_quiz) = 'object'
      AND (review_quiz->'options') IS NOT NULL
  LOOP
    opts        := rec.review_quiz->'options';
    correct_opt := opts -> (rec.review_quiz->>'correctIndex')::int;

    SELECT jsonb_agg(opt ORDER BY random()) INTO new_opts
    FROM jsonb_array_elements(opts) AS opt;

    FOR i IN 0..jsonb_array_length(new_opts)-1 LOOP
      IF new_opts->i = correct_opt THEN
        UPDATE session_contents
        SET review_quiz = rec.review_quiz
          || jsonb_build_object('options', new_opts)
          || jsonb_build_object('correctIndex', i)
        WHERE id = rec.id;
        EXIT;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- ── quick_check（array形式）───────────────────────────────────────
DO $$
DECLARE
  rec RECORD;
  elem jsonb;
  opts jsonb;
  correct_opt jsonb;
  new_opts jsonb;
  new_arr jsonb;
  i int;
  elem_idx int;
BEGIN
  FOR rec IN
    SELECT id, quick_check
    FROM session_contents
    WHERE quick_check IS NOT NULL
      AND jsonb_typeof(quick_check) = 'array'
  LOOP
    new_arr   := '[]'::jsonb;
    elem_idx  := 0;

    FOR elem IN SELECT * FROM jsonb_array_elements(rec.quick_check)
    LOOP
      opts        := elem->'options';
      correct_opt := opts -> (elem->>'correctIndex')::int;

      SELECT jsonb_agg(opt ORDER BY random()) INTO new_opts
      FROM jsonb_array_elements(opts) AS opt;

      FOR i IN 0..jsonb_array_length(new_opts)-1 LOOP
        IF new_opts->i = correct_opt THEN
          elem    := elem
            || jsonb_build_object('options', new_opts)
            || jsonb_build_object('correctIndex', i);
          EXIT;
        END IF;
      END LOOP;

      new_arr := new_arr || jsonb_build_array(elem);
      elem_idx := elem_idx + 1;
    END LOOP;

    UPDATE session_contents SET quick_check = new_arr WHERE id = rec.id;
  END LOOP;
END $$;
