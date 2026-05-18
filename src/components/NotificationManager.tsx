"use client";

import { useEffect, useRef } from "react";
import { loadLocation } from "@/lib/location";
import { getPrayerTimes } from "@/lib/prayer";
import { loadProgress, getTodayRecord, TARGET_PRAYERS_PER_DAY } from "@/lib/progress";
import { loadSettings } from "@/lib/settings";
import {
  schedulePrayerReminders,
  scheduleStreakReminder,
} from "@/lib/notifications";

/**
 * Mounts once at the layout level and (re)schedules notifications
 * whenever the user has granted permission and notifications are
 * enabled in settings. Renders nothing.
 *
 * Reschedules at midnight so tomorrow's prayer times get registered.
 */
export function NotificationManager() {
  const cleanupsRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    function clearAll() {
      for (const fn of cleanupsRef.current) {
        try {
          fn();
        } catch {
          /* ignore */
        }
      }
      cleanupsRef.current = [];
    }

    function reschedule() {
      clearAll();

      // Bail unless settings + permission are aligned
      if (typeof window === "undefined") return;
      const settings = loadSettings();
      if (!settings.notifications) return;
      if (!("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      // Prayer reminders for today
      try {
        const loc = loadLocation();
        const slots = getPrayerTimes(loc);
        const fajr = slots.find((s) => s.key === "fajr")?.time;
        const dhuhr = slots.find((s) => s.key === "dhuhr")?.time;
        const asr = slots.find((s) => s.key === "asr")?.time;
        const maghrib = slots.find((s) => s.key === "maghrib")?.time;
        const isha = slots.find((s) => s.key === "isha")?.time;
        if (fajr && dhuhr && asr && maghrib && isha) {
          const cleanup = schedulePrayerReminders({
            fajr,
            dhuhr,
            asr,
            maghrib,
            isha,
          });
          cleanupsRef.current.push(cleanup);
        }
      } catch {
        /* ignore — bad location data shouldn't crash the layout */
      }

      // Streak reminder if today is incomplete
      try {
        const progress = loadProgress();
        const today = getTodayRecord(progress);
        const allClaimed = today.prayers.length >= TARGET_PRAYERS_PER_DAY;
        const cleanup = scheduleStreakReminder(allClaimed);
        if (cleanup) cleanupsRef.current.push(cleanup);
      } catch {
        /* ignore */
      }
    }

    // Initial schedule
    reschedule();

    // Reschedule at the next midnight (and every 24h after)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 30, 0); // 30s past midnight to be safe
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      reschedule();
      // After firing once at midnight, set a daily interval for subsequent days
      const interval = setInterval(reschedule, 24 * 60 * 60 * 1000);
      cleanupsRef.current.push(() => clearInterval(interval));
    }, msUntilMidnight);

    // Reschedule whenever the page becomes visible again — covers cases
    // where the device woke from sleep and timers got throttled.
    const onVisibility = () => {
      if (document.visibilityState === "visible") reschedule();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(midnightTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      clearAll();
    };
  }, []);

  return null;
}
