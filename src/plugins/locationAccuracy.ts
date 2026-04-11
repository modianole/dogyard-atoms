import { registerPlugin } from "@capacitor/core";

export interface LocationAccuracyResult {
  enabled: boolean;
  cancelled?: boolean;
  resolvable?: boolean;
  reason?: string;
}

export interface LocationAccuracyPlugin {
  showLocationAccuracyDialog(): Promise<LocationAccuracyResult>;
  openGoogleLocationSettings(): Promise<{ opened: boolean }>;
}

export const LocationAccuracy = registerPlugin<LocationAccuracyPlugin>("LocationAccuracy");

