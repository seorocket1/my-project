DROP POLICY IF EXISTS "Allow authenticated users to insert subscription requests" ON public.subscription_requests;

CREATE POLICY "Allow authenticated and anonymous users to insert subscription requests"
ON public.subscription_requests FOR INSERT TO public WITH CHECK (true);