import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MuslimTask — Quest Ibadah Harian",
    short_name: "MuslimTask",
    description:
      "Tingkatkan konsistensi ibadah lewat sistem quest, streak, dan achievement. Offline-first.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#070F18",
    theme_color: "#04261A",
    lang: "id",
    categories: ["lifestyle", "education", "productivity"],
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon2",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/maskable-icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Quest Hari Ini",
        short_name: "Quest",
        url: "/quest",
        description: "Lihat dan klaim quest harian.",
      },
      {
        name: "Tasbih",
        short_name: "Tasbih",
        url: "/tasbih",
        description: "Dzikir dengan counter digital.",
      },
      {
        name: "Al-Quran",
        short_name: "Quran",
        url: "/mihrab/quran",
        description: "Baca Al-Quran offline.",
      },
      {
        name: "Statistik",
        short_name: "Statistik",
        url: "/statistik",
        description: "Lihat konsistensi ibadah.",
      },
    ],
  };
}
