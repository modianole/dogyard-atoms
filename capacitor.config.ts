import type { CapacitorConfig } from "@capacitor/cli";

const androidServerUrl = process.env.CAPACITOR_ANDROID_SERVER_URL?.trim();
const isCleartextServer = !!androidServerUrl && androidServerUrl.startsWith("http://");

const config: CapacitorConfig = {
  appId: "com.dogyard.app",
  appName: "דוג יארד - DogYard",
  webDir: "dist",
  ...(androidServerUrl
    ? {
        server: {
          androidScheme: isCleartextServer ? "http" : "https",
          url: androidServerUrl,
          cleartext: isCleartextServer,
        },
      }
    : {}),
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
