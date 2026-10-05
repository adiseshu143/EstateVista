'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Property } from '@/types/property';
import { formatPrice } from '@/lib/utils';
import { loadGoogleMaps } from '@/lib/maps/googleMapsLoader';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, ArrowRight, X, Navigation } from 'lucide-react';

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  onSelectProperty?: (property: Property | null) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function PropertyMap({
  properties,
  selectedPropertyId,
  onSelectProperty,
  center = [17.3850, 78.4867], // Default Hyderabad
  zoom = 11,
  className = 'h-full min-h-[400px]',
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ [id: string]: google.maps.Marker }>({});
  const [activePopupProperty, setActivePopupProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const validProperties = properties.filter(
    (p) => p.coordinates && typeof p.coordinates.lat === 'number' && typeof p.coordinates.lng === 'number'
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    loadGoogleMaps()
      .then((google) => {
        if (!isMounted || !mapContainerRef.current) return;

        let mapCenter = { lat: center[0], lng: center[1] };
        if (validProperties.length > 0 && validProperties[0].coordinates) {
          mapCenter = {
            lat: validProperties[0].coordinates.lat,
            lng: validProperties[0].coordinates.lng,
          };
        }

        if (!mapInstanceRef.current) {
          const map = new google.maps.Map(mapContainerRef.current, {
            center: mapCenter,
            zoom,
            styles: [
              { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e9e9e9' }] },
              { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
              { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
            ],
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
          });

          mapInstanceRef.current = map;
        }

        const map = mapInstanceRef.current;

        // Clear existing markers
        Object.values(markersRef.current).forEach((m) => m.setMap(null));
        markersRef.current = {};

        const bounds = new google.maps.LatLngBounds();

        validProperties.forEach((property) => {
          const position = { lat: property.coordinates!.lat, lng: property.coordinates!.lng };
          const isSelected = selectedPropertyId === property.id;
          const priceText = property.priceDisplay || formatPrice(property.price, property.listingType);

          const marker = new google.maps.Marker({
            position,
            map,
            title: `${property.title} - ${priceText}`,
            label: {
              text: priceText,
              color: isSelected ? '#ffffff' : '#0b132b',
              fontWeight: 'bold',
              fontSize: '11px',
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: isSelected ? 18 : 14,
              fillColor: isSelected ? '#c59b27' : '#ffffff',
              fillOpacity: 1,
              strokeColor: '#0b132b',
              strokeWeight: 2,
            },
          });

          marker.addListener('click', () => {
            setActivePopupProperty(property);
            if (onSelectProperty) onSelectProperty(property);
            map.panTo(position);
          });

          markersRef.current[property.id] = marker;
          bounds.extend(position);
        });

        if (validProperties.length > 1) {
          map.fitBounds(bounds);
        } else if (validProperties.length === 1) {
          map.setCenter({ lat: validProperties[0].coordinates!.lat, lng: validProperties[0].coordinates!.lng });
          map.setZoom(13);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Google Maps PropertyMap notice:', err.message);
        setLoadError(err.message || 'Google Maps API key unconfigured');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [properties, selectedPropertyId, center, zoom, onSelectProperty]);

  // Sync selectedPropertyId
  useEffect(() => {
    if (selectedPropertyId) {
      const matched = properties.find((p) => p.id === selectedPropertyId);
      if (matched && matched.coordinates) {
        setActivePopupProperty(matched);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo({
            lat: matched.coordinates.lat,
            lng: matched.coordinates.lng,
          });
        }
      }
    }
  }, [selectedPropertyId, properties]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100 ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[450px]" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100/90 backdrop-blur-xs flex items-center justify-center p-4 text-center z-[5]">
          <div className="space-y-2">
            <div className="w-8 h-8 border-3 border-[#c59b27] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-700 font-sans">Loading Google Interactive Map...</p>
          </div>
        </div>
      )}

      {/* Error / Key Fallback Overlay */}
      {loadError && (
        <div className="absolute inset-0 bg-slate-900/95 text-white p-8 flex flex-col items-center justify-center text-center z-[10] space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-sans">Interactive Property Location Map</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-sm">
              Showing {validProperties.length} verified listings across prime metropolitan corridors.
            </p>
          </div>
          <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg max-w-xs font-mono">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY required in .env.local
          </div>
        </div>
      )}

      {/* Floating Property Preview Popup */}
      {activePopupProperty && (
        <div className="absolute bottom-5 left-4 right-4 sm:left-auto sm:right-5 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-[1000] animate-in fade-in slide-in-from-bottom-3">
          <button
            onClick={() => setActivePopupProperty(null)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            aria-label="Close Preview"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex gap-3 items-center">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
              <Image
                src={activePopupProperty.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                alt={activePopupProperty.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1 pr-4">
              <p className="text-xs font-semibold uppercase text-amber-600">
                For {activePopupProperty.listingType}
              </p>
              <h4 className="font-sans font-bold text-slate-900 text-sm truncate">
                {activePopupProperty.priceDisplay || formatPrice(activePopupProperty.price, activePopupProperty.listingType)}
              </h4>
              <p className="text-xs text-slate-600 truncate">{activePopupProperty.title}</p>
              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                {activePopupProperty.location}
              </p>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              {activePopupProperty.bedrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  {activePopupProperty.bedrooms} Bed
                </span>
              )}
              {activePopupProperty.bathrooms > 0 && (
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  {activePopupProperty.bathrooms} Bath
                </span>
              )}
            </div>

            <Link
              href={`/properties/${activePopupProperty.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0b132b] hover:text-[#c59b27] transition"
            >
              View Details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
