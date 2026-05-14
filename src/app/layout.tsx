import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MuslimTask — Habit Ibadah Harian",
  description:
    "Catat dan jaga konsistensi ibadah harianmu. Quest, streak, achievement, jadwal salat, dan Al-Quran digital — offline-first.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen font-sans">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Navbar />
          <main className="mt-5">{children}</main>
        </div>
      </body>
    </html>
  );
}
