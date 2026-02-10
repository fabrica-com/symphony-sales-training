


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, department, role, join_date)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'department', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'employee'),
    CURRENT_DATE
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."category_test_questions" (
    "id" integer NOT NULL,
    "category_test_id" integer NOT NULL,
    "question_number" integer NOT NULL,
    "question" "text" NOT NULL,
    "options" "jsonb" NOT NULL,
    "correct_answer" integer NOT NULL,
    "explanation" "text" NOT NULL,
    "source" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."category_test_questions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."category_test_questions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."category_test_questions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."category_test_questions_id_seq" OWNED BY "public"."category_test_questions"."id";



CREATE TABLE IF NOT EXISTS "public"."category_test_results" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "category_id" character varying(10) NOT NULL,
    "category_name" character varying(100),
    "attempt_number" integer DEFAULT 1 NOT NULL,
    "score" integer NOT NULL,
    "percentage" integer NOT NULL,
    "passed" boolean DEFAULT false NOT NULL,
    "correct_count" integer NOT NULL,
    "total_questions" integer NOT NULL,
    "duration_seconds" integer,
    "answers" "jsonb",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "category_test_results_percentage_check" CHECK ((("percentage" >= 0) AND ("percentage" <= 100)))
);


ALTER TABLE "public"."category_test_results" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."category_tests" (
    "id" integer NOT NULL,
    "category_id" "text" NOT NULL,
    "category_name" "text" NOT NULL,
    "total_questions" integer NOT NULL,
    "passing_score" integer NOT NULL,
    "time_limit" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."category_tests" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."category_tests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."category_tests_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."category_tests_id_seq" OWNED BY "public"."category_tests"."id";



CREATE TABLE IF NOT EXISTS "public"."deep_dive_contents" (
    "id" integer NOT NULL,
    "training_id" integer NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text",
    "introduction" "text" NOT NULL,
    "sections" "jsonb" NOT NULL,
    "conclusion" "text" NOT NULL,
    "reference_list" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."deep_dive_contents" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."deep_dive_contents_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."deep_dive_contents_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."deep_dive_contents_id_seq" OWNED BY "public"."deep_dive_contents"."id";



CREATE TABLE IF NOT EXISTS "public"."deep_dive_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "training_id" integer NOT NULL,
    "is_completed" boolean DEFAULT false NOT NULL,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."deep_dive_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."final_exam_results" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "completed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "score" integer NOT NULL,
    "percentage" integer NOT NULL,
    "passed" boolean DEFAULT false NOT NULL,
    "correct_count" integer NOT NULL,
    "total_questions" integer DEFAULT 100 NOT NULL,
    "duration" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."final_exam_results" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "name" "text",
    "department" "text",
    "join_date" "date",
    "role" "text" DEFAULT 'employee'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['employee'::"text", 'manager'::"text", 'admin'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quiz_responses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "training_id" integer NOT NULL,
    "session_id" "uuid",
    "quiz_type" character varying(20) NOT NULL,
    "question_id" integer,
    "selected_answer" integer,
    "is_correct" boolean,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "quiz_responses_quiz_type_check" CHECK ((("quiz_type")::"text" = ANY (ARRAY[('review_quiz'::character varying)::"text", ('quick_check'::character varying)::"text", ('simulation'::character varying)::"text", ('reflection'::character varying)::"text"])))
);


ALTER TABLE "public"."quiz_responses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."session_contents" (
    "id" integer NOT NULL,
    "training_id" integer NOT NULL,
    "title" "text" NOT NULL,
    "key_phrase" "text" NOT NULL,
    "badge" "jsonb" NOT NULL,
    "mood_options" "jsonb" NOT NULL,
    "review_quiz" "jsonb",
    "story" "jsonb" NOT NULL,
    "infographic" "jsonb",
    "quick_check" "jsonb",
    "quote" "jsonb",
    "simulation" "jsonb",
    "reflection" "jsonb",
    "action_options" "jsonb",
    "work" "jsonb",
    "deep_dive" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "roleplay" "jsonb"
);


ALTER TABLE "public"."session_contents" OWNER TO "postgres";


COMMENT ON TABLE "public"."session_contents" IS 'インタラクティブセッションのコンテンツデータ';



COMMENT ON COLUMN "public"."session_contents"."training_id" IS '研修ID（trainings.idと対応）';



COMMENT ON COLUMN "public"."session_contents"."title" IS 'セッションのタイトル';



COMMENT ON COLUMN "public"."session_contents"."key_phrase" IS 'キーフレーズ';



COMMENT ON COLUMN "public"."session_contents"."badge" IS 'バッジ情報（name, icon）';



COMMENT ON COLUMN "public"."session_contents"."mood_options" IS '気分選択オプション';



COMMENT ON COLUMN "public"."session_contents"."review_quiz" IS '復習クイズ';



COMMENT ON COLUMN "public"."session_contents"."story" IS 'ストーリーコンテンツ（part1, part2）';



COMMENT ON COLUMN "public"."session_contents"."infographic" IS 'インフォグラフィック情報';



COMMENT ON COLUMN "public"."session_contents"."quick_check" IS 'クイックチェック問題';



COMMENT ON COLUMN "public"."session_contents"."quote" IS '名言';



COMMENT ON COLUMN "public"."session_contents"."simulation" IS 'シミュレーション問題';



COMMENT ON COLUMN "public"."session_contents"."reflection" IS '振り返り設問';



COMMENT ON COLUMN "public"."session_contents"."action_options" IS 'アクションオプション';



COMMENT ON COLUMN "public"."session_contents"."work" IS 'ワーク課題';



COMMENT ON COLUMN "public"."session_contents"."deep_dive" IS '深掘りコンテンツ';



COMMENT ON COLUMN "public"."session_contents"."roleplay" IS 'Roleplay scenarios with dialogue-based practice';



CREATE SEQUENCE IF NOT EXISTS "public"."session_contents_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."session_contents_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."session_contents_id_seq" OWNED BY "public"."session_contents"."id";



CREATE TABLE IF NOT EXISTS "public"."training_categories" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "total_duration" integer NOT NULL,
    "target_level" "text" NOT NULL,
    "color" "text" NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."training_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."training_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "training_id" integer NOT NULL,
    "category_id" character varying(10) NOT NULL,
    "training_title" character varying(255),
    "attempt_number" integer DEFAULT 1 NOT NULL,
    "duration_seconds" integer,
    "overall_score" integer,
    "max_score" integer DEFAULT 100,
    "evaluation" "jsonb",
    "feedback" "text",
    "strengths" "text"[],
    "improvements" "text"[],
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "category_name" character varying(100),
    CONSTRAINT "training_sessions_overall_score_check" CHECK ((("overall_score" >= 0) AND ("overall_score" <= 100)))
);


ALTER TABLE "public"."training_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trainings" (
    "id" integer NOT NULL,
    "category_id" "text" NOT NULL,
    "title" "text" NOT NULL,
    "subtitle" "text",
    "duration" integer NOT NULL,
    "level" "text" NOT NULL,
    "detail" "jsonb",
    "display_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."trainings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_reflections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "training_id" integer NOT NULL,
    "session_id" "uuid",
    "reflection_type" character varying(20) NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_reflections_reflection_type_check" CHECK ((("reflection_type")::"text" = ANY (ARRAY[('reflection'::character varying)::"text", ('action'::character varying)::"text", ('work'::character varying)::"text", ('note'::character varying)::"text"])))
);


ALTER TABLE "public"."user_reflections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_training_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "training_id" integer NOT NULL,
    "category_id" character varying(10) NOT NULL,
    "status" character varying(20) DEFAULT 'not_started'::character varying NOT NULL,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_training_progress_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('not_started'::character varying)::"text", ('in_progress'::character varying)::"text", ('completed'::character varying)::"text"])))
);


ALTER TABLE "public"."user_training_progress" OWNER TO "postgres";


ALTER TABLE ONLY "public"."category_test_questions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."category_test_questions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."category_tests" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."category_tests_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."deep_dive_contents" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."deep_dive_contents_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."session_contents" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."session_contents_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."category_test_questions"
    ADD CONSTRAINT "category_test_questions_category_test_id_question_number_key" UNIQUE ("category_test_id", "question_number");



ALTER TABLE ONLY "public"."category_test_questions"
    ADD CONSTRAINT "category_test_questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."category_test_results"
    ADD CONSTRAINT "category_test_results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."category_tests"
    ADD CONSTRAINT "category_tests_category_id_key" UNIQUE ("category_id");



ALTER TABLE ONLY "public"."category_tests"
    ADD CONSTRAINT "category_tests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."deep_dive_contents"
    ADD CONSTRAINT "deep_dive_contents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."deep_dive_contents"
    ADD CONSTRAINT "deep_dive_contents_training_id_key" UNIQUE ("training_id");



ALTER TABLE ONLY "public"."deep_dive_progress"
    ADD CONSTRAINT "deep_dive_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."deep_dive_progress"
    ADD CONSTRAINT "deep_dive_progress_user_id_training_id_key" UNIQUE ("user_id", "training_id");



ALTER TABLE ONLY "public"."final_exam_results"
    ADD CONSTRAINT "final_exam_results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quiz_responses"
    ADD CONSTRAINT "quiz_responses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session_contents"
    ADD CONSTRAINT "session_contents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session_contents"
    ADD CONSTRAINT "session_contents_training_id_key" UNIQUE ("training_id");



ALTER TABLE ONLY "public"."training_categories"
    ADD CONSTRAINT "training_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."training_sessions"
    ADD CONSTRAINT "training_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trainings"
    ADD CONSTRAINT "trainings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_reflections"
    ADD CONSTRAINT "user_reflections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_training_progress"
    ADD CONSTRAINT "user_training_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_training_progress"
    ADD CONSTRAINT "user_training_progress_user_id_training_id_key" UNIQUE ("user_id", "training_id");



CREATE INDEX "idx_category_test_questions_test_id" ON "public"."category_test_questions" USING "btree" ("category_test_id");



CREATE INDEX "idx_category_test_results_category" ON "public"."category_test_results" USING "btree" ("category_id");



CREATE INDEX "idx_category_test_results_user_id" ON "public"."category_test_results" USING "btree" ("user_id");



CREATE INDEX "idx_category_tests_category_id" ON "public"."category_tests" USING "btree" ("category_id");



CREATE INDEX "idx_deep_dive_progress_user_id" ON "public"."deep_dive_progress" USING "btree" ("user_id");



CREATE INDEX "idx_deep_dive_training" ON "public"."deep_dive_contents" USING "btree" ("training_id");



CREATE INDEX "idx_final_exam_results_completed_at" ON "public"."final_exam_results" USING "btree" ("completed_at");



CREATE INDEX "idx_final_exam_results_passed" ON "public"."final_exam_results" USING "btree" ("passed");



CREATE INDEX "idx_final_exam_results_user_id" ON "public"."final_exam_results" USING "btree" ("user_id");



CREATE INDEX "idx_quiz_responses_session_id" ON "public"."quiz_responses" USING "btree" ("session_id");



CREATE INDEX "idx_quiz_responses_user_id" ON "public"."quiz_responses" USING "btree" ("user_id");



CREATE INDEX "idx_session_contents_training_id" ON "public"."session_contents" USING "btree" ("training_id");



CREATE INDEX "idx_training_sessions_training_id" ON "public"."training_sessions" USING "btree" ("training_id");



CREATE INDEX "idx_training_sessions_user_id" ON "public"."training_sessions" USING "btree" ("user_id");



CREATE INDEX "idx_trainings_category" ON "public"."trainings" USING "btree" ("category_id");



CREATE INDEX "idx_user_reflections_user_id" ON "public"."user_reflections" USING "btree" ("user_id");



CREATE INDEX "idx_user_training_progress_category" ON "public"."user_training_progress" USING "btree" ("category_id");



CREATE INDEX "idx_user_training_progress_user_id" ON "public"."user_training_progress" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."category_test_questions"
    ADD CONSTRAINT "category_test_questions_category_test_id_fkey" FOREIGN KEY ("category_test_id") REFERENCES "public"."category_tests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."category_test_results"
    ADD CONSTRAINT "category_test_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."category_tests"
    ADD CONSTRAINT "category_tests_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."training_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."deep_dive_progress"
    ADD CONSTRAINT "deep_dive_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quiz_responses"
    ADD CONSTRAINT "quiz_responses_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."training_sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quiz_responses"
    ADD CONSTRAINT "quiz_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."training_sessions"
    ADD CONSTRAINT "training_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trainings"
    ADD CONSTRAINT "trainings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."training_categories"("id");



ALTER TABLE ONLY "public"."user_reflections"
    ADD CONSTRAINT "user_reflections_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."training_sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_reflections"
    ADD CONSTRAINT "user_reflections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_training_progress"
    ADD CONSTRAINT "user_training_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Allow anonymous insert for final exam results" ON "public"."final_exam_results" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow authenticated insert on deep_dive_contents" ON "public"."deep_dive_contents" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated insert on training_categories" ON "public"."training_categories" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated insert on trainings" ON "public"."trainings" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated update on deep_dive_contents" ON "public"."deep_dive_contents" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated update on training_categories" ON "public"."training_categories" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated update on trainings" ON "public"."trainings" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Allow public read access on deep_dive_contents" ON "public"."deep_dive_contents" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on training_categories" ON "public"."training_categories" FOR SELECT USING (true);



CREATE POLICY "Allow public read access on trainings" ON "public"."trainings" FOR SELECT USING (true);



CREATE POLICY "Users can insert own deep dive progress" ON "public"."deep_dive_progress" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own final exam results" ON "public"."final_exam_results" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own progress" ON "public"."user_training_progress" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own quiz responses" ON "public"."quiz_responses" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own reflections" ON "public"."user_reflections" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own test results" ON "public"."category_test_results" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own training progress" ON "public"."user_training_progress" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own training sessions" ON "public"."training_sessions" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own deep dive progress" ON "public"."deep_dive_progress" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own progress" ON "public"."user_training_progress" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own reflections" ON "public"."user_reflections" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own training progress" ON "public"."user_training_progress" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own training sessions" ON "public"."training_sessions" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own deep dive progress" ON "public"."deep_dive_progress" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own final exam results" ON "public"."final_exam_results" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own quiz responses" ON "public"."quiz_responses" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own reflections" ON "public"."user_reflections" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own test results" ON "public"."category_test_results" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own training progress" ON "public"."user_training_progress" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own training sessions" ON "public"."training_sessions" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."category_test_results" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."deep_dive_contents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."deep_dive_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."final_exam_results" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_delete_admin" ON "public"."profiles" FOR DELETE USING (((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text") OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = 'admin'::"text")));



CREATE POLICY "profiles_insert_own" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "profiles_select_managers" ON "public"."profiles" FOR SELECT USING (((("auth"."jwt"() ->> 'role'::"text") = ANY (ARRAY['manager'::"text", 'admin'::"text"])) OR ((("auth"."jwt"() -> 'user_metadata'::"text") ->> 'role'::"text") = ANY (ARRAY['manager'::"text", 'admin'::"text"]))));



CREATE POLICY "profiles_select_own" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."quiz_responses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."session_contents" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "session_contents_insert_policy" ON "public"."session_contents" FOR INSERT WITH CHECK (true);



CREATE POLICY "session_contents_read_policy" ON "public"."session_contents" FOR SELECT USING (true);



CREATE POLICY "session_contents_update_policy" ON "public"."session_contents" FOR UPDATE USING (true);



ALTER TABLE "public"."training_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."training_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trainings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_reflections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_training_progress" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."category_test_questions" TO "anon";
GRANT ALL ON TABLE "public"."category_test_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."category_test_questions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."category_test_questions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."category_test_questions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."category_test_questions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."category_test_results" TO "anon";
GRANT ALL ON TABLE "public"."category_test_results" TO "authenticated";
GRANT ALL ON TABLE "public"."category_test_results" TO "service_role";



GRANT ALL ON TABLE "public"."category_tests" TO "anon";
GRANT ALL ON TABLE "public"."category_tests" TO "authenticated";
GRANT ALL ON TABLE "public"."category_tests" TO "service_role";



GRANT ALL ON SEQUENCE "public"."category_tests_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."category_tests_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."category_tests_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."deep_dive_contents" TO "anon";
GRANT ALL ON TABLE "public"."deep_dive_contents" TO "authenticated";
GRANT ALL ON TABLE "public"."deep_dive_contents" TO "service_role";



GRANT ALL ON SEQUENCE "public"."deep_dive_contents_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."deep_dive_contents_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."deep_dive_contents_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."deep_dive_progress" TO "anon";
GRANT ALL ON TABLE "public"."deep_dive_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."deep_dive_progress" TO "service_role";



GRANT ALL ON TABLE "public"."final_exam_results" TO "anon";
GRANT ALL ON TABLE "public"."final_exam_results" TO "authenticated";
GRANT ALL ON TABLE "public"."final_exam_results" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."quiz_responses" TO "anon";
GRANT ALL ON TABLE "public"."quiz_responses" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz_responses" TO "service_role";



GRANT ALL ON TABLE "public"."session_contents" TO "anon";
GRANT ALL ON TABLE "public"."session_contents" TO "authenticated";
GRANT ALL ON TABLE "public"."session_contents" TO "service_role";



GRANT ALL ON SEQUENCE "public"."session_contents_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."session_contents_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."session_contents_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."training_categories" TO "anon";
GRANT ALL ON TABLE "public"."training_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."training_categories" TO "service_role";



GRANT ALL ON TABLE "public"."training_sessions" TO "anon";
GRANT ALL ON TABLE "public"."training_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."training_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."trainings" TO "anon";
GRANT ALL ON TABLE "public"."trainings" TO "authenticated";
GRANT ALL ON TABLE "public"."trainings" TO "service_role";



GRANT ALL ON TABLE "public"."user_reflections" TO "anon";
GRANT ALL ON TABLE "public"."user_reflections" TO "authenticated";
GRANT ALL ON TABLE "public"."user_reflections" TO "service_role";



GRANT ALL ON TABLE "public"."user_training_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_training_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_training_progress" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


