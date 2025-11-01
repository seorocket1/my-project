CREATE TABLE public.subscription_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    username TEXT NOT NULL,
    company_name TEXT,
    email TEXT NOT NULL,
    plan TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to insert subscription requests"
ON public.subscription_requests FOR INSERT TO authenticated WITH CHECK (true);

-- Optional: Allow admins to view all subscription requests
CREATE POLICY "Admins can view all subscription requests"
ON public.subscription_requests FOR SELECT TO authenticated USING (is_admin_user(auth.uid()));