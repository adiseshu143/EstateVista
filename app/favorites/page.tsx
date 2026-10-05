'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/authContext';
import { fetchAllProperties } from '@/lib/firebase/firestore';
import { Property } from '@/types/property';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Heart, ArrowRight, Building } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useAuth();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await fetchAllProperties();
        const filtered = all.filter((p) => favorites.includes(p.id));
        setFavoriteProperties(filtered);
      } catch (err) {
        console.error('Error loading favorites:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [favorites]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header */}
      <div className="bg-[#0b132b] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-2">
          <span className="text-[#c59b27] text-xs font-semibold uppercase tracking-widest block font-sans">
            SAVED RESIDENCES
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal flex items-center gap-3 tracking-tight">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            <span>My Favorite Properties ({favorites.length})</span>
          </h1>
          <p className="text-slate-300 text-sm max-w-xl font-normal font-sans">
            Quickly compare and track your shortlisted luxury properties and villas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 my-8 font-sans">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-sans font-semibold text-xl text-[#0b132b]">No Favorites Saved Yet</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Browse our curated luxury collection and tap the heart icon on any property to save it to your wishlist.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0b132b] text-white rounded-lg text-xs font-semibold hover:bg-[#1c2541] transition font-sans"
            >
              <span>Explore Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
