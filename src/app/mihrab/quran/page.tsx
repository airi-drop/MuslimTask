import { PageHeader } from "@/components/PageHeader";

const SAMPLE_SURAHS = [
  { num: 1, name: "Al-Fatihah", arabic: "الفاتحة", meaning: "Pembukaan", ayat: 7 },
  { num: 2, name: "Al-Baqarah", arabic: "البقرة", meaning: "Sapi Betina", ayat: 286 },
  { num: 3, name: "Ali 'Imran", arabic: "آل عمران", meaning: "Keluarga 'Imran", ayat: 200 },
  { num: 36, name: "Yasin", arabic: "يس", meaning: "Yasin", ayat: 83 },
  { num: 55, name: "Ar-Rahman", arabic: "الرحمن", meaning: "Yang Maha Pemurah", ayat: 78 },
  { num: 67, name: "Al-Mulk", arabic: "الملك", meaning: "Kerajaan", ayat: 30 },
  { num: 112, name: "Al-Ikhlas", arabic: "الإخلاص", meaning: "Memurnikan Keesaan Allah", ayat: 4 },
  { num: 113, name: "Al-Falaq", arabic: "الفلق", meaning: "Waktu Subuh", ayat: 5 },
  { num: 114, name: "An-Nas", arabic: "الناس", meaning: "Manusia", ayat: 6 },
];

export default function QuranPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Mihrab / Al-Quran"
        title="Al-Quran Digital"
        description="Tersedia 114 surah lengkap dengan terjemahan Bahasa Indonesia. Konten teks dipaket ke dalam aplikasi (offline). Audio per surah dapat diunduh sesuai kebutuhan."
      />

      <section className="card p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
            Daftar Surah
          </h2>
          <span className="text-xs text-emerald-700/70 dark:text-parchment-100/60">
            Cuplikan — daftar lengkap akan diisi dari data lokal
          </span>
        </div>

        <ul className="divide-y divide-emerald-100 dark:divide-emerald-900/60">
          {SAMPLE_SURAHS.map((s) => (
            <li
              key={s.num}
              className="flex min-w-0 items-center gap-3 py-3 transition hover:bg-parchment-50 dark:hover:bg-space-900/60 sm:gap-4"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 font-display font-bold text-emerald-700 dark:bg-emerald-900/60 dark:text-neon-400">
                {s.num}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="truncate font-display text-base font-bold text-emerald-800 dark:text-parchment-50">
                    {s.name}
                  </span>
                  <span className="truncate text-xs text-emerald-700/70 dark:text-parchment-100/60">
                    {s.meaning} • {s.ayat} ayat
                  </span>
                </div>
              </div>
              <div
                className="arabic shrink-0 text-xl text-emerald-700 dark:text-neon-400 sm:text-2xl"
                dir="rtl"
              >
                {s.arabic}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
