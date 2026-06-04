"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-primary/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden transition-transform duration-300 group-hover:rotate-12 border border-primary/20 shadow-sm">
                <Image src="/logo.png" alt="Sujood Mate Logo" fill className="object-cover" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wide text-primary transition-colors group-hover:text-primary-light">
                Sujood <span className="text-gold">Mate</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-primary hover:text-gold font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-primary hover:text-gold font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-to-order"
              className="text-primary hover:text-gold font-medium transition-colors"
            >
              How to Order
            </Link>
            <Link
              href="/#product-section"
              className="gold-gradient hover:bg-gold-dark text-white px-5 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm"
            >
              Order Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary hover:text-gold focus:outline-none p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navbar Menu */}
      {isOpen && (
        <div className="md:hidden glass border-b border-primary/10 transition-all duration-300">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 text-center">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-gold hover:bg-cream-dark transition-all"
            >
              Home
            </Link>
            <Link
              href="#features"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-gold hover:bg-cream-dark transition-all"
            >
              Features
            </Link>
            <Link
              href="#how-to-order"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-gold hover:bg-cream-dark transition-all"
            >
              How to Order
            </Link>
            <div className="pt-2 px-4">
              <Link
                href="/#product-section"
                onClick={() => setIsOpen(false)}
                className="block text-center gold-gradient text-white px-5 py-3 rounded-full font-semibold shadow-md transition-all text-sm"
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
