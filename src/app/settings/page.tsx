import type { Metadata } from "next";
import { SettingsPanel } from "@/components/SettingsPanel";

export const metadata: Metadata = {
  title: "Pengaturan — MuslimTask",
};

export default function SettingsPage() {
  return <SettingsPanel />;
}
