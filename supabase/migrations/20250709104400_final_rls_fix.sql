-- Step 1: Remove the default value from the id column
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;

-- Step 2: Re-create the RLS policies
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.users;
CREATE POLICY "Allow users to insert their own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow public read access to all users" ON public.users;
CREATE POLICY "Allow public read access to all users"
  ON public.users
  FOR SELECT
  USING (true);
