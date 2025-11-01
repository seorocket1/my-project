-- Add branding guidelines column to the users table
ALTER TABLE public.users
ADD COLUMN brand_guidelines TEXT;