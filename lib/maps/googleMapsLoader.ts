import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

let googleMapsPromise: Promise<typeof google> | null = null;

export const isGoogleMapsConfigured = Boolean(
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY &&
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== 'your-google-maps-api-key' &&
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here'
);

/**
 * Singleton Google Maps loader using @googlemaps/js-api-loader functional API.
 * Prevents duplicate script tags, race conditions, and repeated initializations.
 */
export function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps can only be loaded client-side.'));
  }

  if (window.google && window.google.maps) {
    return Promise.resolve(window.google);
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  if (!apiKey || apiKey === 'your-google-maps-api-key' || apiKey === 'your_google_maps_api_key_here') {
    return Promise.reject(new Error('Google Maps API key is not configured in .env.local'));
  }

  if (!googleMapsPromise) {
    setOptions({ key: apiKey, v: 'weekly' });
    googleMapsPromise = importLibrary('maps').then(() => window.google);
  }

  return googleMapsPromise;
}
