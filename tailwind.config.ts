import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
        display: ['"Space Grotesk"', "var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        arabic: ['"Amiri"', '"Scheherazade New"', "serif"],
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
      },
      animation: {
        glow: "glow 2.4s ease-in-out infinite",
        "spin-slow": "spin-slow 22s linear infinite",
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
