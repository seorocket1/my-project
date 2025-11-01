-- Remove color columns from the users table
ALTER TABLE public.users
DROP COLUMN IF EXISTS brand_primary_color,
DROP COLUMN IF EXISTS brand_secondary_color,
DROP COLUMN IF EXISTS brand_accent_color;