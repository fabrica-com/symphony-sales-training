-- ============================================
-- symphony 営業研修 - 初期スキーマ
-- ============================================
-- 28個のレガシーマイグレーションを統合した単一ファイル
-- 元ファイルは .archive/migrations-legacy/ に保管
-- 生成日: 2026-03-04





--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: FUNCTION handle_new_user(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile record when a new user signs up via email/password or OAuth';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;



--
-- Name: category_deep_dive_contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_deep_dive_contents (
    id integer NOT NULL,
    category_id text NOT NULL,
    title text NOT NULL,
    subtitle text,
    body_html text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: category_deep_dive_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.category_deep_dive_contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: category_deep_dive_contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.category_deep_dive_contents_id_seq OWNED BY public.category_deep_dive_contents.id;


--
-- Name: category_test_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_test_questions (
    id integer NOT NULL,
    category_test_id integer NOT NULL,
    question_number integer NOT NULL,
    question text NOT NULL,
    options jsonb NOT NULL,
    correct_answer integer NOT NULL,
    explanation text NOT NULL,
    source text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: category_test_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.category_test_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: category_test_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.category_test_questions_id_seq OWNED BY public.category_test_questions.id;


--
-- Name: category_test_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_test_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    category_id character varying(10) NOT NULL,
    category_name character varying(100),
    attempt_number integer DEFAULT 1 NOT NULL,
    score integer NOT NULL,
    percentage integer NOT NULL,
    passed boolean DEFAULT false NOT NULL,
    correct_count integer NOT NULL,
    total_questions integer NOT NULL,
    duration_seconds integer,
    answers jsonb,
    completed_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT category_test_results_percentage_check CHECK (((percentage >= 0) AND (percentage <= 100)))
);


--
-- Name: category_tests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_tests (
    id integer NOT NULL,
    category_id text NOT NULL,
    category_name text NOT NULL,
    total_questions integer NOT NULL,
    passing_score integer NOT NULL,
    time_limit integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: category_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.category_tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: category_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.category_tests_id_seq OWNED BY public.category_tests.id;


--
-- Name: deep_dive_contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deep_dive_contents (
    id integer NOT NULL,
    training_id integer NOT NULL,
    title text NOT NULL,
    subtitle text,
    introduction text NOT NULL,
    sections jsonb NOT NULL,
    conclusion text NOT NULL,
    reference_list jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: deep_dive_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.deep_dive_contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: deep_dive_contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.deep_dive_contents_id_seq OWNED BY public.deep_dive_contents.id;


--
-- Name: deep_dive_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deep_dive_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    training_id integer NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: final_exam_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.final_exam_config (
    id integer DEFAULT 1 NOT NULL,
    total_questions integer DEFAULT 100 NOT NULL,
    passing_score integer DEFAULT 90 NOT NULL,
    time_limit integer DEFAULT 30 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT final_exam_config_single_row CHECK ((id = 1))
);


--
-- Name: final_exam_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.final_exam_questions (
    id integer NOT NULL,
    question_number integer NOT NULL,
    question text NOT NULL,
    options jsonb NOT NULL,
    correct_answer integer NOT NULL,
    explanation text NOT NULL,
    source text NOT NULL,
    difficulty text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT final_exam_questions_difficulty_check CHECK ((difficulty = ANY (ARRAY['basic'::text, 'intermediate'::text, 'advanced'::text])))
);


--
-- Name: final_exam_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.final_exam_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: final_exam_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.final_exam_questions_id_seq OWNED BY public.final_exam_questions.id;


--
-- Name: final_exam_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.final_exam_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    completed_at timestamp with time zone DEFAULT now() NOT NULL,
    score integer NOT NULL,
    percentage integer NOT NULL,
    passed boolean DEFAULT false NOT NULL,
    correct_count integer NOT NULL,
    total_questions integer DEFAULT 100 NOT NULL,
    duration integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text,
    name text,
    department text,
    join_date date,
    role text DEFAULT 'employee'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['employee'::text, 'manager'::text])))
);


--
-- Name: TABLE profiles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.profiles IS 'User profile information extending auth.users';


--
-- Name: COLUMN profiles.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.id IS 'References auth.users.id';


--
-- Name: COLUMN profiles.role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.role IS 'User role: employee, manager, or admin';


--
-- Name: quiz_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quiz_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    training_id integer NOT NULL,
    session_id uuid,
    quiz_type character varying(20) NOT NULL,
    question_id integer,
    selected_answer integer,
    is_correct boolean,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT quiz_responses_quiz_type_check CHECK (((quiz_type)::text = ANY (ARRAY[('review_quiz'::character varying)::text, ('quick_check'::character varying)::text, ('simulation'::character varying)::text, ('reflection'::character varying)::text])))
);


--
-- Name: session_contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session_contents (
    id integer NOT NULL,
    training_id integer NOT NULL,
    title text NOT NULL,
    key_phrase text NOT NULL,
    badge jsonb NOT NULL,
    mood_options jsonb NOT NULL,
    review_quiz jsonb,
    story jsonb NOT NULL,
    infographic jsonb,
    quick_check jsonb,
    quote jsonb,
    simulation jsonb,
    reflection jsonb,
    action_options jsonb,
    work jsonb,
    deep_dive jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    roleplay jsonb
);


--
-- Name: TABLE session_contents; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.session_contents IS 'インタラクティブセッションのコンテンツデータ';


--
-- Name: COLUMN session_contents.training_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.training_id IS '研修ID（trainings.idと対応）';


--
-- Name: COLUMN session_contents.title; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.title IS 'セッションのタイトル';


--
-- Name: COLUMN session_contents.key_phrase; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.key_phrase IS 'キーフレーズ';


--
-- Name: COLUMN session_contents.badge; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.badge IS 'バッジ情報（name, icon）';


--
-- Name: COLUMN session_contents.mood_options; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.mood_options IS '気分選択オプション';


--
-- Name: COLUMN session_contents.review_quiz; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.review_quiz IS '復習クイズ';


--
-- Name: COLUMN session_contents.story; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.story IS 'ストーリーコンテンツ（part1, part2）';


--
-- Name: COLUMN session_contents.infographic; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.infographic IS 'インフォグラフィック情報';


--
-- Name: COLUMN session_contents.quick_check; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.quick_check IS 'クイックチェック問題';


--
-- Name: COLUMN session_contents.quote; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.quote IS '名言';


--
-- Name: COLUMN session_contents.simulation; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.simulation IS 'シミュレーション問題';


--
-- Name: COLUMN session_contents.reflection; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.reflection IS '振り返り設問';


--
-- Name: COLUMN session_contents.action_options; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.action_options IS 'アクションオプション';


--
-- Name: COLUMN session_contents.work; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.work IS 'ワーク課題';


--
-- Name: COLUMN session_contents.deep_dive; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.deep_dive IS '深掘りコンテンツ';


--
-- Name: COLUMN session_contents.roleplay; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.session_contents.roleplay IS 'Roleplay scenarios with dialogue-based practice';


--
-- Name: session_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.session_contents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: session_contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.session_contents_id_seq OWNED BY public.session_contents.id;


--
-- Name: training_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.training_categories (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    total_duration integer NOT NULL,
    target_level text NOT NULL,
    color text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: training_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.training_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    training_id integer NOT NULL,
    category_id character varying(10) NOT NULL,
    training_title character varying(255),
    attempt_number integer DEFAULT 1 NOT NULL,
    duration_seconds integer,
    overall_score integer,
    max_score integer DEFAULT 100,
    evaluation jsonb,
    feedback text,
    strengths text[],
    improvements text[],
    completed_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    category_name character varying(100),
    CONSTRAINT training_sessions_overall_score_check CHECK (((overall_score >= 0) AND (overall_score <= 200)))
);


--
-- Name: trainings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trainings (
    id integer NOT NULL,
    category_id text NOT NULL,
    title text NOT NULL,
    subtitle text,
    duration integer NOT NULL,
    level text NOT NULL,
    detail jsonb,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_reflections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_reflections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    training_id integer NOT NULL,
    session_id uuid,
    reflection_type character varying(20) NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_reflections_reflection_type_check CHECK (((reflection_type)::text = ANY (ARRAY[('reflection'::character varying)::text, ('action'::character varying)::text, ('work'::character varying)::text, ('note'::character varying)::text])))
);


--
-- Name: user_training_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_training_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    training_id integer NOT NULL,
    category_id character varying(10) NOT NULL,
    status character varying(20) DEFAULT 'not_started'::character varying NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_training_progress_status_check CHECK (((status)::text = ANY (ARRAY[('not_started'::character varying)::text, ('in_progress'::character varying)::text, ('completed'::character varying)::text])))
);


--
-- Name: category_deep_dive_contents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_deep_dive_contents ALTER COLUMN id SET DEFAULT nextval('public.category_deep_dive_contents_id_seq'::regclass);


--
-- Name: category_test_questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_test_questions ALTER COLUMN id SET DEFAULT nextval('public.category_test_questions_id_seq'::regclass);


--
-- Name: category_tests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_tests ALTER COLUMN id SET DEFAULT nextval('public.category_tests_id_seq'::regclass);


--
-- Name: deep_dive_contents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deep_dive_contents ALTER COLUMN id SET DEFAULT nextval('public.deep_dive_contents_id_seq'::regclass);


--
-- Name: final_exam_questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.final_exam_questions ALTER COLUMN id SET DEFAULT nextval('public.final_exam_questions_id_seq'::regclass);


--
-- Name: session_contents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_contents ALTER COLUMN id SET DEFAULT nextval('public.session_contents_id_seq'::regclass);


--
-- Name: category_deep_dive_contents category_deep_dive_contents_category_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_deep_dive_contents
    ADD CONSTRAINT category_deep_dive_contents_category_id_key UNIQUE (category_id);


--
-- Name: category_deep_dive_contents category_deep_dive_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_deep_dive_contents
    ADD CONSTRAINT category_deep_dive_contents_pkey PRIMARY KEY (id);


--
-- Name: category_test_questions category_test_questions_category_test_id_question_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_test_questions
    ADD CONSTRAINT category_test_questions_category_test_id_question_number_key UNIQUE (category_test_id, question_number);


--
-- Name: category_test_questions category_test_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_test_questions
    ADD CONSTRAINT category_test_questions_pkey PRIMARY KEY (id);


--
-- Name: category_test_results category_test_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_test_results
    ADD CONSTRAINT category_test_results_pkey PRIMARY KEY (id);


--
-- Name: category_tests category_tests_category_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_tests
    ADD CONSTRAINT category_tests_category_id_key UNIQUE (category_id);


--
-- Name: category_tests category_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_tests
    ADD CONSTRAINT category_tests_pkey PRIMARY KEY (id);


--
-- Name: deep_dive_contents deep_dive_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deep_dive_contents
    ADD CONSTRAINT deep_dive_contents_pkey PRIMARY KEY (id);


--
-- Name: deep_dive_contents deep_dive_contents_training_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deep_dive_contents
    ADD CONSTRAINT deep_dive_contents_training_id_key UNIQUE (training_id);


--
-- Name: deep_dive_progress deep_dive_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deep_dive_progress
    ADD CONSTRAINT deep_dive_progress_pkey PRIMARY KEY (id);


--
-- Name: deep_dive_progress deep_dive_progress_user_id_training_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deep_dive_progress
    ADD CONSTRAINT deep_dive_progress_user_id_training_id_key UNIQUE (user_id, training_id);


--
-- Name: final_exam_config final_exam_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.final_exam_config
    ADD CONSTRAINT final_exam_config_pkey PRIMARY KEY (id);


--
-- Name: final_exam_questions final_exam_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.final_exam_questions
    ADD CONSTRAINT final_exam_questions_pkey PRIMARY KEY (id);


--
-- Name: final_exam_questions final_exam_questions_question_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.final_exam_questions
    ADD CONSTRAINT final_exam_questions_question_number_key UNIQUE (question_number);


--
-- Name: final_exam_results final_exam_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.final_exam_results
    ADD CONSTRAINT final_exam_results_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: quiz_responses quiz_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_responses
    ADD CONSTRAINT quiz_responses_pkey PRIMARY KEY (id);


--
-- Name: session_contents session_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_contents
    ADD CONSTRAINT session_contents_pkey PRIMARY KEY (id);


--
-- Name: session_contents session_contents_training_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_contents
    ADD CONSTRAINT session_contents_training_id_key UNIQUE (training_id);


--
-- Name: training_categories training_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_categories
    ADD CONSTRAINT training_categories_pkey PRIMARY KEY (id);


--
-- Name: training_sessions training_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_sessions
    ADD CONSTRAINT training_sessions_pkey PRIMARY KEY (id);


--
-- Name: trainings trainings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_pkey PRIMARY KEY (id);


--
-- Name: user_reflections user_reflections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_reflections
    ADD CONSTRAINT user_reflections_pkey PRIMARY KEY (id);


--
-- Name: user_training_progress user_training_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_progress
    ADD CONSTRAINT user_training_progress_pkey PRIMARY KEY (id);


--
-- Name: user_training_progress user_training_progress_user_id_training_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_progress
    ADD CONSTRAINT user_training_progress_user_id_training_id_key UNIQUE (user_id, training_id);


--
-- Name: idx_category_deep_dive_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_category_deep_dive_category_id ON public.category_deep_dive_contents USING btree (category_id);


--
-- Name: idx_category_test_questions_test_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_category_test_questions_test_id ON public.category_test_questions USING btree (category_test_id);


--
-- Name: idx_category_test_results_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_category_test_results_category ON public.category_test_results USING btree (category_id);


--
-- Name: idx_category_test_results_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_category_test_results_user_id ON public.category_test_results USING btree (user_id);


--
-- Name: idx_category_tests_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_category_tests_category_id ON public.category_tests USING btree (category_id);


--
-- Name: idx_deep_dive_progress_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deep_dive_progress_user_id ON public.deep_dive_progress USING btree (user_id);


--
-- Name: idx_deep_dive_training; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deep_dive_training ON public.deep_dive_contents USING btree (training_id);


--
-- Name: idx_final_exam_questions_difficulty; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_final_exam_questions_difficulty ON public.final_exam_questions USING btree (difficulty);


--
-- Name: idx_final_exam_questions_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_final_exam_questions_number ON public.final_exam_questions USING btree (question_number);


--
-- Name: idx_final_exam_results_completed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_final_exam_results_completed_at ON public.final_exam_results USING btree (completed_at);


--
-- Name: idx_final_exam_results_passed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_final_exam_results_passed ON public.final_exam_results USING btree (passed);


--
-- Name: idx_final_exam_results_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_final_exam_results_user_id ON public.final_exam_results USING btree (user_id);


--
-- Name: idx_quiz_responses_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quiz_responses_session_id ON public.quiz_responses USING btree (session_id);


--
-- Name: idx_quiz_responses_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_quiz_responses_user_id ON public.quiz_responses USING btree (user_id);


--
-- Name: idx_session_contents_training_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_session_contents_training_id ON public.session_contents USING btree (training_id);


--
-- Name: idx_training_sessions_training_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_training_sessions_training_id ON public.training_sessions USING btree (training_id);


--
-- Name: idx_training_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_training_sessions_user_id ON public.training_sessions USING btree (user_id);


--
-- Name: idx_trainings_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_trainings_category ON public.trainings USING btree (category_id);


--
-- Name: idx_user_reflections_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_reflections_user_id ON public.user_reflections USING btree (user_id);


--
-- Name: idx_user_training_progress_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_training_progress_category ON public.user_training_progress USING btree (category_id);


--
-- Name: idx_user_training_progress_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_training_progress_user_id ON public.user_training_progress USING btree (user_id);


--
-- Name: profiles profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: category_deep_dive_contents category_deep_dive_contents_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_deep_dive_contents
    ADD CONSTRAINT category_deep_dive_contents_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.training_categories(id) ON DELETE CASCADE;


--
-- Name: category_test_questions category_test_questions_category_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_test_questions
    ADD CONSTRAINT category_test_questions_category_test_id_fkey FOREIGN KEY (category_test_id) REFERENCES public.category_tests(id) ON DELETE CASCADE;


--
-- Name: category_test_results category_test_results_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_test_results
    ADD CONSTRAINT category_test_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: category_tests category_tests_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_tests
    ADD CONSTRAINT category_tests_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.training_categories(id) ON DELETE CASCADE;


--
-- Name: deep_dive_progress deep_dive_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deep_dive_progress
    ADD CONSTRAINT deep_dive_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quiz_responses quiz_responses_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_responses
    ADD CONSTRAINT quiz_responses_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.training_sessions(id) ON DELETE CASCADE;


--
-- Name: quiz_responses quiz_responses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_responses
    ADD CONSTRAINT quiz_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: training_sessions training_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.training_sessions
    ADD CONSTRAINT training_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: trainings trainings_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trainings
    ADD CONSTRAINT trainings_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.training_categories(id);


--
-- Name: user_reflections user_reflections_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_reflections
    ADD CONSTRAINT user_reflections_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.training_sessions(id) ON DELETE CASCADE;


--
-- Name: user_reflections user_reflections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_reflections
    ADD CONSTRAINT user_reflections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_training_progress user_training_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_training_progress
    ADD CONSTRAINT user_training_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: final_exam_questions Allow admin insert on final_exam_questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow admin insert on final_exam_questions" ON public.final_exam_questions FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- Name: final_exam_config Allow admin update on final_exam_config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow admin update on final_exam_config" ON public.final_exam_config FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- Name: final_exam_questions Allow admin update on final_exam_questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow admin update on final_exam_questions" ON public.final_exam_questions FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))));


--
-- Name: final_exam_results Allow authenticated insert for final exam results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow authenticated insert for final exam results" ON public.final_exam_results FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: final_exam_config Allow authenticated insert on final_exam_config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow authenticated insert on final_exam_config" ON public.final_exam_config FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: category_deep_dive_contents Allow public read access on category_deep_dive_contents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access on category_deep_dive_contents" ON public.category_deep_dive_contents FOR SELECT USING (true);


--
-- Name: deep_dive_contents Allow public read access on deep_dive_contents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access on deep_dive_contents" ON public.deep_dive_contents FOR SELECT USING (true);


--
-- Name: final_exam_config Allow public read access on final_exam_config; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access on final_exam_config" ON public.final_exam_config FOR SELECT USING (true);


--
-- Name: final_exam_questions Allow public read access on final_exam_questions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access on final_exam_questions" ON public.final_exam_questions FOR SELECT USING (true);


--
-- Name: training_categories Allow public read access on training_categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access on training_categories" ON public.training_categories FOR SELECT USING (true);


--
-- Name: trainings Allow public read access on trainings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access on trainings" ON public.trainings FOR SELECT USING (true);


--
-- Name: deep_dive_progress Users can insert own deep dive progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own deep dive progress" ON public.deep_dive_progress FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: final_exam_results Users can insert own final exam results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own final exam results" ON public.final_exam_results FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_training_progress Users can insert own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own progress" ON public.user_training_progress FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: quiz_responses Users can insert own quiz responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own quiz responses" ON public.quiz_responses FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_reflections Users can insert own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own reflections" ON public.user_reflections FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: category_test_results Users can insert own test results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own test results" ON public.category_test_results FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_training_progress Users can insert own training progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own training progress" ON public.user_training_progress FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: training_sessions Users can insert own training sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own training sessions" ON public.training_sessions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: deep_dive_progress Users can update own deep dive progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own deep dive progress" ON public.deep_dive_progress FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_training_progress Users can update own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own progress" ON public.user_training_progress FOR UPDATE TO authenticated USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_reflections Users can update own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own reflections" ON public.user_reflections FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_training_progress Users can update own training progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own training progress" ON public.user_training_progress FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: training_sessions Users can update own training sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own training sessions" ON public.training_sessions FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: deep_dive_progress Users can view own deep dive progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own deep dive progress" ON public.deep_dive_progress FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: final_exam_results Users can view own final exam results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own final exam results" ON public.final_exam_results FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: quiz_responses Users can view own quiz responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own quiz responses" ON public.quiz_responses FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_reflections Users can view own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own reflections" ON public.user_reflections FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: category_test_results Users can view own test results; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own test results" ON public.category_test_results FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_training_progress Users can view own training progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own training progress" ON public.user_training_progress FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: training_sessions Users can view own training sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own training sessions" ON public.training_sessions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: category_deep_dive_contents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.category_deep_dive_contents ENABLE ROW LEVEL SECURITY;

--
-- Name: category_test_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.category_test_results ENABLE ROW LEVEL SECURITY;

--
-- Name: deep_dive_contents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deep_dive_contents ENABLE ROW LEVEL SECURITY;

--
-- Name: deep_dive_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.deep_dive_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: final_exam_config; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.final_exam_config ENABLE ROW LEVEL SECURITY;

--
-- Name: final_exam_questions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.final_exam_questions ENABLE ROW LEVEL SECURITY;

--
-- Name: final_exam_results; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.final_exam_results ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles_insert_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_insert_own ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: profiles profiles_select_managers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_select_managers ON public.profiles FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = 'manager'::text)))));


--
-- Name: profiles profiles_select_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_select_own ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: profiles profiles_update_own; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: quiz_responses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

--
-- Name: session_contents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.session_contents ENABLE ROW LEVEL SECURITY;

--
-- Name: session_contents session_contents_read_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY session_contents_read_policy ON public.session_contents FOR SELECT USING (true);


--
-- Name: training_categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.training_categories ENABLE ROW LEVEL SECURITY;

--
-- Name: training_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: trainings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

--
-- Name: user_reflections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_reflections ENABLE ROW LEVEL SECURITY;

--
-- Name: user_training_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_training_progress ENABLE ROW LEVEL SECURITY;

--

-- ============================================
-- Auth trigger: 新規ユーザー登録時にプロフィール自動作成
-- ============================================
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- End of init migration
--


