
-- Seed reasonable peak hours data for all gardens
DO $$
DECLARE
    g RECORD;
    d INTEGER;
    h INTEGER;
    v INTEGER;
BEGIN
    FOR g IN SELECT id FROM public.gardens LOOP
        FOR d IN 0..6 LOOP -- Days of week (0=Sunday, 6=Saturday)
            FOR h IN 0..23 LOOP -- Hours (0-23)
                -- Reasonable visitor count logic based on typical Israeli dog owner patterns:
                -- Morning peak: 07:00 - 09:00 (Before work)
                -- Evening peak: 18:00 - 21:00 (After work)
                -- Weekend (Fri/Sat): Higher mid-day activity

                IF (d = 5 OR d = 6) AND (h BETWEEN 10 AND 15) THEN
                    -- Weekend midday peak
                    v := floor(random() * 12 + 8);
                ELSIF h BETWEEN 7 AND 9 THEN
                    -- Morning rush
                    v := floor(random() * 15 + 10);
                ELSIF h BETWEEN 18 AND 21 THEN
                    -- Evening rush
                    v := floor(random() * 20 + 15);
                ELSIF h BETWEEN 22 AND 23 THEN
                    -- Late night
                    v := floor(random() * 5 + 2);
                ELSIF h BETWEEN 10 AND 17 THEN
                    -- Midday (Work hours)
                    v := floor(random() * 6 + 1);
                ELSE
                    -- Night (00:00 - 06:00)
                    v := floor(random() * 3);
                END IF;

                INSERT INTO public.peak_hours (garden_id, day_of_week, hour, visitor_count)
                VALUES (g.id, d, h, v)
                ON CONFLICT (garden_id, day_of_week, hour) DO UPDATE
                SET visitor_count = EXCLUDED.visitor_count,
                    updated_at = now();
            END LOOP;
        END LOOP;
    END LOOP;
END $$;
