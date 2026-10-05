'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Shield,
  ArrowRight,
  Globe,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#070d1e] text-slate-300 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c59b27] to-[#917118] flex items-center justify-center text-white font-serif font-bold text-lg shadow-md">
                EV
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Estate<span className="text-[#c59b27]">Vista</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              India&apos;s premier platform for exceptional residential estates, architectural villas, and skyline penthouses. Built with uncompromising trust and verified luxury portfolio standards.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#c59b27] hover:text-white flex items-center justify-center text-slate-400 transition text-xs font-bold"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#c59b27] hover:text-white flex items-center justify-center text-slate-400 transition text-xs font-bold"
                aria-label="LinkedIn"
              >
                IN
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#c59b27] hover:text-white flex items-center justify-center text-slate-400 transition text-xs font-bold"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#c59b27] hover:text-white flex items-center justify-center text-slate-400 transition text-xs font-bold"
                aria-label="Twitter"
              >
                X
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider font-sans">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?listingType=Sale" className="hover:text-[#c59b27] transition">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link href="/properties?listingType=Rent" className="hover:text-[#c59b27] transition">
                  Luxury Rentals
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Villa" className="hover:text-[#c59b27] transition">
                  Signature Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Penthouse" className="hover:text-[#c59b27] transition">
                  Skyline Penthouses
                </Link>
              </li>
              <li>
                <Link href="/properties?type=Plot" className="hover:text-[#c59b27] transition">
                  Gated Plots
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Prime Cities */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider font-sans">Cities</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/locations/hyderabad" className="hover:text-[#c59b27] transition">
                  Hyderabad Estates
                </Link>
              </li>
              <li>
                <Link href="/locations/bangalore" className="hover:text-[#c59b27] transition">
                  Bangalore Residences
                </Link>
              </li>
              <li>
                <Link href="/locations/mumbai" className="hover:text-[#c59b27] transition">
                  Mumbai Trophy Homes
                </Link>
              </li>
              <li>
                <Link href="/locations/pune" className="hover:text-[#c59b27] transition">
                  Pune Villas
                </Link>
              </li>
              <li>
                <Link href="/locations/chennai" className="hover:text-[#c59b27] transition">
                  Chennai Coastal Living
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Headquarters */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider font-sans">Headquarters</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c59b27] shrink-0 mt-0.5" />
                <span>123 Business Park, Financial District, Gachibowli, Hyderabad, Telangana 500032</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c59b27] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c59b27] shrink-0" />
                <a href="mailto:hello@estatevista.com" className="hover:text-white transition">
                  hello@estatevista.com
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-medium">100% RERA Registered &amp; Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with RERA and Copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} EstateVista Luxury Real Estate Pvt. Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/about" className="hover:text-slate-400 transition">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition">
              Contact Support
            </Link>
            <span className="text-slate-600">Privacy Policy</span>
            <span className="text-slate-600">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
