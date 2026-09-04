import { create } from 'zustand';

import type { Rental } from '@/domain/types';

type RentalState = {
  active: Rental | null;
  start: (carId: string) => void;
  unlock: () => void;
  toggleEngine: () => void;
  end: () => void;
};

/**
 * A single rental can be active at a time — the same constraint every real
 * car-sharing product has, and it keeps the "live" surfaces unambiguous.
 */
export const useRental = create<RentalState>((set) => ({
  active: null,

  start: (carId) =>
    set({
      active: {
        carId,
        startedAt: Date.now(),
        freeWaitingMinutes: 10,
        unlocked: false,
        engineRunning: false,
      },
    }),

  unlock: () => set((state) => (state.active ? { active: { ...state.active, unlocked: true } } : state)),

  toggleEngine: () =>
    set((state) =>
      state.active && state.active.unlocked
        ? { active: { ...state.active, engineRunning: !state.active.engineRunning } }
        : state,
    ),

  end: () => set({ active: null }),
}));
