"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function sendCounterEvent(type: "visit" | "download" | "donation", path?: string) {
  const payload = JSON.stringify({ type, path });

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/stats/track", blob);
    return;
  }

  fetch("/api/stats/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => null);
}

export function StatsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/administracion") || pathname.startsWith("/admin-login")) return;

    const today = new Date().toISOString().slice(0, 10);
    const storageKey = `mcs-visit:${today}:${pathname}`;
    if (sessionStorage.getItem(storageKey)) return;

    sessionStorage.setItem(storageKey, "1");
    sendCounterEvent("visit", pathname);
  }, [pathname]);

  return null;
}

export function trackDownload(path?: string) {
  sendCounterEvent("download", path);
}

export function trackDonation(path?: string) {
  sendCounterEvent("donation", path);
}
