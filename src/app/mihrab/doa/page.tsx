import { PageHeader } from "@/components/PageHeader";

type Doa = {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
};

const DOA_LIST: Doa[] = [
  {
    id: "bangun-tidur",
    title: "Doa Bangun Tidur",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdulillahil-ladzi ahyana ba'da ma amatana wa ilaihin-nusyur.",
    translation:
      "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami akan dibangkitkan.",
  },
  {
    id: "sebelum-makan",
    title: "Doa Sebelum Makan",
    arabic:
      "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    latin: "Allahumma bariklana fima razaqtana waqina 'adzaban-nar.",
    translation:
      "Ya Allah, berkahilah kami dalam rezeki yang Engkau berikan dan jagalah kami dari siksa api neraka.",
  },
  {
    id: "sesudah-makan",
    title: "Doa Sesudah Makan",
    arabic:
      "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    latin: "Alhamdulillahil-ladzi ath'amana wa saqana wa ja'alana muslimin.",
    translation:
      "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami sebagai muslim.",
  },
  {
    id: "keluar-rumah",
    title: "Doa Keluar Rumah",
    arabic:
      "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    latin: "Bismillahi tawakkaltu 'alallah, la haula wa la quwwata illa billah.",
    translation:
      "Dengan nama Allah, aku bertawakkal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.",
  },
  {
    id: "sebelum-tidur",
    title: "Doa Sebelum Tidur",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    latin: "Bismika Allahumma amutu wa ahya.",
    translation: "Dengan nama-Mu ya Allah, aku mati dan aku hidup.",
  },
];

export default function DoaPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Mihrab / Doa Harian"
        title="Doa Harian"
        description="Kumpulan doa untuk aktivitas sehari-hari. Tersimpan offline — bisa dibuka kapan saja."
      />

      <section className="grid gap-4 sm:grid-cols-2">
        {DOA_LIST.map((d) => (
          <article key={d.id} className="card min-w-0 p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-emerald-800 dark:text-parchment-50 sm:text-lg">
              {d.title}
            </h2>
            <p
              className="arabic mt-3 break-words text-right text-xl text-emerald-700 dark:text-parchment-50 sm:text-2xl"
              dir="rtl"
            >
              {d.arabic}
            </p>
            <p className="mt-3 break-words text-sm italic text-emerald-700/80 dark:text-parchment-100/70">
              {d.latin}
            </p>
            <p className="mt-2 break-words text-sm text-emerald-800 dark:text-parchment-100/90">
              <span className="font-semibold">Artinya:</span> {d.translation}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
