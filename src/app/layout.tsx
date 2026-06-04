import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant", // Keep variable name to map to font-serif
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sujood Mate | Premium Orthopedic Prayer Mats",
  description: "Experience spiritual comfort and alignment with our premium memory-foam prayer mats. Artfully crafted with rich Islamic geometric patterns.",
  keywords: "prayer mat, sujood mate, orthopedic prayer mat, memory foam sujood mat, islamic gifts, premium prayer mat",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Sujood Mate - Premium Orthopedic Prayer Mats",
    description: "Experience spiritual comfort and alignment with our premium memory-foam prayer mats.",
    type: "website",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "Sujood Mate Logo" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans bg-cream text-primary-dark min-h-screen flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
