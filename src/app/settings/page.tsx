import type { Metadata } from "next";
import { SettingsPanel } from "@/components/SettingsPanel";

export const metadata: Metadata = {
  title: "Pengaturan — Mihrab",
};

export default function SettingsPage() {
  return <SettingsPanel />;
}
