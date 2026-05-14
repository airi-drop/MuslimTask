type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <header className="card hud-frame relative overflow-hidden p-5 sm:p-6">
      {/* Subtle radial accent */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-400/10 blur-2xl dark:bg-neon-400/20" />
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600/80 dark:text-neon-500/80">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-emerald-800 dark:text-parchment-50 sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-emerald-700/80 dark:text-parchment-100/70">
          {description}
        </p>
      )}
    </header>
  );
}
