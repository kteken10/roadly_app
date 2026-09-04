import type { Brand, BrandId, Car, Feature, FeatureId, Trip } from './types';

export const brands: Brand[] = [
  { id: 'bentley', name: 'Bentley', shortName: 'Bentley', monogram: 'B', country: 'Crewe, UK' },
  { id: 'rolls-royce', name: 'Rolls-Royce', shortName: 'Rolls', monogram: 'RR', country: 'Goodwood, UK' },
  { id: 'maserati', name: 'Maserati', shortName: 'Maserati', monogram: 'M', country: 'Modena, IT' },
  { id: 'cadillac', name: 'Cadillac', shortName: 'Cadillac', monogram: 'C', country: 'Detroit, US' },
];

export const brandsById: Record<BrandId, Brand> = brands.reduce(
  (acc, brand) => ({ ...acc, [brand.id]: brand }),
  {} as Record<BrandId, Brand>,
);

export const features: Feature[] = [
  { id: 'climate', label: 'Climate Control', detail: 'Four-zone', symbol: 'snowflake' },
  { id: 'chauffeur', label: 'Chauffeur', detail: 'On request', symbol: 'person.crop.circle.badge.checkmark' },
  { id: 'roomy-trunk', label: 'Roomy Trunk', detail: '3 large bags', symbol: 'suitcase.fill' },
  { id: 'panoramic', label: 'Panoramic Roof', detail: 'Full glass', symbol: 'sun.max.fill' },
  { id: 'carplay', label: 'CarPlay', detail: 'Wireless', symbol: 'car.fill' },
  { id: 'massage-seats', label: 'Massage Seats', detail: 'Front & rear', symbol: 'waveform.path' },
  { id: 'night-vision', label: 'Night Vision', detail: 'Thermal', symbol: 'moon.stars.fill' },
  { id: 'sport-mode', label: 'Sport Mode', detail: 'Adaptive', symbol: 'bolt.fill' },
];

export const featuresById: Record<FeatureId, Feature> = features.reduce(
  (acc, feature) => ({ ...acc, [feature.id]: feature }),
  {} as Record<FeatureId, Feature>,
);

/** The signed-in account holder. */
const kevin = require('../../assets/people/kevin-mercier.jpg');
/** Placeholder portrait for chauffeur profiles. */
const chauffeurAvatar = require('../../assets/people/driver-avatar.jpg');

/**
 * Fleet carried over from the Flutter build (same four cars, same hourly rates),
 * enriched with the specs the new detail screen and filters need.
 */
export const cars: Car[] = [
  {
    id: 'bentley-continental-gt',
    brandId: 'bentley',
    model: 'Continental GT',
    fullName: 'Bentley Continental GT',
    year: 2024,
    plate: '3A 9200',
    image: require('../../assets/cars/bentley-continental.png'),
    pigment: 'sage',
    pricePerHour: 120,
    distanceMeters: 320,
    walkMinutes: 4,
    pickup: 'Green Wood Drive',
    mapPosition: { x: 0.36, y: 0.42 },
    powertrain: 'petrol',
    rangeKm: 540,
    powerHp: 659,
    acceleration: 3.6,
    co2: 77,
    consumption: 5.5,
    seats: 4,
    features: ['climate', 'panoramic', 'carplay', 'massage-seats'],
    rating: 4.9,
    trips: 212,
    tagline: 'A grand tourer that turns a commute into a drive worth taking the long way for.',
  },
  {
    id: 'rolls-royce-wraith',
    brandId: 'rolls-royce',
    model: 'Wraith',
    fullName: 'Rolls-Royce Wraith',
    year: 2023,
    plate: '3A 9200',
    image: require('../../assets/cars/rollsroyce-wraith.png'),
    pigment: 'blush',
    pricePerHour: 185,
    distanceMeters: 780,
    walkMinutes: 9,
    pickup: 'Ocean Drive · Valet',
    mapPosition: { x: 0.68, y: 0.24 },
    powertrain: 'petrol',
    rangeKm: 470,
    powerHp: 624,
    acceleration: 4.4,
    co2: 77,
    consumption: 5.5,
    seats: 4,
    features: ['chauffeur', 'climate', 'massage-seats', 'night-vision', 'roomy-trunk'],
    chauffeur: {
      name: 'Jesica Smith',
      license: 'NWR 369852',
      rating: 5,
      trips: 369,
      avatar: chauffeurAvatar,
    },
    rating: 5,
    trips: 369,
    tagline: 'Arrive without announcing it. Chauffeur included, starlight headliner as standard.',
  },
  {
    id: 'maserati-granturismo',
    brandId: 'maserati',
    model: 'GranTurismo',
    fullName: 'Maserati GranTurismo',
    year: 2024,
    plate: '3A 9200',
    image: require('../../assets/cars/maserati-granturismo.png'),
    pigment: 'mist',
    pricePerHour: 100,
    distanceMeters: 540,
    walkMinutes: 6,
    pickup: 'Collins Ave · Level 2',
    mapPosition: { x: 0.22, y: 0.68 },
    powertrain: 'petrol',
    rangeKm: 430,
    powerHp: 550,
    acceleration: 3.5,
    co2: 77,
    consumption: 5.5,
    seats: 4,
    features: ['sport-mode', 'climate', 'carplay', 'panoramic'],
    rating: 4.8,
    trips: 148,
    tagline: 'Modena engineering with a soundtrack you will find excuses to hear again.',
  },
  {
    id: 'cadillac-escalade',
    brandId: 'cadillac',
    model: 'Escalade',
    fullName: 'Cadillac Escalade',
    year: 2024,
    plate: '3A 9200',
    image: require('../../assets/cars/cadillac-escalade.png'),
    pigment: 'sand',
    pricePerHour: 90,
    distanceMeters: 1150,
    walkMinutes: 13,
    pickup: 'Brickell Key · Bay 4',
    mapPosition: { x: 0.78, y: 0.74 },
    powertrain: 'hybrid',
    rangeKm: 620,
    powerHp: 420,
    acceleration: 6.1,
    co2: 77,
    consumption: 5.5,
    seats: 7,
    features: ['roomy-trunk', 'climate', 'carplay', 'night-vision'],
    rating: 4.7,
    trips: 96,
    tagline: 'Seven seats, a full-width display and enough room for everyone’s luggage.',
  },
];

export const carsById: Record<string, Car> = cars.reduce(
  (acc, car) => ({ ...acc, [car.id]: car }),
  {} as Record<string, Car>,
);

export const priceBounds: [number, number] = [
  Math.min(...cars.map((car) => car.pricePerHour)),
  Math.max(...cars.map((car) => car.pricePerHour)),
];

/**
 * Histogram used behind the price slider. Twenty-four buckets across the price
 * range, shaped so the distribution reads as a real market rather than noise.
 */
export const priceHistogram: number[] = [
  0.12, 0.18, 0.22, 0.31, 0.4, 0.52, 0.61, 0.74, 0.86, 0.95, 1, 0.97, 0.88, 0.79,
  0.71, 0.62, 0.55, 0.46, 0.38, 0.31, 0.24, 0.19, 0.14, 0.09,
];

export const recentTrips: Trip[] = [
  { id: 't-1', carId: 'maserati-granturismo', startedAt: '2026-04-10T06:39:00Z', durationMinutes: 10, amount: 103.24, status: 'completed' },
  { id: 't-2', carId: 'cadillac-escalade', startedAt: '2026-04-08T18:12:00Z', durationMinutes: 15, amount: 90.05, status: 'completed' },
  { id: 't-3', carId: 'bentley-continental-gt', startedAt: '2026-04-06T09:05:00Z', durationMinutes: 25, amount: 150.64, status: 'completed' },
  { id: 't-4', carId: 'rolls-royce-wraith', startedAt: '2026-03-29T20:40:00Z', durationMinutes: 45, amount: 312.9, status: 'completed' },
  { id: 't-5', carId: 'maserati-granturismo', startedAt: '2026-03-22T11:15:00Z', durationMinutes: 8, amount: 42.1, status: 'refunded' },
];

export const account = {
  firstName: 'Kevin',
  lastName: 'Mercier',
  city: 'Miami',
  neighbourhood: 'Green Wood Drive',
  memberSince: 2023,
  avatar: kevin,
  balance: 2912.56,
  card: { brand: 'mastercard' as const, last4: '3673', holder: 'KEVIN MERCIER' },
};
