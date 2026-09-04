import { useRental } from '@/store/useRental';
import { TAB_BAR_CLEARANCE } from '@/theme';

/** Height the live-rental dock occupies when a rental is running. */
const LIVE_BAR_CLEARANCE = 68;

/**
 * Bottom padding a scrollable tab screen must reserve. The live-rental dock is
 * conditional chrome, so the number it adds has to be conditional too —
 * otherwise every screen carries dead space for a bar that is usually absent.
 */
export function useContentBottomInset(extra = 0): number {
  const hasRental = useRental((state) => Boolean(state.active));
  return TAB_BAR_CLEARANCE + (hasRental ? LIVE_BAR_CLEARANCE : 0) + extra;
}
