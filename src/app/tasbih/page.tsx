import { TasbihCounter } from "@/components/TasbihCounter";

export const metadata = {
  title: "Tasbih Digital — Mihrab",
  description: "Dzikir dengan counter digital. Pilih preset atau atur target sendiri.",
};

export default function TasbihPage() {
  return (
    <div className="px-5 py-6 pb-24 [&_.card]:bg-bg-surface [&_.card]:ring-0 [&_.card]:border [&_.card]:border-text-ghost/30 [&_.card]:shadow-none [&_.card-feature]:bg-gradient-to-br [&_.card-feature]:from-green-main [&_.card-feature]:to-green-dim [&_.card-feature]:ring-0 [&_.card-feature]:shadow-none [&_.stat-tile]:bg-bg-surface [&_.stat-tile]:border-text-ghost/30">
      <TasbihCounter />
    </div>
  );
}
