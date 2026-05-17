import type { Metadata } from "next";
import { QuestBoard } from "@/components/QuestBoard";

export const metadata: Metadata = {
  title: "Quest — Mihrab",
  description:
    "Daftar quest harian dan mingguan untuk konsistensi ibadah. Klaim XP saat selesai.",
};

export default function QuestPage() {
  return <QuestBoard />;
}
