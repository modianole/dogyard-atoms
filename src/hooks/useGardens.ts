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

// Function to clean garden names in both Hebrew and English
export const formatGardenName = (name: string, location?: string | null, locale: "he" | "en" = "he"): string => {
  if (!name) return "";

  let cleanName = name.trim();

  if (locale === "en") {
    const normalized = cleanName.toLowerCase();
    if ((normalized.includes("dog park") || normalized.includes("dog garden")) && location) {
      const street = location.split(",")[0].replace(/\d+/g, "").trim();
      if (street) {
        cleanName = `Dog Park ${street}`;
      }
    }

    return cleanName.replace(/\s\s+/g, " ").trim();
  }

  // 1. If generic name, use location street
  if (name.includes("גינת כלבים") || name === "גינת" || name === "גינת הכלבים" || name.includes("גינת הכלבים")) {
    if (location) {
      const street = location.split(',')[0]
        .replace('רח׳', '')
        .replace('רחוב', '')
        .replace('גן', '')
        .trim();
      cleanName = `גינת ${street}`;
    }
  }

  // 2. ALWAYS remove numbers from the final name (e.g., "המלך ג'ורג' 35" -> "המלך ג'ורג'")
  return cleanName.replace(/[0-9]/g, '').replace(/\s\s+/g, ' ').trim();
};

export const useGardens = () => {
  return useQuery({
    queryKey: ["gardens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gardens")
        .select("*");

      if (error) throw error;

      return (data as Garden[]).map(garden => ({
        ...garden,
        name: formatGardenName(garden.name, garden.location),
        name_en: garden.name_en ? formatGardenName(garden.name_en, garden.location_en ?? garden.location, "en") : garden.name_en,
      }));
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

      return (data as Garden[]).map(garden => ({
        ...garden,
        name: formatGardenName(garden.name, garden.location),
        name_en: garden.name_en ? formatGardenName(garden.name_en, garden.location_en ?? garden.location, "en") : garden.name_en,
      }));
    },
    enabled: !!lat && !!lng,
  });
};
