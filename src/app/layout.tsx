import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

// ── Serif: Cormorant Garamond — elegant, wide-tracked luxury serif ──
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

// ── Sans: Inter — clean, modern, legible body copy ──
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Namas Mate | Premium Leather Prayer Stool",
  description:
    "Experience spiritual comfort with our Contemporary Leather Prayer Stool — handcrafted Aniline leather, engineered matte-black frame, sized for devotion.",
  keywords:
    "prayer stool, namas mate, kneeling stool, leather prayer stool, muslim prayer accessories, premium devotion",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Namas Mate — Premium Devotion",
    description:
      "Handcrafted contemporary leather prayer stool. Smoked amber. Matte black frame. Polished gold fasteners.",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "Namas Mate Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body
        className="font-sans antialiased min-h-screen flex flex-col"
        style={{ background: "#0E0D0C", color: "#A89F95" }}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
