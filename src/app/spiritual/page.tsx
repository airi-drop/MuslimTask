import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const SECTIONS = [
  {
    href: "/spiritual/quran",
    title: "Al-Quran Digital",
    description:
      "114 surah dengan terjemahan Bahasa Indonesia. Bisa diakses sepenuhnya offline.",
    icon: "quran" as const,
  },
  {
    href: "/spiritual/doa",
    title: "Doa Harian",
    description:
      "Kumpulan doa untuk aktivitas sehari-hari — bangun tidur, makan, perjalanan, dan lainnya.",
    icon: "hands" as const,
  },
  {
    href: "/spiritual/dzikir",
    title: "Dzikir Pagi & Petang",
    description:
      "Wirid harian dari Al-Ma'tsurat dan Hisnul Muslim, dengan penghitung otomatis.",
    icon: "beads" as const,
  },
];

export default function SpiritualHubPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Spiritual"
        title="Ruang Spiritual"
        description="Konten ibadah harian — Al-Quran, doa, dan dzikir. Semua tersimpan offline."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="card group flex flex-col gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-forest-100 text-forest-700 transition group-hover:bg-forest-700 group-hover:text-cream-50">
              {s.icon === "quran" && <BookIcon className="h-7 w-7" />}
              {s.icon === "hands" && <HandsIcon className="h-7 w-7" />}
              {s.icon === "beads" && <BeadsIcon className="h-7 w-7" />}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-forest-800">
                {s.title}
              </h2>
              <p className="mt-1 text-sm text-forest-500/90">
                {s.description}
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-forest-700">
              Buka
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

function BookIcon({ className }: { className?: string }) {
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
      <path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4V4Z" />
      <path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7V4Z" />
    </svg>
  );
}
function HandsIcon({ className }: { className?: string }) {
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
      <path d="M7 11V6a2 2 0 1 1 4 0v5" />
      <path d="M11 11V5a2 2 0 1 1 4 0v6" />
      <path d="M15 11V7a2 2 0 1 1 4 0v8a6 6 0 0 1-12 0v-2l-2-3a1.5 1.5 0 0 1 2.4-1.7L7 11" />
    </svg>
  );
}
function BeadsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
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
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
