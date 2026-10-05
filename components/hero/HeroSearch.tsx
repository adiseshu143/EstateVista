'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  MapPin,
  Home,
  IndianRupee,
  Bed,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { PropertyType, ListingType } from '@/types/property';

export function HeroSearch() {
  const router = useRouter();
  const [listingType, setListingType] = useState<ListingType>('Sale');
  const [location, setLocation] = useState('All');
  const [propertyType, setPropertyType] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('All');
  const [bedrooms, setBedrooms] = useState<string>('Any');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType) params.set('listingType', listingType);
    if (location && location !== 'All') params.set('city', location);
    if (propertyType && propertyType !== 'All') params.set('type', propertyType);
    if (bedrooms && bedrooms !== 'Any') params.set('bedrooms', bedrooms.replace('+', ''));

    if (priceRange === 'under-1cr') {
      params.set('maxPrice', '10000000');
    } else if (priceRange === '1cr-3cr') {
      params.set('minPrice', '10000000');
      params.set('maxPrice', '30000000');
    } else if (priceRange === '3cr-5cr') {
      params.set('minPrice', '30000000');
      params.set('maxPrice', '50000000');
    } else if (priceRange === 'above-5cr') {
      params.set('minPrice', '50000000');
    } else if (priceRange === 'rent-under-50k') {
      params.set('maxPrice', '50000');
    } else if (priceRange === 'rent-50k-1l') {
      params.set('minPrice', '50000');
      params.set('maxPrice', '100000');
    } else if (priceRange === 'rent-above-1l') {
      params.set('minPrice', '100000');
    }

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative isolate min-h-[720px] lg:min-h-[800px] flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-16 overflow-hidden">
      {/* Background Image - Bright, vibrant luxury dusk villa covering both Navbar and Hero */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/hero-villa.jpg"
          alt="Luxury Villa with Pool at Dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_28%] sm:object-[center_32%] scale-100"
        />
        {/* Soft, natural gradient overlay to enhance text legibility while preserving full villa & pool brilliance */}
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/30" />
      </div>

      {/* Hero Content Container - Center Aligned */}
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center space-y-6 pt-4 sm:pt-6 pb-6 relative z-10">
        <div className="text-xs sm:text-sm font-semibold tracking-wider text-slate-200 uppercase drop-shadow">
          PREMIUM PROPERTIES. BRIGHTER TOMORROWS.
        </div>

        <h1 className="text-[40px] sm:text-[54px] md:text-[64px] lg:text-[76px] font-serif font-normal tracking-tight text-white leading-[1.08] max-w-4xl mx-auto drop-shadow-lg">
          Find a place you&apos;ll <br className="hidden sm:inline" />
          be proud to call home.
        </h1>

        {/* Buy / Rent Floating Pill Tabs */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex items-center p-1 bg-black/40 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
            <button
              type="button"
              onClick={() => setListingType('Sale')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${
                listingType === 'Sale'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white hover:text-amber-300'
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setListingType('Rent')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${
                listingType === 'Rent'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white hover:text-amber-300'
              }`}
            >
              Rent
            </button>
          </div>
        </div>

        {/* Search Bar Card */}
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/40 text-slate-900 text-left">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Location */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#c59b27] absolute left-3 top-3 pointer-events-none" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0b132b] focus:border-transparent outline-none transition cursor-pointer"
                >
                  <option value="All">All Cities</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>
            </div>

            {/* Property Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Property Type
              </label>
              <div className="relative">
                <Home className="w-4 h-4 text-[#c59b27] absolute left-3 top-3 pointer-events-none" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0b132b] focus:border-transparent outline-none transition cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Price Range
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-[#c59b27] absolute left-3 top-3 pointer-events-none" />
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0b132b] focus:border-transparent outline-none transition cursor-pointer"
                >
                  {listingType === 'Sale' ? (
                    <>
                      <option value="All">Any Budget</option>
                      <option value="under-1cr">Under ₹1 Cr</option>
                      <option value="1cr-3cr">₹1 Cr - ₹3 Cr</option>
                      <option value="3cr-5cr">₹3 Cr - ₹5 Cr</option>
                      <option value="above-5cr">Above ₹5 Cr</option>
                    </>
                  ) : (
                    <>
                      <option value="All">Any Budget</option>
                      <option value="rent-under-50k">Under ₹50k / mo</option>
                      <option value="rent-50k-1l">₹50k - ₹1 Lakh / mo</option>
                      <option value="rent-above-1l">Above ₹1 Lakh / mo</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Bedrooms */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Bedrooms
              </label>
              <div className="relative">
                <Bed className="w-4 h-4 text-[#c59b27] absolute left-3 top-3 pointer-events-none" />
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0b132b] focus:border-transparent outline-none transition cursor-pointer"
                >
                  <option value="Any">Any</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4+">4+ BHK</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-1 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0b132b] hover:bg-[#1c2541] text-white font-semibold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 h-[42px]"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Search Properties</span>
              </button>
            </div>
          </form>
        </div>

        {/* Trust Indicators Banner */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-white drop-shadow">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Trusted by 10,000+ clients</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Verified Properties</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Expert Guidance</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Transparent Deals</span>
          </div>
        </div>
      </div>
    </div>
  );
}
