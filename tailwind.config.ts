import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-cormorant)", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#03432E",   // Royal Emerald Green
          dark: "#012116",      // Deep Egyptian Green
          light: "#077353",
          hover: "#04573C",
        },
        gold: {
          DEFAULT: "#D4AF37",   // Egyptian Gold
          light: "#F3E5AB",
          dark: "#AA8C2C",
        },
        cream: {
          DEFAULT: "#FFFFFF",   // Pure White for contrast
          dark: "#F4F0E6",
        },
      },
    },
  },
  plugins: [],
};
export default config;
