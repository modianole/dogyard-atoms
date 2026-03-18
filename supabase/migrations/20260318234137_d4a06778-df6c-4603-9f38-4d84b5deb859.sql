
-- 1. Add status column
ALTER TABLE public.gardens ADD COLUMN status text NOT NULL DEFAULT 'pending';

-- 2. Drop existing RLS policies
DROP POLICY IF EXISTS "Gardens viewable by everyone" ON public.gardens;
DROP POLICY IF EXISTS "Authenticated users can add gardens" ON public.gardens;
DROP POLICY IF EXISTS "Admins can update gardens" ON public.gardens;
DROP POLICY IF EXISTS "Admins can delete gardens" ON public.gardens;

-- 3. New RLS policies
CREATE POLICY "Anyone can view approved gardens"
ON public.gardens FOR SELECT
USING (status = 'approved');

CREATE POLICY "Authenticated users can insert gardens"
ON public.gardens FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update gardens"
ON public.gardens FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gardens"
ON public.gardens FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
