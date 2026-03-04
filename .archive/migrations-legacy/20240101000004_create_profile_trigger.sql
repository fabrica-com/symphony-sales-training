-- Update trigger function to automatically create profile when user signs up
-- This handles both email/password signups and OAuth signups (Google, etc.)
-- Google OAuth provides 'full_name' in raw_user_meta_data

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    department,
    join_date,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    -- Extract name from raw_user_meta_data (Google OAuth provides 'full_name' or 'name')
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.email  -- Fallback to email if no name is provided
    ),
    '未設定',
    CURRENT_DATE,
    'employee'
  )
  ON CONFLICT (id) DO NOTHING;  -- Prevent errors if profile already exists
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires when a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add comment for documentation
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile record when a new user signs up via email/password or OAuth';

