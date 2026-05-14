# MuslimTask

**Quest ibadah harian** dengan vibe gaming-Islamic. Offline-first. Sistem quest, streak, XP, level, dan achievement untuk membantu konsistensi ibadah harian.

## Fitur

- **Dashboard** — hero HUD dengan level/XP, streak/nyawa/best, target 5 salat, daily checklist
- **Statistik** — chart minggu, ringkasan, heatmap 30 hari
- **Achievement** — badge collection (Subuh Warrior, Khatam Quran, dll)
- **Mihrab** — Al-Quran digital, doa harian, dzikir pagi/petang (offline)
- **Dark mode** toggle (light: parchment + emerald, dark: space-navy + neon)
- **Lokasi GPS** — default Jakarta, preset 10 kota Indonesia, atau detect via geolocation

## Tech

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS dengan tema kustom (emerald / amber / neon-cyan / parchment / space-navy)
- [Adhan.js](https://github.com/batoulapps/adhan-js) — kalkulasi jadwal salat lokal
- `Intl.DateTimeFormat` `islamic-umalqura` — tanggal Hijriah lokal
- localStorage untuk progress (streak, lives, XP, history)

## Development

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # production
```
