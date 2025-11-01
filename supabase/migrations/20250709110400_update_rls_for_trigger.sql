-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON public.users;

-- Create new policies
CREATE POLICY "Allow users to view their own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
