"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ChevronDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  videos: string[];
  variants: string[];
}

interface LandingHeroProps {
  product: Product | null;
}

export default function LandingHero({ product }: LandingHeroProps) {
  const displayPrice = product?.salePrice && product.salePrice > 0
    ? product.salePrice
    : product?.price;

  const originalPrice = product?.price;
  const hasSale = product?.salePrice && product.salePrice > 0 && product.salePrice < product.price!;

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden"
      style={{ background: "#0E0D0C" }}
    >
      {/* ── Ambient radial glow behind glass panels ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(212,163,115,0.15) 0%, transparent 70%)",
        }}
      />

      {/* ══════════════════ HEADER / NAV ══════════════════ */}
      <header className="relative z-20 w-full pt-10 pb-6 flex flex-col items-center">
        {/* Arch Icon */}
        <div className="mb-3">
          <svg width="48" height="56" viewBox="0 0 48 56" fill="none" aria-hidden="true">
            <path
              d="M4 55V28C4 13.641 12.954 4 24 4C35.046 4 44 13.641 44 28V55"
              stroke="#D4A373"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M10 55V30C10 17.297 16.268 10 24 10C31.732 10 38 17.297 38 30V55"
              stroke="#D4A373"
              strokeWidth="1"
              strokeOpacity="0.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <h1
          className="font-serif tracking-[0.25em] text-3xl md:text-4xl font-bold"
          style={{ color: "#D4A373", letterSpacing: "0.22em" }}
        >
          NAMAS MATE
        </h1>
        <p
          className="mt-1 font-sans text-[10px] tracking-[0.45em] uppercase"
          style={{ color: "#A89F95" }}
        >
          PREMIUM DEVOTION
        </p>

        {/* Inline nav */}
        <nav className="mt-8 flex items-center gap-8 md:gap-12" aria-label="Primary navigation">
          {["HOME", "ABOUT", "PRODUCTS", "SHOPPING", "CONTACT"].map((item) => (
            <Link
              key={item}
              href={item === "HOME" ? "/" : item === "PRODUCTS" ? "#showcase" : `#${item.toLowerCase()}`}
              className="font-sans text-[12px] tracking-[0.15em] transition-colors duration-200 uppercase"
              style={{ color: "#D4A373" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e8c595")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#D4A373")}
            >
              {item}
            </Link>
          ))}
        </nav>
      </header>

      {/* ══════════════════ DUAL ARCH PANELS ══════════════════ */}
      <div
        id="showcase"
        className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-16 mt-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">

          {/* ─── LEFT PANEL: Lifestyle / Cinematic Showcase ─── */}
          <div
            className="relative min-h-[600px] md:min-h-[720px] overflow-hidden flex flex-col"
            style={{
              background: "rgba(20, 18, 16, 0.65)",
              border: "4px solid #141414",
              boxShadow: "0 0 0 2px rgba(212, 163, 115, 0.4), 0 0 40px rgba(212, 163, 115, 0.2)",
              borderRadius: "48px",
            }}
          >
            {/* Lifestyle image */}
            {product?.videos && product.videos.length > 0 ? (
              <video
                src={product.videos[0]}
                className="absolute inset-0 w-full h-full object-cover z-10"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : product?.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt="Namas Mate prayer stool lifestyle"
                fill
                className="object-cover z-10"
                priority
              />
            ) : (
              <div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(30,26,22,0.95) 0%, rgba(20,18,16,0.98) 100%)",
                }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center border"
                  style={{ borderColor: "rgba(212,163,115,0.3)", background: "rgba(212,163,115,0.06)" }}
                >
                  <Sparkles className="w-10 h-10" style={{ color: "#D4A373" }} />
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT PANEL: Product Card ─── */}
          <div
            className="relative flex flex-col overflow-hidden"
            style={{
              background: "rgba(30, 28, 26, 0.7)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(212, 163, 115, 0.25)",
              boxShadow: "0 0 40px rgba(212, 163, 115, 0.15)",
              borderRadius: "40px",
            }}
          >
            <div className="relative z-10 flex flex-col h-full p-6 md:p-10 gap-6">

              {/* Product image cutout */}
              <div
                className="relative w-full rounded-3xl overflow-hidden flex-shrink-0 bg-white"
                style={{
                  minHeight: "260px",
                  background: "#e8e5e1",
                }}
              >
                {product?.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center py-12"
                    style={{ color: "#A89F95" }}
                  >
                    No image available
                  </div>
                )}
              </div>

              {/* Product details */}
              <div className="flex flex-col flex-grow justify-between gap-6">
                <div>
                  <h2
                    className="font-serif text-2xl md:text-3xl font-normal leading-snug"
                    style={{ color: "#D4A373" }}
                  >
                    {product?.name ?? "The Contemporary Leather Prayer Stool"}
                  </h2>

                  {/* Price display */}
                  <div className="flex items-center gap-3 mt-3">
                    <span
                      className="font-sans text-xl font-normal"
                      style={{ color: "#D4A373" }}
                    >
                      ${displayPrice ?? "—"}
                    </span>
                    {hasSale && (
                      <span
                        className="font-sans text-sm line-through"
                        style={{ color: "rgba(168,159,149,0.7)" }}
                      >
                        ${originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Text descriptions matching image exactly */}
                  <div className="space-y-4 mt-6 font-sans text-[15px] leading-relaxed" style={{ color: "#c8c1b5" }}>
                    <p>
                      <span className="font-semibold" style={{ color: "#D4A373" }}>Features: </span>
                      Integrated Ergonomic Stool with Padded Kneeler, Handcrafted in Premium Aniline Leather, Engineered Matte Black Support Structure, Sized for Devotion and Comfort.
                    </p>
                    <p>
                      <span className="font-semibold" style={{ color: "#D4A373" }}>Material & Finish: </span>
                      Choice of Tawny Leather (shown), Onyx Velvet Kneeler, Polished Gold Fasteners.
                    </p>
                    <p>
                      <span className="font-semibold" style={{ color: "#D4A373" }}>Dimensions: </span>
                      S: 20cm, L: 50cm, XL: 75cm (Custom available).
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                {product ? (
                  <Link
                    id="reserve-cta"
                    href={`/order-form?productId=${product.id}`}
                    className="w-full text-center font-sans font-medium text-sm tracking-[0.05em] py-4 px-6 rounded-xl transition-all duration-300"
                    style={{
                      background: "linear-gradient(to bottom, #725b48 0%, #4a3b2f 50%, #362a22 100%)",
                      border: "1px solid rgba(212, 163, 115, 0.4)",
                      color: "#e8c595",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "linear-gradient(to bottom, #8a6e57 0%, #5c4a3c 50%, #46372d 100%)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "linear-gradient(to bottom, #725b48 0%, #4a3b2f 50%, #362a22 100%)";
                    }}
                  >
                    RESERVE YOUR STOOL
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full font-sans font-medium text-sm tracking-[0.05em] py-4 px-6 rounded-xl"
                    style={{
                      background: "rgba(30,26,22,0.8)",
                      border: "1px solid rgba(212,163,115,0.15)",
                      color: "rgba(168,159,149,0.5)",
                    }}
                  >
                    COMING SOON
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-12">
          <a
            href="#features"
            className="flex flex-col items-center gap-1 transition-opacity hover:opacity-80 relative z-20"
            style={{ color: "rgba(212,163,115,0.5)" }}
            aria-label="Scroll to features"
          >
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </a>
        </div>
      </div>

      {/* ── Subtle 4-point Star Accent (Bottom Right) ── */}
      <div 
        className="absolute bottom-8 right-8 z-0 opacity-40 pointer-events-none"
        aria-hidden="true"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#D4A373">
          <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
        </svg>
      </div>
    </section>
  );
}
