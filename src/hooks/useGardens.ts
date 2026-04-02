import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Garden {
  id: string;
  name: string;
  name_en: string | null;
  location: string;
  location_en: string | null;
  lat: number;
  lng: number;
  image_url: string | null;
  rating: number | null;
  reviews_count: number | null;
  has_fence: boolean | null;
  has_water: boolean | null;
  has_shade: boolean | null;
  has_lighting: boolean | null;
  has_parking: boolean | null;
  distance_meters?: number;
}

export const useGardens = () => {
  return useQuery({
    queryKey: ["gardens"],
    queryFn: async () => {
      console.log("🔍 Fetching ALL gardens from Supabase...");
      const { data, error, count } = await supabase
        .from("gardens")
        .select("*", { count: 'exact' });

      if (error) {
        console.error("❌ Error fetching gardens:", error);
        throw error;
      }

      console.log(`✅ Success! Found ${data?.length || 0} gardens total in DB. Total count: ${count}`);
      return data as Garden[];
    },
    staleTime: 0,
  });
};

export const useNearbyGardens = (lat?: number, lng?: number, radius = 5000) => {
  return useQuery({
    queryKey: ["nearby-gardens", lat, lng, radius],
    queryFn: async () => {
      if (!lat || !lng) return [];

      const { data, error } = await supabase.rpc("get_nearby_gardens", {
        user_lat: lat,
        user_lng: lng,
        radius_meters: radius,
      });

      if (error) throw error;
      return data as Garden[];
    },
    enabled: !!lat && !!lng,
  });
};
