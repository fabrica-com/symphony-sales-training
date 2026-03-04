-- Create profiles table for user profile information
-- This table extends auth.users with application-specific user data

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  department TEXT,
  join_date DATE,
  role TEXT DEFAULT 'employee' CHECK (role IN ('employee', 'manager', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO public
  USING (auth.uid() = id);

-- Managers and admins can read all profiles
CREATE POLICY "profiles_select_managers"
  ON public.profiles
  FOR SELECT
  TO public
  USING (
    (auth.jwt() ->> 'role') = ANY (ARRAY['manager', 'admin']) OR
    ((auth.jwt() -> 'user_metadata') ->> 'role') = ANY (ARRAY['manager', 'admin'])
  );

-- Users can insert their own profile (for trigger)
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id);

-- Admins can delete profiles
CREATE POLICY "profiles_delete_admin"
  ON public.profiles
  FOR DELETE
  TO public
  USING (
    (auth.jwt() ->> 'role') = 'admin' OR
    ((auth.jwt() -> 'user_metadata') ->> 'role') = 'admin'
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.profiles IS 'User profile information extending auth.users';
COMMENT ON COLUMN public.profiles.id IS 'References auth.users.id';
COMMENT ON COLUMN public.profiles.role IS 'User role: employee, manager, or admin';

