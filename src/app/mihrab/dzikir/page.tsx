import type { Metadata } from "next";
import { DzikirCounter } from "@/components/DzikirCounter";

export const metadata: Metadata = {
  title: "Dzikir — MuslimTask",
};

export default function DzikirPage() {
  return <DzikirCounter />;
}
