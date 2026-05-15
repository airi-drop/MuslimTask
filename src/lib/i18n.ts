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
  "quest.dailyQuest": string;
  "quest.weeklyQuest": string;
  "quest.resetMidnight": string;
  "quest.resetMonday": string;
  "quest.syncDashboard": string;
  "quest.syncDesc": string;
  "quest.done": string;
  "quest.now": string;
  "quest.mainTime": string;
  "quest.openDashboard": string;
  "quest.undo": string;
  "quest.claim": string;

  // Statistik
  "statistik.eyebrow": string;
  "statistik.title": string;
  "statistik.description": string;
  "statistik.highlight": string;
  "statistik.days30": string;
  "statistik.thisWeek": string;
  "statistik.prayerPerDay": string;
  "statistik.weekTarget": string;
  "statistik.summary": string;
  "statistik.totalPrayers30": string;
  "statistik.perfectDays": string;
  "statistik.incompleteDays": string;
  "statistik.xpMonth": string;
  "statistik.mostConsistent": string;
  "statistik.perPrayer": string;
  "statistik.heatmap": string;
  "statistik.less": string;
  "statistik.more": string;
  "statistik.loading": string;

  // Mihrab
  "mihrab.eyebrow": string;
  "mihrab.title": string;
  "mihrab.description": string;
  "mihrab.quran": string;
  "mihrab.quranDesc": string;
  "mihrab.doa": string;
  "mihrab.doaDesc": string;
  "mihrab.dzikir": string;
  "mihrab.dzikirDesc": string;
  "mihrab.open": string;

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

  // Stats highlight
  "stats.hl.noData": string;
  "stats.hl.noDataDesc": string;
  "stats.hl.great": string;
  "stats.hl.greatDesc": string;
  "stats.hl.consistentAt": string;
  "stats.hl.improveDesc": string;
  "stats.hl.keepGoing": string;
  "stats.hl.keepGoingDesc": string;
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
  "quest.title": "Papan Quest",
  "quest.description": "Selesaikan misi harian & mingguan. Setiap quest selesai memberi XP.",
  "quest.daily": "Harian",
  "quest.weekly": "Mingguan",
  "quest.dailyQuest": "Quest Harian",
  "quest.weeklyQuest": "Quest Mingguan",
  "quest.resetMidnight": "reset 00:00",
  "quest.resetMonday": "reset Senin",
  "quest.syncDashboard": "Sinkron Dashboard",
  "quest.syncDesc": "Tandai di Dashboard. Setiap salat memberi +10 XP — total 50 XP untuk 5 waktu.",
  "quest.done": "Selesai",
  "quest.now": "Sekarang",
  "quest.mainTime": "Waktu utama",
  "quest.openDashboard": "Buka Dashboard →",
  "quest.undo": "Batal",
  "quest.claim": "Klaim",

  "statistik.eyebrow": "Statistik",
  "statistik.title": "Konsistensi Ibadah",
  "statistik.description": "Ritme ibadahmu dalam minggu dan bulan ini.",
  "statistik.highlight": "Highlight",
  "statistik.days30": "30 hari",
  "statistik.thisWeek": "Minggu Ini",
  "statistik.prayerPerDay": "Salat per Hari",
  "statistik.weekTarget": "target minggu",
  "statistik.summary": "Ringkasan",
  "statistik.totalPrayers30": "Total salat 30 hari",
  "statistik.perfectDays": "Hari sempurna",
  "statistik.incompleteDays": "Hari belum lengkap",
  "statistik.xpMonth": "XP bulan ini",
  "statistik.mostConsistent": "Paling konsisten",
  "statistik.perPrayer": "Per Waktu Salat (30 hari)",
  "statistik.heatmap": "Heatmap 30 Hari",
  "statistik.less": "Sedikit",
  "statistik.more": "Banyak",
  "statistik.loading": "Memuat data…",

  "mihrab.eyebrow": "Mihrab",
  "mihrab.title": "Ruang Mihrab",
  "mihrab.description": "Konten ibadah harianmu — Al-Quran, doa, dzikir. Tersimpan offline.",
  "mihrab.quran": "Al-Quran Digital",
  "mihrab.quranDesc": "114 surah dengan terjemahan Bahasa Indonesia. Tersimpan offline.",
  "mihrab.doa": "Doa Harian",
  "mihrab.doaDesc": "Kumpulan doa untuk aktivitas sehari-hari.",
  "mihrab.dzikir": "Dzikir Pagi & Petang",
  "mihrab.dzikirDesc": "Wirid harian dengan penghitung tap-to-count.",
  "mihrab.open": "Buka",

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

  "stats.hl.noData": "Mulai catat ibadahmu",
  "stats.hl.noDataDesc": "Belum ada data 30 hari. Tandai salat di Dashboard untuk mengisi statistik.",
  "stats.hl.great": "Performa luar biasa",
  "stats.hl.greatDesc": "hari sempurna dalam 30 hari terakhir. Pertahankan!",
  "stats.hl.consistentAt": "Konsisten di",
  "stats.hl.improveDesc": "masih bisa lebih konsisten",
  "stats.hl.keepGoing": "Terus tingkatkan",
  "stats.hl.keepGoingDesc": "Lanjutkan rutinmu — setiap salat adalah XP.",
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
  "quest.title": "Quest Board",
  "quest.description": "Complete daily & weekly missions. Each quest gives XP.",
  "quest.daily": "Daily",
  "quest.weekly": "Weekly",
  "quest.dailyQuest": "Daily Quests",
  "quest.weeklyQuest": "Weekly Quests",
  "quest.resetMidnight": "resets 00:00",
  "quest.resetMonday": "resets Monday",
  "quest.syncDashboard": "Synced from Dashboard",
  "quest.syncDesc": "Mark on Dashboard. Each prayer gives +10 XP — 50 XP total for all 5.",
  "quest.done": "Done",
  "quest.now": "Now",
  "quest.mainTime": "Main time",
  "quest.openDashboard": "Open Dashboard →",
  "quest.undo": "Undo",
  "quest.claim": "Claim",

  "statistik.eyebrow": "Statistics",
  "statistik.title": "Worship Consistency",
  "statistik.description": "Your worship rhythm this week and month.",
  "statistik.highlight": "Highlight",
  "statistik.days30": "30 days",
  "statistik.thisWeek": "This Week",
  "statistik.prayerPerDay": "Prayers per Day",
  "statistik.weekTarget": "week target",
  "statistik.summary": "Summary",
  "statistik.totalPrayers30": "Total prayers (30d)",
  "statistik.perfectDays": "Perfect days",
  "statistik.incompleteDays": "Incomplete days",
  "statistik.xpMonth": "XP this month",
  "statistik.mostConsistent": "Most consistent",
  "statistik.perPrayer": "Per Prayer Time (30 days)",
  "statistik.heatmap": "30-Day Heatmap",
  "statistik.less": "Less",
  "statistik.more": "More",
  "statistik.loading": "Loading data…",

  "mihrab.eyebrow": "Mihrab",
  "mihrab.title": "Mihrab Space",
  "mihrab.description": "Your daily worship content — Al-Quran, prayers, dhikr. Stored offline.",
  "mihrab.quran": "Al-Quran Digital",
  "mihrab.quranDesc": "114 surahs with Indonesian translation. Stored offline.",
  "mihrab.doa": "Daily Prayers",
  "mihrab.doaDesc": "Collection of prayers for daily activities.",
  "mihrab.dzikir": "Morning & Evening Dhikr",
  "mihrab.dzikirDesc": "Daily wirds with tap-to-count tracker.",
  "mihrab.open": "Open",

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

  "stats.hl.noData": "Start tracking your worship",
  "stats.hl.noDataDesc": "No data for 30 days yet. Mark prayers on Dashboard to fill statistics.",
  "stats.hl.great": "Outstanding performance",
  "stats.hl.greatDesc": "perfect days in the last 30 days. Keep it up!",
  "stats.hl.consistentAt": "Consistent at",
  "stats.hl.improveDesc": "could be more consistent",
  "stats.hl.keepGoing": "Keep improving",
  "stats.hl.keepGoingDesc": "Continue your routine — every prayer is XP.",
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

/* ─── Dynamic translations for quest/achievement by ID ─── */

type DynEntry = { title: string; description: string };

const QUEST_I18N: Record<Language, Record<string, DynEntry>> = {
  id: {
    "salat-5": { title: "Salat 5 Waktu", description: "Selesaikan kelima salat fardhu hari ini." },
    "dzikir-pagi": { title: "Dzikir Pagi", description: "Baca wirid pagi setelah Subuh." },
    "dzikir-petang": { title: "Dzikir Petang", description: "Baca wirid petang sebelum Maghrib." },
    "quran-1": { title: "Baca Al-Quran", description: "Baca minimal 1 halaman / 5 ayat hari ini." },
    "doa-harian": { title: "Doa Harian", description: "Baca minimal 1 doa di Mihrab > Doa." },
    "puasa-senin-kamis": { title: "Puasa Senin-Kamis", description: "Berpuasa di hari Senin atau Kamis minggu ini." },
    "tahajud-3": { title: "Tahajud 3x", description: "Lakukan salat tahajud 3 kali minggu ini." },
    "al-kahfi-jumat": { title: "Al-Kahfi di Jumat", description: "Baca surah Al-Kahfi pada hari Jumat." },
    "sedekah-1": { title: "Sedekah", description: "Bersedekah minimal 1 kali minggu ini." },
    "dhuha-3": { title: "Salat Dhuha 3x", description: "Lakukan salat dhuha 3 kali minggu ini." },
  },
  en: {
    "salat-5": { title: "5 Daily Prayers", description: "Complete all five obligatory prayers today." },
    "dzikir-pagi": { title: "Morning Dhikr", description: "Read morning wirds after Fajr." },
    "dzikir-petang": { title: "Evening Dhikr", description: "Read evening wirds before Maghrib." },
    "quran-1": { title: "Read Al-Quran", description: "Read at least 1 page / 5 verses today." },
    "doa-harian": { title: "Daily Prayer", description: "Read at least 1 dua in Mihrab > Prayers." },
    "puasa-senin-kamis": { title: "Mon-Thu Fasting", description: "Fast on Monday or Thursday this week." },
    "tahajud-3": { title: "Tahajud 3x", description: "Perform tahajud prayer 3 times this week." },
    "al-kahfi-jumat": { title: "Al-Kahfi on Friday", description: "Read surah Al-Kahfi on Friday." },
    "sedekah-1": { title: "Charity", description: "Give charity at least once this week." },
    "dhuha-3": { title: "Dhuha Prayer 3x", description: "Perform dhuha prayer 3 times this week." },
  },
};

const ACHIEVEMENT_I18N: Record<Language, Record<string, DynEntry>> = {
  id: {
    "first-step": { title: "Langkah Pertama", description: "Tandai 1 salat di Dashboard." },
    "perfect-day": { title: "Hari Sempurna", description: "Selesaikan 5 salat dalam 1 hari." },
    "perfect-week": { title: "Pekan Sempurna", description: "7 hari sempurna kumulatif." },
    "subuh-warrior": { title: "Subuh Warrior", description: "Salat Subuh 7 hari berturut-turut." },
    "streak-7": { title: "Streak 7 Hari", description: "Pertahankan streak 7 hari." },
    "streak-30": { title: "Streak 30 Hari", description: "Pertahankan streak 30 hari." },
    "streak-100": { title: "Streak 100 Hari", description: "Pertahankan streak 100 hari." },
    "xp-500": { title: "Pengumpul XP", description: "Kumpulkan 500 XP total." },
    "xp-1000": { title: "Penjelajah Spiritual", description: "Kumpulkan 1.000 XP total." },
    "quran-reader": { title: "Pembaca Al-Quran", description: "Baca Al-Quran 7 hari berturut-turut." },
    "dzikir-pagi-streak": { title: "Pagi Berkah", description: "Dzikir pagi 7 hari berturut-turut." },
    "dzikir-petang-streak": { title: "Petang Berkah", description: "Dzikir petang 7 hari berturut-turut." },
    "dzikir-pagi-30": { title: "Wirid Subuh", description: "Dzikir pagi 30 hari berturut-turut." },
  },
  en: {
    "first-step": { title: "First Step", description: "Mark 1 prayer on Dashboard." },
    "perfect-day": { title: "Perfect Day", description: "Complete 5 prayers in 1 day." },
    "perfect-week": { title: "Perfect Week", description: "7 cumulative perfect days." },
    "subuh-warrior": { title: "Fajr Warrior", description: "Pray Fajr 7 days in a row." },
    "streak-7": { title: "7-Day Streak", description: "Maintain a 7-day streak." },
    "streak-30": { title: "30-Day Streak", description: "Maintain a 30-day streak." },
    "streak-100": { title: "100-Day Streak", description: "Maintain a 100-day streak." },
    "xp-500": { title: "XP Collector", description: "Collect 500 total XP." },
    "xp-1000": { title: "Spiritual Explorer", description: "Collect 1,000 total XP." },
    "quran-reader": { title: "Quran Reader", description: "Read Al-Quran 7 days in a row." },
    "dzikir-pagi-streak": { title: "Blessed Morning", description: "Morning dhikr 7 days in a row." },
    "dzikir-petang-streak": { title: "Blessed Evening", description: "Evening dhikr 7 days in a row." },
    "dzikir-pagi-30": { title: "Dawn Wird", description: "Morning dhikr 30 days in a row." },
  },
};

/** Get translated quest title+description by quest ID. Falls back to original. */
export function tQuest(id: string, lang: Language): DynEntry | null {
  return QUEST_I18N[lang]?.[id] ?? QUEST_I18N.id[id] ?? null;
}

/** Get translated achievement title+description by achievement ID. */
export function tAchievement(id: string, lang: Language): DynEntry | null {
  return ACHIEVEMENT_I18N[lang]?.[id] ?? ACHIEVEMENT_I18N.id[id] ?? null;
}
