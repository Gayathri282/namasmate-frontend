import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant", // Reusing the same variable name so it maps to font-serif automatically
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
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="font-sans bg-[#FAF7F0] text-[#1B4332] min-h-screen flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
