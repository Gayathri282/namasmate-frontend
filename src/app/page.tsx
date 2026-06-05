import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice: number;
  isActive: boolean;
}

async function getProduct(): Promise<Product | null> {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL || "http://127.0.0.1:5000"}/api/products`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data: Product[] = await res.json();
    return data.find((p) => p.isActive) ?? data[0] ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const product = await getProduct();

  // Determine displayed price: use salePrice when > 0
  const displayPrice = product
    ? product.salePrice > 0
      ? product.salePrice
      : product.price
    : null;
  const originalPrice =
    product && product.salePrice > 0 ? product.price : null;

  const formatPrice = (n: number) =>
    "₹" + n.toLocaleString("en-IN") + ".00";

  return (
    <div className="w-full flex flex-col items-center pb-20">
      
      {/* Background Glow */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212,163,115,0.10) 0%, transparent 80%)"
        }}
      />
      
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 flex flex-col items-center gap-24">
        
        {/* 1. HERO SECTION */}
        <section className="w-full flex flex-col lg:flex-row justify-center gap-6 lg:h-[600px]">
          
          {/* LEFT PANEL */}
          <div 
            className="relative w-full lg:w-1/2 h-[500px] lg:h-full flex-shrink-0"
            style={{
              background: "rgba(20, 18, 16, 0.65)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(212, 163, 115, 0.15)",
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div className="absolute inset-0 w-full h-full rounded-[24px] overflow-hidden">
              <Image 
                src="/man-kneeling.jpg" 
                alt="Man praying on Namas Mate stool" 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div 
            className="relative w-full lg:w-1/2 h-full flex flex-col"
            style={{
              background: "rgba(20, 18, 16, 0.65)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(212, 163, 115, 0.15)",
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div 
              className="w-full h-[240px] lg:h-[300px] rounded-t-[24px] overflow-hidden relative"
              style={{ background: "rgba(255, 255, 255, 0.95)" }}
            >
              <Image 
                src="/stool-isolated.jpg" 
                alt="The SujoodMate Ergonomic Prayer Stool" 
                fill 
                className="object-contain p-6"
                priority
              />
            </div>

            <div className="p-8 lg:p-10 flex flex-col flex-grow justify-between gap-6">
              <div>
                <h2 
                  className="font-serif text-[28px] lg:text-[32px] leading-[1.2] mb-3"
                  style={{ color: "#D4A373", fontFamily: "Cormorant Garamond, serif" }}
                >
                  The SujoodMate Ergonomic Prayer Stool
                </h2>
                
                {/* Dynamic Price */}
                <div className="flex items-baseline gap-3 flex-wrap">
                  {displayPrice !== null ? (
                    <>
                      <span
                        className="text-[26px] font-medium tracking-wide"
                        style={{ color: "#D4A373" }}
                      >
                        {formatPrice(displayPrice)}
                      </span>
                      {originalPrice !== null && (
                        <span
                          className="text-[18px] line-through opacity-50"
                          style={{ color: "#A89F95" }}
                        >
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </>
                  ) : (
                    <span
                      className="text-[26px] font-medium tracking-wide"
                      style={{ color: "#D4A373" }}
                    >
                      ₹1,499.00
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Action Row (50/50 split) */}
              <div className="flex gap-4 w-full mt-auto">
                <Link 
                  href="/cart"
                  className="w-1/2 py-4 rounded-[16px] text-[12px] tracking-[0.2em] font-semibold text-center transition-transform hover:scale-95 flex items-center justify-center"
                  style={{
                    background: "linear-gradient(145deg, #4A3B2C 0%, #2A1F15 100%)",
                    border: "1px solid rgba(212, 163, 115, 0.4)",
                    color: "#D4A373",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
                  }}
                >
                  ORDER NOW
                </Link>
                <Link 
                  href="/product-details"
                  className="w-1/2 py-4 rounded-[16px] text-[12px] tracking-[0.2em] font-semibold text-center transition-colors hover:bg-[rgba(212,163,115,0.05)] flex items-center justify-center"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(212, 163, 115, 0.3)",
                    color: "#D4A373",
                  }}
                >
                  DETAILS
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. VALUE PROPOSITION SECTION */}
        <section className="w-full">
          <h3 
            className="font-serif text-[24px] tracking-[0.1em] text-center mb-10 uppercase"
            style={{ color: "#D4A373", fontFamily: "Cormorant Garamond, serif" }}
          >
            Uncompromising Engineering
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {[
              {
                title: "Designed For Perfect Focus",
                desc: "Combining ancient aesthetic elegance with cutting-edge orthopedic support, helping you achieve peaceful and extended prostrations."
              },
              {
                title: "Premium Quality Material",
                desc: "Handcrafted from luxury Turkish velvet, featuring intricate gold-threaded motifs. Machine stitched with reinforced borders to prevent fraying and ensure durability."
              },
              {
                title: "Orthopedic Foam Core",
                desc: "Dual-layered high-density memory foam distributes weight evenly. Relieves pressure on sensitive joints, including knees, shins, ankles, and wrists during Ruku and Sujood."
              },
              {
                title: "Anti-Slip Bottom Lining",
                desc: "Specially coated micro-grip underlay ensures the mat stays perfectly anchored to carpet, hardwood, or tile floors, allowing complete focus without constant adjustment."
              }
            ].map((prop, idx) => (
              <div 
                key={idx}
                className="p-8"
                style={{
                  background: "rgba(20, 18, 16, 0.65)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(212, 163, 115, 0.15)",
                  borderRadius: "24px",
                }}
              >
                <h4 className="font-serif text-[20px] mb-3" style={{ color: "#D4A373" }}>{prop.title}</h4>
                <p className="text-[14px] leading-[1.6]" style={{ color: "#A89F95" }}>{prop.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SIMPLE 3-STEP ORDERING SYSTEM */}
        <section className="w-full">
          <div className="text-center mb-10">
            <h3 
              className="font-serif text-[24px] tracking-[0.1em] uppercase mb-2"
              style={{ color: "#D4A373", fontFamily: "Cormorant Garamond, serif" }}
            >
              Simple 3-Step Ordering
            </h3>
            <p className="text-[14px]" style={{ color: "#A89F95" }}>
              We process all orders securely and confirm manually via payment verification.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              {
                step: "1. Choose Your Variant",
                desc: "Click on the mat of your choice, read its custom dimensions and features, and select your preferred color or style."
              },
              {
                step: "2. Scan QR to Pay",
                desc: "Proceed to the order form, scan our secure static UPI QR code on your phone, and make the payment via any UPI app (GPay, PhonePe, Paytm)."
              },
              {
                step: "3. Enter Transaction ID",
                desc: "Fill in your delivery address, type in the UTR / Transaction ID from your banking app."
              }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="p-8 flex flex-col"
                style={{
                  background: "rgba(20, 18, 16, 0.65)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(212, 163, 115, 0.15)",
                  borderRadius: "24px",
                }}
              >
                <h4 className="font-serif text-[18px] mb-4" style={{ color: "#D4A373" }}>{step.step}</h4>
                <p className="text-[13px] leading-[1.6]" style={{ color: "#A89F95" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
