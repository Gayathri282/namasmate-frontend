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
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        serif: ["var(--font-serif)", "Cormorant Garamond", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#5c4a3c",   // Deep Bronze Taupe
          dark: "#0E0D0C",      // Rich Onyx (global background)
          light: "#A89F95",     // Warm Taupe (body text)
          hover: "#4e3b32",     // Darker Bronze Taupe
        },
        gold: {
          DEFAULT: "#D4A373",   // Polished Tawny Gold (primary accent)
          light: "#e8c595",     // Warm Champagne Gold
          dark: "#a67c30",      // Antique Gold (shadows/depth)
        },
        cream: {
          DEFAULT: "#f5efe6",   // Sandalwood Crème (light surfaces)
          dark: "#ede6db",      // Muslin backdrop
        },
        onyx: "#0E0D0C",        // Alias for global dark bg
        taupe: "#A89F95",       // Alias for body text
      },
      borderRadius: {
        "arch": "28px",         // Glass arch panel radius
      },
      backdropBlur: {
        amber: "16px",          // Standard smoked amber blur
        nav: "20px",            // Floating nav blur
      },
      boxShadow: {
        "gold-sm": "0 4px 24px rgba(212,163,115,0.10)",
        "gold-md": "0 8px 36px rgba(212,163,115,0.18)",
        "gold-lg": "0 16px 56px rgba(212,163,115,0.24)",
      },
      animation: {
        "shimmer": "shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0" },
          "50%":       { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
