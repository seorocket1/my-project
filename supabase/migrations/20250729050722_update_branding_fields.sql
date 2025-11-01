-- Add new branding columns and remove unused ones
ALTER TABLE public.users
ADD COLUMN brand_name TEXT,
ADD COLUMN brand_accent_color TEXT,
DROP COLUMN IF EXISTS brand_website;