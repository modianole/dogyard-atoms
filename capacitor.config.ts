import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dogyard.app",
  appName: "דוג פארק - Dog Park",
  webDir: "dist",
  server: {
    androidScheme: "https",
    allowMixedContent: true,
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#f97316",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
    },
  },
};

export default config;
