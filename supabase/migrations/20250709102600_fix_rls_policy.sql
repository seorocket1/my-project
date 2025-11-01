ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to all users"
ON public.users
FOR SELECT
USING (true);

-- This policy is duplicated in other migration files and will be removed from here.
