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
      const { data, error } = await supabase
        .from("gardens")
        .select("*")
        .order("rating", { ascending: false });
      if (error) throw error;
      return data as Garden[];
    },
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
