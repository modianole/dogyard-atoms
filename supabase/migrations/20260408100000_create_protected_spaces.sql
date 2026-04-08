-- ============================================================
-- CREATE PROTECTED SPACES TABLE (Mmarot Muganim - ממ"ד)
-- ============================================================

CREATE TABLE public.protected_spaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  location TEXT NOT NULL,
  location_en TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  type VARCHAR(50) DEFAULT 'protected_space', -- ממ"ד, מקלט, etc.
  image_url TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  capacity INTEGER,
  is_accessible BOOLEAN DEFAULT false,
  contact_phone TEXT,
  contact_email TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.protected_spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Protected spaces viewable by everyone" ON public.protected_spaces FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add protected spaces" ON public.protected_spaces FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update protected spaces" ON public.protected_spaces FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete protected spaces" ON public.protected_spaces FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_protected_spaces_updated_at BEFORE UPDATE ON public.protected_spaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create spatial index for faster location-based queries
CREATE INDEX idx_protected_spaces_location ON public.protected_spaces (lat, lng);
CREATE INDEX idx_protected_spaces_type ON public.protected_spaces (type);
CREATE INDEX idx_protected_spaces_created_at ON public.protected_spaces (created_at DESC);

