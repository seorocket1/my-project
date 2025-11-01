ALTER TABLE public.users
ADD COLUMN blog_credits INT DEFAULT 0 NOT NULL,
ADD COLUMN infographic_credits INT DEFAULT 0 NOT NULL;

-- Migrate existing 'credits' to 'blog_credits' and 'infographic_credits' if needed
-- For simplicity, we'll just set them to 0 for existing users, or you can distribute existing credits.
-- For example, to distribute existing 'credits' equally:
-- UPDATE public.users SET blog_credits = credits / 2, infographic_credits = credits / 2;
-- Or to just set them to a default for existing users:
UPDATE public.users SET blog_credits = 100, infographic_credits = 100 WHERE credits IS NULL OR credits = 0;
UPDATE public.users SET blog_credits = credits, infographic_credits = credits WHERE credits > 0;


ALTER TABLE public.users
DROP COLUMN credits;