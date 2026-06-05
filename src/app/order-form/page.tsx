"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, QrCode, Clipboard, ShoppingCart, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// We create a wrapper because Next.js 14 requires useSearchParams to be wrapped in a Suspense boundary for client-side rendering
function OrderFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const selectedVariant = searchParams.get("variant") || "";

  // Data states
  const [product, setProduct] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    transactionId: "",
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Fetch product and settings
  useEffect(() => {
    if (!productId) {
      setErrorMsg("No product selected. Please return to the homepage.");
      setLoadingData(false);
      return;
    }

    Promise.all([
      fetch(`/api/settings`).then((res) => res.json()),
      fetch(`/api/products`).then((res) => res.json()),
    ])
      .then(([settingsData, productsData]) => {
        setSettings(settingsData);
        const selectedProd = productsData.find((p: any) => p._id === productId || p.id === productId);
        if (selectedProd) {
          setProduct(selectedProd);
        } else {
          setErrorMsg("Selected product could not be found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching checkout details:", err);
        setErrorMsg("Failed to load checkout details. Please refresh the page.");
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMsg("");
  };

  const handleCopyUpi = () => {
    if (settings?.upiId) {
      navigator.clipboard.writeText(settings.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setErrorMsg("");

    // Validate fields
    if (
      !formData.customerName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim() ||
      !formData.transactionId.trim()
    ) {
      setErrorMsg("Please fill in all the shipping and payment details.");
      setLoadingSubmit(false);
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          productId: product._id,
          amount: product.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
        <p className="text-primary-light font-serif text-lg">Preparing secure checkout...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-cream border border-gold/15 rounded-3xl p-8 text-center space-y-6 shadow-xl my-12">
        <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto border border-gold/20 shadow-inner">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-primary-dark">Order Submitted Successfully!</h1>
        <p className="text-primary-dark/80 max-w-md mx-auto leading-relaxed">
          Assalamu Alaikum! Your order has been registered and is currently under review.
          We will verify your payment of <strong>₹{product.price}</strong> using Transaction ID <strong>{formData.transactionId}</strong>
          and send you a confirmation email at <strong>{formData.email}</strong> once verified.
        </p>
        <div className="border-t border-primary-dark/10 pt-6 font-serif text-gold font-semibold italic">
          JazakAllah Khair for shopping with Sujood Mate!
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href={product ? `/product/${product._id}` : "/"}
          className="inline-flex items-center space-x-2 text-primary-light hover:text-gold font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to product details</span>
        </Link>
      </div>

      {errorMsg && !product && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start space-x-3 max-w-xl mx-auto">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {product && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form details */}
          <div className="lg:col-span-7 bg-cream border border-gold/15 rounded-3xl p-6 sm:p-8 shadow-md">
            <h2 className="font-serif text-2xl font-bold text-primary-dark mb-6">
              Shipping & Delivery Details
            </h2>

            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start space-x-3 mb-6">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerName" className="block text-xs font-bold text-primary-dark/80 uppercase mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gold/20 focus:outline-none focus:border-gold text-primary-dark font-medium placeholder:text-primary-dark/30 bg-white/50 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-primary-dark/80 uppercase mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-3 rounded-xl border border-gold/20 focus:outline-none focus:border-gold text-primary-dark font-medium placeholder:text-primary-dark/30 bg-white/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-primary-dark/80 uppercase mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gold/20 focus:outline-none focus:border-gold text-primary-dark font-medium placeholder:text-primary-dark/30 bg-white/50 text-sm"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-bold text-primary-dark/80 uppercase mb-1.5">
                  Shipping Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Apartment, Street address, landmarks..."
                  className="w-full px-4 py-3 rounded-xl border border-gold/20 focus:outline-none focus:border-gold text-primary-dark font-medium placeholder:text-primary-dark/30 bg-white/50 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-xs font-bold text-primary-dark/80 uppercase mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Bangalore"
                    className="w-full px-4 py-3 rounded-xl border border-gold/20 focus:outline-none focus:border-gold text-primary-dark font-medium placeholder:text-primary-dark/30 bg-white/50 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-xs font-bold text-primary-dark/80 uppercase mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Karnataka"
                    className="w-full px-4 py-3 rounded-xl border border-gold/20 focus:outline-none focus:border-gold text-primary-dark font-medium placeholder:text-primary-dark/30 bg-white/50 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-xs font-bold text-primary-dark/80 uppercase mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g. 560001"
                    className="w-full px-4 py-3 rounded-xl border border-gold/20 focus:outline-none focus:border-gold text-primary-dark font-medium placeholder:text-primary-dark/30 bg-white/50 text-sm"
                  />
                </div>
              </div>

              <div className="border-t border-primary-dark/10 pt-6 space-y-4">
                <h3 className="font-serif text-xl font-bold text-primary-dark">
                  Payment Verification
                </h3>
                <p className="text-xs text-primary-dark/80 leading-relaxed">
                  Please scan the QR code on the right with any UPI app and proceed to pay <strong>₹{product.price}</strong>. After payment, enter your UTR / Transaction ID below to verify and submit your order.
                </p>
                <div>
                  <label htmlFor="transactionId" className="block text-xs font-bold text-primary-dark/80 uppercase mb-1.5">
                    UTR / Transaction ID
                  </label>
                  <input
                    type="text"
                    id="transactionId"
                    name="transactionId"
                    required
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="Enter 12-digit UTR or Transaction ID"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gold focus:outline-none focus:border-gold/80 text-primary-dark font-medium placeholder:text-primary-dark/30 bg-white/60 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingSubmit}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {loadingSubmit ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Submit & Place Order</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Checkout Summary & QR Code */}
          <div className="lg:col-span-5 space-y-6">
            {/* Order Summary Box */}
            <div className="bg-cream border border-gold/15 rounded-3xl p-6 shadow-md space-y-4">
              <h3 className="font-serif text-lg font-bold text-primary-dark pb-2 border-b border-gold/10 flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-gold" />
                <span>Order Summary</span>
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream-dark flex-shrink-0 border border-gold/15">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs">No image</div>
                  )}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-primary-dark text-sm leading-snug">
                    {product.name}
                  </h4>
                  {selectedVariant && (
                    <span className="text-[10px] text-primary-dark/80 bg-white/50 px-2.5 py-0.5 rounded-full border border-gold/15 font-semibold">
                      Color/Style: {selectedVariant}
                    </span>
                  )}
                </div>
              </div>
              <div className="border-t border-gold/15 pt-4 flex justify-between items-center text-primary-dark font-bold">
                <span>Total Amount:</span>
                <span className="text-xl text-primary">₹{product.price}</span>
              </div>
            </div>

            {/* UPI QR Code Section */}
            {/* COMMENT: REPLACE THIS WITH ACTUAL QR CODE IMAGE OR UPDATE VIA ADMIN PANEL */}
            <div className="bg-primary text-cream rounded-3xl p-6 text-center space-y-4 border border-gold/20 shadow-md">
              <div className="inline-flex items-center space-x-2 bg-gold/10 text-gold px-3.5 py-1 rounded-full text-xs font-semibold">
                <QrCode className="w-4 h-4" />
                <span>Scan & Pay via UPI</span>
              </div>
              <p className="text-xs text-cream/70 leading-relaxed max-w-xs mx-auto">
                Scan using Google Pay, PhonePe, Paytm, BHIM, or any banking application.
              </p>

              {/* QR Image Container */}
              <div className="relative w-48 h-48 mx-auto bg-white p-2 rounded-2xl shadow-inner flex items-center justify-center overflow-hidden">
                {settings?.upiQrCode ? (
                  <Image
                    src={settings.upiQrCode}
                    alt="UPI QR Code for Payment"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="text-[#111] font-bold text-xs p-4">
                    QR Code Loading...
                  </div>
                )}
              </div>

              {/* UPI ID block */}
              {settings?.upiId && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
                    UPI Address
                  </span>
                  <div className="inline-flex items-center bg-primary-dark text-cream border border-gold/20 px-3 py-1.5 rounded-xl text-xs space-x-2 shadow-inner">
                    <span className="font-mono font-medium">{settings.upiId}</span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="text-gold hover:text-gold-light transition-colors p-1"
                      title="Copy UPI ID"
                    >
                      {copiedUpi ? (
                        <span className="text-[10px] text-green-400 font-bold">Copied!</span>
                      ) : (
                        <Clipboard className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderFormPage() {
  return (
    <div className="bg-islamic-pattern min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-gold animate-spin" />
            <p className="text-primary-light font-serif text-lg font-semibold">Loading checkout details...</p>
          </div>
        }>
          <OrderFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
