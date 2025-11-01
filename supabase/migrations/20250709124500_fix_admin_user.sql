-- Step 1: Set all users to non-admin
UPDATE public.users SET is_admin = false;

-- Step 2: Set the specified user as admin
UPDATE public.users SET is_admin = true WHERE email = 'nigamaakash101@gmail.com';

-- Step 3: Correct the "Set First User as Admin" function
CREATE OR REPLACE FUNCTION set_first_user_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if any users exist
  IF (SELECT COUNT(*) FROM public.users) = 0 THEN
    NEW.is_admin = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
