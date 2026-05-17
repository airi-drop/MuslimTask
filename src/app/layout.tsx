import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Cinzel, DM_Sans, Amiri } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { themeBootScript } from "@/components/ThemeToggle";
import { ThemeBoot } from "@/components/ThemeBoot";
import { PWARegister } from "@/components/PWARegister";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PrayerNotifier } from "@/components/PrayerNotifier";

// PRD §1.2 — Cormorant Garamond drives `font-display` (numbers, prayer
// names, large headings, rank names).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// PRD §1.2 — Cinzel drives `font-ornament` (UPPERCASE section labels,
// nav labels, badge text).
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ornament",
  display: "swap",
});

// PRD §1.2 — DM Sans drives `font-ui` AND the default `font-sans` (body
// text, descriptions, time, XP values).
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
});

// Arabic-script font for Quran ayat, dzikir text, and `.arabic` class.
// Retained from the previous build; not part of the PRD §1.2 swap.
const amiri = Amiri({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://muslimtask.app"),
  title: "Mihrab — Tracker Kualitas Ibadah",
  description:
    "Tracker kualitas ibadah harian. Ukur, tingkatkan, banggakan perjalanan spiritualmu.",
  applicationName: "Mihrab",
  appleWebApp: {
    capable: true,
    title: "Mihrab",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4EFDE" },
    { media: "(prefers-color-scheme: dark)", color: "#070F18" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${cinzel.variable} ${dmSans.variable} ${amiri.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen font-sans">
        <ThemeBoot />
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
          <Navbar />
          <main className="mt-4 pb-24 sm:mt-5 sm:pb-0">{children}</main>
        </div>
        <PWARegister />
        <InstallPrompt />
        <PrayerNotifier />
      </body>
    </html>
  );
}
