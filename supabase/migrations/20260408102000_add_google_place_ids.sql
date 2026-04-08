-- ============================================================
-- ADD GOOGLE PLACE IDS FOR SAFE RE-IMPORTS / UPSERTS
-- ============================================================

ALTER TABLE public.gardens
ADD COLUMN IF NOT EXISTS google_place_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_gardens_google_place_id
ON public.gardens (google_place_id)
WHERE google_place_id IS NOT NULL;

ALTER TABLE public.protected_spaces
ADD COLUMN IF NOT EXISTS google_place_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_protected_spaces_google_place_id
ON public.protected_spaces (google_place_id)
WHERE google_place_id IS NOT NULL;

