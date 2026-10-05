'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  zoom?: number;
  height?: string;
  className?: string;
}

export function LocationMap({
  latitude,
  longitude,
  title = 'Location Pin',
  address,
  zoom = 15,
  height = 'h-72',
  className = '',
}: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  useEffect(() => {
    if (!isClient || !isValidCoords || !containerRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !containerRef.current) return;

      try {
        // Fix Leaflet's default icon path issue in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (!mapRef.current) {
          const map = L.map(containerRef.current, {
            center: [latitude, longitude],
            zoom,
            scrollWheelZoom: false,
            zoomControl: true,
          });

          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a> &bull; EstateVista Maps',
            maxZoom: 19,
          }).addTo(map);

          // Add custom marker with EstateVista styling
          const customMarkerHtml = `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-[#0b132b] border-2 border-[#c59b27] shadow-lg flex items-center justify-center text-amber-400 font-bold text-xs animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            </div>
          `;

          const markerIcon = L.divIcon({
            className: 'estatevista-location-pin',
            html: customMarkerHtml,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          const marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(map);

          if (title || address) {
            marker.bindPopup(`
              <div style="font-family: sans-serif; padding: 4px;">
                <strong style="color: #0b132b; font-size: 13px; display: block;">${title}</strong>
                ${address ? `<span style="color: #64748b; font-size: 11px; display: block; margin-top: 2px;">${address}</span>` : ''}
              </div>
            `);
          }

          mapRef.current = map;
        } else {
          mapRef.current.setView([latitude, longitude], zoom);
        }
      } catch (err) {
        console.error('LocationMap Leaflet error:', err);
        setHasError(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isClient, isValidCoords, latitude, longitude, zoom, title, address]);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  if (!isValidCoords || hasError) {
    return (
      <div className={`w-full bg-slate-100 rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center ${height} ${className}`}>
        <MapPin className="w-10 h-10 text-slate-400 mb-2" />
        <h4 className="text-sm font-semibold text-slate-800">Location Map Unavailable</h4>
        {address ? (
          <p className="text-xs text-slate-500 mt-1 max-w-sm">{address}</p>
        ) : (
          <p className="text-xs text-slate-500 mt-1">Coordinates not provided for this location.</p>
        )}
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className={`w-full bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center ${height} ${className}`}>
        <div className="text-center p-4">
          <MapPin className="w-8 h-8 text-amber-500 mx-auto animate-bounce mb-2" />
          <p className="text-xs text-slate-600 font-medium">Loading interactive location map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 group ${height} ${className}`}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      
      <div ref={containerRef} className="w-full h-full" />

      {/* Direct Google Maps Action Overlay */}
      <div className="absolute top-3 right-3 z-[1000]">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b132b]/90 backdrop-blur-xs text-white hover:bg-[#1c2541] rounded-lg text-xs font-semibold shadow-md transition"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>Open Directions</span>
          <ExternalLink className="w-3 h-3 text-slate-300 ml-0.5" />
        </a>
      </div>
    </div>
  );
}
