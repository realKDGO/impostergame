import "./prevent-zoom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import PwaLifecycle from "./pwa-lifecycle";
import "./globals.css";
import "./feature-controls.css";
import "./pwa-lifecycle.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <PwaLifecycle />
    <Analytics />
  </StrictMode>,
);

if ("serviceWorker" in navigator && window.location.protocol === "https:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).then((registration) => {
      window.dispatchEvent(new CustomEvent("blendin:sw-registration", { detail: registration }));
    }).catch(() => console.warn("BLENDIN service worker registration failed."));
  });
}
