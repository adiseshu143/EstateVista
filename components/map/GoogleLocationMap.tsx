'use client';

import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps, isGoogleMapsConfigured } from '@/lib/maps/googleMapsLoader';
import { MapPin, Navigation, ExternalLink, AlertTriangle } from 'lucide-react';

interface GoogleLocationMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  zoom?: number;
  height?: string;
  className?: string;
}

export function GoogleLocationMap({
  latitude,
  longitude,
  title = 'EstateVista Location',
  address,
  zoom = 15,
  height = 'h-72',
  className = '',
}: GoogleLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isValidCoords =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    (latitude !== 0 || longitude !== 0);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  useEffect(() => {
    if (!isValidCoords || !mapRef.current) return;

    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    loadGoogleMaps()
      .then((google) => {
        if (!isMounted || !mapRef.current) return;

        const center = { lat: latitude, lng: longitude };
        
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#e9e9e9' }, { lightnes: 17 }],
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }, { lightness: 20 }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.fill',
              stylers: [{ color: '#ffffff' }, { lightness: 17 }],
            },
            {
              featureType: 'poi',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }, { lightness: 21 }],
            },
          ],
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        });

        const marker = new google.maps.Marker({
          position: center,
          map,
          title,
          animation: google.maps.Animation.DROP,
        });

        if (title || address) {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="font-family: sans-serif; padding: 6px; max-width: 220px;">
                <h4 style="margin: 0 0 4px 0; color: #0b132b; font-size: 13px; font-weight: 700;">${title}</h4>
                ${address ? `<p style="margin: 0; color: #475569; font-size: 11px;">${address}</p>` : ''}
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }

        setMapInstance(map);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Google Maps loading notice:', err.message);
        setLoadError(err.message || 'Google Maps API key unconfigured');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude, zoom, title, address, isValidCoords]);

  if (!isValidCoords) {
    return (
      <div className={`w-full bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center ${height} ${className}`}>
        <MapPin className="w-8 h-8 text-slate-400 mb-2" />
        <h4 className="text-sm font-bold text-slate-800">Location Coordinates Unavailable</h4>
        <p className="text-xs text-slate-500 mt-1">{address || 'Address information is provided as text.'}</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 ${height} ${className}`}>
      {/* Map Element Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading State Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100/90 backdrop-blur-xs flex items-center justify-center p-4 text-center z-[5]">
          <div className="space-y-2">
            <div className="w-8 h-8 border-3 border-[#c59b27] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-700 font-sans">Loading Google Maps...</p>
          </div>
        </div>
      )}

      {/* Error / Key Fallback Overlay */}
      {loadError && (
        <div className="absolute inset-0 bg-slate-900/90 text-white p-6 flex flex-col items-center justify-center text-center z-[10] space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white font-sans">{title}</h4>
            <p className="text-xs text-slate-300 mt-0.5">{address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}</p>
          </div>
          <div className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg max-w-xs font-mono">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY required in .env.local
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c59b27] hover:bg-[#a37e1e] text-slate-950 font-bold text-xs rounded-lg transition shadow-md"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open Directions in Google Maps</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      )}

      {/* Open Directions Floating Action Bar */}
      {!isLoading && !loadError && (
        <div className="absolute top-3 right-3 z-[1000]">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b132b]/90 hover:bg-[#1c2541] backdrop-blur-xs text-white rounded-lg text-xs font-semibold shadow-md transition"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Directions</span>
            <ExternalLink className="w-3 h-3 text-slate-300 ml-0.5" />
          </a>
        </div>
      )}
    </div>
  );
}
