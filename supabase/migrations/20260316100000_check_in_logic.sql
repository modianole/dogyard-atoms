
-- 1. Create check-in status enum
DO $$ BEGIN
    CREATE TYPE public.check_in_status AS ENUM ('arrived', 'on_way');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Enhance check_ins table
ALTER TABLE public.check_ins ADD COLUMN IF NOT EXISTS status public.check_in_status NOT NULL DEFAULT 'arrived';
ALTER TABLE public.check_ins ADD COLUMN IF NOT EXISTS arrival_at TIMESTAMPTZ;

-- 3. Update RLS (already enabled in previous step, but ensuring policies)
DROP POLICY IF EXISTS "Users can check-in" ON public.check_ins;
CREATE POLICY "Users can manage own check-in" ON public.check_ins
  FOR ALL USING (auth.uid() = user_id);

-- 4. Function to automatically "promote" on_way to arrived after 15 mins is handled in queries for now,
-- but we'll provide a view or function to get active visitors.

CREATE OR REPLACE VIEW public.active_garden_visitors AS
SELECT
    *,
    CASE
        WHEN status = 'on_way' AND now() >= arrival_at THEN 'arrived'::public.check_in_status
        ELSE status
    END as current_status
FROM public.check_ins
WHERE expires_at > now();
