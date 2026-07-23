export type PropertyType =
  | "Casa"
  | "Departamento"
  | "Terreno"
  | "Condominio"
  | "Casa en condominio"
  | "Penthouse"
  | "Local Comercial"
  | "Oficina"
  | "Consultorio"
  | "Bodega"
  | "Nave industrial"
  | "Rancho"
  | "Otro";

export type OperationType = "Venta" | "Renta" | "Venta o Renta";

export type QueretaroZone =
  | "Zona Campanario / Altozano"
  | "Zona Centro / Querétaro Tradicional"
  | "Zona Centro Sur / Sur de Querétaro"
  | "Zona Ciudad del Sol / Poniente"
  | "Zona Corregidora"
  | "Zona El Refugio / Norte de El Marqués"
  | "Zona Juriquilla / Jurica"
  | "Zona Zibatá / Zakia"
  | "Zona Industrial / Logística"
  | "Otra / Sin clasificar";

export type AmenityCategory =
  | "Seguridad"
  | "Amenidades del desarrollo"
  | "Interiores"
  | "Exteriores y áreas verdes"
  | "Servicios"
  | "Ubicación y vistas";

export interface Amenity {
  id: number;
  name: string;
  slug: string;
  category: AmenityCategory;
  icon: string;
}

export interface Property {
  id: number;
  title: string;
  property_type: PropertyType;
  operation_type: OperationType;
  price: string;
  currency: string;
  description: string;
  address: string;
  state: string;
  city: string;
  postal_code: string;
  zone: QueretaroZone;
  maps_link: string;
  bedrooms: number;
  full_bathrooms: number;
  half_bathrooms: number;
  parking_spaces: number;
  build_area_m2: string;
  land_area_m2: string;
  levels: number;
  front_measure_m: string | null;
  depth_measure_m: string | null;
  build_year: number | null;
  environments: number;
  maintenance_fee: string | null;
  amenities: number[];
  amenities_detail?: Amenity[];
  is_featured: boolean;
  easybroker_id?: string | null;
  easybroker_synced_at?: string | null;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
  cover_image_url?: string | null;
  technical_sheet_url?: string | null;
}

export interface PropertyFormValues {
  title: string;
  property_type: PropertyType;
  operation_type: OperationType;
  price: string;
  description: string;
  address: string;
  state: string;
  city: string;
  postal_code: string;
  zone: QueretaroZone;
  maps_link: string;
  latitude: string;
  longitude: string;
  bedrooms: string;
  full_bathrooms: string;
  half_bathrooms: string;
  parking_spaces: string;
  build_area_m2: string;
  land_area_m2: string;
  levels: string;
  front_measure_m: string;
  depth_measure_m: string;
  build_year: string;
  environments: string;
  maintenance_fee: string;
  amenities: number[];
  is_featured: boolean;
  easybroker_id: string;
}

export interface PropertyCreatePayload {
  title: string;
  property_type: PropertyType;
  operation_type: OperationType;
  price: number;
  currency: string;
  description: string;
  address: string;
  state: string;
  city: string;
  postal_code: string;
  zone: QueretaroZone;
  maps_link: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  full_bathrooms: number;
  half_bathrooms: number;
  parking_spaces: number;
  build_area_m2: number;
  land_area_m2: number;
  levels: number;
  front_measure_m: number | null;
  depth_measure_m: number | null;
  build_year: number | null;
  environments: number;
  maintenance_fee: number | null;
  amenities: number[];
  is_featured: boolean;
  easybroker_id?: string | null;
}

export interface GeoJsonPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface PropertyFeature {
  id: number;
  type: "Feature";
  geometry: GeoJsonPoint;
  properties: Omit<Property, "id">;
}

export interface FeaturedPropertiesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    type: "FeatureCollection";
    features: PropertyFeature[];
  };
}

export function formatPropertyLocation(property: Property): string {
  return `${property.zone} · ${property.city}, ${property.state}`;
}

export function formatPropertyBathrooms(property: Property): string {
  const halves = property.half_bathrooms > 0 ? ` + ${property.half_bathrooms} medios` : "";
  return `${property.full_bathrooms} baños${halves}`;
}
