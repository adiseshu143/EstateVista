'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SEED_LOCATIONS } from '@/data/seed/locations';
import { fetchAllProperties } from '@/lib/firebase/properties';
import { PropertyMap } from '@/components/map/PropertyMap';
import { Property } from '@/types/property';
import { MapPin, ArrowRight, Globe2, Building2 } from 'lucide-react';

export default function LocationsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProperties()
      .then((data) => setProperties(data))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="bg-[#0b132b] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block">
            LOCATION DISCOVERY
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight leading-tight">
            Prime Real Estate Hubs
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal font-sans">
            Discover verified luxury residential corridors across India&apos;s leading metropolitan destinations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        {/* National Interactive Property Map */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-[#c59b27] uppercase tracking-widest block">
                NATIONAL MAP VIEW
              </span>
              <h3 className="text-xl font-sans font-semibold text-[#0b132b] flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-[#c59b27]" />
                Explore Properties Across All Hubs
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-sans">
              Pan &amp; zoom to preview verified listings in Hyderabad, Bangalore, Mumbai, Pune, &amp; Chennai.
            </p>
          </div>

          <div className="h-[450px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner">
            <PropertyMap properties={properties} zoom={5} center={[19.076, 72.8777]} />
          </div>
        </div>

        {/* Grid of Locations */}
        <div>
          <h3 className="text-2xl font-serif font-normal text-[#0b132b] mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#c59b27]" />
            Metropolitan Portfolios
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SEED_LOCATIONS.map((loc) => (
              <div
                key={loc.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <Image
                    src={loc.imageUrl}
                    alt={loc.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 bg-[#0b132b]/80 backdrop-blur-xs text-white text-xs font-semibold rounded-md font-sans">
                      {loc.state}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-sans font-semibold group-hover:text-amber-300 transition">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-slate-300 truncate font-sans">{loc.tagline}</p>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {loc.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-400">Average Rate:</span>
                      <strong className="text-slate-900">{loc.averagePricePerSqft} / sqft</strong>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {loc.popularLocalities.slice(0, 4).map((sub) => (
                        <span
                          key={sub}
                          className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/locations/${loc.slug}`}
                    className="w-full py-2.5 bg-[#0b132b] hover:bg-[#1c2541] text-white text-xs font-bold rounded-lg text-center flex items-center justify-center gap-2 transition"
                  >
                    <span>Explore {loc.name} Properties</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
