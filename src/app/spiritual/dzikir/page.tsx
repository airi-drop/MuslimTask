import { PageHeader } from "@/components/PageHeader";

type Wirid = {
  id: string;
  arabic: string;
  latin: string;
  translation: string;
  count: number;
};

const PAGI_PETANG: Wirid[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللَّهِ",
    latin: "Subhanallah",
    translation: "Maha Suci Allah.",
    count: 33,
  },
  {
    id: "alhamdulillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    latin: "Alhamdulillah",
    translation: "Segala puji bagi Allah.",
    count: 33,
  },
  {
    id: "allahuakbar",
    arabic: "اللَّهُ أَكْبَرُ",
    latin: "Allahu Akbar",
    translation: "Allah Maha Besar.",
    count: 33,
  },
  {
    id: "lailaha",
    arabic:
      "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    latin:
      "La ilaha illallah wahdahu la syarika lahu, lahul-mulku walahul-hamdu wahuwa 'ala kulli syai'in qadir.",
    translation:
      "Tidak ada Tuhan selain Allah, Yang Esa, tidak ada sekutu bagi-Nya. Bagi-Nya kerajaan dan pujian, dan Dia Maha Kuasa atas segala sesuatu.",
    count: 10,
  },
];

export default function DzikirPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Spiritual / Dzikir"
        title="Dzikir Pagi & Petang"
        description="Wirid harian dari sumber Al-Ma'tsurat dan Hisnul Muslim. Penghitung otomatis akan ditambahkan pada iterasi berikutnya."
      />

      <div className="flex flex-wrap gap-2">
        <span className="pill bg-forest-700 text-cream-50">Pagi</span>
        <span className="pill border border-cream-200 bg-white text-forest-700">
          Petang
        </span>
        <span className="pill border border-cream-200 bg-white text-forest-700">
          Setelah Salat
        </span>
      </div>

      <section className="space-y-4">
        {PAGI_PETANG.map((w, i) => (
          <article key={w.id} className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-forest-100 text-forest-700 font-display font-bold">
                  {i + 1}
                </div>
                <div className="text-sm font-semibold text-forest-700/80">
                  Dibaca {w.count}x
                </div>
              </div>
              <button
                className="pill border border-cream-200 bg-white text-forest-700 hover:bg-cream-100"
                aria-label="Hitung"
              >
                <span className="font-display text-lg font-bold">0</span>
                <span className="text-xs text-forest-500/70">/ {w.count}</span>
              </button>
            </div>
            <p
              className="mt-4 text-right font-display text-3xl leading-loose text-forest-700"
              dir="rtl"
            >
              {w.arabic}
            </p>
            <p className="mt-3 text-sm italic text-forest-500/90">{w.latin}</p>
            <p className="mt-2 text-sm text-forest-700/90">
              <span className="font-semibold">Artinya:</span> {w.translation}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
