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

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- Functions
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

-- Tables (IF NOT EXISTS ensures no errors if they exist)
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
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
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
    "created_at" timestamp with time zone DEFAULT "now"()
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
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
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
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
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
    "updated_at" timestamp with time zone DEFAULT "now"()
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
    "created_at" timestamp with time zone DEFAULT "now"()
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
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
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
    "category_name" character varying(100)
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
    "created_at" timestamp with time zone DEFAULT "now"()
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
    "updated_at" timestamp with time zone DEFAULT "now"()
);
ALTER TABLE "public"."user_training_progress" OWNER TO "postgres";

-- Sequence Defaults
ALTER TABLE ONLY "public"."category_test_questions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."category_test_questions_id_seq"'::"regclass");
ALTER TABLE ONLY "public"."category_tests" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."category_tests_id_seq"'::"regclass");
ALTER TABLE ONLY "public"."deep_dive_contents" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."deep_dive_contents_id_seq"'::"regclass");
ALTER TABLE ONLY "public"."session_contents" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."session_contents_id_seq"'::"regclass");

-- RLS Enablement
ALTER TABLE "public"."category_test_results" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."deep_dive_contents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."deep_dive_progress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."final_exam_results" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."quiz_responses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."session_contents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."training_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."training_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."trainings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_reflections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_training_progress" ENABLE ROW LEVEL SECURITY;

-- Publication
ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

-- Grants
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

-- Final Triggers (Dropped first to avoid conflicts)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- NOTE: Constraints, Indexes, and Policies have been removed to prevent duplicate errors.
-- The database structure relies on previous migration files for those definitions.