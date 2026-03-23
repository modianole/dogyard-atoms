
-- ============================================================
-- 1. ENUMS FOR DOGS
-- ============================================================
DO $$ BEGIN
    CREATE TYPE public.dog_size AS ENUM ('small', 'medium', 'large', 'giant');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.dog_gender AS ENUM ('male', 'female');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 2. DOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.dogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT,
  birthday DATE,
  gender public.dog_gender,
  size public.dog_size,
  temperament TEXT[], -- Array of traits like 'friendly', 'energetic', etc.
  bio TEXT,
  image_url TEXT,
  is_neutered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. SECURITY (RLS)
-- ============================================================
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;

-- Everyone can view dogs (to see who is in the park)
CREATE POLICY "Dogs are viewable by everyone" ON public.dogs
  FOR SELECT USING (true);

-- Users can manage only their own dogs
CREATE POLICY "Users can insert own dogs" ON public.dogs
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own dogs" ON public.dogs
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own dogs" ON public.dogs
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================================
-- 4. TRIGGERS
-- ============================================================
CREATE TRIGGER update_dogs_updated_at
  BEFORE UPDATE ON public.dogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5. STORAGE BUCKET FOR DOG IMAGES
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('dog-images', 'dog-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Dog images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'dog-images');

CREATE POLICY "Users can upload dog images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'dog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own dog images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'dog-images' AND auth.uid() IS NOT NULL);

-- ============================================================
-- 6. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_dogs_owner ON public.dogs (owner_id);
