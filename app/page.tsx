'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSearch } from '@/components/hero/HeroSearch';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Property } from '@/types/property';
import { LocationCity } from '@/types/location';
import { fetchAllProperties } from '@/lib/firebase/firestore';
import { SEED_LOCATIONS } from '@/data/seed/locations';
import { SectionHeading } from '@/components/ui/Typography';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Users,
  Building,
  Globe2,
  Calendar,
  CheckCircle,
  Quote,
} from 'lucide-react';

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [locations, setLocations] = useState<LocationCity[]>(SEED_LOCATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const props = await fetchAllProperties();
        setFeaturedProperties(props.filter((p) => p.featured).slice(0, 6));
      } catch (err) {
        console.error('Failed to load home properties:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* 1. Hero Section with Live Search */}
      <HeroSearch />

      {/* 2. Featured Properties Section ("Handpicked for You") */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#c59b27] font-semibold text-xs uppercase tracking-widest mb-1.5 font-sans">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FEATURED PROPERTIES</span>
            </div>
            <SectionHeading>
              Handpicked for You
            </SectionHeading>
            <p className="text-slate-600 text-sm mt-1 font-sans">
              Discover our most exclusive and premium verified residential listings.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b132b] hover:text-[#c59b27] transition font-sans"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Trust Statistics Banner ("Why Choose EstateVista") */}
      <section className="bg-[#0b132b] text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block mb-2 font-sans">
              WHY CHOOSE ESTATEVISTA
            </span>
            <SectionHeading dark className="text-white">
              Your Trusted Real Estate Partner
            </SectionHeading>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-sans">
            <div className="space-y-2 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="w-12 h-12 mx-auto bg-[#c59b27]/20 text-[#c59b27] rounded-full flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-white font-sans">10,000+</p>
              <p className="text-xs text-slate-400 font-medium">Happy Clients Served</p>
            </div>

            <div className="space-y-2 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="w-12 h-12 mx-auto bg-[#c59b27]/20 text-[#c59b27] rounded-full flex items-center justify-center mb-3">
                <Building className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-white font-sans">500+</p>
              <p className="text-xs text-slate-400 font-medium">Curated Properties Listed</p>
            </div>

            <div className="space-y-2 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="w-12 h-12 mx-auto bg-[#c59b27]/20 text-[#c59b27] rounded-full flex items-center justify-center mb-3">
                <Globe2 className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-white font-sans">10+</p>
              <p className="text-xs text-slate-400 font-medium">Metropolitan Hubs</p>
            </div>

            <div className="space-y-2 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="w-12 h-12 mx-auto bg-[#c59b27]/20 text-[#c59b27] rounded-full flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-white font-sans">15+</p>
              <p className="text-xs text-slate-400 font-medium">Years of Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Explore Prime Locations */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#c59b27] font-semibold text-xs uppercase tracking-widest mb-1.5 font-sans">
              <Globe2 className="w-3.5 h-3.5" />
              <span>PRIME DESTINATIONS</span>
            </div>
            <SectionHeading>
              Explore Locations
            </SectionHeading>
            <p className="text-slate-600 text-sm mt-1 font-sans">
              Find luxury properties in India&apos;s fastest growing high-yield metro corridors.
            </p>
          </div>

          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b132b] hover:text-[#c59b27] transition font-sans"
          >
            <span>All Locations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.slice(0, 3).map((loc) => (
            <Link
              key={loc.id}
              href={`/locations/${loc.slug}`}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <Image
                src={loc.imageUrl}
                alt={loc.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b]/90 via-[#0b132b]/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 font-sans">
                  {loc.state}
                </span>
                <h3 className="text-2xl font-serif font-normal text-white group-hover:text-amber-300 transition">
                  {loc.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 font-sans">{loc.tagline}</p>
                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-amber-200 font-sans">
                  <span>{loc.propertyCount}+ Properties Available</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Brand Story & Vision ("About EstateVista") */}
      <section className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Modern Architecture"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white max-w-xs font-sans">
                <p className="font-bold text-slate-900 text-sm">RERA-Registered &amp; Verified</p>
                <p className="text-xs text-slate-600 mt-0.5 font-normal">Every property passes rigorous legal and physical audits.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-[#c59b27] font-semibold text-xs uppercase tracking-widest font-sans">
                <Award className="w-4 h-4" />
                <span>EXCELLENCE IN REAL ESTATE</span>
              </div>
              <SectionHeading className="leading-tight">
                Building Better Lives Through Exceptional Real Estate
              </SectionHeading>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-sans font-normal">
                At EstateVista, we believe that a home is more than just a place — it&apos;s the foundation for your family&apos;s brightest tomorrow. We provide curated access to India&apos;s finest architectural residences with transparent advisory.
              </p>

              <div className="space-y-3 pt-2 font-sans">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#c59b27] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Zero-Brokerage Ambiguity</h4>
                    <p className="text-xs text-slate-600 font-normal">Transparent pricing and direct developer or verified owner connections.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#c59b27] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Dedicated Portfolio Managers</h4>
                    <p className="text-xs text-slate-600 font-normal">Personalized on-ground site visits, legal checks, and home loan assistance.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0b132b] text-white rounded-lg font-semibold text-sm hover:bg-[#1c2541] transition shadow-md font-sans"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block mb-2 font-sans">
            CLIENT EXPERIENCES
          </span>
          <SectionHeading>
            What Our Homeowners Say
          </SectionHeading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <Quote className="w-8 h-8 text-[#c59b27]/30" />
              <p className="text-slate-600 text-sm leading-relaxed italic font-normal">
                &quot;EstateVista made finding our dream villa in Gachibowli an absolute joy. The scheduled visit was seamless, and the legal documentation was thoroughly vetted.&quot;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Client"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Sunita Krishnamurthy</h4>
                <p className="text-xs text-slate-500 font-normal">Villa Owner, Hyderabad</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <Quote className="w-8 h-8 text-[#c59b27]/30" />
              <p className="text-slate-600 text-sm leading-relaxed italic font-normal">
                &quot;The interactive map and instant WhatsApp booking feature saved us weeks of research. The property was exactly as shown in the high-definition photos.&quot;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  alt="Client"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Arjun Singhania</h4>
                <p className="text-xs text-slate-500 font-normal">Penthouse Buyer, Bangalore</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <Quote className="w-8 h-8 text-[#c59b27]/30" />
              <p className="text-slate-600 text-sm leading-relaxed italic font-normal">
                &quot;The most professional real estate platform in India. Rajesh Sharma and the advisory team treated our inquiry with exceptional discretion and care.&quot;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                  alt="Client"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Deepak Chawla</h4>
                <p className="text-xs text-slate-500 font-normal">Investor, Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action (CTA) */}
      <section className="bg-gradient-to-r from-[#0b132b] to-[#1c2541] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <SectionHeading dark className="text-white">
            Ready to Find Your Next Sanctuary?
          </SectionHeading>
          <p className="text-slate-300 text-base max-w-xl mx-auto font-normal font-sans">
            Browse our full catalogue of over 20+ verified properties or speak directly with our senior luxury advisors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-sans">
            <Link
              href="/properties"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#c59b27] hover:bg-[#b38a1f] text-white font-semibold text-sm rounded-lg shadow-lg transition"
            >
              Browse All Properties
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-lg border border-white/20 transition"
            >
              Contact Advisory Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
