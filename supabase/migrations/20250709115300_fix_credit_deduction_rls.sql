-- Drop the existing policy
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.users;

-- Create a new policy that allows users to update their own profile, including credits
CREATE POLICY "Allow users to update their own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
