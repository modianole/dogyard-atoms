-- ══════════════════════════════════════════════════════════
--  הדבק את כל הקובץ הזה ב: Supabase Dashboard → SQL Editor
--  https://supabase.com/dashboard/project/keccmcwkqguooifloxnt/sql
-- ══════════════════════════════════════════════════════════

-- ============================================================
-- Create public.shalter (dependency-safe)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.shalter (
  id               UUID             NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  google_place_id  TEXT             UNIQUE,
  name             TEXT             NOT NULL,
  name_en          TEXT,
  location         TEXT             NOT NULL,
  location_en      TEXT,
  lat              DOUBLE PRECISION NOT NULL,
  lng              DOUBLE PRECISION NOT NULL,
  type             TEXT             NOT NULL DEFAULT 'protected_space',
  image_url        TEXT,
  rating           NUMERIC(2,1)     DEFAULT 0,
  reviews_count    INTEGER          DEFAULT 0,
  capacity         INTEGER,
  is_accessible    BOOLEAN          DEFAULT false,
  contact_phone    TEXT,
  contact_email    TEXT,
  created_by       UUID,
  created_at       TIMESTAMPTZ      NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ      NOT NULL DEFAULT now()
);

ALTER TABLE public.shalter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Shalter viewable by everyone" ON public.shalter;
CREATE POLICY "Shalter viewable by everyone"
  ON public.shalter FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can add shalter" ON public.shalter;
CREATE POLICY "Authenticated users can add shalter"
  ON public.shalter FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_shalter_location
  ON public.shalter (lat, lng);

CREATE INDEX IF NOT EXISTS idx_shalter_type
  ON public.shalter (type);

CREATE INDEX IF NOT EXISTS idx_shalter_google_place_id
  ON public.shalter (google_place_id)
  WHERE google_place_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_shalter_created_at
  ON public.shalter (created_at DESC);

-- Verify
SELECT to_regclass('public.shalter') AS created_table;
