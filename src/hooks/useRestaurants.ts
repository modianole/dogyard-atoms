import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbMenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  price: number;
  category: string;
  category_en: string | null;
  image_url: string | null;
  is_popular: boolean | null;
  is_available: boolean | null;
  sort_order: number | null;
}

export interface DbDeal {
  id: string;
  restaurant_id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  description_en: string | null;
  original_price: number;
  deal_price: number;
  items: string[] | null;
  is_active: boolean | null;
}

export interface DbRestaurant {
  id: string;
  name: string;
  name_en: string | null;
  garden_id: string | null;
  phone: string | null;
  delivery_note: string | null;
  delivery_note_en: string | null;
  logo_url: string | null;
  is_active: boolean | null;
  menu_items: DbMenuItem[];
  deals: DbDeal[];
}

export const useRestaurants = () => {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select(`
          *,
          menu_items (*),
          deals (*)
        `)
        .eq("is_active", true);
      if (error) throw error;
      return (data as DbRestaurant[]) ?? [];
    },
  });
};
