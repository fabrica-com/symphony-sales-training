drop extension if exists "pg_net";

drop policy "Allow public read access on category_test_questions" on "public"."category_test_questions";

drop policy "Allow public read access on category_tests" on "public"."category_tests";

drop index if exists "public"."idx_category_test_questions_test";

drop index if exists "public"."idx_profiles_email";


  create table "public"."category_test_results" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "category_id" character varying(10) not null,
    "category_name" character varying(100),
    "attempt_number" integer not null default 1,
    "score" integer not null,
    "percentage" integer not null,
    "passed" boolean not null default false,
    "correct_count" integer not null,
    "total_questions" integer not null,
    "duration_seconds" integer,
    "answers" jsonb,
    "completed_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now()
      );


alter table "public"."category_test_results" enable row level security;


  create table "public"."deep_dive_progress" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "training_id" integer not null,
    "is_completed" boolean not null default false,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."deep_dive_progress" enable row level security;


  create table "public"."quiz_responses" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "training_id" integer not null,
    "session_id" uuid,
    "quiz_type" character varying(20) not null,
    "question_id" integer,
    "selected_answer" integer,
    "is_correct" boolean,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."quiz_responses" enable row level security;


  create table "public"."training_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "training_id" integer not null,
    "category_id" character varying(10) not null,
    "training_title" character varying(255),
    "attempt_number" integer not null default 1,
    "duration_seconds" integer,
    "overall_score" integer,
    "max_score" integer default 100,
    "evaluation" jsonb,
    "feedback" text,
    "strengths" text[],
    "improvements" text[],
    "completed_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now(),
    "category_name" character varying(100)
      );


alter table "public"."training_sessions" enable row level security;


  create table "public"."user_reflections" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "training_id" integer not null,
    "session_id" uuid,
    "reflection_type" character varying(20) not null,
    "content" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."user_reflections" enable row level security;


  create table "public"."user_training_progress" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "training_id" integer not null,
    "category_id" character varying(10) not null,
    "status" character varying(20) not null default 'not_started'::character varying,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."user_training_progress" enable row level security;

alter table "public"."category_test_questions" disable row level security;

alter table "public"."category_tests" disable row level security;

CREATE UNIQUE INDEX category_test_questions_category_test_id_question_number_key ON public.category_test_questions USING btree (category_test_id, question_number);

CREATE UNIQUE INDEX category_test_results_pkey ON public.category_test_results USING btree (id);

CREATE UNIQUE INDEX deep_dive_progress_pkey ON public.deep_dive_progress USING btree (id);

CREATE UNIQUE INDEX deep_dive_progress_user_id_training_id_key ON public.deep_dive_progress USING btree (user_id, training_id);

CREATE INDEX idx_category_test_questions_test_id ON public.category_test_questions USING btree (category_test_id);

CREATE INDEX idx_category_test_results_category ON public.category_test_results USING btree (category_id);

CREATE INDEX idx_category_test_results_user_id ON public.category_test_results USING btree (user_id);

CREATE INDEX idx_category_tests_category_id ON public.category_tests USING btree (category_id);

CREATE INDEX idx_deep_dive_progress_user_id ON public.deep_dive_progress USING btree (user_id);

CREATE INDEX idx_quiz_responses_session_id ON public.quiz_responses USING btree (session_id);

CREATE INDEX idx_quiz_responses_user_id ON public.quiz_responses USING btree (user_id);

CREATE INDEX idx_training_sessions_training_id ON public.training_sessions USING btree (training_id);

CREATE INDEX idx_training_sessions_user_id ON public.training_sessions USING btree (user_id);

CREATE INDEX idx_user_reflections_user_id ON public.user_reflections USING btree (user_id);

CREATE INDEX idx_user_training_progress_category ON public.user_training_progress USING btree (category_id);

CREATE INDEX idx_user_training_progress_user_id ON public.user_training_progress USING btree (user_id);

CREATE UNIQUE INDEX quiz_responses_pkey ON public.quiz_responses USING btree (id);

CREATE UNIQUE INDEX training_sessions_pkey ON public.training_sessions USING btree (id);

CREATE UNIQUE INDEX user_reflections_pkey ON public.user_reflections USING btree (id);

CREATE UNIQUE INDEX user_training_progress_pkey ON public.user_training_progress USING btree (id);

CREATE UNIQUE INDEX user_training_progress_user_id_training_id_key ON public.user_training_progress USING btree (user_id, training_id);

alter table "public"."category_test_results" add constraint "category_test_results_pkey" PRIMARY KEY using index "category_test_results_pkey";

alter table "public"."deep_dive_progress" add constraint "deep_dive_progress_pkey" PRIMARY KEY using index "deep_dive_progress_pkey";

alter table "public"."quiz_responses" add constraint "quiz_responses_pkey" PRIMARY KEY using index "quiz_responses_pkey";

alter table "public"."training_sessions" add constraint "training_sessions_pkey" PRIMARY KEY using index "training_sessions_pkey";

alter table "public"."user_reflections" add constraint "user_reflections_pkey" PRIMARY KEY using index "user_reflections_pkey";

alter table "public"."user_training_progress" add constraint "user_training_progress_pkey" PRIMARY KEY using index "user_training_progress_pkey";

alter table "public"."category_test_questions" add constraint "category_test_questions_category_test_id_question_number_key" UNIQUE using index "category_test_questions_category_test_id_question_number_key";

alter table "public"."category_test_results" add constraint "category_test_results_percentage_check" CHECK (((percentage >= 0) AND (percentage <= 100))) not valid;

alter table "public"."category_test_results" validate constraint "category_test_results_percentage_check";

alter table "public"."category_test_results" add constraint "category_test_results_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."category_test_results" validate constraint "category_test_results_user_id_fkey";

alter table "public"."deep_dive_progress" add constraint "deep_dive_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."deep_dive_progress" validate constraint "deep_dive_progress_user_id_fkey";

alter table "public"."deep_dive_progress" add constraint "deep_dive_progress_user_id_training_id_key" UNIQUE using index "deep_dive_progress_user_id_training_id_key";

alter table "public"."quiz_responses" add constraint "quiz_responses_quiz_type_check" CHECK (((quiz_type)::text = ANY (ARRAY[('review_quiz'::character varying)::text, ('quick_check'::character varying)::text, ('simulation'::character varying)::text, ('reflection'::character varying)::text]))) not valid;

alter table "public"."quiz_responses" validate constraint "quiz_responses_quiz_type_check";

alter table "public"."quiz_responses" add constraint "quiz_responses_session_id_fkey" FOREIGN KEY (session_id) REFERENCES public.training_sessions(id) ON DELETE CASCADE not valid;

alter table "public"."quiz_responses" validate constraint "quiz_responses_session_id_fkey";

alter table "public"."quiz_responses" add constraint "quiz_responses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."quiz_responses" validate constraint "quiz_responses_user_id_fkey";

alter table "public"."training_sessions" add constraint "training_sessions_overall_score_check" CHECK (((overall_score >= 0) AND (overall_score <= 100))) not valid;

alter table "public"."training_sessions" validate constraint "training_sessions_overall_score_check";

alter table "public"."training_sessions" add constraint "training_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."training_sessions" validate constraint "training_sessions_user_id_fkey";

alter table "public"."user_reflections" add constraint "user_reflections_reflection_type_check" CHECK (((reflection_type)::text = ANY (ARRAY[('reflection'::character varying)::text, ('action'::character varying)::text, ('work'::character varying)::text, ('note'::character varying)::text]))) not valid;

alter table "public"."user_reflections" validate constraint "user_reflections_reflection_type_check";

alter table "public"."user_reflections" add constraint "user_reflections_session_id_fkey" FOREIGN KEY (session_id) REFERENCES public.training_sessions(id) ON DELETE CASCADE not valid;

alter table "public"."user_reflections" validate constraint "user_reflections_session_id_fkey";

alter table "public"."user_reflections" add constraint "user_reflections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_reflections" validate constraint "user_reflections_user_id_fkey";

alter table "public"."user_training_progress" add constraint "user_training_progress_status_check" CHECK (((status)::text = ANY (ARRAY[('not_started'::character varying)::text, ('in_progress'::character varying)::text, ('completed'::character varying)::text]))) not valid;

alter table "public"."user_training_progress" validate constraint "user_training_progress_status_check";

alter table "public"."user_training_progress" add constraint "user_training_progress_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_training_progress" validate constraint "user_training_progress_user_id_fkey";

alter table "public"."user_training_progress" add constraint "user_training_progress_user_id_training_id_key" UNIQUE using index "user_training_progress_user_id_training_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

grant delete on table "public"."category_test_results" to "anon";

grant insert on table "public"."category_test_results" to "anon";

grant references on table "public"."category_test_results" to "anon";

grant select on table "public"."category_test_results" to "anon";

grant trigger on table "public"."category_test_results" to "anon";

grant truncate on table "public"."category_test_results" to "anon";

grant update on table "public"."category_test_results" to "anon";

grant delete on table "public"."category_test_results" to "authenticated";

grant insert on table "public"."category_test_results" to "authenticated";

grant references on table "public"."category_test_results" to "authenticated";

grant select on table "public"."category_test_results" to "authenticated";

grant trigger on table "public"."category_test_results" to "authenticated";

grant truncate on table "public"."category_test_results" to "authenticated";

grant update on table "public"."category_test_results" to "authenticated";

grant delete on table "public"."category_test_results" to "service_role";

grant insert on table "public"."category_test_results" to "service_role";

grant references on table "public"."category_test_results" to "service_role";

grant select on table "public"."category_test_results" to "service_role";

grant trigger on table "public"."category_test_results" to "service_role";

grant truncate on table "public"."category_test_results" to "service_role";

grant update on table "public"."category_test_results" to "service_role";

grant delete on table "public"."deep_dive_progress" to "anon";

grant insert on table "public"."deep_dive_progress" to "anon";

grant references on table "public"."deep_dive_progress" to "anon";

grant select on table "public"."deep_dive_progress" to "anon";

grant trigger on table "public"."deep_dive_progress" to "anon";

grant truncate on table "public"."deep_dive_progress" to "anon";

grant update on table "public"."deep_dive_progress" to "anon";

grant delete on table "public"."deep_dive_progress" to "authenticated";

grant insert on table "public"."deep_dive_progress" to "authenticated";

grant references on table "public"."deep_dive_progress" to "authenticated";

grant select on table "public"."deep_dive_progress" to "authenticated";

grant trigger on table "public"."deep_dive_progress" to "authenticated";

grant truncate on table "public"."deep_dive_progress" to "authenticated";

grant update on table "public"."deep_dive_progress" to "authenticated";

grant delete on table "public"."deep_dive_progress" to "service_role";

grant insert on table "public"."deep_dive_progress" to "service_role";

grant references on table "public"."deep_dive_progress" to "service_role";

grant select on table "public"."deep_dive_progress" to "service_role";

grant trigger on table "public"."deep_dive_progress" to "service_role";

grant truncate on table "public"."deep_dive_progress" to "service_role";

grant update on table "public"."deep_dive_progress" to "service_role";

grant delete on table "public"."quiz_responses" to "anon";

grant insert on table "public"."quiz_responses" to "anon";

grant references on table "public"."quiz_responses" to "anon";

grant select on table "public"."quiz_responses" to "anon";

grant trigger on table "public"."quiz_responses" to "anon";

grant truncate on table "public"."quiz_responses" to "anon";

grant update on table "public"."quiz_responses" to "anon";

grant delete on table "public"."quiz_responses" to "authenticated";

grant insert on table "public"."quiz_responses" to "authenticated";

grant references on table "public"."quiz_responses" to "authenticated";

grant select on table "public"."quiz_responses" to "authenticated";

grant trigger on table "public"."quiz_responses" to "authenticated";

grant truncate on table "public"."quiz_responses" to "authenticated";

grant update on table "public"."quiz_responses" to "authenticated";

grant delete on table "public"."quiz_responses" to "service_role";

grant insert on table "public"."quiz_responses" to "service_role";

grant references on table "public"."quiz_responses" to "service_role";

grant select on table "public"."quiz_responses" to "service_role";

grant trigger on table "public"."quiz_responses" to "service_role";

grant truncate on table "public"."quiz_responses" to "service_role";

grant update on table "public"."quiz_responses" to "service_role";

grant delete on table "public"."training_sessions" to "anon";

grant insert on table "public"."training_sessions" to "anon";

grant references on table "public"."training_sessions" to "anon";

grant select on table "public"."training_sessions" to "anon";

grant trigger on table "public"."training_sessions" to "anon";

grant truncate on table "public"."training_sessions" to "anon";

grant update on table "public"."training_sessions" to "anon";

grant delete on table "public"."training_sessions" to "authenticated";

grant insert on table "public"."training_sessions" to "authenticated";

grant references on table "public"."training_sessions" to "authenticated";

grant select on table "public"."training_sessions" to "authenticated";

grant trigger on table "public"."training_sessions" to "authenticated";

grant truncate on table "public"."training_sessions" to "authenticated";

grant update on table "public"."training_sessions" to "authenticated";

grant delete on table "public"."training_sessions" to "service_role";

grant insert on table "public"."training_sessions" to "service_role";

grant references on table "public"."training_sessions" to "service_role";

grant select on table "public"."training_sessions" to "service_role";

grant trigger on table "public"."training_sessions" to "service_role";

grant truncate on table "public"."training_sessions" to "service_role";

grant update on table "public"."training_sessions" to "service_role";

grant delete on table "public"."user_reflections" to "anon";

grant insert on table "public"."user_reflections" to "anon";

grant references on table "public"."user_reflections" to "anon";

grant select on table "public"."user_reflections" to "anon";

grant trigger on table "public"."user_reflections" to "anon";

grant truncate on table "public"."user_reflections" to "anon";

grant update on table "public"."user_reflections" to "anon";

grant delete on table "public"."user_reflections" to "authenticated";

grant insert on table "public"."user_reflections" to "authenticated";

grant references on table "public"."user_reflections" to "authenticated";

grant select on table "public"."user_reflections" to "authenticated";

grant trigger on table "public"."user_reflections" to "authenticated";

grant truncate on table "public"."user_reflections" to "authenticated";

grant update on table "public"."user_reflections" to "authenticated";

grant delete on table "public"."user_reflections" to "service_role";

grant insert on table "public"."user_reflections" to "service_role";

grant references on table "public"."user_reflections" to "service_role";

grant select on table "public"."user_reflections" to "service_role";

grant trigger on table "public"."user_reflections" to "service_role";

grant truncate on table "public"."user_reflections" to "service_role";

grant update on table "public"."user_reflections" to "service_role";

grant delete on table "public"."user_training_progress" to "anon";

grant insert on table "public"."user_training_progress" to "anon";

grant references on table "public"."user_training_progress" to "anon";

grant select on table "public"."user_training_progress" to "anon";

grant trigger on table "public"."user_training_progress" to "anon";

grant truncate on table "public"."user_training_progress" to "anon";

grant update on table "public"."user_training_progress" to "anon";

grant delete on table "public"."user_training_progress" to "authenticated";

grant insert on table "public"."user_training_progress" to "authenticated";

grant references on table "public"."user_training_progress" to "authenticated";

grant select on table "public"."user_training_progress" to "authenticated";

grant trigger on table "public"."user_training_progress" to "authenticated";

grant truncate on table "public"."user_training_progress" to "authenticated";

grant update on table "public"."user_training_progress" to "authenticated";

grant delete on table "public"."user_training_progress" to "service_role";

grant insert on table "public"."user_training_progress" to "service_role";

grant references on table "public"."user_training_progress" to "service_role";

grant select on table "public"."user_training_progress" to "service_role";

grant trigger on table "public"."user_training_progress" to "service_role";

grant truncate on table "public"."user_training_progress" to "service_role";

grant update on table "public"."user_training_progress" to "service_role";


  create policy "Users can insert own test results"
  on "public"."category_test_results"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view own test results"
  on "public"."category_test_results"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own deep dive progress"
  on "public"."deep_dive_progress"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own deep dive progress"
  on "public"."deep_dive_progress"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own deep dive progress"
  on "public"."deep_dive_progress"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own quiz responses"
  on "public"."quiz_responses"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view own quiz responses"
  on "public"."quiz_responses"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own training sessions"
  on "public"."training_sessions"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Users can update own training sessions"
  on "public"."training_sessions"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own training sessions"
  on "public"."training_sessions"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own reflections"
  on "public"."user_reflections"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own reflections"
  on "public"."user_reflections"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own reflections"
  on "public"."user_reflections"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert own progress"
  on "public"."user_training_progress"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Users can insert own training progress"
  on "public"."user_training_progress"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own progress"
  on "public"."user_training_progress"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Users can update own training progress"
  on "public"."user_training_progress"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own training progress"
  on "public"."user_training_progress"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



