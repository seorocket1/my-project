-- Add branding columns to the users table
ALTER TABLE public.users
ADD COLUMN brand_color TEXT,
ADD COLUMN brand_logo_url TEXT;