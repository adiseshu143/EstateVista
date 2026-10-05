export type PropertyType =
  | 'Apartment'
  | 'Villa'
  | 'Independent House'
  | 'Plot'
  | 'Commercial'
  | 'Penthouse';

export type ListingType = 'Sale' | 'Rent';

export type PropertyStatus =
  | 'Available'
  | 'Pending'
  | 'Sold'
  | 'Rented'
  | 'Draft';

export type FurnishingType = 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished';

export interface PropertyCoordinates {
  lat: number;
  lng: number;
}

export interface AgentRef {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  title?: string;
  rating?: number;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number; // in INR
  priceDisplay?: string; // e.g. "₹2.4 Cr" or "₹75,000 / month"
  location: string; // e.g. "Gachibowli, Hyderabad"
  address: string;
  neighborhood?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  coordinates: PropertyCoordinates;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sq ft
  parking: number; // slots
  furnishing: FurnishingType;
  facing?: string; // e.g. "East", "North-East"
  yearBuilt?: number;
  amenities: string[];
  images: string[];
  videoUrl?: string;
  floorPlanUrl?: string;
  status: PropertyStatus;
  featured: boolean;
  verified: boolean;
  agentId?: string;
  agent?: AgentRef;
  viewsCount?: number;
  favoritesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type PropertyFormData = Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'favoritesCount'>;
