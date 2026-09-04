import { create } from 'zustand';

import { cars, priceBounds } from '@/domain/catalog';
import type { BrandId, Car, FeatureId, Filters, SortKey } from '@/domain/types';

const defaultFilters: Filters = {
  brands: [],
  priceRange: priceBounds,
  features: [],
  sort: 'nearest',
};

type FleetState = {
  /** Committed filters — what the list is actually showing. */
  filters: Filters;
  /** Working copy edited inside the filter sheet, applied on confirm. */
  draft: Filters;
  saved: string[];

  resetDraft: () => void;
  syncDraft: () => void;
  toggleDraftBrand: (id: BrandId) => void;
  toggleDraftFeature: (id: FeatureId) => void;
  setDraftPriceRange: (range: [number, number]) => void;
  setDraftSort: (sort: SortKey) => void;
  applyDraft: () => void;
  clearFilters: () => void;
  /** Home-screen shortcut: pick a single brand without opening the sheet. */
  setBrandShortcut: (id: BrandId | null) => void;
  toggleSaved: (carId: string) => void;
};

export const useFleet = create<FleetState>((set) => ({
  filters: defaultFilters,
  draft: defaultFilters,
  saved: ['rolls-royce-wraith'],

  resetDraft: () => set({ draft: defaultFilters }),
  syncDraft: () => set((state) => ({ draft: state.filters })),

  toggleDraftBrand: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        brands: state.draft.brands.includes(id)
          ? state.draft.brands.filter((brand) => brand !== id)
          : [...state.draft.brands, id],
      },
    })),

  toggleDraftFeature: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        features: state.draft.features.includes(id)
          ? state.draft.features.filter((feature) => feature !== id)
          : [...state.draft.features, id],
      },
    })),

  setDraftPriceRange: (priceRange) => set((state) => ({ draft: { ...state.draft, priceRange } })),
  setDraftSort: (sort) => set((state) => ({ draft: { ...state.draft, sort } })),

  applyDraft: () => set((state) => ({ filters: state.draft })),
  clearFilters: () => set({ filters: defaultFilters, draft: defaultFilters }),

  setBrandShortcut: (id) =>
    set((state) => {
      const brands = id === null ? [] : [id];
      return { filters: { ...state.filters, brands }, draft: { ...state.draft, brands } };
    }),

  toggleSaved: (carId) =>
    set((state) => ({
      saved: state.saved.includes(carId)
        ? state.saved.filter((id) => id !== carId)
        : [...state.saved, carId],
    })),
}));

const sorters: Record<SortKey, (a: Car, b: Car) => number> = {
  nearest: (a, b) => a.distanceMeters - b.distanceMeters,
  'price-asc': (a, b) => a.pricePerHour - b.pricePerHour,
  'price-desc': (a, b) => b.pricePerHour - a.pricePerHour,
  power: (a, b) => b.powerHp - a.powerHp,
};

export function matches(car: Car, filters: Filters): boolean {
  if (filters.brands.length > 0 && !filters.brands.includes(car.brandId)) return false;
  if (car.pricePerHour < filters.priceRange[0] || car.pricePerHour > filters.priceRange[1]) return false;
  if (filters.features.length > 0 && !filters.features.every((f) => car.features.includes(f))) return false;
  return true;
}

export function selectCars(filters: Filters): Car[] {
  return cars.filter((car) => matches(car, filters)).sort(sorters[filters.sort]);
}

/** How many filter dimensions are non-default — drives the badge on the filter button. */
export function countActive(filters: Filters): number {
  let count = filters.brands.length + filters.features.length;
  if (filters.priceRange[0] !== priceBounds[0] || filters.priceRange[1] !== priceBounds[1]) count += 1;
  if (filters.sort !== 'nearest') count += 1;
  return count;
}
