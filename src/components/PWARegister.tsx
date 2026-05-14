"use client";

import { useEffect, useState } from "react";

/**
 * Registers /sw.js and exposes a tiny "update available" toast.
 * Production-only — we don't want SW caching to interfere with hot reload.
 */
export function PWARegister() {
  const [updateReady, setUpdateReady] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          // Periodic update check (once / hour while open)
          const interval = setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);

          reg.addEventListener("updatefound", () => {
            const installing = reg.installing;
            if (!installing) return;
            installing.addEventListener("statechange", () => {
              if (
                installing.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setUpdateReady(installing);
              }
            });
          });

          window.addEventListener("beforeunload", () => clearInterval(interval), {
            once: true,
          });
        })
        .catch((err) => {
          console.warn("[MuslimTask] SW registration failed", err);
        });

      // Reload when the new SW takes control after we tell it to skip waiting.
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  if (!updateReady) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-3">
      <button
        onClick={() => updateReady.postMessage("SKIP_WAITING")}
        className="pointer-events-auto flex items-center gap-3 rounded-full border border-amber-300/70 bg-gradient-to-br from-emerald-700 to-emerald-950 px-4 py-2.5 text-sm font-semibold text-parchment-50 shadow-glow-amber ring-1 ring-amber-400/40"
      >
        <svg
          className="h-4 w-4 text-amber-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v5h5" />
        </svg>
        Update aplikasi tersedia — tap untuk reload
      </button>
    </div>
  );
}
