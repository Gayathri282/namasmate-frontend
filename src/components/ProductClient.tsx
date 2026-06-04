"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingBag, ArrowLeft, Play, Info } from "lucide-react";

interface ProductClientProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    images: string[];
    videos: string[];
    variants: string[];
  };
}

export default function ProductClient({ product }: ProductClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : ""
  );

  return (
    <div className="space-y-8">
      {/* Back link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-primary hover:text-gold font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to products</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Images Carousel & Video */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Active Image */}
          <div className="relative aspect-[4/3] w-full bg-white border border-primary/10 rounded-3xl overflow-hidden shadow-md">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[activeImageIndex]}
                alt={`${product.name} - View ${activeImageIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary-light">
                No Images Available
              </div>
            )}
          </div>

          {/* Thumbnail list */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIndex === idx ? "border-gold scale-95 shadow-sm" : "border-primary/10 hover:border-gold/50"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Video Section */}
          {product.videos && product.videos.length > 0 && (
            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 space-y-6">
              <h3 className="font-serif text-xl font-bold text-primary flex items-center space-x-2">
                <Play className="w-5 h-5 text-gold fill-gold" />
                <span>Product Showcase Videos</span>
              </h3>
              <div className="space-y-4">
                {product.videos.map((vid, vIdx) => (
                  <div key={vid} className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-primary/10">
                    <video
                      src={vid}
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Title, Details, Variants, Checkout */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
              {product.name}
            </h1>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                {product.salePrice && product.salePrice > 0 ? (
                  <>
                    <span className="text-4xl font-extrabold text-primary">
                      ₹{product.salePrice}
                    </span>
                    <span className="text-xl font-medium text-primary-light/60 line-through">
                      ₹{product.price}
                    </span>
                    <span className="bg-red-600 text-white font-sans text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                      {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-extrabold text-primary">
                    ₹{product.price}
                  </span>
                )}
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full w-max mt-2">
                Free Delivery Included
              </span>
            </div>
          </div>

          <div className="border-t border-b border-primary/10 py-6 space-y-4">
            <h3 className="font-bold text-primary text-sm uppercase tracking-wider">
              Product Description
            </h3>
            <p className="text-primary-light/90 text-base leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-primary text-sm uppercase tracking-wider">
                Select Color / Pattern Variant
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      selectedVariant === v
                        ? "border-gold bg-primary text-gold shadow-md"
                        : "border-primary/10 bg-white text-primary hover:border-gold/50"
                    }`}
                  >
                    <span>{v}</span>
                    {selectedVariant === v && (
                      <Check className="w-4 h-4 text-gold stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Purchase CTA */}
          <div className="space-y-4 pt-4">
            <Link
              href={`/order-form?productId=${product.id}${
                selectedVariant ? `&variant=${encodeURIComponent(selectedVariant)}` : ""
              }`}
              className="w-full text-center green-gradient hover:opacity-90 text-white font-bold py-4 px-8 rounded-2xl shadow-lg flex items-center justify-center space-x-3 transform hover:-translate-y-0.5 transition-all border border-gold/50"
            >
              <ShoppingBag className="w-5 h-5 text-gold" />
              <span>Buy Now (UPI Payment)</span>
            </Link>
            
            <div className="flex items-center justify-center space-x-2 text-xs text-primary-light/70 bg-cream-dark p-3 rounded-xl border border-primary/5">
              <Info className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Orders are secured manually. Pay using UPI and submit Transaction ID.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
