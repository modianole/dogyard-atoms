
-- Insert Initial Gardens (Tel Aviv Area)
INSERT INTO public.gardens (id, name, name_en, location, location_en, lat, lng, rating, reviews_count, has_fence, has_water, has_shade, has_lighting, has_parking)
VALUES
  (gen_random_uuid(), 'גינת צהלה', 'Tzahala Garden', 'רח׳ צהלה, תל אביב', 'Tzahala St., Tel Aviv', 32.1158, 34.8218, 4.8, 124, true, true, true, true, true),
  (gen_random_uuid(), 'גינת הכלבים הצפון הישן', 'Old North Dog Garden', 'הצפון הישן, תל אביב', 'Old North, Tel Aviv', 32.0915, 34.7820, 4.6, 89, true, true, true, true, false),
  (gen_random_uuid(), 'גינת דיזנגוב', 'Dizengoff Garden', 'רחוב דיזנגוב, תל אביב', 'Dizengoff St., Tel Aviv', 32.0768, 34.7745, 4.5, 210, true, true, true, true, false),
  (gen_random_uuid(), 'גינת כלבים וכטנגוב', 'Wachtangov Dog Garden', 'רחוב וכטנגוב 6, תל אביב', '6 Wachtangov St., Tel Aviv', 32.0520, 34.7510, 4.7, 45, true, true, false, true, true),
  (gen_random_uuid(), 'גינת הכלבים פארק הירקון (צפון)', 'Yarkon Park Dog Garden (North)', 'פארק הירקון, תל אביב', 'Yarkon Park, Tel Aviv', 32.1020, 34.7950, 4.9, 156, true, true, true, true, true),
  (gen_random_uuid(), 'גינת הכלבים יהושע', 'Yehoshua Dog Garden', 'גן יהושע, תל אביב', 'Gan Yehoshua, Tel Aviv', 32.0980, 34.8080, 4.4, 72, true, true, true, true, true);

-- Insert some Mock Check-ins to show activity
-- Note: These will need valid user_ids from your auth.users table to work in a real environment,
-- but for local testing without RLS blocks on the View, they provide data.
