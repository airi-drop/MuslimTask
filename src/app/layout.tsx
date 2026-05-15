import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Amiri } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { themeBootScript } from "@/components/ThemeToggle";
import { PWARegister } from "@/components/PWARegister";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PrayerNotifier } from "@/components/PrayerNotifier";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const amiri = Amiri({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://muslimtask.app"),
  title: "MuslimTask — Quest Ibadah Harian",
  description:
    "Tingkatkan konsistensi ibadahmu lewat sistem quest, streak, dan achievement. Offline-first, full Indonesian.",
  applicationName: "MuslimTask",
  appleWebApp: {
    capable: true,
    title: "MuslimTask",
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
      className={`${inter.variable} ${display.variable} ${amiri.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen font-sans">
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
