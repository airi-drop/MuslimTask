import { PageHeader } from "@/components/PageHeader";

type Achievement = {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: { current: number; target: number };
  category: "streak" | "salat" | "quran" | "spiritual";
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    name: "Langkah Pertama",
    description: "Tandai 1 salat di Dashboard.",
    unlocked: false,
    category: "salat",
  },
  {
    id: "perfect-day",
    name: "Hari Sempurna",
    description: "Selesaikan 5 salat dalam 1 hari.",
    unlocked: false,
    progress: { current: 0, target: 5 },
    category: "salat",
  },
  {
    id: "subuh-warrior",
    name: "Subuh Warrior",
    description: "Salat Subuh 7 hari berturut-turut.",
    unlocked: false,
    progress: { current: 0, target: 7 },
    category: "streak",
  },
  {
    id: "streak-7",
    name: "Streak 7 Hari",
    description: "Pertahankan streak 7 hari.",
    unlocked: false,
    progress: { current: 0, target: 7 },
    category: "streak",
  },
  {
    id: "streak-30",
    name: "Streak 30 Hari",
    description: "Pertahankan streak 30 hari.",
    unlocked: false,
    progress: { current: 0, target: 30 },
    category: "streak",
  },
  {
    id: "quran-reader",
    name: "Pembaca Al-Quran",
    description: "Baca Al-Quran 7 hari berturut-turut.",
    unlocked: false,
    progress: { current: 0, target: 7 },
    category: "quran",
  },
  {
    id: "khatam",
    name: "Khatam Quran",
    description: "Selesaikan 30 juz Al-Quran.",
    unlocked: false,
    progress: { current: 0, target: 30 },
    category: "quran",
  },
  {
    id: "dzikir-pagi",
    name: "Pagi Berkah",
    description: "Dzikir pagi 30 hari berturut-turut.",
    unlocked: false,
    progress: { current: 0, target: 30 },
    category: "spiritual",
  },
];

const CATEGORY_LABEL: Record<Achievement["category"], string> = {
  streak: "Streak",
  salat: "Salat",
  quran: "Al-Quran",
  spiritual: "Spiritual",
};

export default function AchievementPage() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Achievement"
        title="Pencapaianmu"
        description={`Kumpulkan badge sebagai pengingat perjalanan ibadahmu. ${unlocked} dari ${ACHIEVEMENTS.length} tercapai.`}
      />

      <section className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-forest-800">
            Semua Badge
          </h2>
          <div className="text-sm text-forest-500/80">
            {unlocked} / {ACHIEVEMENTS.length}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => (
            <article
              key={a.id}
              className={`rounded-2xl border p-4 transition ${
                a.unlocked
                  ? "border-gold-500 bg-gold-500/5"
                  : "border-cream-200 bg-cream-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                    a.unlocked
                      ? "bg-gold-500 text-white"
                      : "bg-cream-200 text-forest-500/60"
                  }`}
                >
                  <TrophyIcon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-forest-800">
                      {a.name}
                    </h3>
                    <span className="rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-forest-500/80">
                      {CATEGORY_LABEL[a.category]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-forest-500/90">
                    {a.description}
                  </p>
                  {a.progress && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full bg-cream-200">
                        <div
                          className={`h-full rounded-full ${
                            a.unlocked ? "bg-gold-500" : "bg-forest-500/60"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (a.progress.current / a.progress.target) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="mt-1 text-[11px] text-forest-500/80">
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
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M17 5h3v3a3 3 0 0 1-3 3" />
      <path d="M7 5H4v3a3 3 0 0 0 3 3" />
    </svg>
  );
}
