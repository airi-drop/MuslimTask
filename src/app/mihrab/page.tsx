import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const SECTIONS = [
  {
    href: "/mihrab/quran",
    title: "Al-Quran Digital",
    description:
      "114 surah dengan terjemahan Bahasa Indonesia. Tersimpan offline, bisa dibaca kapan saja.",
    icon: "quran" as const,
    accent: "from-emerald-600 to-emerald-900",
  },
  {
    href: "/mihrab/doa",
    title: "Doa Harian",
    description:
      "Kumpulan doa untuk aktivitas sehari-hari — bangun tidur, makan, perjalanan, dan lainnya.",
    icon: "hands" as const,
    accent: "from-emerald-700 to-emerald-950",
  },
  {
    href: "/mihrab/dzikir",
    title: "Dzikir Pagi & Petang",
    description:
      "Wirid harian dari Al-Ma'tsurat dan Hisnul Muslim, dengan penghitung tap-to-count.",
    icon: "beads" as const,
    accent: "from-emerald-800 to-space-950",
  },
];

export default function MihrabHubPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Mihrab"
        title="Ruang Mihrab"
        description="Konten ibadah harianmu — Al-Quran, doa, dzikir. Tersimpan offline. (Mihrab: ceruk pengingat arah kiblat dalam masjid.)"
        back={{ href: "/", label: "Dashboard" }}
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="card group relative flex min-w-0 flex-col gap-4 overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-glow sm:p-6"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-400/10 blur-2xl transition group-hover:bg-neon-400/25" />
            <div
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${s.accent} text-parchment-50 shadow-glow ring-1 ring-emerald-700/40`}
            >
              {s.icon === "quran" && <BookIcon className="h-7 w-7" />}
              {s.icon === "hands" && <HandsIcon className="h-7 w-7" />}
              {s.icon === "beads" && <BeadsIcon className="h-7 w-7" />}
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl font-bold text-emerald-800 dark:text-parchment-50 sm:text-2xl">
                {s.title}
              </h2>
              <p className="mt-1 text-sm text-emerald-700/80 dark:text-parchment-100/70">
                {s.description}
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 dark:text-neon-400">
              Buka
              <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4V4Z" />
      <path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7V4Z" />
    </svg>
  );
}
function HandsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 11V6a2 2 0 1 1 4 0v5" />
      <path d="M11 11V5a2 2 0 1 1 4 0v6" />
      <path d="M15 11V7a2 2 0 1 1 4 0v8a6 6 0 0 1-12 0v-2l-2-3a1.5 1.5 0 0 1 2.4-1.7L7 11" />
    </svg>
  );
}
function BeadsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="6" r="2" />
      <circle cx="6" cy="10" r="2" />
      <circle cx="18" cy="10" r="2" />
      <circle cx="5" cy="16" r="2" />
      <circle cx="19" cy="16" r="2" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="15" cy="20" r="1.5" />
    </svg>
  );
}
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
