import { PageHeader } from "@/components/PageHeader";

const WEEK = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Ahad"];
const SAMPLE = [0, 0, 0, 0, 0, 0, 0]; // placeholder bars

export default function StatistikPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Statistik"
        title="Konsistensi Ibadah"
        description="Lihat ritme ibadahmu dalam minggu dan bulan ini. Data dihitung dari riwayat checklist salat di Dashboard."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-forest-800">
              Minggu Ini
            </h2>
            <span className="text-xs text-forest-500/80">5 / hari = target</span>
          </div>
          <div className="mt-6 grid grid-cols-7 items-end gap-2 sm:gap-4">
            {SAMPLE.map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-xl bg-forest-100"
                  style={{ height: `${Math.max(8, v * 24)}px` }}
                />
                <div className="text-xs text-forest-500/80">{WEEK[i]}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-forest-500/80">
            Belum ada data minggu ini. Tandai salatmu di Dashboard untuk mulai
            mengisi grafik.
          </p>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-xl font-bold text-forest-800">
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

      <section className="card p-6">
        <h2 className="font-display text-xl font-bold text-forest-800">
          Heatmap 30 Hari
        </h2>
        <div className="mt-4 grid grid-cols-10 gap-1 sm:grid-cols-15 lg:grid-cols-30">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-md bg-cream-200"
              title="Belum ada data"
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-forest-500/70">
          Setiap kotak mewakili 1 hari. Warna lebih gelap = lebih banyak salat
          tercatat.
        </p>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between border-b border-cream-200/70 pb-2 last:border-0 last:pb-0">
      <span className="text-forest-500/90">{label}</span>
      <span className="font-display text-lg font-bold text-forest-800">
        {value}
      </span>
    </li>
  );
}
