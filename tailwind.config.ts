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
          DEFAULT: "#1B4332",
          dark: "#122e22",
          light: "#2D6A4F",
          hover: "#40916C",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#DFCA78",
          dark: "#A3822E",
        },
        cream: {
          DEFAULT: "#FAF7F0",
          dark: "#F4EFE3",
        },
      },
    },
  },
  plugins: [],
};
export default config;
