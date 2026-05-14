# MuslimTask

Aplikasi habit ibadah harian — offline-first. Konsep "quest" untuk salat, dzikir, baca Al-Quran, plus sistem streak, XP, level, dan achievement.

## Fitur

- **Dashboard Harian** — streak, target 5 salat, XP/level, countdown salat berikutnya, tanggal Hijriah
- **Statistik** — konsistensi mingguan & bulanan
- **Achievement** — badge collection (Subuh Warrior, 7 Hari Streak, dll)
- **Spiritual** — Al-Quran digital, doa harian, dzikir pagi/petang
- **Offline-first** — semua data lokal, jadwal salat dihitung lokal via Adhan.js

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- [Adhan.js](https://github.com/batoulapps/adhan-js) — kalkulasi jadwal salat lokal
- localStorage / IndexedDB untuk persistence

## Development

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

## Build

```bash
npm run build
npm start
```
