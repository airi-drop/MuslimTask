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
    <div className="space-y-5">
      <PageHeader
        eyebrow="Spiritual / Al-Quran"
        title="Al-Quran Digital"
        description="Tersedia 114 surah lengkap dengan terjemahan Bahasa Indonesia. Konten teks akan dipaket ke dalam aplikasi (offline). Audio per surah dapat diunduh sesuai kebutuhan."
      />

      <section className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-forest-800">
            Daftar Surah
          </h2>
          <span className="text-sm text-forest-500/80">
            Cuplikan — daftar lengkap akan diisi dari data lokal
          </span>
        </div>

        <ul className="divide-y divide-cream-200/70">
          {SAMPLE_SURAHS.map((s) => (
            <li
              key={s.num}
              className="flex items-center gap-4 py-3 transition hover:bg-cream-50"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 font-display font-bold text-forest-700">
                {s.num}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-base font-bold text-forest-800">
                    {s.name}
                  </span>
                  <span className="text-xs text-forest-500/80">
                    {s.meaning} • {s.ayat} ayat
                  </span>
                </div>
              </div>
              <div
                className="font-display text-2xl text-forest-700"
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
