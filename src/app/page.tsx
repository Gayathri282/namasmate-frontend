import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, QrCode, ShoppingCart, Mail, ShieldCheck, Moon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const revalidate = 0; // Disable static rendering cache to get fresh DB changes

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

async function getActiveProducts() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products?activeOnly=true`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    return await res.json();
  } catch (error) {
    console.error("Error loading products on homepage:", error);
    return [];
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/settings`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

export default async function HomePage() {
  const products = await getActiveProducts();
  const settings = await getSettings();

  return (
    <div className="bg-islamic-pattern min-h-screen flex flex-col">
      <Navbar />

      {/* Interactive Full-Screen Hero Banner */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image / Video from Settings */}
        {settings?.heroBannerUrl ? (
          settings.heroBannerType === "video" ? (
            <video
              src={settings.heroBannerUrl}
              className="object-cover object-center absolute inset-0 z-0 w-full h-full"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image
              src={settings.heroBannerUrl}
              alt="Namas Mate Premium Prayer Mat"
              fill
              className="object-cover object-center absolute inset-0 z-0"
              priority
            />
          )
        ) : (
          <div className="absolute inset-0 bg-primary z-0 flex items-center justify-center">
          </div>
        )}

        {/* Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary/60 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-black/30 z-10"></div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center h-full space-y-8 mt-16">
          <div className="inline-flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-gold/30 text-cream px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-xl">
            <Sparkles className="w-4 h-4 text-gold fill-gold" />
            <span>Premium Islamic Devotional Craft</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 tracking-wide drop-shadow-md">
            Elevate Your <span className="gold-text-gradient">Sujood</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light drop-shadow">
            Experience spiritual comfort and alignment with our premium memory-foam prayer mats. Artfully crafted for modern Muslims.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5 pt-4">
            <Link
              href="#product-section"
              className="green-gradient hover:opacity-90 text-white font-semibold px-10 py-4 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-center flex items-center justify-center space-x-2 text-lg border border-white/20"
            >
              <span>Order Now</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="#features"
              className="bg-black/40 backdrop-blur-md border-2 border-gold/50 text-gold hover:bg-black/60 font-bold px-10 py-4 rounded-full shadow-lg transform hover:-translate-y-1 transition-all text-center text-lg"
            >
              Explore Features
            </Link>
          </div>
        </div>
        
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-primary text-white relative border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-gold">
              Designed For Perfect Focus
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto"></div>
            <p className="text-[#D1C9BA] font-serif text-lg">
              Combining ancient aesthetic elegance with cutting-edge orthopedic support,
              helping you achieve peaceful and extended prostrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#023122] border border-gold/20 p-8 rounded-2xl space-y-4 shadow-md hover:shadow-xl hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gold">Premium Quality Material</h3>
              <p className="text-[#B5AFA1] text-sm leading-relaxed">
                Handcrafted from luxury Turkish velvet, featuring intricate gold-threaded
                motifs. Machine stitched with reinforced borders to prevent fraying and ensure durability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#023122] border border-gold/20 p-8 rounded-2xl space-y-4 shadow-md hover:shadow-xl hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gold">Orthopedic Foam Core</h3>
              <p className="text-[#B5AFA1] text-sm leading-relaxed">
                Dual-layered high-density memory foam distributes weight evenly. Relieves pressure on
                sensitive joints, including knees, shins, ankles, and wrists during Ruku and Sujood.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#023122] border border-gold/20 p-8 rounded-2xl space-y-4 shadow-md hover:shadow-xl hover:border-gold/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gold">Anti-Slip Bottom Lining</h3>
              <p className="text-[#B5AFA1] text-sm leading-relaxed">
                Specially coated micro-grip underlay ensures the mat stays perfectly anchored to carpet,
                hardwood, or tile floors, allowing complete focus without constant adjustments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid / Gallery Section */}
      <section id="product-section" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-gold">
              Our Signature Collections
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto"></div>
            <p className="text-[#B5AFA1] font-serif text-lg">
              Select the variant and size that matches your personal sanctuary.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 text-primary-light">
              <p className="text-xl font-medium mt-4">Coming Soon</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${products.length === 1 ? 'max-w-md mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
              {products.map((prod: any) => (
                <div
                  key={prod.id || prod._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 hover:border-gold/30 transition-all duration-300 group flex flex-col"
                >
                  {/* Image container */}
                  <div className="relative aspect-[4/3] w-full bg-cream-dark overflow-hidden">
                    {prod.images && prod.images.length > 0 ? (
                      <Image
                        src={prod.images[0]}
                        alt={prod.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-light">
                        No Image Available
                      </div>
                    )}
                    {prod.salePrice && prod.salePrice > 0 ? (
                      <div className="absolute top-4 right-4 flex flex-col items-end space-y-1">
                        <div className="bg-red-600 text-white font-sans text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                          {Math.round(((prod.price - prod.salePrice) / prod.price) * 100)}% OFF
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-cream mb-1 line-clamp-1">
                        {prod.name}
                      </h3>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        {prod.salePrice && prod.salePrice > 0 ? (
                          <>
                            <span className="font-sans font-bold text-xl text-gold">₹{prod.salePrice}</span>
                            <span className="font-sans font-medium text-sm text-[#B5AFA1] line-through">₹{prod.price}</span>
                          </>
                        ) : (
                          <span className="font-sans font-bold text-xl text-gold">₹{prod.price}</span>
                        )}
                      </div>

                      <p className="text-[#999999] text-sm leading-relaxed line-clamp-3">
                        {prod.description}
                      </p>
                      {prod.variants && prod.variants.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {prod.variants.map((v: string) => (
                            <span
                              key={v}
                              className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/product/${prod.id || prod._id}`}
                      className="w-full mt-6 text-center green-gradient hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4 text-gold" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How to Order Section */}
      <section id="how-to-order" className="py-20 bg-cream-dark relative border-t border-b border-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-gold">
              Simple 3-Step Ordering
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto"></div>
            <p className="text-[#B5AFA1] font-serif text-lg">
              We process all orders securely and confirm manually via payment verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-gold border-2 border-gold flex items-center justify-center font-serif text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-cream">Choose Your Variant</h3>
              <p className="text-[#999999] text-sm max-w-xs leading-relaxed">
                Click on the mat of your choice, read its custom dimensions and features, and select your preferred color or style.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-gold border-2 border-gold flex items-center justify-center font-serif text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-cream">Scan QR to Pay</h3>
              <p className="text-[#999999] text-sm max-w-xs leading-relaxed">
                Proceed to the order form, scan our secure static UPI QR code on your phone, and make the payment via any UPI app (GPay, PhonePe, Paytm).
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-gold border-2 border-gold flex items-center justify-center font-serif text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-cream">Enter Transaction ID</h3>
              <p className="text-[#999999] text-sm max-w-xs leading-relaxed">
                Fill in your delivery address, type in the UTR / Transaction ID from your banking app, and submit. We will verify and ship your order!
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
