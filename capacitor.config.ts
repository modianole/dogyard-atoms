import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dogyard.app",
  appName: "דוג פארק - Dog Park",
  webDir: "dist",
  server: {
    // בגרסת אנדרואיד סופית אנחנו מסירים את ה-url ומשתמשים בקבצים המקומיים
    androidScheme: "https"
  },
  android: {
    buildOptions: {
      keystorePath: undefined, // יוגדר ב-Android Studio
      keystorePassword: undefined,
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#f97316",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
    },
  },
};

export default config;
