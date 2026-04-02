
-- 1. Clean up old columns if they exist
ALTER TABLE public.gardens DROP COLUMN IF EXISTS status;
ALTER TABLE public.gardens DROP COLUMN IF EXISTS is_approved;

-- 2. Ensure RLS policies are open for viewing
DROP POLICY IF EXISTS "Gardens viewable by everyone" ON public.gardens;
DROP POLICY IF EXISTS "Anyone can view approved gardens" ON public.gardens;

CREATE POLICY "Gardens viewable by everyone"
ON public.gardens FOR SELECT
USING (true);

-- 3. Maintenance of other policies
DROP POLICY IF EXISTS "Authenticated users can insert gardens" ON public.gardens;
CREATE POLICY "Authenticated users can insert gardens"
ON public.gardens FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can update gardens" ON public.gardens;
CREATE POLICY "Admins can update gardens"
ON public.gardens FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete gardens" ON public.gardens;
CREATE POLICY "Admins can delete gardens"
ON public.gardens FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
