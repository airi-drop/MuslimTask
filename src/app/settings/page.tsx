import type { Metadata } from "next";
import { SettingsPanel } from "@/components/SettingsPanel";

export const metadata: Metadata = {
  title: "Pengaturan — Mihrab",
};

export default function SettingsPage() {
  return (
    <div className="px-5 py-6 pb-24 [&_.card]:bg-bg-surface [&_.card]:ring-0 [&_.card]:border [&_.card]:border-text-ghost/30 [&_.card]:shadow-none [&_.stat-tile]:bg-bg-surface [&_.stat-tile]:border-text-ghost/30">
      <SettingsPanel />
    </div>
  );
}
