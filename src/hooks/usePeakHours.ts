import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePeakHours = (gardenId?: string) => {
  return useQuery({
    queryKey: ["peak-hours", gardenId],
    queryFn: async () => {
      const today = new Date().getDay();
      let query = supabase
        .from("peak_hours")
        .select("*")
        .eq("day_of_week", today)
        .order("hour", { ascending: true });

      if (gardenId) {
        query = query.eq("garden_id", gardenId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!gardenId,
  });
};
