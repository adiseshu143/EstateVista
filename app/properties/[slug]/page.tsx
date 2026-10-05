'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types/property';
import { fetchPropertyBySlug, fetchAllProperties, submitLead, scheduleVisit } from '@/lib/firebase/firestore';
import { useAuth } from '@/lib/auth/authContext';
import { formatPrice, formatArea } from '@/lib/utils';
import { PropertyMap } from '@/components/map/PropertyMap';
import { PropertyCard } from '@/components/properties/PropertyCard';
import confetti from 'canvas-confetti';
import {
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Car,
  Compass,
  Calendar,
  ShieldCheck,
  Phone,
  MessageCircle,
  Mail,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Waves,
  Dumbbell,
  Shield,
  Trees,
  Video,
  FileText,
  Star,
  ArrowRight,
} from 'lucide-react';

const AMENITY_ICONS: { [key: string]: React.ReactNode } = {
  'Swimming Pool': <Waves className="w-5 h-5 text-[#c59b27]" />,
  'Gym': <Dumbbell className="w-5 h-5 text-[#c59b27]" />,
  'Clubhouse': <Sparkles className="w-5 h-5 text-[#c59b27]" />,
  'Security': <Shield className="w-5 h-5 text-[#c59b27]" />,
  'Garden': <Trees className="w-5 h-5 text-[#c59b27]" />,
  'Parking': <Car className="w-5 h-5 text-[#c59b27]" />,
  'CCTV': <ShieldCheck className="w-5 h-5 text-[#c59b27]" />,
  'Power Backup': <Sparkles className="w-5 h-5 text-[#c59b27]" />,
  'EV Charging': <Sparkles className="w-5 h-5 text-[#c59b27]" />,
  'Smart Home Automation': <Sparkles className="w-5 h-5 text-[#c59b27]" />,
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user, isFavorite, toggleFavorite } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery viewer state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Active section tab
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'location' | 'floorplan' | 'similar'>('overview');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('I am interested in this property. Please share full brochure and schedule a consultation.');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | 'whatsapp'>('whatsapp');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Schedule Visit Modal State
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [visitNotes, setVisitNotes] = useState('');
  const [visitSubmitting, setVisitSubmitting] = useState(false);
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  // Share Toast State
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    if (user) {
      if (!contactName) setContactName(user.name);
      if (!contactEmail) setContactEmail(user.email);
      if (!contactPhone && user.phone) setContactPhone(user.phone);
    }
  }, [user, contactName, contactEmail, contactPhone]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const found = await fetchPropertyBySlug(slug);
        setProperty(found);

        if (found) {
          const all = await fetchAllProperties();
          const similar = all
            .filter((p) => p.id !== found.id && (p.city === found.city || p.propertyType === found.propertyType))
            .slice(0, 3);
          setSimilarProperties(similar);
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setContactSubmitting(true);
    try {
      await submitLead({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        message: contactMessage,
        propertyId: property.id,
        propertyTitle: property.title,
        propertySlug: property.slug,
        propertyPrice: property.price,
        propertyLocation: property.location,
        propertyImage: property.images[0],
        userId: user?.uid,
        enquiryType: 'property',
        preferredContactMethod: contactMethod,
        assignedAgentId: property.agentId || property.agent?.id || 'agent-1',
        assignedAgentName: property.agent?.name || 'Rajesh Sharma',
      });

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setContactSubmitted(true);
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleScheduleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setVisitSubmitting(true);
    try {
      await scheduleVisit({
        propertyId: property.id,
        propertyTitle: property.title,
        propertySlug: property.slug,
        propertyLocation: property.location,
        propertyImage: property.images[0],
        userId: user?.uid,
        userName: contactName || user?.name || 'Prospective Buyer',
        userEmail: contactEmail || user?.email || 'buyer@example.com',
        userPhone: contactPhone || user?.phone || '+91 99999 88888',
        preferredDate: visitDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        preferredTime: visitTime,
        assignedAgentId: property.agentId || property.agent?.id || 'agent-1',
        assignedAgentName: property.agent?.name || 'Rajesh Sharma',
        notes: visitNotes,
      });

      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      setVisitSubmitted(true);
    } catch (err) {
      console.error('Failed to schedule visit:', err);
    } finally {
      setVisitSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-[#c59b27] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto font-sans">
        <h2 className="text-2xl font-sans font-semibold text-[#0b132b] mb-2">Property Not Found</h2>
        <p className="text-slate-600 mb-6 text-sm font-sans">
          The property listing you are looking for may have been archived or is no longer available.
        </p>
        <Link
          href="/properties"
          className="px-6 py-2.5 bg-[#0b132b] text-white rounded-lg text-xs font-semibold hover:bg-[#1c2541] transition font-sans"
        >
          Explore All Properties
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(property.id);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 bg-[#0b132b] text-white px-4 py-2.5 rounded-lg shadow-2xl z-50 text-xs font-semibold flex items-center gap-2 border border-amber-400/30 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#c59b27]" />
          <span>Listing link copied to clipboard!</span>
        </div>
      )}

      {/* Main Breadcrumb & Action Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-slate-900">Properties</Link>
            <span>/</span>
            <Link href={`/locations/${property.city.toLowerCase()}`} className="hover:text-slate-900">{property.city}</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate">{property.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                favorite
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{favorite ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition"
              title="Share Listing"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. High-End Image Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[360px] sm:h-[460px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 relative">
          {/* Main Large Image */}
          <div
            onClick={() => {
              setActiveImageIndex(0);
              setLightboxOpen(true);
            }}
            className="md:col-span-2 md:row-span-2 relative cursor-pointer group overflow-hidden"
          >
            <Image
              src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
              alt={property.title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
          </div>

          {/* Secondary Thumbnail Images */}
          {property.images.slice(1, 5).map((img, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveImageIndex(idx + 1);
                setLightboxOpen(true);
              }}
              className="hidden md:block relative cursor-pointer group overflow-hidden"
            >
              <Image
                src={img}
                alt={`${property.title} preview ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
            </div>
          ))}

          {/* "View All Photos" Button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md hover:bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold shadow-xl border border-slate-200 flex items-center gap-2 transition"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>View All {property.images.length} Photos</span>
          </button>
        </div>
      </div>

      {/* Lightbox Full-Screen Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white pb-4">
            <span className="text-sm font-semibold">
              {activeImageIndex + 1} / {property.images.length} &bull; {property.title}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center">
            <Image
              src={property.images[activeImageIndex]}
              alt="Full view"
              fill
              className="object-contain"
            />

            {/* Prev / Next Arrows */}
            <button
              onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
              className="absolute left-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveImageIndex((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex gap-2 justify-center overflow-x-auto py-2">
            {property.images.map((thumb, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                  activeImageIndex === idx ? 'border-[#c59b27] scale-105' : 'border-transparent opacity-60'
                }`}
              >
                <Image src={thumb} alt="thumb" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Body Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Details & Tabs) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Summary */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-[#0b132b] text-white text-xs font-semibold rounded-md">
                  For {property.listingType}
                </span>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-md border border-amber-200">
                  {property.propertyType}
                </span>
                {property.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% RERA Verified
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-sans font-semibold text-[#0b132b]">
                  {property.title}
                </h1>
                <div className="text-2xl sm:text-3xl font-bold font-sans text-[#c59b27]">
                  {property.priceDisplay || formatPrice(property.price, property.listingType)}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-[#c59b27] shrink-0" />
                <span>{property.address || property.location}</span>
              </div>

              {property.tagline && (
                <p className="text-xs sm:text-sm text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                  &ldquo;{property.tagline}&rdquo;
                </p>
              )}

              {/* Specification Grid Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Bedrooms</span>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                    <Bed className="w-4 h-4 text-[#c59b27]" />
                    <span>{property.bedrooms > 0 ? `${property.bedrooms} Bedrooms` : 'N/A'}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Bathrooms</span>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                    <Bath className="w-4 h-4 text-[#c59b27]" />
                    <span>{property.bathrooms > 0 ? `${property.bathrooms} Bathrooms` : 'N/A'}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Super Built Area</span>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                    <Maximize2 className="w-4 h-4 text-[#c59b27]" />
                    <span>{formatArea(property.area)}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">Parking &amp; Facing</span>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                    <Car className="w-4 h-4 text-[#c59b27]" />
                    <span>{property.parking} Slots ({property.facing || 'East'})</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons Row */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    const el = document.getElementById('contact-agent-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-3 bg-[#0b132b] hover:bg-[#1c2541] text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Mail className="w-4 h-4 text-amber-400" /> Contact Agent
                </button>

                <button
                  onClick={() => setVisitModalOpen(true)}
                  className="py-3 bg-[#c59b27] hover:bg-[#b38a1f] text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <CalendarCheck className="w-4 h-4" /> Schedule Visit
                </button>

                <a
                  href={`tel:${property.agent?.phone || '+919876543210'}`}
                  className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Phone className="w-4 h-4 text-[#0b132b]" /> Call
                </a>

                <a
                  href={`https://wa.me/919876543210?text=Hi,%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}%20(${property.priceDisplay || ''})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>

            {/* Navigation Tabs (Overview, Amenities, Location, Floor Plan, Similar) */}
            <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 sticky top-20 z-20 shadow-xs">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'amenities', label: 'Amenities' },
                { key: 'location', label: 'Location' },
                { key: 'floorplan', label: 'Floor Plan' },
                { key: 'similar', label: 'Similar Properties' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-3.5 px-4 text-xs font-bold border-b-2 transition ${
                    activeTab === tab.key
                      ? 'border-[#c59b27] text-[#0b132b]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Overview / Description */}
            {(activeTab === 'overview' || activeTab === 'amenities') && (
              <div className="bg-white rounded-b-xl rounded-t-none p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="font-sans font-semibold text-lg text-[#0b132b] mb-3">Property Description</h3>
                  <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line font-sans">
                    {property.description}
                  </p>
                </div>

                {/* Additional Spec Table */}
                <div className="pt-4 border-t border-slate-100 font-sans">
                  <h4 className="font-semibold text-slate-900 text-sm mb-3">Key Property Specifications</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <span className="text-slate-400 block">Furnishing</span>
                      <strong className="text-slate-800">{property.furnishing}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <span className="text-slate-400 block">Facing Direction</span>
                      <strong className="text-slate-800">{property.facing || 'East'}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <span className="text-slate-400 block">Year of Construction</span>
                      <strong className="text-slate-800">{property.yearBuilt || 2024}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <span className="text-slate-400 block">Property Status</span>
                      <strong className="text-emerald-700 font-semibold">{property.status}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <span className="text-slate-400 block">City &amp; State</span>
                      <strong className="text-slate-800">{property.city}, {property.state}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg">
                      <span className="text-slate-400 block">Postal Code</span>
                      <strong className="text-slate-800">{property.postalCode || '500032'}</strong>
                    </div>
                  </div>
                </div>

                {/* Amenities Grid */}
                <div className="pt-4 border-t border-slate-100 font-sans">
                  <h3 className="font-sans font-semibold text-lg text-[#0b132b] mb-4">Amenities &amp; Features</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800"
                      >
                        {AMENITY_ICONS[amenity] || <Sparkles className="w-4 h-4 text-[#c59b27]" />}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Location & Interactive Map */}
            {activeTab === 'location' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="font-sans font-semibold text-lg text-[#0b132b] mb-1">Neighborhood &amp; Location</h3>
                  <p className="text-xs text-slate-500 font-sans">{property.address || property.location}</p>
                </div>

                <div className="h-[360px] rounded-xl overflow-hidden shadow-xs border border-slate-200">
                  <PropertyMap
                    properties={[property]}
                    selectedPropertyId={property.id}
                    center={[property.coordinates.lat, property.coordinates.lng]}
                    zoom={14}
                    className="h-full w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-sans">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <strong className="block text-slate-900 font-semibold mb-1">Connectivity</strong>
                    <span className="text-slate-500">Outer Ring Road &bull; 5 mins away</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <strong className="block text-slate-900 font-semibold mb-1">Education</strong>
                    <span className="text-slate-500">Top International Schools &bull; 2 km</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <strong className="block text-slate-900 font-semibold mb-1">Airport</strong>
                    <span className="text-slate-500">Rajiv Gandhi Intl Airport &bull; 25 mins</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Floor Plan */}
            {activeTab === 'floorplan' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-sans font-semibold text-lg text-[#0b132b]">Architectural Floor Plan</h3>
                <p className="text-xs text-slate-500 font-sans">
                  Detailed 2D layout blueprint with room dimensions and terrace spaces.
                </p>
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image
                    src={property.floorPlanUrl || 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80'}
                    alt="Floor Plan"
                    fill
                    className="object-contain p-4 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Tab: Similar Properties */}
            {activeTab === 'similar' && (
              <div className="space-y-4">
                <h3 className="font-serif font-normal text-2xl text-[#0b132b] tracking-tight">Similar Curated Residences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {similarProperties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Agent Info + Lead Capture Form) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Agent Profile Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 font-sans">
              <span className="text-[11px] font-semibold text-[#c59b27] uppercase tracking-wider block">
                ASSIGNED PORTFOLIO ADVISOR
              </span>

              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-amber-300">
                  <Image
                    src={property.agent?.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'}
                    alt={property.agent?.name || 'Agent'}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{property.agent?.name || 'Rajesh Sharma'}</h4>
                  <p className="text-xs text-slate-500">{property.agent?.title || 'Senior Luxury Portfolio Advisor'}</p>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{property.agent?.rating || 4.9} (142 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                <span>RERA ID: <strong>RERA-TS-2022-0941</strong></span>
                <span className="text-emerald-600 font-semibold">Online &bull; Fast Reply</span>
              </div>
            </div>

            {/* Lead / Enquiry Form Section */}
            <div id="contact-agent-section" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-sans font-semibold text-lg text-[#0b132b]">Enquire About This Property</h3>
              <p className="text-xs text-slate-500 font-sans">
                Receive private brochure, floorplans, and schedule an exclusive tour.
              </p>

              {contactSubmitted ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-in fade-in font-sans">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-semibold text-slate-900 text-sm">Enquiry Received!</h4>
                  <p className="text-xs text-slate-600">
                    Thank you, {contactName}. {property.agent?.name || 'Our senior advisor'} will connect with you shortly via {contactMethod}.
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="text-xs font-semibold text-[#c59b27] underline pt-2 block mx-auto font-sans"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3 font-sans">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 uppercase block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siddharth Rao"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#0b132b]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. siddharth@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#0b132b]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 uppercase block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#0b132b]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 uppercase block mb-1">Preferred Contact</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['whatsapp', 'phone', 'email'] as ('whatsapp' | 'phone' | 'email')[]).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setContactMethod(m)}
                          className={`py-1.5 text-xs font-semibold rounded-lg capitalize border transition ${
                            contactMethod === m
                              ? 'bg-[#0b132b] text-white border-[#0b132b]'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 uppercase block mb-1">Message</label>
                    <textarea
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#0b132b]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-3 bg-[#0b132b] hover:bg-[#1c2541] text-white rounded-lg text-xs font-semibold transition shadow-md disabled:opacity-50"
                  >
                    {contactSubmitting ? 'Sending...' : 'Send Enquiry'}
                  </button>

                  <p className="text-[10px] text-slate-400 text-center font-sans">
                    🔒 Your details are securely encrypted and never shared with 3rd parties.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-sans font-semibold text-xl text-[#0b132b]">Schedule a Private Visit</h3>
              <button
                onClick={() => setVisitModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {visitSubmitted ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">Visit Request Confirmed!</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your appointment request for <strong>{visitDate || 'upcoming date'}</strong> at <strong>{visitTime}</strong> has been logged. {property.agent?.name || 'Our agent'} will contact you to confirm the access pass.
                </p>
                <button
                  onClick={() => {
                    setVisitSubmitted(false);
                    setVisitModalOpen(false);
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#0b132b] text-white rounded-lg text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleScheduleVisitSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Preferred Time Slot</label>
                  <select
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  >
                    <option value="10:00 AM">10:00 AM - 11:30 AM (Morning)</option>
                    <option value="11:30 AM">11:30 AM - 01:00 PM (Midday)</option>
                    <option value="03:00 PM">03:00 PM - 04:30 PM (Afternoon)</option>
                    <option value="05:00 PM">05:00 PM - 06:30 PM (Golden Hour Tour)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Special Requirements (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Requesting architect floor drawings on site..."
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setVisitModalOpen(false)}
                    className="w-1/2 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={visitSubmitting}
                    className="w-1/2 py-2.5 bg-[#c59b27] hover:bg-[#b38a1f] text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                  >
                    {visitSubmitting ? 'Confirming...' : 'Confirm Schedule'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
