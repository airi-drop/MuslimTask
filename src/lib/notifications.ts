export const NOTIF_TYPES = {
  PRAYER_REMINDER: 'prayer',
  DZIKIR_PAGI: 'dzikir-p',
  DZIKIR_PETANG: 'dzikir-a',
  STREAK_REMINDER: 'streak',
  ACHIEVEMENT: 'achieve',
} as const;

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function sendNotification(title: string, body: string, tag?: string): void {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: tag ?? 'mihrab',
  });
}

export function schedulePrayerReminders(schedule: {
  fajr: Date; dhuhr: Date; asr: Date; maghrib: Date; isha: Date;
}): (() => void) {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const prayers = [
    { name: 'Subuh', time: schedule.fajr },
    { name: 'Dzuhur', time: schedule.dhuhr },
    { name: 'Ashar', time: schedule.asr },
    { name: 'Maghrib', time: schedule.maghrib },
    { name: 'Isya', time: schedule.isha },
  ];

  prayers.forEach(({ name, time }) => {
    const reminderTime = new Date(time.getTime() - 5 * 60 * 1000);
    const delay = reminderTime.getTime() - Date.now();
    if (delay > 0) {
      timers.push(setTimeout(() => {
        sendNotification(
          `🕌 ${name} 5 menit lagi`,
          'Jangan lewatkan window tepat waktu untuk XP penuh!',
          `prayer-${name}`
        );
      }, delay));
    }
  });

  // Return cleanup function
  return () => timers.forEach(t => clearTimeout(t));
}

export function scheduleStreakReminder(hasClaimed: boolean): (() => void) | null {
  if (hasClaimed) return null;
  const now = new Date();
  const target = new Date(now);
  target.setHours(21, 0, 0, 0);
  const delay = target.getTime() - now.getTime();
  if (delay <= 0) return null;
  const timer = setTimeout(() => {
    sendNotification(
      '⚠️ Streak dalam bahaya!',
      'Belum ada salat yang diklaim hari ini. Jangan sampai streak putus!',
      'streak-reminder'
    );
  }, delay);
  return () => clearTimeout(timer);
}
