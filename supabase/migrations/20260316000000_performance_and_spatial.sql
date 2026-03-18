
-- 1. ENABLE POSTGIS FOR SPATIAL QUERIES
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. ADD GEOGRAPHY COLUMN TO GARDENS FOR FAST SPATIAL SEARCH
ALTER TABLE public.gardens ADD COLUMN geom geography(Point, 4326);

-- UPDATE GEOM FROM EXISTING LAT/LNG
UPDATE public.gardens SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography;

-- INDEX FOR SPATIAL SEARCH
CREATE INDEX idx_gardens_geom ON public.gardens USING GIST (geom);

-- 3. CHECK-INS TABLE (Real-time feature)
CREATE TABLE public.check_ins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  garden_id UUID NOT NULL REFERENCES public.gardens(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '2 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEXES FOR CHECK-INS
CREATE INDEX idx_check_ins_garden ON public.check_ins (garden_id);
CREATE INDEX idx_check_ins_expires ON public.check_ins (expires_at);

-- RLS FOR CHECK-INS
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Check-ins viewable by everyone" ON public.check_ins FOR SELECT USING (true);
CREATE POLICY "Users can check-in" ON public.check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own check-in" ON public.check_ins FOR DELETE USING (auth.uid() = user_id);

-- 4. FUNCTION TO FIND NEARBY GARDENS (Server-side)
CREATE OR REPLACE FUNCTION public.get_nearby_gardens(user_lat float, user_lng float, radius_meters float DEFAULT 5000)
RETURNS SETOF public.gardens AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.gardens
  WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography, radius_meters)
  ORDER BY geom <-> ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography;
END;
$$ LANGUAGE plpgsql STABLE;

-- 5. PERFORMANCE INDEXES FOR FOREIGN KEYS
CREATE INDEX IF NOT EXISTS idx_reviews_garden_id ON public.reviews(garden_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON public.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON public.menu_items(restaurant_id);
