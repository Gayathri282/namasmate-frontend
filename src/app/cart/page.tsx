"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ShieldCheck, Lock, Minus, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice: number;
  isActive: boolean;
}

export default function CartCheckoutPage() {
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        const active = data.find((p) => p.isActive) ?? data[0] ?? null;
        if (active) setProduct(active);
      })
      .catch(() => {/* keep null — fallback shown below */});
  }, []);

  // Use salePrice when set, otherwise use regular price
  const unitPrice = product
    ? product.salePrice > 0
      ? product.salePrice
      : product.price
    : 1499;

  const originalPrice =
    product && product.salePrice > 0 ? product.price : null;

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN") + ".00";

  const inputStyle = {
    background: "rgba(10, 8, 6, 0.8)",
    border: "1px solid rgba(212, 163, 115, 0.15)",
    color: "#A89F95",
  };
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "rgba(212, 163, 115, 0.5)");
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "rgba(212, 163, 115, 0.15)");

  return (
    <div className="w-full flex flex-col items-center pb-24 pt-8">
      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 cursor-zoom-out"
          style={{ background: "rgba(10, 8, 6, 0.92)", backdropFilter: "blur(8px)" }}
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative w-full max-w-[400px] aspect-[2/2.8] rounded-[24px] overflow-hidden"
            style={{ border: "2px solid rgba(212, 163, 115, 0.4)" }}
          >
            <Image
              src="/qr-code.jpg"
              alt="PhonePe Payment QR Code (Zoomed)"
              fill
              className="object-contain"
            />
          </div>
          <p className="mt-6 text-[13px] uppercase tracking-widest" style={{ color: "#D4A373" }}>
            Click anywhere to close
          </p>
        </div>
      )}

      {/* Background Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,163,115,0.08) 0%, transparent 80%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 flex flex-col items-center">
        <div className="text-center mb-10 w-full">
          <h2
            className="font-serif text-[32px] tracking-[0.1em] mb-3 uppercase flex items-center justify-center gap-3"
            style={{ color: "#D4A373", fontFamily: "Cormorant Garamond, serif" }}
          >
            <Lock className="w-6 h-6" /> Secure Checkout
          </h2>
          <p className="text-[14px]" style={{ color: "#A89F95" }}>
            Complete your order through our verified payment portal.
          </p>
        </div>

        <div className="w-full flex flex-col lg:flex-row justify-center gap-8 items-start">
          {/* 1. SHOPPING BAG (Left Column) */}
          <div
            className="w-full lg:w-[480px] flex flex-col p-8"
            style={{
              background: "rgba(20, 18, 16, 0.65)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(212, 163, 115, 0.15)",
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <h3
              className="font-serif text-[20px] mb-6 tracking-wide uppercase"
              style={{ color: "#D4A373" }}
            >
              Shopping Bag
            </h3>

            <div
              className="flex gap-6 pb-6"
              style={{ borderBottom: "1px solid rgba(212, 163, 115, 0.1)" }}
            >
              {/* Mini Thumbnail */}
              <div
                className="w-[100px] h-[100px] rounded-[16px] overflow-hidden relative flex-shrink-0"
                style={{ background: "rgba(255, 255, 255, 0.95)" }}
              >
                <Image
                  src="/stool-isolated.jpg"
                  alt="SujoodMate Thumbnail"
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* Item Details */}
              <div className="flex flex-col flex-grow justify-between py-1">
                <div>
                  <h4
                    className="font-serif text-[18px] leading-snug"
                    style={{ color: "#D4A373" }}
                  >
                    The SujoodMate Ergonomic Prayer Stool
                  </h4>
                  <p className="text-[12px] mt-1" style={{ color: "#A89F95" }}>
                    Tawny Leather / Matte Black Frame
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity Adjuster */}
                  <div
                    className="flex items-center rounded-full px-3 py-1.5 gap-4"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(212,163,115,0.2)",
                    }}
                  >
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-[#D4A373] hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span
                      className="text-[12px] font-medium w-4 text-center"
                      style={{ color: "#D4A373" }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-[#D4A373] hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Unit price with optional strikethrough */}
                  <div className="flex flex-col items-end">
                    <span
                      className="text-[16px] font-medium tracking-wide"
                      style={{ color: "#D4A373" }}
                    >
                      {fmt(unitPrice * quantity)}
                    </span>
                    {originalPrice !== null && (
                      <span
                        className="text-[12px] line-through opacity-50"
                        style={{ color: "#A89F95" }}
                      >
                        {fmt(originalPrice * quantity)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Row */}
            <div className="flex justify-between items-center pt-6">
              <span
                className="text-[14px] uppercase tracking-wider"
                style={{ color: "#A89F95" }}
              >
                Subtotal
              </span>
              <span className="text-[20px] font-semibold" style={{ color: "#D4A373" }}>
                {fmt(unitPrice * quantity)}
              </span>
            </div>

            <div
              className="flex items-center gap-2 mt-6 pt-6"
              style={{ borderTop: "1px dashed rgba(212, 163, 115, 0.15)" }}
            >
              <ShieldCheck className="w-4 h-4" style={{ color: "rgba(212, 163, 115, 0.7)" }} />
              <p className="text-[11px]" style={{ color: "rgba(168,159,149,0.7)" }}>
                Secure checkout. Free shipping across India.
              </p>
            </div>
          </div>

          {/* 2. SECURE GLASS CHECKOUT PORTAL (Right Column) */}
          <div
            className="w-full lg:w-[560px] flex flex-col p-8 lg:p-10"
            style={{
              background: "rgba(20, 18, 16, 0.65)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(212, 163, 115, 0.15)",
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* QR Code Section */}
            <div
              className="flex flex-col items-center mb-10 pb-10"
              style={{ borderBottom: "1px solid rgba(212, 163, 115, 0.1)" }}
            >
              <div
                className="w-[200px] h-[280px] rounded-[16px] flex items-center justify-center mb-4 relative overflow-hidden cursor-zoom-in transition-transform hover:scale-105"
                style={{
                  background: "rgba(10, 8, 6, 0.8)",
                  border: "1px solid rgba(212, 163, 115, 0.3)",
                }}
                onClick={() => setIsZoomed(true)}
              >
                <Image
                  src="/qr-code.jpg"
                  alt="PhonePe Payment QR Code"
                  fill
                  className="object-contain"
                />
              </div>
              <p
                className="text-[11px] uppercase tracking-wider mb-3"
                style={{ color: "rgba(212,163,115,0.6)" }}
              >
                Tap to zoom &amp; scan
              </p>
              <p
                className="text-[14px] text-center max-w-[320px] leading-relaxed"
                style={{ color: "#A89F95" }}
              >
                Scan the QR code to clear your invoice securely via any UPI Application.
              </p>
            </div>

            {/* Input Form Fields */}
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>

              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[11px] uppercase tracking-wider pl-2"
                  style={{ color: "#D4A373" }}
                >
                  Full Name <span style={{ color: "#D4A373" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="First and Last Name"
                  className="w-full rounded-[16px] p-4 text-[14px] outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Full Delivery Address */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[11px] uppercase tracking-wider pl-2"
                  style={{ color: "#D4A373" }}
                >
                  Full Delivery Address <span style={{ color: "#D4A373" }}>*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Street address, City, State, PIN Code"
                  className="w-full rounded-[16px] p-4 text-[14px] outline-none transition-all duration-300 resize-none"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Contact Phone */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[11px] uppercase tracking-wider pl-2"
                  style={{ color: "#D4A373" }}
                >
                  Contact Phone Number <span style={{ color: "#D4A373" }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9+\s\-]{7,15}"
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-[16px] p-4 text-[14px] outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Bank UTR / Transaction ID */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[11px] uppercase tracking-wider pl-2"
                  style={{ color: "#D4A373" }}
                >
                  Bank UTR / Transaction ID <span style={{ color: "#D4A373" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  minLength={6}
                  placeholder="Enter UTR / Transaction Reference"
                  className="w-full rounded-[16px] p-4 text-[14px] outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>

              {/* Final Submit Button */}
              <button
                type="submit"
                className="w-full py-5 rounded-[16px] text-[13px] tracking-[0.15em] font-bold transition-all duration-300 mt-4"
                style={{
                  background: "linear-gradient(135deg, #CF9F45 0%, #A67C30 100%)",
                  border: "none",
                  color: "#0E0D0C",
                  boxShadow: "0 8px 24px rgba(212,163,115,0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(212,163,115,0.4)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(212,163,115,0.25)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.98)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
              >
                CONFIRM VERIFICATION PAYMENT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
