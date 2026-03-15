
-- ============================================================
-- 1. ALL ENUMS
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'restaurant_owner', 'user');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');
CREATE TYPE public.hazard_status AS ENUM ('open', 'in_progress', 'resolved');

-- ============================================================
-- 2. TIMESTAMP HELPER
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================================
-- 3. USER ROLES TABLE
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. ROLE CHECKER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 5. PROFILES TABLE
-- ============================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  favorite_garden_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. GARDENS TABLE
-- ============================================================
CREATE TABLE public.gardens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  location TEXT NOT NULL,
  location_en TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  has_fence BOOLEAN DEFAULT false,
  has_water BOOLEAN DEFAULT false,
  has_shade BOOLEAN DEFAULT false,
  has_lighting BOOLEAN DEFAULT false,
  has_parking BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gardens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gardens viewable by everyone" ON public.gardens FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add gardens" ON public.gardens FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update gardens" ON public.gardens FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete gardens" ON public.gardens FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_gardens_updated_at BEFORE UPDATE ON public.gardens FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 7. RESTAURANTS TABLE
-- ============================================================
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  garden_id UUID REFERENCES public.gardens(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES auth.users(id),
  phone TEXT,
  delivery_note TEXT,
  delivery_note_en TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  opening_hours JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Restaurants viewable by everyone" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Owners can update own restaurant" ON public.restaurants FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Admins can manage restaurants" ON public.restaurants FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Restaurant owners can insert" ON public.restaurants FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND (public.has_role(auth.uid(), 'restaurant_owner') OR public.has_role(auth.uid(), 'admin'))
);
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 8. MENU ITEMS TABLE
-- ============================================================
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  category_en TEXT,
  image_url TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Menu items viewable by everyone" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Restaurant owners can manage menu items" ON public.menu_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins can manage all menu items" ON public.menu_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 9. DEALS TABLE
-- ============================================================
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  original_price NUMERIC(10,2) NOT NULL,
  deal_price NUMERIC(10,2) NOT NULL,
  items TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deals viewable by everyone" ON public.deals FOR SELECT USING (true);
CREATE POLICY "Restaurant owners can manage deals" ON public.deals FOR ALL USING (
  EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_id AND owner_id = auth.uid())
);
CREATE POLICY "Admins can manage all deals" ON public.deals FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 10. ORDERS TABLE
-- ============================================================
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Restaurant owners can view their orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_id AND owner_id = auth.uid())
);
CREATE POLICY "Authenticated users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Restaurant owners can update order status" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_id AND owner_id = auth.uid())
);
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 11. HAZARD REPORTS TABLE
-- ============================================================
CREATE TABLE public.hazard_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  garden_id UUID REFERENCES public.gardens(id),
  description TEXT NOT NULL,
  image_url TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  status hazard_status NOT NULL DEFAULT 'open',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hazard_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hazard reports viewable by everyone" ON public.hazard_reports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can report hazards" ON public.hazard_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reports" ON public.hazard_reports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all reports" ON public.hazard_reports FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_hazard_reports_updated_at BEFORE UPDATE ON public.hazard_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 12. REVIEWS TABLE
-- ============================================================
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  garden_id UUID NOT NULL REFERENCES public.gardens(id) ON DELETE CASCADE,
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, garden_id)
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_garden_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_garden_id UUID;
BEGIN
  target_garden_id := COALESCE(NEW.garden_id, OLD.garden_id);
  UPDATE public.gardens SET
    rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE garden_id = target_garden_id), 0),
    reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE garden_id = target_garden_id)
  WHERE id = target_garden_id;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_garden_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_garden_rating();

-- ============================================================
-- 13. PEAK HOURS TABLE
-- ============================================================
CREATE TABLE public.peak_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  garden_id UUID NOT NULL REFERENCES public.gardens(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
  visitor_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (garden_id, day_of_week, hour)
);
ALTER TABLE public.peak_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Peak hours viewable by everyone" ON public.peak_hours FOR SELECT USING (true);
CREATE POLICY "Admins can manage peak hours" ON public.peak_hours FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 14. STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('garden-images', 'garden-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('hazard-images', 'hazard-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('user-avatars', 'user-avatars', true);

CREATE POLICY "Garden images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'garden-images');
CREATE POLICY "Authenticated users can upload garden images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'garden-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Menu images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
CREATE POLICY "Restaurant owners can upload menu images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Restaurant owners can update menu images" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Hazard images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'hazard-images');
CREATE POLICY "Authenticated users can upload hazard images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hazard-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Avatars are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- 15. INDEXES
-- ============================================================
CREATE INDEX idx_gardens_location ON public.gardens (lat, lng);
CREATE INDEX idx_gardens_rating ON public.gardens (rating DESC);
CREATE INDEX idx_menu_items_restaurant ON public.menu_items (restaurant_id);
CREATE INDEX idx_menu_items_category ON public.menu_items (category);
CREATE INDEX idx_deals_restaurant ON public.deals (restaurant_id);
CREATE INDEX idx_orders_user ON public.orders (user_id);
CREATE INDEX idx_orders_restaurant ON public.orders (restaurant_id);
CREATE INDEX idx_orders_status ON public.orders (status);
CREATE INDEX idx_hazard_reports_garden ON public.hazard_reports (garden_id);
CREATE INDEX idx_hazard_reports_status ON public.hazard_reports (status);
CREATE INDEX idx_reviews_garden ON public.reviews (garden_id);
CREATE INDEX idx_peak_hours_garden ON public.peak_hours (garden_id);
