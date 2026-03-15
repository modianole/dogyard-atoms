import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Self-heal: unregister stale Service Workers and clear old caches
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((reg) => reg.unregister());
  });
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
}

createRoot(document.getElementById("root")!).render(<App />);
