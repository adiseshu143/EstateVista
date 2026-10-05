import { PropertyType, ListingType, FurnishingType } from './property';

export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'area_desc'
  | 'relevance';

export interface PropertyFilterState {
  searchQuery: string;
  listingType: ListingType | 'All';
  propertyTypes: PropertyType[];
  city: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | null; // null = any, 1, 2, 3, 4 (means 4+)
  bathrooms: number | null;
  furnishing: FurnishingType | 'All';
  amenities: string[];
  featuredOnly?: boolean;
  sortBy: SortOption;
}

export const INITIAL_FILTER_STATE: PropertyFilterState = {
  searchQuery: '',
  listingType: 'All',
  propertyTypes: [],
  city: 'All',
  minPrice: 0,
  maxPrice: 200000000, // 20 Cr
  bedrooms: null,
  bathrooms: null,
  furnishing: 'All',
  amenities: [],
  featuredOnly: false,
  sortBy: 'newest',
};
