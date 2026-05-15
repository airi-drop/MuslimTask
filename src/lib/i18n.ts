"use client";

import { useEffect, useState } from "react";
import { loadSettings, type Language } from "./settings";
import { STORAGE_KEYS, subscribeStorage } from "./storage";

/* ─── Translation dictionary ─── */

type Dict = {
  // Common
  "common.back": string;
  "common.save": string;
  "common.saved": string;
  "common.cancel": string;
  "common.close": string;
  "common.loading": string;
  "common.day": string;
  "common.days": string;

  // Navbar
  "nav.dashboard": string;
  "nav.home": string;
  "nav.quest": string;
  "nav.tasbih": string;
  "nav.statistik": string;
  "nav.mihrab": string;
  "nav.achievement": string;
  "nav.settings": string;
  "nav.adminLabel": string;
  "nav.adminCaption": string;

  // Dashboard
  "dashboard.eyebrow": string;
  "dashboard.greeting": string;
  "dashboard.title1": string;
  "dashboard.title2": string;
  "dashboard.subtitle": string;
  "dashboard.shareBtn": string;
  "dashboard.xpLevel": string;
  "dashboard.xpToNext": string;
  "dashboard.streakRunning": string;
  "dashboard.bestStreak": string;
  "dashboard.lives": string;
  "dashboard.livesFull": string;
  "dashboard.livesNext": string;
  "dashboard.questMain": string;
  "dashboard.target5": string;
  "dashboard.targetReached": string;
  "dashboard.morePrayers": string;
  "dashboard.tapToClaim": string;
  "dashboard.prayer5Title": string;
  "dashboard.xpToday": string;
  "dashboard.level": string;
  "dashboard.salat": string;
  "dashboard.totalXp": string;
  "dashboard.claimed": string;
  "dashboard.notClaimed": string;
  "dashboard.streakAtRisk": string;
  "dashboard.streakWarn": string;
  "dashboard.streakWarnNoLives": string;
  "dashboard.protectionTitle": string;
  "dashboard.protectionHow": string;
  "dashboard.protectionR1": string;
  "dashboard.protectionR2": string;
  "dashboard.protectionR3": string;
  "dashboard.protectionUsed": string;
  "dashboard.activeLives": string;

  // Prayer names
  "prayer.fajr": string;
  "prayer.dhuhr": string;
  "prayer.asr": string;
  "prayer.maghrib": string;
  "prayer.isha": string;
  "prayer.sunrise": string;
  "prayer.next": string;
  "prayer.changeLocation": string;

  // Settings
  "settings.eyebrow": string;
  "settings.title": string;
  "settings.description": string;
  "settings.changesSaved": string;
  "settings.langTitle": string;
  "settings.langDesc": string;
  "settings.profileTitle": string;
  "settings.profileDesc": string;
  "settings.nameLabel": string;
  "settings.nameHint": string;
  "settings.profileSaveHint": string;
  "settings.prayerTitle": string;
  "settings.prayerDesc": string;
  "settings.calcLabel": string;
  "settings.madhabLabel": string;
  "settings.madhabHint": string;
  "settings.notifTitle": string;
  "settings.notifDesc": string;
  "settings.prayerNotifLabel": string;
  "settings.prayerNotifDesc": string;
  "settings.vibrateLabel": string;
  "settings.vibrateDesc": string;
  "settings.aboutTitle": string;
  "settings.aboutDesc": string;
  "settings.version": string;
  "settings.storage": string;
  "settings.hijriNote": string;

  // Tasbih
  "tasbih.eyebrow": string;
  "tasbih.title": string;
  "tasbih.description": string;
  "tasbih.target": string;
  "tasbih.custom": string;
  "tasbih.reset": string;
  "tasbih.completed": string;
  "tasbih.tapHint": string;
  "tasbih.lifetimeTotal": string;
  "tasbih.tapToCount": string;

  // Achievement
  "achievement.eyebrow": string;
  "achievement.title": string;
  "achievement.description": string;
  "achievement.allBadges": string;
  "achievement.newBadges": string;
  "achievement.claimAll": string;
  "achievement.claim": string;
  "achievement.claimedLabel": string;
  "achievement.claimHint": string;
  "achievement.cat.streak": string;
  "achievement.cat.salat": string;
  "achievement.cat.quran": string;
  "achievement.cat.mihrab": string;
  "achievement.cat.xp": string;

  // Quest
  "quest.eyebrow": string;
  "quest.title": string;
  "quest.description": string;
  "quest.daily": string;
  "quest.weekly": string;

  // Statistik
  "statistik.eyebrow": string;
  "statistik.title": string;
  "statistik.description": string;

  // Mihrab
  "mihrab.eyebrow": string;
  "mihrab.title": string;
  "mihrab.description": string;
  "mihrab.quran": string;
  "mihrab.doa": string;
  "mihrab.dzikir": string;

  // Quran
  "quran.eyebrow": string;
  "quran.title": string;
  "quran.description": string;
  "quran.searchPlaceholder": string;
  "quran.allSurah": string;
  "quran.bookmark": string;
  "quran.lastRead": string;
  "quran.recent": string;
  "quran.qariLabel": string;
  "quran.showLatin": string;
  "quran.fontSize": string;
  "quran.audioNotAvailable": string;
  "quran.readerSettings": string;

  // Doa
  "doa.eyebrow": string;
  "doa.title": string;
  "doa.description": string;
  "doa.searchPlaceholder": string;
  "doa.all": string;
  "doa.notFound": string;
  "doa.meaning": string;

  // Dzikir
  "dzikir.eyebrow": string;
  "dzikir.title": string;
  "dzikir.description": string;
};

const id: Dict = {
  "common.back": "Kembali",
  "common.save": "Simpan",
  "common.saved": "Tersimpan",
  "common.cancel": "Batal",
  "common.close": "Tutup",
  "common.loading": "Memuat...",
  "common.day": "Hari",
  "common.days": "Hari",

  "nav.dashboard": "Dashboard",
  "nav.home": "Home",
  "nav.quest": "Quest",
  "nav.tasbih": "Tasbih",
  "nav.statistik": "Statistik",
  "nav.mihrab": "Mihrab",
  "nav.achievement": "Achievement",
  "nav.settings": "Pengaturan",
  "nav.adminLabel": "Admin",
  "nav.adminCaption": "PENGATURAN",

  "dashboard.eyebrow": "Dashboard",
  "dashboard.greeting": "Assalamu'alaikum",
  "dashboard.title1": "Dashboard",
  "dashboard.title2": "Harian",
  "dashboard.subtitle": "Selesaikan quest ibadahmu hari ini. Kumpulkan XP, naik level, dan jaga streak-mu.",
  "dashboard.shareBtn": "Bagikan Progressku",
  "dashboard.xpLevel": "XP Level",
  "dashboard.xpToNext": "XP lagi untuk Level",
  "dashboard.streakRunning": "Streak Berjalan",
  "dashboard.bestStreak": "Terbaik",
  "dashboard.lives": "Nyawa Streak",
  "dashboard.livesFull": "Nyawa penuh. Tetap konsisten!",
  "dashboard.livesNext": "hari lagi → +1 nyawa",
  "dashboard.questMain": "Quest Utama",
  "dashboard.target5": "Target 5 Salat",
  "dashboard.targetReached": "Target tercapai!",
  "dashboard.morePrayers": "salat lagi",
  "dashboard.tapToClaim": "Tap untuk klaim XP",
  "dashboard.prayer5Title": "Quest Salat 5 Waktu",
  "dashboard.xpToday": "XP Hari Ini",
  "dashboard.level": "Level",
  "dashboard.salat": "Salat",
  "dashboard.totalXp": "Total XP",
  "dashboard.claimed": "+10 XP klaim",
  "dashboard.notClaimed": "Belum klaim",
  "dashboard.streakAtRisk": "Streak Terancam",
  "dashboard.streakWarn": "Belum ada salat tercatat. Kalau hari ini terlewat, 1 nyawa akan terpakai.",
  "dashboard.streakWarnNoLives": "Belum ada salat tercatat dan nyawa habis. Tandai sebelum tengah malam supaya streak gak putus.",
  "dashboard.protectionTitle": "Streak Protection",
  "dashboard.protectionHow": "Cara Kerja Nyawa",
  "dashboard.protectionR1": "Setiap 7 hari streak → kamu dapat +1 nyawa (maksimal 3).",
  "dashboard.protectionR2": "Kalau lewatkan 1 hari penuh, 1 nyawa terpakai otomatis untuk menjaga streak.",
  "dashboard.protectionR3": "Nyawa habis + lewat hari → streak putus dan harus mulai lagi dari 0.",
  "dashboard.protectionUsed": "x nyawa telah menyelamatkan streak-mu sejauh ini.",
  "dashboard.activeLives": "Nyawa Aktif",

  "prayer.fajr": "Subuh",
  "prayer.dhuhr": "Dzuhur",
  "prayer.asr": "Ashar",
  "prayer.maghrib": "Maghrib",
  "prayer.isha": "Isya",
  "prayer.sunrise": "Syuruq",
  "prayer.next": "Salat Berikutnya",
  "prayer.changeLocation": "Ganti lokasi",

  "settings.eyebrow": "Pengaturan",
  "settings.title": "Pengaturan",
  "settings.description": "Kelola profil, preferensi ibadah, notifikasi, dan tampilan aplikasi.",
  "settings.changesSaved": "Perubahan tersimpan",
  "settings.langTitle": "Bahasa",
  "settings.langDesc": "Pilih bahasa tampilan aplikasi.",
  "settings.profileTitle": "Profil",
  "settings.profileDesc": "Informasi yang ditampilkan di dashboard dan kartu share.",
  "settings.nameLabel": "Nama panggilan",
  "settings.nameHint": "Kosongkan untuk pakai default \"Musafir\".",
  "settings.profileSaveHint": "Klik Simpan untuk menerapkan perubahan.",
  "settings.prayerTitle": "Jadwal Salat",
  "settings.prayerDesc": "Metode hisab dan madzhab untuk perhitungan waktu salat.",
  "settings.calcLabel": "Metode hisab",
  "settings.madhabLabel": "Madzhab Ashar",
  "settings.madhabHint": "Hanafi: bayangan 2x panjang benda. Lainnya: 1x.",
  "settings.notifTitle": "Notifikasi & Umpan Balik",
  "settings.notifDesc": "Pengingat salat dan respons haptic.",
  "settings.prayerNotifLabel": "Pengingat waktu salat",
  "settings.prayerNotifDesc": "Tampilkan notifikasi browser saat masuk waktu salat (hanya saat tab terbuka).",
  "settings.vibrateLabel": "Getaran",
  "settings.vibrateDesc": "Getarkan perangkat saat menghitung dzikir / tasbih.",
  "settings.aboutTitle": "Tentang Aplikasi",
  "settings.aboutDesc": "Informasi teknis dan catatan penting.",
  "settings.version": "Versi",
  "settings.storage": "Penyimpanan",
  "settings.hijriNote": "Tanggal Hijriah menggunakan kalender Umm Al-Qura (hisab) yang dapat berbeda 1 hari dengan rukyat resmi. Untuk awal Ramadhan, Syawal, dan Zulhijjah, selalu rujuk pengumuman resmi sidang isbat.",

  "tasbih.eyebrow": "Tasbih",
  "tasbih.title": "Tasbih Digital",
  "tasbih.description": "Dzikir dengan counter digital. Pilih preset atau atur target sendiri. Data tersimpan otomatis.",
  "tasbih.target": "Target",
  "tasbih.custom": "Custom",
  "tasbih.reset": "Reset",
  "tasbih.completed": "Selesai",
  "tasbih.tapHint": "Tap lingkaran untuk menghitung. Data tersimpan otomatis di perangkat.",
  "tasbih.lifetimeTotal": "Total seumur hidup",
  "tasbih.tapToCount": "Tap untuk menghitung",

  "achievement.eyebrow": "Achievement",
  "achievement.title": "Pencapaianmu",
  "achievement.description": "Kumpulkan badge sebagai milestone perjalananmu.",
  "achievement.allBadges": "Semua Badge",
  "achievement.newBadges": "achievement baru!",
  "achievement.claimAll": "Klaim Semua",
  "achievement.claim": "Klaim",
  "achievement.claimedLabel": "Diklaim",
  "achievement.claimHint": "Klaim untuk menghilangkan notifikasi.",
  "achievement.cat.streak": "Streak",
  "achievement.cat.salat": "Salat",
  "achievement.cat.quran": "Al-Quran",
  "achievement.cat.mihrab": "Mihrab",
  "achievement.cat.xp": "XP",

  "quest.eyebrow": "Quest",
  "quest.title": "Quest Hari Ini",
  "quest.description": "Selesaikan quest harian dan mingguan untuk mengumpulkan XP.",
  "quest.daily": "Harian",
  "quest.weekly": "Mingguan",

  "statistik.eyebrow": "Statistik",
  "statistik.title": "Statistik",
  "statistik.description": "Lihat konsistensi ibadahmu dari waktu ke waktu.",

  "mihrab.eyebrow": "Mihrab",
  "mihrab.title": "Mihrab",
  "mihrab.description": "Ruang ibadah digital — Al-Quran, Doa harian, dan Dzikir.",
  "mihrab.quran": "Al-Quran",
  "mihrab.doa": "Doa Harian",
  "mihrab.dzikir": "Dzikir",

  "quran.eyebrow": "Mihrab / Al-Quran",
  "quran.title": "Al-Quran",
  "quran.description": "Baca 114 surah lengkap. Buka surah saat online sekali untuk simpan offline.",
  "quran.searchPlaceholder": "Cari surah...",
  "quran.allSurah": "Semua Surah",
  "quran.bookmark": "Bookmark",
  "quran.lastRead": "Terakhir Dibaca",
  "quran.recent": "Baru Dibuka",
  "quran.qariLabel": "Qari",
  "quran.showLatin": "Latin",
  "quran.fontSize": "Ukuran",
  "quran.audioNotAvailable": "Audio belum tersedia",
  "quran.readerSettings": "Pengaturan Bacaan",

  "doa.eyebrow": "Mihrab / Doa Harian",
  "doa.title": "Doa Harian",
  "doa.description": "Kumpulan doa untuk aktivitas sehari-hari. Tersimpan offline.",
  "doa.searchPlaceholder": "Cari doa...",
  "doa.all": "Semua",
  "doa.notFound": "Tidak ada doa yang cocok dengan pencarian.",
  "doa.meaning": "Artinya",

  "dzikir.eyebrow": "Mihrab / Dzikir",
  "dzikir.title": "Dzikir Harian",
  "dzikir.description": "Wirid pagi, petang, dan setelah salat. Tap kartu untuk menghitung.",
};

const en: Dict = {
  "common.back": "Back",
  "common.save": "Save",
  "common.saved": "Saved",
  "common.cancel": "Cancel",
  "common.close": "Close",
  "common.loading": "Loading...",
  "common.day": "Day",
  "common.days": "Days",

  "nav.dashboard": "Dashboard",
  "nav.home": "Home",
  "nav.quest": "Quest",
  "nav.tasbih": "Tasbih",
  "nav.statistik": "Stats",
  "nav.mihrab": "Mihrab",
  "nav.achievement": "Achievement",
  "nav.settings": "Settings",
  "nav.adminLabel": "Admin",
  "nav.adminCaption": "SETTINGS",

  "dashboard.eyebrow": "Dashboard",
  "dashboard.greeting": "Assalamu'alaikum",
  "dashboard.title1": "Daily",
  "dashboard.title2": "Dashboard",
  "dashboard.subtitle": "Complete your worship quests today. Earn XP, level up, and keep your streak alive.",
  "dashboard.shareBtn": "Share My Progress",
  "dashboard.xpLevel": "Level XP",
  "dashboard.xpToNext": "XP to Level",
  "dashboard.streakRunning": "Active Streak",
  "dashboard.bestStreak": "Best",
  "dashboard.lives": "Streak Lives",
  "dashboard.livesFull": "Lives full. Stay consistent!",
  "dashboard.livesNext": "days → +1 life",
  "dashboard.questMain": "Main Quest",
  "dashboard.target5": "Target 5 Prayers",
  "dashboard.targetReached": "Target reached!",
  "dashboard.morePrayers": "more prayers",
  "dashboard.tapToClaim": "Tap to claim XP",
  "dashboard.prayer5Title": "5 Daily Prayers Quest",
  "dashboard.xpToday": "Today's XP",
  "dashboard.level": "Level",
  "dashboard.salat": "Prayers",
  "dashboard.totalXp": "Total XP",
  "dashboard.claimed": "+10 XP claimed",
  "dashboard.notClaimed": "Not claimed",
  "dashboard.streakAtRisk": "Streak at Risk",
  "dashboard.streakWarn": "No prayer marked yet. If today is missed, 1 life will be used.",
  "dashboard.streakWarnNoLives": "No prayer marked and no lives left. Mark before midnight to keep your streak.",
  "dashboard.protectionTitle": "Streak Protection",
  "dashboard.protectionHow": "How Lives Work",
  "dashboard.protectionR1": "Every 7-day streak → you earn +1 life (max 3).",
  "dashboard.protectionR2": "Miss a full day, 1 life is used automatically to protect your streak.",
  "dashboard.protectionR3": "Out of lives + missed day → streak resets to 0.",
  "dashboard.protectionUsed": "x lives have saved your streak so far.",
  "dashboard.activeLives": "Active Lives",

  "prayer.fajr": "Fajr",
  "prayer.dhuhr": "Dhuhr",
  "prayer.asr": "Asr",
  "prayer.maghrib": "Maghrib",
  "prayer.isha": "Isha",
  "prayer.sunrise": "Sunrise",
  "prayer.next": "Next Prayer",
  "prayer.changeLocation": "Change location",

  "settings.eyebrow": "Settings",
  "settings.title": "Settings",
  "settings.description": "Manage your profile, worship preferences, notifications, and app display.",
  "settings.changesSaved": "Changes saved",
  "settings.langTitle": "Language",
  "settings.langDesc": "Choose the app display language.",
  "settings.profileTitle": "Profile",
  "settings.profileDesc": "Information shown on the dashboard and share card.",
  "settings.nameLabel": "Display name",
  "settings.nameHint": "Leave empty to use default \"Musafir\".",
  "settings.profileSaveHint": "Click Save to apply changes.",
  "settings.prayerTitle": "Prayer Times",
  "settings.prayerDesc": "Calculation method and madhab for prayer time computation.",
  "settings.calcLabel": "Calculation method",
  "settings.madhabLabel": "Asr madhab",
  "settings.madhabHint": "Hanafi: shadow 2x object length. Others: 1x.",
  "settings.notifTitle": "Notifications & Feedback",
  "settings.notifDesc": "Prayer reminders and haptic responses.",
  "settings.prayerNotifLabel": "Prayer time reminder",
  "settings.prayerNotifDesc": "Show browser notification when prayer time enters (only while tab is open).",
  "settings.vibrateLabel": "Vibration",
  "settings.vibrateDesc": "Vibrate device when counting dzikir / tasbih.",
  "settings.aboutTitle": "About",
  "settings.aboutDesc": "Technical info and important notes.",
  "settings.version": "Version",
  "settings.storage": "Storage",
  "settings.hijriNote": "Hijri dates use the Umm Al-Qura (calculated) calendar which may differ by 1 day from official sighting. For Ramadan, Eid, and Dhul Hijjah, always refer to official announcements.",

  "tasbih.eyebrow": "Tasbih",
  "tasbih.title": "Digital Tasbih",
  "tasbih.description": "Dhikr with a digital counter. Pick a preset or set your own target. Data is saved automatically.",
  "tasbih.target": "Target",
  "tasbih.custom": "Custom",
  "tasbih.reset": "Reset",
  "tasbih.completed": "Completed",
  "tasbih.tapHint": "Tap the circle to count. Data is saved automatically on this device.",
  "tasbih.lifetimeTotal": "Lifetime total",
  "tasbih.tapToCount": "Tap to count",

  "achievement.eyebrow": "Achievement",
  "achievement.title": "Your Achievements",
  "achievement.description": "Collect badges as milestones of your journey.",
  "achievement.allBadges": "All Badges",
  "achievement.newBadges": "new achievements!",
  "achievement.claimAll": "Claim All",
  "achievement.claim": "Claim",
  "achievement.claimedLabel": "Claimed",
  "achievement.claimHint": "Claim to clear the notification.",
  "achievement.cat.streak": "Streak",
  "achievement.cat.salat": "Prayer",
  "achievement.cat.quran": "Al-Quran",
  "achievement.cat.mihrab": "Mihrab",
  "achievement.cat.xp": "XP",

  "quest.eyebrow": "Quest",
  "quest.title": "Today's Quests",
  "quest.description": "Complete daily and weekly quests to earn XP.",
  "quest.daily": "Daily",
  "quest.weekly": "Weekly",

  "statistik.eyebrow": "Statistics",
  "statistik.title": "Statistics",
  "statistik.description": "Track your worship consistency over time.",

  "mihrab.eyebrow": "Mihrab",
  "mihrab.title": "Mihrab",
  "mihrab.description": "Digital worship space — Al-Quran, daily prayers, and dhikr.",
  "mihrab.quran": "Al-Quran",
  "mihrab.doa": "Daily Prayers",
  "mihrab.dzikir": "Dhikr",

  "quran.eyebrow": "Mihrab / Al-Quran",
  "quran.title": "Al-Quran",
  "quran.description": "Read all 114 surahs. Open a surah online once to cache it for offline.",
  "quran.searchPlaceholder": "Search surah...",
  "quran.allSurah": "All Surahs",
  "quran.bookmark": "Bookmark",
  "quran.lastRead": "Last Read",
  "quran.recent": "Recently Opened",
  "quran.qariLabel": "Reciter",
  "quran.showLatin": "Latin",
  "quran.fontSize": "Size",
  "quran.audioNotAvailable": "Audio not available yet",
  "quran.readerSettings": "Reading Settings",

  "doa.eyebrow": "Mihrab / Daily Prayers",
  "doa.title": "Daily Prayers",
  "doa.description": "Collection of prayers for daily activities. Stored offline.",
  "doa.searchPlaceholder": "Search prayer...",
  "doa.all": "All",
  "doa.notFound": "No prayer matches your search.",
  "doa.meaning": "Meaning",

  "dzikir.eyebrow": "Mihrab / Dhikr",
  "dzikir.title": "Daily Dhikr",
  "dzikir.description": "Morning, evening, and after-prayer wirids. Tap a card to count.",
};

const TRANSLATIONS: Record<Language, Dict> = { id, en };

export type TKey = keyof Dict;

export function translate(key: TKey, lang: Language): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.id[key] ?? key;
}

/**
 * React hook that returns the current language and a `t()` translator.
 * Re-renders when the user changes language in Settings.
 */
export function useT(): { t: (key: TKey) => string; lang: Language } {
  const [lang, setLang] = useState<Language>("id");

  useEffect(() => {
    setLang(loadSettings().language);
    const unsub = subscribeStorage((key) => {
      if (key === STORAGE_KEYS.settings) {
        setLang(loadSettings().language);
      }
    }, STORAGE_KEYS.settings);
    return unsub;
  }, []);

  return {
    lang,
    t: (key: TKey) => translate(key, lang),
  };
}
