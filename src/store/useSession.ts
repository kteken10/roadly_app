import { create } from 'zustand';

type SessionState = {
  onboarded: boolean;
  complete: () => void;
};

export const useSession = create<SessionState>((set) => ({
  onboarded: false,
  complete: () => set({ onboarded: true }),
}));
