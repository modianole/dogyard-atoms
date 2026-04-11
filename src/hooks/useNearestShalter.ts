/**
 * useNearestShalter.ts
 * Gets user location, finds the nearest shelter from the `shalter` table,
 * and opens Google Maps walking-navigation to it.
 */
import { useState, useCallback, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { App as CapacitorApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LocationAccuracy } from "@/plugins/locationAccuracy";

type LocationErrorKind = "permission" | "unavailable" | "timeout" | "unsupported" | "unknown";

interface Shalter {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

// Haversine distance in meters
function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const useNearestShalter = () => {
  const [loading, setLoading] = useState(false);
  const [gpsPromptOpen, setGpsPromptOpen] = useState(false);
  const [retryOnResume, setRetryOnResume] = useState(false);

  const mapPositionError = useCallback((message?: string): LocationErrorKind => {
    const m = String(message || "").toLowerCase();
    if (m.includes("denied") || m.includes("permission") || m.includes("forbidden")) return "permission";
    if (m.includes("timeout")) return "timeout";
    if (m.includes("unavailable") || m.includes("disabled") || m.includes("service")) return "unavailable";
    return "unknown";
  }, []);

  const openNavigation = useCallback(async (originLat: number, originLng: number, destLat: number, destLng: number) => {
    const mapsUrl =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${originLat},${originLng}` +
      `&destination=${destLat},${destLng}` +
      `&travelmode=walking`;

    if (Capacitor.isNativePlatform()) {
      try {
        await Browser.open({ url: mapsUrl });
        return;
      } catch {
        window.location.href = mapsUrl;
        return;
      }
    }

    const opened = window.open(mapsUrl, "_blank", "noopener,noreferrer");
    if (!opened) {
      window.location.href = mapsUrl;
    }
  }, []);

  const fetchShelters = useCallback(async () => {
    const { data, error } = await supabase
      .from("shalter")
      .select("id, name, lat, lng, type");

    if (error || !data || data.length === 0) {
      throw new Error("NO_SHELTERS");
    }

    const normalized = (data as Shalter[])
      .map((s) => ({ ...s, lat: Number(s.lat), lng: Number(s.lng) }))
      .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng));

    if (normalized.length === 0) {
      throw new Error("NO_VALID_SHELTERS");
    }

    return normalized;
  }, []);

  const findNearest = useCallback((originLat: number, originLng: number, shelters: Shalter[]) => {
    let nearest = shelters[0];
    let minDist = distanceMeters(originLat, originLng, nearest.lat, nearest.lng);

    for (const s of shelters) {
      const d = distanceMeters(originLat, originLng, s.lat, s.lng);
      if (d < minDist) {
        minDist = d;
        nearest = s;
      }
    }

    return { nearest, minDist };
  }, []);

  const navigateFromOrigin = useCallback(async (originLat: number, originLng: number) => {
    const shelters = await fetchShelters();
    const { nearest, minDist } = findNearest(originLat, originLng, shelters);

    const distLabel = minDist < 1000
      ? `${Math.round(minDist)} מ׳`
      : `${(minDist / 1000).toFixed(1)} ק"מ`;

    toast.success(`מנווט למרחב המוגן הקרוב: ${nearest.name} (${distLabel})`);
    await openNavigation(originLat, originLng, nearest.lat, nearest.lng);
    return true;
  }, [fetchShelters, findNearest, openNavigation]);

  const geocodeAddress = useCallback(async (address: string) => {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("MISSING_MAPS_KEY");
    }

    const url =
      `https://maps.googleapis.com/maps/api/geocode/json` +
      `?address=${encodeURIComponent(address)}` +
      `&key=${GOOGLE_MAPS_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || data.status !== "OK" || !data.results?.length) {
      throw new Error("GEOCODE_FAILED");
    }

    const loc = data.results[0]?.geometry?.location;
    if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") {
      throw new Error("GEOCODE_INVALID");
    }

    return { lat: loc.lat, lng: loc.lng };
  }, []);

  const getCurrentPositionWeb = useCallback(async () => {
    if (!navigator.geolocation) {
      throw { kind: "unsupported" as LocationErrorKind };
    }

    return await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          if (err.code === 1) reject({ kind: "permission" as LocationErrorKind });
          else if (err.code === 2) reject({ kind: "unavailable" as LocationErrorKind });
          else if (err.code === 3) reject({ kind: "timeout" as LocationErrorKind });
          else reject({ kind: "unknown" as LocationErrorKind });
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
      );
    });
  }, []);

  const getCurrentPosition = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const requested = await Geolocation.requestPermissions();
        if (requested.location !== "granted") {
          throw { kind: "permission" as LocationErrorKind };
        }

        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 30000,
        });

        return { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch (err: any) {
        try {
          return await getCurrentPositionWeb();
        } catch {
          throw { kind: mapPositionError(err?.message) as LocationErrorKind };
        }
      }
    }

    return await getCurrentPositionWeb();
  }, [getCurrentPositionWeb, mapPositionError]);

  const ensureGoogleAccuracyBeforeLocate = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return true;

    try {
      // This is the original Google Play Services location-accuracy resolution dialog.
      const result = await LocationAccuracy.showLocationAccuracyDialog();
      if (result?.enabled) return true;

      // User cancelled or device cannot resolve automatically.
      if (result?.cancelled || result?.resolvable === false) {
        return false;
      }

      return false;
    } catch {
      // If dialog API fails on this device, we'll continue and rely on runtime geolocation handling.
      return true;
    }
  }, []);

  const goToNearestShalter = useCallback(async () => {
    setLoading(true);
    try {
      const accuracyReady = await ensureGoogleAccuracyBeforeLocate();
      if (!accuracyReady) {
        setGpsPromptOpen(true);
        return false;
      }

      const { lat, lng } = await getCurrentPosition();
      setGpsPromptOpen(false);
      await navigateFromOrigin(lat, lng);
      return true;
    } catch (e: any) {
      const kind: LocationErrorKind = e?.kind || "unknown";
      if (kind === "permission" || kind === "timeout" || kind === "unavailable") {
        setGpsPromptOpen(true);
        return false;
      }
      if (kind === "unsupported") {
        toast.error("המכשיר/דפדפן לא תומך במיקום.");
        setGpsPromptOpen(true);
        return false;
      }
      if (e?.message === "NO_SHELTERS" || e?.message === "NO_VALID_SHELTERS") {
        toast.error("לא נמצאו מרחבים מוגנים במערכת.");
        return false;
      }
      toast.error("לא ניתן לאתר מיקום כרגע. נסו שוב.");
      setGpsPromptOpen(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, [ensureGoogleAccuracyBeforeLocate, getCurrentPosition, navigateFromOrigin]);

  const navigateFromManualAddress = useCallback(async (address: string) => {
    const trimmed = address.trim();
    if (!trimmed) {
      toast.error("הזינו מיקום ידני.");
      return false;
    }

    setLoading(true);
    try {
      const { lat, lng } = await geocodeAddress(trimmed);
      setGpsPromptOpen(false);
      await navigateFromOrigin(lat, lng);
      return true;
    } catch (e: any) {
      if (e?.message === "MISSING_MAPS_KEY") {
        toast.error("חסר Google Maps API key ולכן לא ניתן לבצע חיפוש כתובת.");
        return false;
      }
      if (e?.message === "NO_SHELTERS" || e?.message === "NO_VALID_SHELTERS") {
        toast.error("לא נמצאו מרחבים מוגנים במערכת.");
        return false;
      }
      toast.error("לא הצלחנו לזהות את הכתובת. נסו כתובת מדויקת יותר.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [geocodeAddress, navigateFromOrigin]);

  const navigateFromGarden = useCallback(async (gardenLat: number, gardenLng: number) => {
    if (!Number.isFinite(gardenLat) || !Number.isFinite(gardenLng)) {
      toast.error("מיקום הגינה אינו תקין.");
      return false;
    }

    setLoading(true);
    try {
      setGpsPromptOpen(false);
      await navigateFromOrigin(gardenLat, gardenLng);
      return true;
    } catch (e: any) {
      if (e?.message === "NO_SHELTERS" || e?.message === "NO_VALID_SHELTERS") {
        toast.error("לא נמצאו מרחבים מוגנים במערכת.");
        return false;
      }
      toast.error("לא הצלחנו להתחיל ניווט מהגינה שנבחרה.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigateFromOrigin]);

  const openLocationSettingsAndRetry = useCallback(async () => {
    setGpsPromptOpen(false);

    if (!Capacitor.isNativePlatform()) {
      void goToNearestShalter();
      return;
    }

    try {
      const result = await LocationAccuracy.showLocationAccuracyDialog();
      if (result?.enabled) {
        void goToNearestShalter();
        return;
      }

      // Open the dedicated Google location settings page as fallback.
      setRetryOnResume(true);
      await LocationAccuracy.openGoogleLocationSettings();
    } catch {
      // Fallback to app settings if plugin/dialog is unavailable.
      try {
        setRetryOnResume(true);
        await CapacitorApp.openSettings();
      } catch {
        setRetryOnResume(false);
        toast.info("לא ניתן לפתוח את חלון GPS. פתחו ידנית את הגדרות המיקום.");
      }
    }
  }, [goToNearestShalter]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let isMounted = true;
    let listener: { remove: () => Promise<void> } | null = null;

    CapacitorApp.addListener("appStateChange", ({ isActive }) => {
      if (!isMounted) return;
      if (isActive && retryOnResume) {
        setRetryOnResume(false);
        void goToNearestShalter();
      }
    }).then((l) => {
      if (isMounted) listener = l;
    });

    return () => {
      isMounted = false;
      if (listener) {
        void listener.remove();
      }
    };
  }, [goToNearestShalter, retryOnResume]);

  return {
    goToNearestShalter,
    navigateFromManualAddress,
    navigateFromGarden,
    loading,
    gpsPromptOpen,
    setGpsPromptOpen,
    openLocationSettingsAndRetry,
  };
};
