import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Cinzel, DM_Sans, Amiri } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

// Critical path — render immediately
import BottomNav from "@/components/layout/BottomNav";
import { ThemeBoot } from "@/components/ThemeBoot";
import { OnboardingGate } from "@/components/OnboardingGate";

// Non-critical — lazy load (these show conditionally or after delay)
const PWARegister = dynamic(() => import("@/components/PWARegister").then(m => ({ default: m.PWARegister })), { ssr: false });
const InstallPrompt = dynamic(() => import("@/components/InstallPrompt").then(m => ({ default: m.InstallPrompt })), { ssr: false });
const NotificationManager = dynamic(() => import("@/components/NotificationManager").then(m => ({ default: m.NotificationManager })), { ssr: false });

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-ornament",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400"],
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
    { media: "(prefers-color-scheme: light)", color: "#F5F2EC" },
    { media: "(prefers-color-scheme: dark)", color: "#050E08" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Inline theme boot script — runs before React hydrates to prevent FOUC
const themeBootScript = `
(function(){
  try {
    var t = localStorage.getItem("mihrab-theme") || localStorage.getItem("mt:theme");
    if (t !== "dark" && t !== "light") t = "dark";
    var root = document.documentElement;
    root.setAttribute("data-theme", t);
    if (t === "dark") root.classList.add("dark");
  } catch(e){
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("dark");
  }
})();
`;

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
      <body className="font-ui bg-bg-deepest text-text-primary min-h-dvh">
        <ThemeBoot />
        <OnboardingGate />
        <NotificationManager />
        <div className="max-w-[430px] mx-auto min-h-dvh flex flex-col relative">
          <main className="flex-1 overflow-y-auto pb-[72px] pt-safe">
            {children}
          </main>
          <BottomNav />
        </div>
        <PWARegister />
        <InstallPrompt />
      </body>
    </html>
  );
}
