-- 選択肢の正解位置偏り解消: 全クイズ・テストの選択肢をランダムシャッフル
-- 正解の「内容（文字列）」は変えず、配列内の位置だけをランダム化する
-- 対象: category_test_questions, final_exam_questions,
--        session_contents.review_quiz, session_contents.quick_check, session_contents.simulation

-- ============================================================
-- 1. category_test_questions
--    options: jsonb配列(string), correct_answer: integer(0始まりインデックス)
-- ============================================================
DO $$
DECLARE
  rec         RECORD;
  correct_opt jsonb;
  new_opts    jsonb;
  i           int;
BEGIN
  FOR rec IN SELECT id, options, correct_answer FROM category_test_questions LOOP
    correct_opt := rec.options -> rec.correct_answer;

    SELECT jsonb_agg(opt ORDER BY random())
    INTO new_opts
    FROM jsonb_array_elements(rec.options) AS opt;

    FOR i IN 0..jsonb_array_length(new_opts)-1 LOOP
      IF new_opts -> i = correct_opt THEN
        UPDATE category_test_questions
        SET options = new_opts, correct_answer = i
        WHERE id = rec.id;
        EXIT;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- ============================================================
-- 2. final_exam_questions
--    options: jsonb配列(string), correct_answer: integer(0始まりインデックス)
-- ============================================================
DO $$
DECLARE
  rec         RECORD;
  correct_opt jsonb;
  new_opts    jsonb;
  i           int;
BEGIN
  FOR rec IN SELECT id, options, correct_answer FROM final_exam_questions LOOP
    correct_opt := rec.options -> rec.correct_answer;

    SELECT jsonb_agg(opt ORDER BY random())
    INTO new_opts
    FROM jsonb_array_elements(rec.options) AS opt;

    FOR i IN 0..jsonb_array_length(new_opts)-1 LOOP
      IF new_opts -> i = correct_opt THEN
        UPDATE final_exam_questions
        SET options = new_opts, correct_answer = i
        WHERE id = rec.id;
        EXIT;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- ============================================================
-- 3. session_contents.review_quiz
--    review_quiz: {question, options: [string], correctIndex: int, explanation}
-- ============================================================
DO $$
DECLARE
  rec         RECORD;
  correct_opt jsonb;
  new_opts    jsonb;
  i           int;
BEGIN
  FOR rec IN
    SELECT id, review_quiz
    FROM session_contents
    WHERE review_quiz IS NOT NULL
  LOOP
    correct_opt := rec.review_quiz -> 'options' -> (rec.review_quiz ->> 'correctIndex')::int;

    SELECT jsonb_agg(opt ORDER BY random())
    INTO new_opts
    FROM jsonb_array_elements(rec.review_quiz -> 'options') AS opt;

    FOR i IN 0..jsonb_array_length(new_opts)-1 LOOP
      IF new_opts -> i = correct_opt THEN
        UPDATE session_contents
        SET review_quiz = jsonb_set(
          jsonb_set(rec.review_quiz, '{options}', new_opts),
          '{correctIndex}',
          to_jsonb(i)
        )
        WHERE id = rec.id;
        EXIT;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- ============================================================
-- 4. session_contents.quick_check
--    quick_check: [{question, options: [string], correctIndex: int, explanation}]
--    配列内の各要素を個別にシャッフル
-- ============================================================
DO $$
DECLARE
  rec          RECORD;
  qc_elem      jsonb;
  correct_opt  jsonb;
  new_opts     jsonb;
  new_elem     jsonb;
  new_qc       jsonb;
  elem_idx     int;
  opt_idx      int;
  qc_len       int;
BEGIN
  FOR rec IN
    SELECT id, quick_check
    FROM session_contents
    WHERE quick_check IS NOT NULL
  LOOP
    qc_len  := jsonb_array_length(rec.quick_check);
    new_qc  := '[]'::jsonb;

    FOR elem_idx IN 0..qc_len-1 LOOP
      qc_elem     := rec.quick_check -> elem_idx;
      correct_opt := qc_elem -> 'options' -> (qc_elem ->> 'correctIndex')::int;

      SELECT jsonb_agg(opt ORDER BY random())
      INTO new_opts
      FROM jsonb_array_elements(qc_elem -> 'options') AS opt;

      new_elem := qc_elem;
      FOR opt_idx IN 0..jsonb_array_length(new_opts)-1 LOOP
        IF new_opts -> opt_idx = correct_opt THEN
          new_elem := jsonb_set(
            jsonb_set(qc_elem, '{options}', new_opts),
            '{correctIndex}',
            to_jsonb(opt_idx)
          );
          EXIT;
        END IF;
      END LOOP;

      new_qc := new_qc || jsonb_build_array(new_elem);
    END LOOP;

    UPDATE session_contents
    SET quick_check = new_qc
    WHERE id = rec.id;
  END LOOP;
END $$;

-- ============================================================
-- 5. session_contents.simulation
--    options 内に isCorrect が埋め込まれているため、
--    配列をシャッフルするだけで正解情報が追随する
-- ============================================================
DO $$
DECLARE
  rec          RECORD;
  scenario     jsonb;
  new_scenario jsonb;
  new_sim      jsonb;
  sim_idx      int;
  new_opts     jsonb;
BEGIN
  FOR rec IN
    SELECT id, simulation
    FROM session_contents
    WHERE simulation IS NOT NULL
  LOOP
    new_sim := '[]'::jsonb;

    FOR sim_idx IN 0..jsonb_array_length(rec.simulation)-1 LOOP
      scenario := rec.simulation -> sim_idx;

      SELECT jsonb_agg(opt ORDER BY random())
      INTO new_opts
      FROM jsonb_array_elements(scenario -> 'options') AS opt;

      new_scenario := jsonb_set(scenario, '{options}', new_opts);
      new_sim      := new_sim || jsonb_build_array(new_scenario);
    END LOOP;

    UPDATE session_contents
    SET simulation = new_sim
    WHERE id = rec.id;
  END LOOP;
END $$;
