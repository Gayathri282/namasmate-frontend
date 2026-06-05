"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

export default function ProductDetailsPage() {
  const testimonials = [
    {
      text: "Very good quality. Extremely sturdy and heavy duty. It provides incredible support for my knees during long prayers.",
      author: "J. Ahmed",
    },
    {
      text: "Beautifully designed and very comfortable for the elderly. Bought this for my father who has severe arthritis, and he can finally complete his prayers without joint pain.",
      author: "M. Ibrahim",
    },
    {
      text: "The C-shaped metal frame doesn't wobble at all, even on thick carpets. Highly recommended for anyone recovering from knee or lower back surgery.",
      author: "M. Omar",
    },
    {
      text: "An absolute blessing for taraweeh and extended jalsa sessions. The leather is premium and the frame looks like a piece of high-end modern furniture.",
      author: "Z. Fatima",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center pb-24 pt-8">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(212,163,115,0.08) 0%, transparent 70%)"
        }}
      />

      <div className="relative z-10 w-full max-w-[1080px] mx-auto px-6 flex flex-col gap-24">
        
        {/* 1. PRODUCT SPECIFICATIONS GRID */}
        <section>
          <div className="text-center mb-12">
            <h2 
              className="font-serif text-[32px] tracking-[0.1em] mb-4 uppercase"
              style={{ color: "#D4A373", fontFamily: "Cormorant Garamond, serif" }}
            >
              Technical Specifications
            </h2>
            <p className="text-[14px]" style={{ color: "#A89F95" }}>
              Engineered with precision for lifelong devotion.
            </p>
          </div>

          <div 
            className="w-full overflow-hidden"
            style={{
              background: "rgba(20, 18, 16, 0.65)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(212, 163, 115, 0.15)",
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <table className="w-full text-left border-collapse">
              <tbody>
                {[
                  {
                    label: "Frame Architecture",
                    value: "C-shaped looping industrial grade steel base with an anti-slip rubber padding protector."
                  },
                  {
                    label: "Comfort Layers",
                    value: "High-density dual-layered responsive orthopedic memory foam structure."
                  },
                  {
                    label: "Exterior Shell",
                    value: "Hand-selected premium top-grain Aniline leather with solid brass/polished gold fasteners."
                  },
                  {
                    label: "Weight Profile",
                    value: "Compact and ultra-lightweight at 1.3 kg for fluid masjid portability and travel."
                  }
                ].map((spec, idx) => (
                  <tr key={idx} style={{ borderBottom: idx !== 3 ? "1px solid rgba(212, 163, 115, 0.1)" : "none" }}>
                    <th 
                      className="py-6 px-8 font-serif text-[18px] w-1/3 align-top"
                      style={{ color: "#D4A373", backgroundColor: "rgba(0,0,0,0.2)" }}
                    >
                      {spec.label}
                    </th>
                    <td className="py-6 px-8 text-[14px] leading-[1.6]" style={{ color: "#A89F95" }}>
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. TESTIMONIALS DISPLAY */}
        <section id="reviews" className="w-full overflow-hidden pb-10">
          <div className="text-center mb-12">
            <h2 
              className="font-serif text-[32px] tracking-[0.1em] uppercase"
              style={{ color: "#D4A373", fontFamily: "Cormorant Garamond, serif" }}
            >
              What The Community Says
            </h2>
          </div>

          {/* Carousel Container */}
          <div className="relative w-full overflow-hidden py-4">
            
            {/* Fading Edges */}
            <div className="absolute top-0 left-0 w-16 md:w-32 h-full z-10" style={{ background: "linear-gradient(to right, #0E0D0C, transparent)" }} />
            <div className="absolute top-0 right-0 w-16 md:w-32 h-full z-10" style={{ background: "linear-gradient(to left, #0E0D0C, transparent)" }} />

            <div 
              className="flex gap-6 w-max animate-marquee"
              style={{
                animation: "marquee 35s linear infinite"
              }}
            >
              {/* Duplicate array to create infinite seamless loop effect */}
              {[...testimonials, ...testimonials].map((review, idx) => (
                <div 
                  key={idx}
                  className="w-[320px] md:w-[400px] flex-shrink-0 flex flex-col p-8 lg:p-10"
                  style={{
                    background: "rgba(20, 18, 16, 0.65)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(212, 163, 115, 0.15)",
                    borderRadius: "24px",
                  }}
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" style={{ color: "#D4A373" }} />
                    ))}
                  </div>
                  <p className="text-[16px] leading-[1.8] italic mb-8" style={{ color: "#A89F95" }}>
                    "{review.text}"
                  </p>
                  <div className="mt-auto">
                    <p className="text-[14px] font-semibold tracking-wider" style={{ color: "#D4A373" }}>
                      — {review.author}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider mt-1 opacity-60" style={{ color: "#A89F95" }}>
                      Verified Buyer
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-50% - 12px)); }
            }
            .animate-marquee:hover {
              animation-play-state: paused !important;
            }
          `}} />
        </section>

      </div>
    </div>
  );
}
