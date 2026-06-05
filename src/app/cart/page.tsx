"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Minus, 
  Plus, 
  Check, 
  QrCode, 
  Smartphone, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Sparkles,
  ShoppingBag,
  MapPin,
  CheckCircle2
} from "lucide-react";

interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  salePrice: number;
  isActive: boolean;
}

interface Settings {
  upiId?: string;
  upiQrCode?: string;
}

export default function CartCheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 4
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  
  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [transactionId, setTransactionId] = useState("");
  
  // Flow state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utrError, setUtrError] = useState<string | null>(null);

  // Fetch product and settings
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        const active = data.find((p) => p.isActive) ?? data[0] ?? null;
        if (active) setProduct(active);
      })
      .catch(() => {});

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data: Settings) => {
        if (data) setSettings(data);
      })
      .catch(() => {});
  }, []);

  const unitPrice = product
    ? product.salePrice > 0
      ? product.salePrice
      : product.price
    : 1499;

  const originalPrice =
    product && product.salePrice > 0 ? product.price : null;

  const subtotal = unitPrice * quantity;
  const shipping = 0; // Standard complimentary
  const totalAmount = subtotal + shipping;

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN") + ".00";

  // Form handlers
  const handleNextStep = () => {
    if (currentStep === 2) {
      // Validate UTR / Transaction ID
      const cleanedUtr = transactionId.replace(/\s+/g, "");
      if (!cleanedUtr) {
        setUtrError("Transaction ID / UTR is required.");
        return;
      }
      if (cleanedUtr.length !== 12) {
        setUtrError("UPI UTR must be exactly 12 digits.");
        return;
      }
      setUtrError(null);
    }
    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !streetAddress || !city || !stateName || !pincode) {
      setError("Please fill in all shipping fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const prodId = product?.id || product?._id || "65c32bfa034cb24ab9e5fb82"; // safe fallback ObjectId
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: fullName,
          email,
          phone,
          address: streetAddress,
          city,
          state: stateName,
          pincode,
          productId: prodId,
          amount: totalAmount,
          transactionId: transactionId.replace(/\s+/g, ""),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      // Order placed successfully, advance to Step 5 (Success canvas)
      setCurrentStep(4);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeVpa = settings?.upiId || "YOUR_VPA@ybl";
  // UPI Deep-link configuration
  const upiDeepLink = `upi://pay?pa=${activeVpa}&pn=NamasMate&am=${totalAmount.toFixed(2)}&cu=INR`;

  // Wizard steps indicator
  const steps = [
    { label: "Summary" },
    { label: "Pay" },
    { label: "Verify" },
    { label: "Shipping" }
  ];

  return (
    <div className="w-full flex flex-col items-center pb-24 pt-8 min-h-screen relative overflow-hidden bg-islamic-pattern">
      {/* Zoom Modal for QR Code */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 cursor-zoom-out"
          style={{ background: "rgba(10, 8, 6, 0.92)", backdropFilter: "blur(8px)" }}
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative w-full max-w-[360px] aspect-[2/2.8] rounded-[24px] overflow-hidden bg-[#0E0D0C]"
            style={{ border: "2px solid rgba(212, 163, 115, 0.4)" }}
          >
            <Image
              src="/qr-code.jpg"
              alt="Payment QR Code (Zoomed)"
              fill
              sizes="(max-width: 768px) 100vw, 360px"
              className="object-contain p-4"
            />
          </div>
          <p className="mt-6 text-[13px] uppercase tracking-widest text-[#D4A373]">
            Click anywhere to close
          </p>
        </div>
      )}

      {/* Ambient Radial Background Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,163,115,0.08) 0%, transparent 80%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[850px] mx-auto px-4 flex flex-col items-center">
        
        {/* Centered Header */}
        <div className="text-center mb-10 w-full">
          <h2
            className="font-serif text-[32px] tracking-[0.1em] mb-3 uppercase flex items-center justify-center gap-3 text-[#D4A373]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            <Lock className="w-6 h-6" /> Secure Checkout
          </h2>
          <p className="text-[14px] text-[#A89F95]">
            Complete your order through our verified payment portal.
          </p>
        </div>

        {/* Wizard Container */}
        <div
          className="w-full flex flex-col p-6 md:p-10 relative overflow-hidden transition-all duration-300"
          style={{
            background: "rgba(20, 18, 16, 0.65)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(212, 163, 115, 0.15)",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          {/* Progress Indicator - Hidden on step 5 (success screen) */}
          {currentStep < 4 && (
            <div className="w-full flex items-center justify-between mb-10 relative px-4">
              {/* Progress Line Background */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -translate-y-1/2 z-0 mx-8 md:mx-14" />
              {/* Active Progress Line */}
              <div
                className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-[#D4A373] to-[#e8c595] -translate-y-1/2 transition-all duration-500 ease-in-out z-0 mx-8 md:mx-14"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              />

              {steps.map((s, idx) => {
                const isCompleted = currentStep > idx;
                const isActive = currentStep === idx;
                return (
                  <div key={idx} className="flex flex-col items-center relative z-10 flex-1">
                    <button
                      onClick={() => idx < currentStep && setCurrentStep(idx)}
                      disabled={idx >= currentStep}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-500 border ${
                        isCompleted
                          ? "bg-[#D4A373] text-[#0E0D0C] border-[#D4A373]"
                          : isActive
                          ? "bg-[#0E0D0C] text-[#D4A373] border-[#D4A373] shadow-[0_0_15px_rgba(212,163,115,0.3)] scale-110"
                          : "bg-[#0E0D0C] text-[#A89F95]/30 border-white/10 cursor-not-allowed"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                    </button>
                    <span
                      className={`text-[10px] md:text-[11px] font-medium tracking-widest mt-3 uppercase transition-colors duration-300 ${
                        isActive ? "text-[#D4A373]" : isCompleted ? "text-[#D4A373]/70" : "text-[#A89F95]/30"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sliding Track Viewport */}
          <div className="w-full overflow-hidden relative min-h-[420px]">
            <div
              className="flex transition-transform duration-500 ease-in-out items-start"
              style={{
                transform: `translateX(-${currentStep * 20}%)`,
                width: "500%",
              }}
            >
              
              {/* ──────────────────────────────────────────────────────────
                 STEP 1: ORDER SUMMARY (The Review Screen)
                 ────────────────────────────────────────────────────────── */}
              <div className="w-1/5 shrink-0 px-1 md:px-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-[22px] tracking-wide text-[#D4A373] mb-6 uppercase flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#D4A373]" /> Order Summary
                  </h3>

                  <div className="flex flex-col md:flex-row gap-8 items-center bg-[#0E0D0C]/40 border border-white/5 p-6 rounded-2xl mb-8">
                    {/* Left Thumbnail with quantity bubble */}
                    <div className="relative">
                      <div
                        className="w-[120px] h-[120px] rounded-[16px] overflow-hidden relative flex-shrink-0 bg-white"
                        style={{ border: "1px solid rgba(212, 163, 115, 0.2)" }}
                      >
                        <Image
                          src="/stool-isolated.jpg"
                          alt="SujoodMate Ergonomic Prayer Stool"
                          fill
                          sizes="120px"
                          className="object-contain p-2"
                        />
                      </div>
                      <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#D4A373] text-[#0E0D0C] text-[12px] font-bold flex items-center justify-center shadow-lg">
                        {quantity}
                      </span>
                    </div>

                    {/* Description and Interactive quantity control */}
                    <div className="flex-1 flex flex-col justify-between self-stretch py-1">
                      <div>
                        <h4 className="font-serif text-[19px] leading-snug text-[#D4A373]">
                          The SujoodMate Ergonomic Prayer Stool
                        </h4>
                        <p className="text-[12px] mt-1 text-[#A89F95] uppercase tracking-wider">
                          Tawny Leather / Matte Black Frame
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div
                          className="flex items-center rounded-full px-3 py-1.5 gap-4"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(212, 163, 115, 0.2)",
                          }}
                        >
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="text-[#D4A373] hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[13px] font-bold w-4 text-center text-[#D4A373]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="text-[#D4A373] hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-col items-end">
                          <span className="text-[16px] font-bold text-[#D4A373] tracking-wide">
                            {fmt(unitPrice * quantity)}
                          </span>
                          {originalPrice !== null && (
                            <span className="text-[12px] line-through text-[#A89F95]/50">
                              {fmt(originalPrice * quantity)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right / Bottom Price Manifest */}
                <div className="bg-[#0e0d0c]/30 border border-white/5 rounded-2xl p-6 mb-6">
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-[13px] uppercase tracking-wider text-[#A89F95]">Item Subtotal</span>
                    <span className="text-[14px] text-[#A89F95]">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-start py-2.5 border-t border-white/5">
                    <div>
                      <span className="text-[13px] uppercase tracking-wider text-[#A89F95]">Shipping &amp; Handling</span>
                      <p className="text-[10px] text-[#D4A373]/80 uppercase tracking-widest mt-0.5">Standard Complimentary Shipping</p>
                    </div>
                    <span className="text-[14px] text-[#D4A373] font-medium">₹0.00</span>
                  </div>
                  <div className="flex justify-between items-center py-3.5 border-t border-[#D4A373]/20">
                    <span className="text-[14px] uppercase tracking-wider font-semibold text-[#A89F95]">Total Amount Due</span>
                    <span className="text-[20px] font-serif font-bold text-[#D4A373]">{fmt(totalAmount)}</span>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full py-4 rounded-[16px] text-[13px] tracking-[0.2em] font-bold transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #CF9F45 0%, #A67C30 100%)",
                    color: "#0E0D0C",
                    boxShadow: "0 8px 24px rgba(212,163,115,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(212,163,115,0.4)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(212,163,115,0.25)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  PROCEED TO PAYMENT <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* ──────────────────────────────────────────────────────────
                 STEP 2: SECURE UPI GATEWAY (Dual-Payment Intent)
                 ────────────────────────────────────────────────────────── */}
              <div className="w-1/5 shrink-0 px-1 md:px-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-[22px] tracking-wide text-[#D4A373] mb-2 uppercase flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[#D4A373]" /> Secure UPI Payment
                  </h3>
                  <p className="text-[13px] text-[#A89F95] mb-8">
                    Select your preferred secure payment method below to complete the invoice of <span className="text-[#D4A373] font-bold">{fmt(totalAmount)}</span>.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Left Column (Desktop QR Code Frame) */}
                    <div className="flex flex-col items-center p-6 bg-[#0E0D0C]/40 border border-white/5 rounded-2xl text-center">
                      <div
                        className="w-[160px] h-[210px] rounded-[16px] flex items-center justify-center mb-4 relative overflow-hidden cursor-zoom-in transition-transform hover:scale-[1.03]"
                        style={{
                          background: "rgba(10, 8, 6, 0.8)",
                          border: "1px solid rgba(212, 163, 115, 0.2)",
                        }}
                        onClick={() => setIsZoomed(true)}
                      >
                        <Image
                          src="/qr-code.jpg"
                          alt="PhonePe Payment QR Code"
                          fill
                          sizes="160px"
                          className="object-contain p-2"
                        />
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-[#D4A373]/80 mb-2">Tap to Zoom &amp; Scan</p>
                      <p className="text-[12px] text-[#A89F95] max-w-[200px] leading-relaxed">
                        Scan using any UPI app (GPay, PhonePe, Paytm, BHIM) to pay.
                      </p>
                    </div>

                    {/* Right Column (Mobile Deep-Linking) */}
                    <div className="flex flex-col justify-center items-center p-6 bg-[#0E0D0C]/40 border border-white/5 rounded-2xl text-center">
                      <Smartphone className="w-10 h-10 text-[#D4A373] mb-4 opacity-80" />
                      <h4 className="text-[14px] uppercase tracking-wider font-semibold text-[#D4A373] mb-2">
                        Mobile Checkout
                      </h4>
                      <p className="text-[12px] text-[#A89F95] mb-6 max-w-[220px] leading-relaxed">
                        Checking out on your phone? Tap below to open your preferred UPI application automatically.
                      </p>
                      <a
                        href={upiDeepLink}
                        className="w-full py-4 px-6 rounded-[16px] text-[12px] tracking-wider font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:brightness-110"
                        style={{
                          background: "linear-gradient(135deg, #5C4A3C 0%, #3D2F24 100%)",
                          border: "1px solid rgba(212, 163, 115, 0.25)",
                          color: "#ebd8aa",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        TAP TO PAY VIA UPI APP
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 py-4 border border-white/10 rounded-[16px] text-[12px] tracking-wider text-[#A89F95] hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> BACK
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 py-4 rounded-[16px] text-[12px] tracking-wider font-bold text-[#0E0D0C] transition-all flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #CF9F45 0%, #A67C30 100%)",
                    }}
                  >
                    I HAVE PAID, ENTER DETAILS <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────────
                 STEP 3: PAYMENT VERIFICATION (Proof of Deposit)
                 ────────────────────────────────────────────────────────── */}
              <div className="w-1/5 shrink-0 px-1 md:px-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-[22px] tracking-wide text-[#D4A373] mb-2 uppercase flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#D4A373]" /> Confirm Your Transaction
                  </h3>
                  <p className="text-[13px] text-[#A89F95] mb-8 leading-relaxed">
                    Please paste the 12-digit UTR / Transaction ID from your banking or UPI app receipt to link your payment to this invoice.
                  </p>

                  <div className="flex flex-col gap-2 mb-8">
                    <label className="text-[11px] uppercase tracking-wider pl-1 text-[#D4A373]">
                      UPI Transaction ID / UTR <span className="text-[#D4A373]">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={transactionId}
                      onChange={(e) => {
                        // Keep only digits for strict UTR numbers
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setTransactionId(val);
                        if (val.length === 12) setUtrError(null);
                      }}
                      placeholder="Enter 12-Digit UPI Transaction ID / UTR"
                      className="w-full rounded-[16px] p-4 text-[14px] outline-none transition-all duration-300"
                      style={{
                        background: "rgba(10, 8, 6, 0.8)",
                        border: utrError ? "1px solid rgb(220, 38, 38)" : "1px solid rgba(212, 163, 115, 0.15)",
                        color: "#A89F95",
                      }}
                      onFocus={(e) => {
                        if (!utrError) e.target.style.borderColor = "rgba(212, 163, 115, 0.5)";
                      }}
                      onBlur={(e) => {
                        if (!utrError) e.target.style.borderColor = "rgba(212, 163, 115, 0.15)";
                      }}
                    />
                    {utrError && (
                      <p className="text-[11px] text-red-500 pl-1 mt-1 font-medium">{utrError}</p>
                    )}
                    
                    <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-[#D4A373] mt-0.5 shrink-0" />
                      <p className="text-[11px] text-[#A89F95]/70 leading-normal">
                        Your transaction UTR is a 12-digit number appearing in your Google Pay, PhonePe, or bank transaction receipt. Example: <code className="text-[#D4A373] font-mono">604928173645</code>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 py-4 border border-white/10 rounded-[16px] text-[12px] tracking-wider text-[#A89F95] hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> BACK
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 py-4 rounded-[16px] text-[12px] tracking-wider font-bold text-[#0E0D0C] transition-all flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #CF9F45 0%, #A67C30 100%)",
                    }}
                  >
                    CONTINUE TO SHIPPING <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ──────────────────────────────────────────────────────────
                 STEP 4: DELIVERY LEDGER (Shipping Details)
                 ────────────────────────────────────────────────────────── */}
              <div className="w-1/5 shrink-0 px-1 md:px-4 flex flex-col justify-between">
                <form onSubmit={handlePlaceOrder} className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-serif text-[22px] tracking-wide text-[#D4A373] mb-2 uppercase flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#D4A373]" /> Shipping &amp; Contact
                    </h3>
                    <p className="text-[13px] text-[#A89F95] mb-6">
                      Provide your dispatch particulars to schedule shipping for your Companion.
                    </p>

                    {error && (
                      <div className="mb-4 p-4 rounded-xl bg-red-950/20 border border-red-900/35 text-[12px] text-red-400 font-medium">
                        {error}
                      </div>
                    )}

                    {/* Stacked Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[11px] uppercase tracking-wider pl-1 text-[#D4A373]">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="First and Last Name"
                          className="w-full rounded-[14px] p-3 text-[13px] outline-none transition-all duration-300"
                          style={{
                            background: "rgba(10, 8, 6, 0.8)",
                            border: "1px solid rgba(212, 163, 115, 0.15)",
                            color: "#A89F95",
                          }}
                          onFocus={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.5)"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.15)"}
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase tracking-wider pl-1 text-[#D4A373]">
                          Contact Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full rounded-[14px] p-3 text-[13px] outline-none transition-all duration-300"
                          style={{
                            background: "rgba(10, 8, 6, 0.8)",
                            border: "1px solid rgba(212, 163, 115, 0.15)",
                            color: "#A89F95",
                          }}
                          onFocus={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.5)"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.15)"}
                        />
                      </div>

                      {/* Email Address */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase tracking-wider pl-1 text-[#D4A373]">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tracking@domain.com"
                          className="w-full rounded-[14px] p-3 text-[13px] outline-none transition-all duration-300"
                          style={{
                            background: "rgba(10, 8, 6, 0.8)",
                            border: "1px solid rgba(212, 163, 115, 0.15)",
                            color: "#A89F95",
                          }}
                          onFocus={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.5)"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.15)"}
                        />
                      </div>

                      {/* Complete Delivery Address (Street) */}
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[11px] uppercase tracking-wider pl-1 text-[#D4A373]">
                          Complete Delivery Address *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder="Apartment, building, street, locality"
                          className="w-full rounded-[14px] p-3 text-[13px] outline-none transition-all duration-300 resize-none"
                          style={{
                            background: "rgba(10, 8, 6, 0.8)",
                            border: "1px solid rgba(212, 163, 115, 0.15)",
                            color: "#A89F95",
                          }}
                          onFocus={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.5)"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.15)"}
                        />
                      </div>

                      {/* City */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase tracking-wider pl-1 text-[#D4A373]">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="w-full rounded-[14px] p-3 text-[13px] outline-none transition-all duration-300"
                          style={{
                            background: "rgba(10, 8, 6, 0.8)",
                            border: "1px solid rgba(212, 163, 115, 0.15)",
                            color: "#A89F95",
                          }}
                          onFocus={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.5)"}
                          onBlur={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.15)"}
                        />
                      </div>

                      {/* State & Pincode Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] uppercase tracking-wider pl-1 text-[#D4A373]">
                            State *
                          </label>
                          <input
                            type="text"
                            required
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            placeholder="State"
                            className="w-full rounded-[14px] p-3 text-[13px] outline-none transition-all duration-300"
                            style={{
                              background: "rgba(10, 8, 6, 0.8)",
                              border: "1px solid rgba(212, 163, 115, 0.15)",
                              color: "#A89F95",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.5)"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.15)"}
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] uppercase tracking-wider pl-1 text-[#D4A373]">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            required
                            pattern="[0-9]{6}"
                            maxLength={6}
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ""))}
                            placeholder="600001"
                            className="w-full rounded-[14px] p-3 text-[13px] outline-none transition-all duration-300"
                            style={{
                              background: "rgba(10, 8, 6, 0.8)",
                              border: "1px solid rgba(212, 163, 115, 0.15)",
                              color: "#A89F95",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.5)"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(212, 163, 115, 0.15)"}
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handlePrevStep}
                      className="flex-1 py-4 border border-white/10 rounded-[16px] text-[12px] tracking-wider text-[#A89F95] hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-4 h-4" /> BACK
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 rounded-[16px] text-[12px] tracking-wider font-bold text-[#0E0D0C] transition-all flex items-center justify-center gap-2 disabled:opacity-85 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, #CF9F45 0%, #A67C30 100%)",
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#0E0D0C]" /> VERIFYING...
                        </>
                      ) : (
                        <>
                          PLACE ORDER &amp; VERIFY <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* ──────────────────────────────────────────────────────────
                 STEP 5: THE THANK YOU NOTE (Success Canvas)
                 ────────────────────────────────────────────────────────── */}
              <div className="w-1/5 shrink-0 px-1 md:px-8 text-center flex flex-col items-center justify-center py-6">
                <div className="relative mb-6">
                  {/* Outer Pulsing Glow */}
                  <div className="absolute inset-0 rounded-full bg-[#D4A373]/10 blur-xl scale-125 animate-pulse" />
                  
                  {/* Decorative Architectural Arch with Checkmark */}
                  <div 
                    className="w-20 h-20 rounded-full border border-[#D4A373]/30 flex items-center justify-center bg-[#0E0D0C]/80 relative z-10 mx-auto"
                    style={{
                      boxShadow: "0 0 25px rgba(212,163,115,0.25)",
                    }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-[#D4A373] animate-bounce" />
                  </div>
                </div>

                <h3 className="font-serif text-[24px] md:text-[28px] tracking-[0.05em] text-[#D4A373] mb-4 uppercase leading-snug">
                  Your Devotion Companion is Reserved
                </h3>

                <p className="text-[14px] text-[#A89F95] leading-relaxed max-w-[500px] mb-8 font-sans">
                  Thank you for shopping with <span className="text-[#D4A373] font-semibold">NAMAS MATE</span>. We have received your transaction ID (<span className="font-mono text-[#D4A373]/80">{transactionId}</span>). Our team is manually verifying your payment, and a confirmation email along with shipping tracking details will be dispatched to your inbox shortly.
                </p>

                <Link
                  href="/"
                  className="py-4 px-10 rounded-full text-[12px] tracking-[0.2em] font-bold transition-all duration-300 inline-block uppercase text-[#D4A373] border border-[#D4A373]/20 bg-white/[0.02] hover:bg-[#D4A373] hover:text-[#0E0D0C] hover:border-transparent"
                  style={{
                    boxShadow: "0 4px 15px rgba(212,163,115,0.05)",
                  }}
                >
                  RETURN TO HOME
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Dynamic Footer Trust Badge */}
        {currentStep < 4 && (
          <div className="mt-8 flex items-center gap-2 text-white/40">
            <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
            <span className="text-[11px] tracking-wide uppercase text-[#A89F95]/60">
              Guaranteed 256-bit encryption. Handcrafted with reverence in India.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
