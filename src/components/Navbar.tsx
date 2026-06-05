"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "PRODUCT DETAILS", href: "/product-details" },
    { label: "REVIEWS", href: "/product-details#reviews" },
    { label: "CART", href: "/cart" },
  ];

  return (
    <header className="flex flex-col items-center w-full pt-10 pb-8 z-20 relative">
      {/* Logo Image */}
      <Link href="/" aria-label="Namas Mate Home">
        <div className="relative w-[140px] h-[90px] mb-2 overflow-hidden transition-opacity hover:opacity-90">
          <Image
            src="/logo.png"
            alt="Namas Mate Logo"
            fill
            sizes="140px"
            className="object-cover scale-110"
            priority
          />
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center gap-8 md:gap-12 mt-6">
        {navLinks.map(({ label, href }) => {
          const isActive =
            pathname === href ||
            (pathname === "/" && href === "/") ||
            (pathname === "/product-details" &&
              href.startsWith("/product-details"));

          return (
            <Link
              key={label}
              href={href}
              className="text-[12px] tracking-[0.15em] transition-colors"
              style={{ color: isActive ? "#ebd8aa" : "#D4A373" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ebd8aa")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isActive ? "#ebd8aa" : "#D4A373")
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
