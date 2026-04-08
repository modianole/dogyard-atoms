-- ============================================================
-- ADD INDEXES TO GARDENS TABLE FOR NAME_EN AND LOCATION_EN
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_gardens_name_en ON public.gardens (name_en);
CREATE INDEX IF NOT EXISTS idx_gardens_location_en ON public.gardens (location_en);
CREATE INDEX IF NOT EXISTS idx_gardens_location ON public.gardens (lat, lng);
CREATE INDEX IF NOT EXISTS idx_gardens_created_at ON public.gardens (created_at DESC);

-- ============================================================
-- ADD STATUS COLUMN TO GARDENS IF NOT EXISTS
-- ============================================================

-- This allows us to track garden approval status
ALTER TABLE public.gardens
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending'; -- pending, approved, rejected

CREATE INDEX IF NOT EXISTS idx_gardens_status ON public.gardens (status);

