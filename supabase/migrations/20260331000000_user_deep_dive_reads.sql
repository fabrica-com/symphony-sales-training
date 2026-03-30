CREATE TABLE IF NOT EXISTS public.user_deep_dive_reads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  training_id INTEGER NOT NULL REFERENCES public.trainings(id),
  read_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, training_id)
);

CREATE INDEX IF NOT EXISTS idx_deep_dive_reads_user
  ON public.user_deep_dive_reads (user_id);

ALTER TABLE public.user_deep_dive_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deep dive reads"
  ON public.user_deep_dive_reads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deep dive reads"
  ON public.user_deep_dive_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);
