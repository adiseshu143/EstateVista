export interface LocationCity {
  id: string;
  name: string;
  slug: string;
  state: string;
  tagline: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  propertyCount: number;
  popularLocalities: string[];
  averagePricePerSqft: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
