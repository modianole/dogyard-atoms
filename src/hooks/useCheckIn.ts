import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type CheckInStatus = "arrived" | "on_way" | "none";

export const useCheckIn = (gardenId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get current user's check-in for this garden
  const { data: currentCheckIn, isLoading } = useQuery({
    queryKey: ["my-check-in", gardenId, user?.id],
    queryFn: async () => {
      if (!user || !gardenId) return null;
      const { data, error } = await supabase
        .from("check_ins")
        .select("*")
        .eq("user_id", user.id)
        .eq("garden_id", gardenId)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!gardenId,
  });

  const checkInMutation = useMutation({
    mutationFn: async ({ status, delayMins = 0 }: { status: "arrived" | "on_way"; delayMins?: number }) => {
      if (!user || !gardenId) throw new Error("Missing user or garden ID");

      // Clear existing check-ins first
      await supabase.from("check_ins").delete().eq("user_id", user.id);

      const now = new Date();
      const arrival_at = new Date(now.getTime() + delayMins * 60000);
      const expires_at = new Date(arrival_at.getTime() + 40 * 60000); // Expires 40 mins after arrival

      const { data, error } = await supabase.from("check_ins").insert({
        user_id: user.id,
        garden_id: gardenId,
        status,
        arrival_at: arrival_at.toISOString(),
        expires_at: expires_at.toISOString(),
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-check-in"] });
      queryClient.invalidateQueries({ queryKey: ["garden-visitors"] });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await supabase.from("check_ins").delete().eq("user_id", user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-check-in"] });
      queryClient.invalidateQueries({ queryKey: ["garden-visitors"] });
    },
  });

  return {
    currentCheckIn,
    isLoading,
    checkIn: checkInMutation.mutate,
    checkOut: checkOutMutation.mutate,
    isPending: checkInMutation.isPending || checkOutMutation.isPending,
  };
};
