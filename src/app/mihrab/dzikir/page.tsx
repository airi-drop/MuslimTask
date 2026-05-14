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
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Mihrab / Dzikir"
        title="Dzikir Pagi & Petang"
        description="Wirid harian dari Al-Ma'tsurat dan Hisnul Muslim. Penghitung tap-to-count akan ditambahkan pada iterasi berikutnya."
      />

      <div className="flex flex-wrap gap-2">
        <span className="pill bg-emerald-700 text-parchment-50 shadow-glow dark:bg-emerald-600">Pagi</span>
        <span className="pill border border-emerald-100 bg-white text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100">
          Petang
        </span>
        <span className="pill border border-emerald-100 bg-white text-emerald-700 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100">
          Setelah Salat
        </span>
      </div>

      <section className="space-y-4">
        {PAGI_PETANG.map((w, i) => (
          <article key={w.id} className="card min-w-0 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 font-display font-bold text-emerald-700 dark:bg-emerald-900/60 dark:text-neon-400">
                  {i + 1}
                </div>
                <div className="text-sm font-semibold text-emerald-700/80 dark:text-parchment-100/70">
                  Dibaca {w.count}x
                </div>
              </div>
              <button
                className="pill shrink-0 border border-emerald-100 bg-white text-emerald-700 hover:bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-800 dark:text-parchment-100"
                aria-label="Hitung"
              >
                <span className="font-display text-lg font-bold">0</span>
                <span className="text-xs text-emerald-700/60 dark:text-parchment-100/50">
                  / {w.count}
                </span>
              </button>
            </div>
            <p
              className="arabic mt-4 break-words text-right text-2xl leading-loose text-emerald-700 dark:text-parchment-50 sm:text-3xl"
              dir="rtl"
            >
              {w.arabic}
            </p>
            <p className="mt-3 break-words text-sm italic text-emerald-700/80 dark:text-parchment-100/70">
              {w.latin}
            </p>
            <p className="mt-2 break-words text-sm text-emerald-800 dark:text-parchment-100/90">
              <span className="font-semibold">Artinya:</span> {w.translation}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
