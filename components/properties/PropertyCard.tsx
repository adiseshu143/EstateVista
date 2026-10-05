'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';
import { useAuth } from '@/lib/auth/authContext';
import { formatPrice, formatArea } from '@/lib/utils';
import { Heart, MapPin, Bed, Bath, Maximize2, ShieldCheck } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useAuth();
  const favorite = isFavorite(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-[#c59b27]/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Link href={`/properties/${property.slug}`}>
          <Image
            src={mainImage}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Gradient scrim for top & bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md tracking-wide uppercase ${
              property.listingType === 'Rent'
                ? 'bg-amber-600 text-white'
                : 'bg-[#0b132b] text-white'
            }`}
          >
            For {property.listingType}
          </span>
          {property.verified && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-600/90 text-white px-2.5 py-1 rounded-full shadow-md backdrop-blur-md">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition shadow-md z-10 hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorite ? 'fill-rose-500 text-rose-500' : 'text-white hover:text-rose-400'
            }`}
          />
        </button>

        {/* Property Type Badge bottom left */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-[11px] font-semibold bg-black/50 text-slate-100 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xl font-bold font-sans text-[#0b132b] tracking-tight group-hover:text-[#c59b27] transition-colors">
              {property.priceDisplay || formatPrice(property.price, property.listingType)}
            </span>
            {property.status !== 'Available' && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-amber-50 text-[#c59b27] rounded-full border border-amber-200">
                {property.status}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/properties/${property.slug}`}>
            <h3 className="font-semibold text-slate-900 group-hover:text-[#c59b27] transition line-clamp-1 text-base">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 mb-3 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#c59b27] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Specs Ribbon */}
        <div className="pt-3.5 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-600 font-medium">
          {property.bedrooms > 0 ? (
            <div className="flex items-center gap-1.5" title={`${property.bedrooms} Bedrooms`}>
              <Bed className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{property.bedrooms} Bed</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Plot / Comm.</span>
            </div>
          )}

          {property.bathrooms > 0 ? (
            <div className="flex items-center gap-1.5" title={`${property.bathrooms} Bathrooms`}>
              <Bath className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{property.bathrooms} Bath</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>—</span>
            </div>
          )}

          <div className="flex items-center gap-1.5" title={`${property.area} Square Feet`}>
            <Maximize2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formatArea(property.area)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
