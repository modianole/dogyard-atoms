import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dogyard.app",
  appName: "דוג פארק - Dog Park",
  webDir: "dist",
  server: {
    url: "https://b824be15-4841-4034-8509-a7abb18b206a.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
};

export default config;
