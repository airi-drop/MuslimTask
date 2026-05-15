import { notFound } from "next/navigation";
import { SURAH_LIST } from "@/lib/quran";
import { SurahReader } from "@/components/SurahReader";

export async function generateStaticParams() {
  return SURAH_LIST.map((s) => ({ surah: String(s.nomor) }));
}

export function generateMetadata({ params }: { params: { surah: string } }) {
  const n = Number(params.surah);
  const meta = SURAH_LIST.find((s) => s.nomor === n);
  if (!meta) return { title: "Surah tidak ditemukan — MuslimTask" };
  return {
    title: `${meta.namaLatin} (${meta.arti}) — MuslimTask`,
    description: `Baca surah ${meta.namaLatin} (${meta.arti}) — ${meta.jumlahAyat} ayat. Tersimpan offline.`,
  };
}

export default function SurahPage({ params }: { params: { surah: string } }) {
  const n = Number(params.surah);
  const meta = SURAH_LIST.find((s) => s.nomor === n);
  if (!meta) notFound();
  return <SurahReader meta={meta} />;
}
