import { PageHeader } from "@/components/PageHeader";

const WEEK = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Ahad"];
const SAMPLE = [0, 0, 0, 0, 0, 0, 0];

export default function StatistikPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Statistik"
        title="Konsistensi Ibadah"
        description="Lihat ritme ibadahmu dalam minggu dan bulan ini. Data dihitung dari riwayat checklist salat di Dashboard."
      />

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        <section className="card min-w-0 p-5 sm:p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
              Minggu Ini
            </h2>
            <span className="text-xs text-emerald-700/70 dark:text-parchment-100/60">
              5 / hari = target
            </span>
          </div>
          <div className="mt-6 grid grid-cols-7 items-end gap-1.5 sm:gap-3">
            {SAMPLE.map((v, i) => (
              <div key={i} className="flex min-w-0 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-emerald-100 to-emerald-200 dark:from-emerald-900/60 dark:to-emerald-700/60"
                  style={{ height: `${Math.max(8, v * 24)}px` }}
                />
                <div className="truncate text-xs text-emerald-700/70 dark:text-parchment-100/60">
                  {WEEK[i]}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-emerald-700/70 dark:text-parchment-100/60">
            Belum ada data minggu ini. Tandai salatmu di Dashboard untuk mulai
            mengisi grafik.
          </p>
        </section>

        <section className="card min-w-0 p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
            Ringkasan
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <Row label="Total salat 30 hari" value="0 / 150" />
            <Row label="Subuh paling konsisten" value="0%" />
            <Row label="Total XP bulan ini" value="0 XP" />
            <Row label="Hari sempurna" value="0" />
          </ul>
        </section>
      </div>

      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
          Heatmap 30 Hari
        </h2>
        <div className="mt-4 grid grid-cols-10 gap-1 sm:grid-cols-15 lg:grid-cols-30">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-md bg-parchment-200 dark:bg-space-900"
              title="Belum ada data"
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-emerald-700/60 dark:text-parchment-100/50">
          Setiap kotak mewakili 1 hari. Warna lebih gelap = lebih banyak salat
          tercatat.
        </p>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-2 last:border-0 last:pb-0 dark:border-emerald-900/60">
      <span className="min-w-0 truncate text-emerald-700/80 dark:text-parchment-100/70">
        {label}
      </span>
      <span className="shrink-0 font-display text-lg font-bold text-emerald-800 dark:text-parchment-50">
        {value}
      </span>
    </li>
  );
}
