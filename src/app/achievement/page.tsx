import { PageHeader } from "@/components/PageHeader";

type Achievement = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: { current: number; target: number };
  category: "streak" | "salat" | "quran" | "mihrab";
};

const ACHIEVEMENTS: Achievement[] = [
  { id: "first-step", name: "Langkah Pertama", description: "Tandai 1 salat di Dashboard.", unlocked: false, category: "salat" },
  { id: "perfect-day", name: "Hari Sempurna", description: "Selesaikan 5 salat dalam 1 hari.", unlocked: false, progress: { current: 0, target: 5 }, category: "salat" },
  { id: "subuh-warrior", name: "Subuh Warrior", description: "Salat Subuh 7 hari berturut-turut.", unlocked: false, progress: { current: 0, target: 7 }, category: "streak" },
  { id: "streak-7", name: "Streak 7 Hari", description: "Pertahankan streak 7 hari.", unlocked: false, progress: { current: 0, target: 7 }, category: "streak" },
  { id: "streak-30", name: "Streak 30 Hari", description: "Pertahankan streak 30 hari.", unlocked: false, progress: { current: 0, target: 30 }, category: "streak" },
  { id: "quran-reader", name: "Pembaca Al-Quran", description: "Baca Al-Quran 7 hari berturut-turut.", unlocked: false, progress: { current: 0, target: 7 }, category: "quran" },
  { id: "khatam", name: "Khatam Quran", description: "Selesaikan 30 juz Al-Quran.", unlocked: false, progress: { current: 0, target: 30 }, category: "quran" },
  { id: "dzikir-pagi", name: "Pagi Berkah", description: "Dzikir pagi 30 hari berturut-turut.", unlocked: false, progress: { current: 0, target: 30 }, category: "mihrab" },
];

const CATEGORY_LABEL: Record<Achievement["category"], string> = {
  streak: "Streak",
  salat: "Salat",
  quran: "Al-Quran",
  mihrab: "Mihrab",
};

export default function AchievementPage() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Achievement"
        title="Pencapaianmu"
        description={`Kumpulkan badge sebagai milestone perjalananmu. ${unlocked} dari ${ACHIEVEMENTS.length} terbuka.`}
      />

      <section className="card p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-emerald-800 dark:text-parchment-50 sm:text-xl">
            Semua Badge
          </h2>
          <div className="text-sm text-emerald-700/70 dark:text-parchment-100/60">
            {unlocked} / {ACHIEVEMENTS.length}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => (
            <article
              key={a.id}
              className={`min-w-0 rounded-2xl border p-4 transition ${
                a.unlocked
                  ? "border-amber-400/50 bg-amber-400/5 shadow-glow-amber"
                  : "border-emerald-100 bg-parchment-50 dark:border-emerald-900/60 dark:bg-space-900/60"
              }`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                    a.unlocked
                      ? "bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950"
                      : "bg-emerald-100 text-emerald-700/40 dark:bg-space-800 dark:text-parchment-100/30"
                  }`}
                >
                  <TrophyIcon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <h3 className="truncate font-display text-base font-bold text-emerald-800 dark:text-parchment-50">
                      {a.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-parchment-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700/80 dark:bg-space-800 dark:text-parchment-100/70">
                      {CATEGORY_LABEL[a.category]}
                    </span>
                  </div>
                  <p className="mt-1 break-words text-sm text-emerald-700/80 dark:text-parchment-100/70">
                    {a.description}
                  </p>
                  {a.progress && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full bg-emerald-100 dark:bg-space-800">
                        <div
                          className={`h-full rounded-full ${
                            a.unlocked
                              ? "bg-amber-400"
                              : "bg-emerald-500/60 dark:bg-neon-500/50"
                          }`}
                          style={{
                            width: `${Math.min(100, (a.progress.current / a.progress.target) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="mt-1 text-[11px] text-emerald-700/70 dark:text-parchment-100/60">
                        {a.progress.current} / {a.progress.target}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M17 5h3v3a3 3 0 0 1-3 3M7 5H4v3a3 3 0 0 0 3 3" />
    </svg>
  );
}
