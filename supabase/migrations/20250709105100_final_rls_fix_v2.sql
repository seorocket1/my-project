-- Drop all existing policies on the users table to ensure a clean slate
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow public read access to all users" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Allow users to read their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.users;

-- Create a new policy that allows any authenticated user to insert their own profile
DROP POLICY IF EXISTS "Allow authenticated users to insert their own profile" ON public.users;
CREATE POLICY "Allow authenticated users to insert their own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create a new policy that allows users to view their own profile
CREATE POLICY "Allow users to view their own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
