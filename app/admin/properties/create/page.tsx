'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { createProperty } from '@/lib/firebase/firestore';
import { PropertyFormData, PropertyType, ListingType, PropertyStatus, FurnishingType } from '@/types/property';
import { slugify } from '@/lib/utils';
import { SEED_AGENTS } from '@/data/seed/agents';
import {
  Building,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

const ALL_AMENITIES_OPTIONS = [
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
  'Tennis Court',
  'Rooftop Deck',
  'Servant Quarters',
  'Cafeteria',
];

const DEFAULT_SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
];

export default function AdminCreatePropertyPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Villa');
  const [listingType, setListingType] = useState<ListingType>('Sale');
  const [price, setPrice] = useState<number>(25000000);
  const [priceDisplay, setPriceDisplay] = useState('₹2.5 Cr');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [location, setLocation] = useState('Gachibowli, Hyderabad');
  const [address, setAddress] = useState('Plot 15, Elite Enclave, Gachibowli');
  const [lat, setLat] = useState<number>(17.4401);
  const [lng, setLng] = useState<number>(78.3489);
  const [bedrooms, setBedrooms] = useState<number>(4);
  const [bathrooms, setBathrooms] = useState<number>(4);
  const [area, setArea] = useState<number>(3500);
  const [parking, setParking] = useState<number>(2);
  const [furnishing, setFurnishing] = useState<FurnishingType>('Fully Furnished');
  const [facing, setFacing] = useState('East');
  const [yearBuilt, setYearBuilt] = useState<number>(2025);
  const [status, setStatus] = useState<PropertyStatus>('Available');
  const [featured, setFeatured] = useState<boolean>(true);
  const [verified, setVerified] = useState<boolean>(true);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Swimming Pool',
    'Gym',
    'Clubhouse',
    'Security',
    'Garden',
    'Parking',
    'Power Backup',
  ]);
  const [images, setImages] = useState<string[]>(DEFAULT_SAMPLE_IMAGES);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('agent-1');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleToggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities((prev) => [...prev, amenity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please provide a property title and description.');
      return;
    }

    if (images.length === 0) {
      setErrorMessage('Please include at least one property photo.');
      return;
    }

    setSubmitting(true);
    try {
      const chosenAgent = SEED_AGENTS.find((a) => a.uid === selectedAgentId) || SEED_AGENTS[0];
      const slug = slugify(title);

      const payload: PropertyFormData = {
        title: title.trim(),
        slug,
        tagline: tagline.trim(),
        description: description.trim(),
        propertyType,
        listingType,
        price,
        priceDisplay: priceDisplay.trim() || undefined,
        location: location.trim(),
        address: address.trim(),
        city,
        state,
        country: 'India',
        coordinates: { lat: Number(lat), lng: Number(lng) },
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        parking: Number(parking),
        furnishing,
        facing,
        yearBuilt: Number(yearBuilt),
        amenities: selectedAmenities,
        images,
        status,
        featured,
        verified,
        agentId: chosenAgent.uid,
        agent: {
          id: chosenAgent.uid,
          name: chosenAgent.name,
          email: chosenAgent.email,
          phone: chosenAgent.phone || '+91 98765 43210',
          avatarUrl: chosenAgent.avatarUrl,
          title: chosenAgent.title,
          rating: chosenAgent.rating,
        },
      };

      const created = await createProperty(payload);
      router.push(`/properties/${created.slug}`);
    } catch (err: unknown) {
      console.error('Failed to create property:', err);
      const msg = err instanceof Error ? err.message : 'Creation failed.';
      setErrorMessage(msg);
      setSubmitting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#f8fafc] pb-20">
        <div className="bg-[#0b132b] text-white py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto flex items-center justify-between font-sans">
            <div>
              <Link
                href="/admin/properties"
                className="text-xs text-amber-300 hover:underline flex items-center gap-1 mb-1 font-sans"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Properties
              </Link>
              <h1 className="text-2xl sm:text-3xl font-sans font-semibold">
                Create New Property Listing
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans">
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Info */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-sans font-semibold text-lg text-[#0b132b]">
                1. Basic Listing Information
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Crown Villa in Jubilee Hills"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0b132b]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                  Tagline / Highlights
                </label>
                <input
                  type="text"
                  placeholder="e.g. Architect Designed Private Estate with Infinity Pool"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0b132b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                  >
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                    Listing Type
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value as ListingType)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                  >
                    <option value="Sale">Sale (Buy)</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                    Price (INR Numeric) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                    Display Price String
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹2.5 Cr or ₹80,000 / month"
                    value={priceDisplay}
                    onChange={(e) => setPriceDisplay(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                  Full Detailed Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe architectural features, room layouts, marble flooring, smart automation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Section 2: Location & Coordinates */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 font-sans">
              <h3 className="font-sans font-semibold text-lg text-[#0b132b]">
                2. Location &amp; Geo Coordinates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                  >
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Locality Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Jubilee Hills, Hyderabad"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Exact Address</label>
                <input
                  type="text"
                  placeholder="e.g. Road No 36, Beside KBR National Park"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Specifications */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 font-sans">
              <h3 className="font-sans font-semibold text-lg text-[#0b132b]">
                3. Specifications &amp; Amenities
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Area (Sqft)</label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Parking Slots</label>
                  <input
                    type="number"
                    value={parking}
                    onChange={(e) => setParking(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Furnishing</label>
                  <select
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value as FurnishingType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Facing</label>
                  <input
                    type="text"
                    value={facing}
                    onChange={(e) => setFacing(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Year Built</label>
                  <input
                    type="number"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Amenities Chips */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase block mb-2">
                  Select Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_AMENITIES_OPTIONS.map((a) => {
                    const selected = selectedAmenities.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => handleToggleAmenity(a)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          selected
                            ? 'bg-[#0b132b] text-white border-[#0b132b]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {a} {selected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 4: Property Images */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 font-sans">
              <h3 className="font-sans font-semibold text-lg text-[#0b132b]">
                4. High-Definition Imagery
              </h3>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste Image URL (Unsplash or Cloudinary)..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none font-sans"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-[#0b132b] text-white rounded-lg text-xs font-semibold hover:bg-[#1c2541] font-sans"
                >
                  Add Image
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
                    <Image src={img} alt="Property preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-md hover:bg-rose-600 transition"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Advisor & Publishing Settings */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 font-sans">
              <h3 className="font-sans font-semibold text-lg text-[#0b132b]">
                5. Advisor Assignment &amp; Featured Status
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                    Assign Portfolio Advisor
                  </label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {SEED_AGENTS.map((agent) => (
                      <option key={agent.uid} value={agent.uid}>
                        {agent.name} ({agent.title})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded border-slate-300 text-[#0b132b]"
                    />
                    <span>Feature on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verified}
                      onChange={(e) => setVerified(e.target.checked)}
                      className="rounded border-slate-300 text-[#0b132b]"
                    />
                    <span>100% RERA Verified</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-end gap-4 pt-2">
              <Link
                href="/admin/properties"
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-[#c59b27] hover:bg-[#b38a1f] text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Publishing Property...' : 'Publish Property to Live Portal'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </RoleGuard>
  );
}
