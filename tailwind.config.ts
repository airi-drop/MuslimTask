import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FBF7EE",
          100: "#F6EFDE",
          200: "#EFE3C4",
        },
        forest: {
          50: "#E8EFE9",
          100: "#C7D6C9",
          400: "#3F5A45",
          500: "#2F4A37",
          600: "#26402E",
          700: "#1F3526",
          800: "#172A1D",
          900: "#0E1E14",
        },
        gold: {
          400: "#D9A441",
          500: "#C68A2E",
          600: "#A56F1F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 30, 20, 0.04), 0 8px 24px rgba(15, 30, 20, 0.06)",
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
