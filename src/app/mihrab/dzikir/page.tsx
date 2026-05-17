import type { Metadata } from "next";
import { DzikirCounter } from "@/components/DzikirCounter";

export const metadata: Metadata = {
  title: "Dzikir — Mihrab",
};

export default function DzikirPage() {
  return <DzikirCounter />;
}
