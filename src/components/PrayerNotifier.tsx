"use client";

import { useEffect } from "react";
import { getPrayerTimes, type PrayerSlot } from "@/lib/prayer";
import { loadLocation } from "@/lib/location";
import { loadSettings } from "@/lib/settings";

const NOTIF_FIRED_KEY = "mt:notif-fired";

type FiredMap = Record<string, string>; // { prayerKey: dateKey }

function loadFired(): FiredMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(NOTIF_FIRED_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as FiredMap;
  } catch {
    return {};
  }
}

function saveFired(map: FiredMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTIF_FIRED_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const PRAYER_NAMES: Record<string, string> = {
  fajr: "Subuh",
  sunrise: "Syuruq",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
};

/**
 * Foreground prayer notifier. Polls every 30s, fires a browser Notification
 * when a prayer time crosses within the last 2 minutes and hasn't been fired
 * today. Respects the notifications setting.
 */
export function PrayerNotifier() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    function check() {
      const settings = loadSettings();
      if (!settings.notifications) return;

      if (Notification.permission === "default") {
        Notification.requestPermission();
        return;
      }
      if (Notification.permission !== "granted") return;

      const loc = loadLocation();
      const now = new Date();
      const dateKey = todayKey(now);
      const slots: PrayerSlot[] = getPrayerTimes(loc, now);
      const fired = loadFired();
      let changed = false;

      for (const slot of slots) {
        if (!slot.obligatory) continue; // skip sunrise
        const diff = now.getTime() - slot.time.getTime();
        // Fire if prayer time was within last 2 minutes (0 to 120_000ms ago)
        if (diff >= 0 && diff <= 120_000) {
          if (fired[slot.key] === dateKey) continue; // already fired today
          fired[slot.key] = dateKey;
          changed = true;

          const name = PRAYER_NAMES[slot.key] || slot.key;
          new Notification(`Waktu ${name} telah masuk`, {
            body: `Segera tunaikan salat ${name}. Jaga streak-mu!`,
            icon: "/icon",
            tag: `prayer-${slot.key}-${dateKey}`,
          });
        }
      }

      if (changed) saveFired(fired);
    }

    // Initial check
    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, []);

  return null;
}
