type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <header className="card p-6">
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-500/70">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-1 font-display text-4xl font-bold text-forest-800 sm:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-forest-500/90">
          {description}
        </p>
      )}
    </header>
  );
}
