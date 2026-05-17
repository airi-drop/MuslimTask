import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mihrab",
    short_name: "Mihrab",
    description:
      "Tracker kualitas ibadah harian. Ukur, tingkatkan, banggakan perjalanan spiritualmu.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050E08",
    theme_color: "#0C1A14",
    lang: "id",
    categories: ["lifestyle", "health"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
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
