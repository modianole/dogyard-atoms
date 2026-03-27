import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// In Capacitor environments, we let the native bridge handle initialization.
// Removed service worker clearing logic that caused 'triggerEvent' runtime errors.

createRoot(document.getElementById("root")!).render(<App />);
