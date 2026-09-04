import type { ImageSourcePropType } from 'react-native';
import type { SFSymbol } from 'expo-symbols';

export type BrandId = 'bentley' | 'rolls-royce' | 'maserati' | 'cadillac';

export type Brand = {
  id: BrandId;
  name: string;
  /** Short label used inside filter pills where horizontal space is scarce. */
  shortName: string;
  /** Typographic monogram used in place of a trademarked logo. */
  monogram: string;
  country: string;
};

export type Powertrain = 'petrol' | 'hybrid' | 'electric';

export type FeatureId =
  | 'climate'
  | 'chauffeur'
  | 'roomy-trunk'
  | 'panoramic'
  | 'carplay'
  | 'massage-seats'
  | 'night-vision'
  | 'sport-mode';

export type Feature = {
  id: FeatureId;
  label: string;
  detail: string;
  symbol: SFSymbol;
};

/** Semantic surface tint a car is presented on. */
export type Pigment = 'blush' | 'sand' | 'mist' | 'sage';

export type Chauffeur = {
  name: string;
  license: string;
  rating: number;
  trips: number;
  avatar: ImageSourcePropType;
};

export type Car = {
  id: string;
  brandId: BrandId;
  /** e.g. "Continental GT" */
  model: string;
  /** e.g. "Bentley Continental GT" */
  fullName: string;
  year: number;
  plate: string;
  image: ImageSourcePropType;
  pigment: Pigment;

  pricePerHour: number;

  /** Walking distance from the user to the parked car. */
  distanceMeters: number;
  walkMinutes: number;
  /** Human-readable pickup point. */
  pickup: string;
  /** Normalised 0–1 coordinates on the stylised city map. */
  mapPosition: { x: number; y: number };

  powertrain: Powertrain;
  /** Remaining range in km — the reference boards lead with this, not fuel %. */
  rangeKm: number;
  powerHp: number;
  /** 0–100 km/h in seconds. */
  acceleration: number;
  /** g/km — carried over from the original Flutter model. */
  co2: number;
  /** L/100km, or kWh/100km for electric cars. */
  consumption: number;
  seats: number;

  features: FeatureId[];
  chauffeur?: Chauffeur;
  /** Aggregate guest rating. */
  rating: number;
  trips: number;
  /** One-line editorial blurb shown on the detail screen. */
  tagline: string;
};

export type SortKey = 'nearest' | 'price-asc' | 'price-desc' | 'power';

export type Filters = {
  brands: BrandId[];
  priceRange: [number, number];
  features: FeatureId[];
  sort: SortKey;
};

export type Trip = {
  id: string;
  carId: string;
  /** ISO date string. */
  startedAt: string;
  durationMinutes: number;
  amount: number;
  status: 'completed' | 'refunded';
};

export type Rental = {
  carId: string;
  /** Epoch ms at which the rental started. */
  startedAt: number;
  /** Free waiting window before metered billing begins. */
  freeWaitingMinutes: number;
  unlocked: boolean;
  engineRunning: boolean;
};
