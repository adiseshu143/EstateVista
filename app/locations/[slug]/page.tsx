'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SEED_LOCATIONS } from '@/data/seed/locations';
import { Property } from '@/types/property';
import { fetchAllProperties } from '@/lib/firebase/firestore';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyMap } from '@/components/map/PropertyMap';
import { MapPin, ArrowRight, Building, CheckCircle2 } from 'lucide-react';

export default function LocationDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const location = SEED_LOCATIONS.find((l) => l.slug.toLowerCase() === slug.toLowerCase()) || {
    id: `loc-${slug}`,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    slug: slug,
    state: 'India',
    tagline: 'Prime Real Estate Corridor',
    description: `Explore premium properties and upcoming residential luxury projects in ${slug}.`,
    imageUrl: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    propertyCount: 5,
    popularLocalities: ['Central City', 'Prime Enclave', 'Financial Belt'],
    averagePricePerSqft: '₹8,000 - ₹18,000',
    coordinates: { lat: 17.3850, lng: 78.4867 },
  };

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await fetchAllProperties();
        const matched = all.filter((p) => p.city.toLowerCase() === location.name.toLowerCase());
        setProperties(matched.length > 0 ? matched : all.slice(0, 4));
      } catch (err) {
        console.error('Error loading location properties:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [location.name]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Hero Banner */}
      <div className="relative h-[340px] bg-[#0b132b] text-white flex items-center">
        <Image
          src={location.imageUrl}
          alt={location.name}
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b] via-[#0b132b]/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-3">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold uppercase tracking-widest font-sans">
            <MapPin className="w-4 h-4" />
            <span>{location.state} &bull; PRIME HUB</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight leading-tight">
            Luxury Properties in {location.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal font-sans">
            {location.description}
          </p>
        </div>
      </div>

      {/* Overview & Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Available Residences</span>
            <strong className="text-xl font-bold font-sans text-[#0b132b]">{properties.length} Verified Listings</strong>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Average Capital Rate</span>
            <strong className="text-xl font-bold font-sans text-[#c59b27]">{location.averagePricePerSqft} / sqft</strong>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Key Corridors</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {location.popularLocalities.map((loc) => (
                <span key={loc} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Property Listings & Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#0b132b] tracking-tight">
            Featured Residences in {location.name}
          </h2>
          <Link
            href={`/properties?city=${location.name}`}
            className="text-xs font-semibold font-sans text-[#c59b27] hover:underline flex items-center gap-1"
          >
            Filter {location.name} Properties <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* City Map */}
        <div className="pt-8">
          <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#0b132b] mb-4 tracking-tight">
            {location.name} Real Estate Map
          </h3>
          <div className="h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <PropertyMap
              properties={properties}
              center={[location.coordinates.lat, location.coordinates.lng]}
              zoom={12}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
