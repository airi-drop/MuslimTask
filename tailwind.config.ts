import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // === Phase 2 — PRD §1.1 design tokens (additive) ===
        "bg-deepest": "#050E08",
        "bg-deep": "#081210",
        "bg-mid": "#0C1A14",
        "bg-surface": "#102018",
        "bg-raised": "#152A1E",
        "bg-card": "#1A3224",

        "green-dim": "#1E4A2E",
        "green-mid": "#2A6A3E",
        "green-main": "#3A8A52",
        "green-light": "#4AAA66",
        "green-glow": "#5DC47A",

        "gold-dim": "#5A3A08",
        "gold-mid": "#8A5A0E",
        "gold-main": "#C4882A",
        "gold-light": "#D4A040",
        "gold-glow": "#E8BC5A",

        "text-primary": "#E8F0EC",
        "text-secondary": "#7A9A86",
        "text-muted": "#3A5A44",
        "text-ghost": "#1E3028",

        "light-bg": "#F5F2EC",
        "light-bg-card": "#FFFFFF",
        "light-bg-surface": "#EDE9E0",
        "light-text": "#1A2A1E",
        "light-text-muted": "#8A9A8E",
        "light-green": "#2A6A3A",
        "light-gold": "#8A5A10",

        // Light theme — soft parchment + emerald
        parchment: {
          50: "#FBF9F2",
          100: "#F4EFDE",
          200: "#E8E0C5",
        },
        // Deep islamic emerald (replaces forest)
        emerald: {
          50: "#E6F4ED",
          100: "#BFE0CC",
          200: "#7FC0A0",
          400: "#1F9D6A",
          500: "#0F8A57",
          600: "#0A6F44",
          700: "#085434",
          800: "#063D26",
          900: "#04261A",
          950: "#021810",
        },
        // Futuristic accents
        amber: {
          300: "#FCD667",
          400: "#F5BE3D",
          500: "#E5A91C",
          600: "#B58410",
        },
        // Neon cyan-mint for gaming highlights
        neon: {
          400: "#46F2C0",
          500: "#1FE5A5",
          600: "#0DBE85",
        },
        // Space-navy for dark mode background
        space: {
          800: "#0A1620",
          900: "#070F18",
          950: "#030810",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", '"Cormorant Garamond"', "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-ui)", '"DM Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        arabic: ['"Amiri"', '"Scheherazade New"', "serif"],
        ornament: ["var(--font-ornament)", '"Cinzel"', "ui-serif", "Georgia", "serif"],
        ui: ["var(--font-ui)", '"DM Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        xxs: "0.625rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(6, 24, 16, 0.04), 0 8px 24px rgba(6, 24, 16, 0.06)",
        glow: "0 0 0 1px rgba(31,229,165,.25), 0 8px 32px -8px rgba(31,229,165,.45)",
        "glow-amber": "0 0 0 1px rgba(245,190,61,.25), 0 8px 32px -8px rgba(245,190,61,.4)",
      },
      backgroundImage: {
        "grid-light":
          "radial-gradient(circle at 1px 1px, rgba(15,138,87,.08) 1px, transparent 0)",
        "grid-dark":
          "radial-gradient(circle at 1px 1px, rgba(70,242,192,.08) 1px, transparent 0)",
      },
      keyframes: {
        glow: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: ".6" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 4px rgba(196,136,42,0.3)" },
          "50%": { boxShadow: "0 0 12px rgba(196,136,42,0.7)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { transform: "translateY(16px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        glow: "glow 2.4s ease-in-out infinite",
        "spin-slow": "spin-slow 22s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      gridTemplateColumns: {
        "15": "repeat(15, minmax(0, 1fr))",
        "30": "repeat(30, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};

export default config;
