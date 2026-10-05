'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { fetchPropertyBySlug, updateProperty } from '@/lib/firebase/firestore';
import { Property, PropertyType, ListingType, PropertyStatus, FurnishingType } from '@/types/property';
import { SEED_AGENTS } from '@/data/seed/agents';
import {
  Building,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  CheckCircle2,
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

export default function AdminEditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Villa');
  const [listingType, setListingType] = useState<ListingType>('Sale');
  const [price, setPrice] = useState<number>(0);
  const [priceDisplay, setPriceDisplay] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [area, setArea] = useState<number>(0);
  const [parking, setParking] = useState<number>(0);
  const [furnishing, setFurnishing] = useState<FurnishingType>('Fully Furnished');
  const [facing, setFacing] = useState('');
  const [status, setStatus] = useState<PropertyStatus>('Available');
  const [featured, setFeatured] = useState<boolean>(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const found = await fetchPropertyBySlug(propertyId);
        if (found) {
          setProperty(found);
          setTitle(found.title);
          setTagline(found.tagline || '');
          setDescription(found.description);
          setPropertyType(found.propertyType);
          setListingType(found.listingType);
          setPrice(found.price);
          setPriceDisplay(found.priceDisplay || '');
          setCity(found.city);
          setState(found.state);
          setLocation(found.location);
          setAddress(found.address);
          setBedrooms(found.bedrooms);
          setBathrooms(found.bathrooms);
          setArea(found.area);
          setParking(found.parking);
          setFurnishing(found.furnishing);
          setFacing(found.facing || 'East');
          setStatus(found.status);
          setFeatured(found.featured);
          setSelectedAmenities(found.amenities || []);
          setImages(found.images || []);
        }
      } catch (err) {
        console.error('Failed to load property to edit:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [propertyId]);

  const handleToggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities((prev) => [...prev, amenity]);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setSubmitting(true);
    try {
      await updateProperty(property.id, {
        title,
        tagline,
        description,
        propertyType,
        listingType,
        price,
        priceDisplay,
        city,
        state,
        location,
        address,
        bedrooms,
        bathrooms,
        area,
        parking,
        furnishing,
        facing,
        status,
        featured,
        amenities: selectedAmenities,
        images,
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push('/admin/properties');
      }, 1500);
    } catch (err) {
      console.error('Failed to update property:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#c59b27] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">Property not found.</p>
        <Link href="/admin/properties" className="text-xs text-[#c59b27] font-bold underline mt-2 block">
          Return to properties
        </Link>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#f8fafc] pb-20">
        <div className="bg-[#0b132b] text-white py-10 px-4 sm:px-6 lg:px-8 font-sans">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <Link
                href="/admin/properties"
                className="text-xs text-amber-300 hover:underline flex items-center gap-1 mb-1 font-sans"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Properties
              </Link>
              <h1 className="text-2xl sm:text-3xl font-sans font-semibold">
                Edit Property: {property.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans">
          {saveSuccess && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Property updated successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 font-sans">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-sans font-semibold text-lg text-[#0b132b]">Basic Details</h3>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
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
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Price (INR)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/admin/properties"
                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2.5 bg-[#c59b27] hover:bg-[#b38a1f] text-white rounded-lg text-xs font-bold shadow-md transition"
              >
                {submitting ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </RoleGuard>
  );
}
