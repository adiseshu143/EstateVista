'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Property, PropertyType, ListingType, FurnishingType } from '@/types/property';
import { PropertyFilterState, INITIAL_FILTER_STATE, SortOption } from '@/types/filters';
import { fetchAllProperties } from '@/lib/firebase/firestore';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { PropertyMap } from '@/components/map/PropertyMap';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  Map as MapIcon,
  Columns2,
  X,
  ChevronDown,
  Building,
  Home,
  Check,
  Filter,
} from 'lucide-react';

const ALL_AMENITIES = [
  'Swimming Pool',
  'Gym',
  'Clubhouse',
  'Security',
  'Garden',
  'Parking',
  'CCTV',
  'Power Backup',
  'Smart Home Automation',
  'EV Charging',
  'Private Elevator',
  'Jacuzzi',
];

const ALL_PROPERTY_TYPES: PropertyType[] = [
  'Apartment',
  'Villa',
  'Independent House',
  'Penthouse',
  'Plot',
  'Commercial',
];

function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse filters from URL search params or defaults
  const [filters, setFilters] = useState<PropertyFilterState>(() => {
    const listingTypeParam = searchParams.get('listingType') as ListingType | null;
    const cityParam = searchParams.get('city');
    const typeParam = searchParams.get('type') as PropertyType | null;
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const bedroomsParam = searchParams.get('bedrooms');
    const bathroomsParam = searchParams.get('bathrooms');
    const furnishingParam = searchParams.get('furnishing') as FurnishingType | null;
    const sortParam = searchParams.get('sort') as SortOption | null;
    const qParam = searchParams.get('q');

    return {
      searchQuery: qParam || '',
      listingType: listingTypeParam || 'All',
      propertyTypes: typeParam ? [typeParam] : [],
      city: cityParam || 'All',
      minPrice: minPriceParam ? parseInt(minPriceParam) : 0,
      maxPrice: maxPriceParam ? parseInt(maxPriceParam) : 200000000,
      bedrooms: bedroomsParam ? parseInt(bedroomsParam) : null,
      bathrooms: bathroomsParam ? parseInt(bathroomsParam) : null,
      furnishing: furnishingParam || 'All',
      amenities: [],
      sortBy: sortParam || 'newest',
    };
  });

  // Load properties from Firestore / local storage
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllProperties();
        setProperties(data);
      } catch (err) {
        console.error('Failed to load properties:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Update URL search params whenever filter changes
  const updateUrlParams = (newFilters: PropertyFilterState) => {
    const params = new URLSearchParams();
    if (newFilters.searchQuery) params.set('q', newFilters.searchQuery);
    if (newFilters.listingType !== 'All') params.set('listingType', newFilters.listingType);
    if (newFilters.city !== 'All') params.set('city', newFilters.city);
    if (newFilters.propertyTypes.length === 1) params.set('type', newFilters.propertyTypes[0]);
    if (newFilters.minPrice > 0) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice < 200000000) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.bedrooms !== null) params.set('bedrooms', newFilters.bedrooms.toString());
    if (newFilters.bathrooms !== null) params.set('bathrooms', newFilters.bathrooms.toString());
    if (newFilters.furnishing !== 'All') params.set('furnishing', newFilters.furnishing);
    if (newFilters.sortBy !== 'newest') params.set('sort', newFilters.sortBy);

    const queryStr = params.toString();
    router.replace(`/properties${queryStr ? `?${queryStr}` : ''}`, { scroll: false });
  };

  const handleFilterChange = (updates: Partial<PropertyFilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      updateUrlParams(next);
      return next;
    });
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTER_STATE);
    router.replace('/properties', { scroll: false });
  };

  // Filtered & Sorted Properties computation
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Query search
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchLocation = p.location.toLowerCase().includes(q);
          const matchCity = p.city.toLowerCase().includes(q);
          const matchDescription = p.description.toLowerCase().includes(q);
          if (!matchTitle && !matchLocation && !matchCity && !matchDescription) {
            return false;
          }
        }

        // Listing Type
        if (filters.listingType !== 'All' && p.listingType !== filters.listingType) {
          return false;
        }

        // City
        if (filters.city !== 'All' && p.city.toLowerCase() !== filters.city.toLowerCase()) {
          return false;
        }

        // Property Types
        if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(p.propertyType)) {
          return false;
        }

        // Price range
        if (p.price < filters.minPrice || p.price > filters.maxPrice) {
          return false;
        }

        // Bedrooms
        if (filters.bedrooms !== null) {
          if (filters.bedrooms >= 4) {
            if (p.bedrooms < 4) return false;
          } else {
            if (p.bedrooms !== filters.bedrooms) return false;
          }
        }

        // Bathrooms
        if (filters.bathrooms !== null) {
          if (filters.bathrooms >= 4) {
            if (p.bathrooms < 4) return false;
          } else {
            if (p.bathrooms !== filters.bathrooms) return false;
          }
        }

        // Furnishing
        if (filters.furnishing !== 'All' && p.furnishing !== filters.furnishing) {
          return false;
        }

        // Amenities
        if (filters.amenities.length > 0) {
          const hasAll = filters.amenities.every((a) => p.amenities?.includes(a));
          if (!hasAll) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price_asc') return a.price - b.price;
        if (filters.sortBy === 'price_desc') return b.price - a.price;
        if (filters.sortBy === 'area_desc') return b.area - a.area;
        // Default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [properties, filters]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Top Search & Filter Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by location, project, or keyword..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#c59b27] focus:border-transparent outline-none transition"
            />
            {filters.searchQuery && (
              <button
                onClick={() => handleFilterChange({ searchQuery: '' })}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Result Count and Controls */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="text-sm text-slate-600 font-medium font-sans">
              <strong className="text-[#0b132b] font-bold text-base">
                {filteredProperties.length}
              </strong>{' '}
              Properties Found
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold transition"
            >
              <Filter className="w-4 h-4 text-[#c59b27]" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase font-bold hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as SortOption })}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#c59b27] outline-none cursor-pointer transition"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_desc">Largest Area</option>
              </select>
            </div>

            {/* Desktop View Switcher (Split, Grid, Map) */}
            <div className="hidden sm:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'split' ? 'bg-white shadow-xs text-[#0b132b] font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Split View (List + Map)"
              >
                <Columns2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-[#0b132b] font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid Only"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'map' ? 'bg-white shadow-xs text-[#0b132b] font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Map Only"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-grow flex gap-6">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2 font-sans">
                <SlidersHorizontal className="w-4 h-4 text-[#c59b27]" /> Filters
              </h3>
              <button
                onClick={handleClearFilters}
                className="text-xs text-slate-500 hover:text-[#c59b27] font-semibold flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" /> Clear All
              </button>
            </div>

            {/* Buy / Rent */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Listing Type
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                {(['All', 'Sale', 'Rent'] as (ListingType | 'All')[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange({ listingType: type })}
                    className={`py-1.5 text-xs font-semibold rounded-md transition ${
                      filters.listingType === type
                        ? 'bg-white text-[#0b132b] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type === 'Sale' ? 'Buy' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                City
              </label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange({ city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none"
              >
                <option value="All">All Cities</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>

            {/* Property Types */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Property Type
              </label>
              <div className="space-y-1.5">
                {ALL_PROPERTY_TYPES.map((type) => {
                  const checked = filters.propertyTypes.includes(type);
                  return (
                    <label
                      key={type}
                      className="flex items-center justify-between text-xs text-slate-700 cursor-pointer hover:text-slate-900 py-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked
                              ? filters.propertyTypes.filter((t) => t !== type)
                              : [...filters.propertyTypes, type];
                            handleFilterChange({ propertyTypes: next });
                          }}
                          className="rounded border-slate-300 text-[#0b132b] focus:ring-[#0b132b]"
                        />
                        <span>{type}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {properties.filter((p) => p.propertyType === type).length}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Bedrooms
              </label>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { label: 'Any', value: null },
                  { label: '1', value: 1 },
                  { label: '2', value: 2 },
                  { label: '3', value: 3 },
                  { label: '4+', value: 4 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleFilterChange({ bedrooms: item.value })}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                      filters.bedrooms === item.value
                        ? 'bg-[#0b132b] text-white border-[#0b132b]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Bathrooms
              </label>
              <div className="grid grid-cols-5 gap-1">
                {[
                  { label: 'Any', value: null },
                  { label: '1', value: 1 },
                  { label: '2', value: 2 },
                  { label: '3', value: 3 },
                  { label: '4+', value: 4 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleFilterChange({ bathrooms: item.value })}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                      filters.bathrooms === item.value
                        ? 'bg-[#0b132b] text-white border-[#0b132b]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnishing */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Furnishing
              </label>
              <select
                value={filters.furnishing}
                onChange={(e) => handleFilterChange({ furnishing: e.target.value as FurnishingType | 'All' })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none"
              >
                <option value="All">All Furnishing Types</option>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi Furnished">Semi Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Amenities
              </label>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {ALL_AMENITIES.map((amenity) => {
                  const checked = filters.amenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900 py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next = checked
                            ? filters.amenities.filter((a) => a !== amenity)
                            : [...filters.amenities, amenity];
                          handleFilterChange({ amenities: next });
                        }}
                        className="rounded border-slate-300 text-[#0b132b] focus:ring-[#0b132b]"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center my-8 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-amber-50 text-[#c59b27] rounded-full flex items-center justify-center mx-auto">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-xl text-[#0b132b] font-sans">No Matching Properties</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                We couldn&apos;t find any properties matching your current filter criteria. Try clearing some filters or expanding your budget range.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-[#0b132b] text-white rounded-lg text-xs font-semibold hover:bg-[#1c2541] transition font-sans"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="w-full flex-grow">
              {/* Split View (Grid on left, Map on right) */}
              {viewMode === 'split' && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  <div className="xl:col-span-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
                    {filteredProperties.map((property) => (
                      <div
                        key={property.id}
                        onMouseEnter={() => setSelectedPropertyId(property.id)}
                        className={`transition duration-200 rounded-xl ${
                          selectedPropertyId === property.id ? 'ring-2 ring-[#c59b27]' : ''
                        }`}
                      >
                        <PropertyCard property={property} />
                      </div>
                    ))}
                  </div>

                  {/* Sticky Map Container */}
                  <div className="hidden xl:block xl:col-span-6 sticky top-6 h-[calc(100vh-100px)] rounded-2xl overflow-hidden shadow-sm border border-slate-200/80">
                    <PropertyMap
                      properties={filteredProperties}
                      selectedPropertyId={selectedPropertyId}
                      onSelectProperty={(p) => setSelectedPropertyId(p ? p.id : null)}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              )}

              {/* Grid Only View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}

              {/* Map Only View */}
              {viewMode === 'map' && (
                <div className="w-full h-[75vh] rounded-xl overflow-hidden shadow-md">
                  <PropertyMap
                    properties={filteredProperties}
                    selectedPropertyId={selectedPropertyId}
                    onSelectProperty={(p) => setSelectedPropertyId(p ? p.id : null)}
                    className="h-full w-full"
                  />
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 font-sans">
              <h3 className="font-sans font-semibold text-lg text-slate-900">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 font-sans"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Filter Controls */}
            <div className="py-4 space-y-6 flex-grow">
              {/* Buy / Rent */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Listing Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['All', 'Sale', 'Rent'] as (ListingType | 'All')[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange({ listingType: type })}
                      className={`py-2 text-xs font-semibold rounded-lg border ${
                        filters.listingType === type
                          ? 'bg-[#0b132b] text-white border-[#0b132b]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {type === 'Sale' ? 'Buy' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange({ city: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800"
                >
                  <option value="All">All Cities</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Bedrooms</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { label: 'Any', value: null },
                    { label: '1', value: 1 },
                    { label: '2', value: 2 },
                    { label: '3', value: 3 },
                    { label: '4+', value: 4 },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleFilterChange({ bedrooms: item.value })}
                      className={`py-2 text-xs font-semibold rounded-lg border ${
                        filters.bedrooms === item.value
                          ? 'bg-[#0b132b] text-white border-[#0b132b]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-3">
              <button
                onClick={handleClearFilters}
                className="w-1/2 py-3 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-3 bg-[#0b132b] text-white rounded-lg text-sm font-semibold hover:bg-[#1c2541] transition"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-600">Loading listings...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
