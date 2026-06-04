"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [settings, setSettings] = useState({
    contactEmail: "support@namasmate.com",
    contactPhone: "+91 98765 43210",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings({
            contactEmail: data.contactEmail || "support@namasmate.com",
            contactPhone: data.contactPhone || "+91 98765 43210",
          });
        }
      })
      .catch((err) => console.error("Error loading settings in footer:", err));
  }, []);

  return (
    <footer className="bg-primary-dark text-cream/80 pt-16 pb-8 border-t-2 border-gold/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="p-2 bg-primary text-gold rounded-full">
                <Moon className="w-5 h-5 fill-gold stroke-gold" />
              </span>
              <span className="font-serif text-2xl font-bold tracking-wide text-cream">
                Namas <span className="text-gold">Mate</span>
              </span>
            </div>
            <p className="text-[#B3D1C2] text-sm leading-relaxed">
              Namas Mate is dedicated to crafting premium prayer mats that merge
              unparalleled joint support with historic Islamic geometric art,
              enriching your daily spiritual connection.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:pl-12">
            <h3 className="font-serif text-lg font-bold text-gold mb-4 tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm text-[#CDE0D7]">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-gold transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-to-order" className="hover:text-gold transition-colors">
                  How to Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-lg font-bold text-gold mb-4 tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm text-[#CDE0D7]">
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{settings.contactPhone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="hover:underline hover:text-gold transition-all"
                >
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>
                  123 Elegant Minaret Way,<br />
                  Suite 786, Crescent District,<br />
                  Karnataka, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gold/20 pt-8 flex flex-col md:flex-row justify-between items-center text-[#9ABFA9] text-sm">
          <p>
            &copy; {new Date().getFullYear()} Namas Mate. All rights reserved.
            Crafted for Comfort, Designed for Devotion.
          </p>
        </div>
      </div>
    </footer>
  );
}
