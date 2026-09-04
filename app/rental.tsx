import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CityMap, RouteOverlay } from '@/components/map/CityMap';
import { Button, Icon, Text, Touchable } from '@/components/ui';
import { SlideToConfirm } from '@/components/ui/SlideToConfirm';
import { account, carsById } from '@/domain/catalog';
import { clock, money } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { useTicker } from '@/lib/useTicker';
import { useRental } from '@/store/useRental';
import { border, control, gutter, icon, palette, radius, shadow, space, type } from '@/theme';

export default function RentalSheet() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const active = useRental((state) => state.active);
  const unlock = useRental((state) => state.unlock);
  const toggleEngine = useRental((state) => state.toggleEngine);
  const end = useRental((state) => state.end);
  const now = useTicker(Boolean(active));

  if (!active) {
    return (
      <View style={styles.empty}>
        <Text variant="title3">No rental in progress</Text>
        <Button label="Find a car" onPress={() => router.replace('/(tabs)/explore')} />
      </View>
    );
  }

  const car = carsById[active.carId];
  const elapsedSeconds = Math.floor((now - active.startedAt) / 1000);
  const freeSeconds = active.freeWaitingMinutes * 60;
  const metered = active.unlocked || elapsedSeconds > freeSeconds;
  const billedSeconds = active.unlocked ? elapsedSeconds : Math.max(0, elapsedSeconds - freeSeconds);
  const runningCost = (billedSeconds / 3600) * car.pricePerHour;

  return (
    <View style={[styles.root, { paddingBottom: (insets.bottom || space.lg) + space.sm }]}>
      <View style={styles.mapStrip}>
        <CityMap seed={1} style={StyleSheet.absoluteFill}>
          <RouteOverlay from={{ x: 0.22, y: 0.7 }} to={car.mapPosition} />
        </CityMap>
        <View style={styles.mapHeader}>
          <View style={styles.mapCopy}>
            <Text variant="captionStrong" numberOfLines={1}>
              {car.fullName}
            </Text>
            <Text variant="caption" tone="tertiary" numberOfLines={1}>
              {car.pickup}
            </Text>
          </View>
          <Image source={car.image} style={styles.car} contentFit="contain" />
        </View>
      </View>

      <View style={styles.meterRow}>
        <View style={styles.meter}>
          <Text style={[type.mono, styles.clock]} accessibilityLabel={`Elapsed ${clock(elapsedSeconds)}`}>
            {clock(elapsedSeconds)}
          </Text>
          <Text variant="caption" tone={metered ? 'live' : 'tertiary'}>
            {metered
              ? `Metered · ${money(runningCost, true)} so far`
              : `Free waiting, then ${money(car.pricePerHour)}/h`}
          </Text>
        </View>

        <Touchable
          accessibilityRole="button"
          accessibilityLabel="End rental"
          onPress={() => {
            haptic.warning();
            end();
            router.back();
          }}
          haptics="none"
          scaleTo={0.94}
          style={styles.endButton}
        >
          <Text variant="callout" tone="live">
            End rent
          </Text>
        </Touchable>
      </View>

      <View style={styles.divider} />

      <Touchable
        accessibilityRole="button"
        accessibilityLabel={`Payment method, Mastercard ending ${account.card.last4}. Change`}
        onPress={() => haptic.tap()}
        scaleTo={0.98}
        style={styles.payment}
      >
        <Icon name="creditcard.fill" size={icon.lg} color={palette.ink} />
        <Text variant="callout" style={styles.paymentLabel}>
          ···· {account.card.last4}
        </Text>
        <Text variant="caption" tone="tertiary">
          Change
        </Text>
      </Touchable>

      {/* Vehicle controls only exist once the car is actually open. */}
      {active.unlocked ? (
        <Animated.View entering={FadeIn.duration(260)} style={styles.controls}>
          <Control
            symbol="power.circle.fill"
            label={active.engineRunning ? 'Stop engine' : 'Start engine'}
            active={active.engineRunning}
            onPress={() => {
              haptic.thud();
              toggleEngine();
            }}
          />
          <Control
            symbol="speaker.wave.2.fill"
            label="Beep sound"
            onPress={() => haptic.press()}
          />
          <Control symbol="lock.fill" label="Lock" onPress={() => haptic.press()} />
        </Animated.View>
      ) : (
        <Animated.View exiting={FadeOut.duration(140)} style={styles.hint}>
          <Icon name="info.circle" size={icon.md} color={palette.inkTertiary} />
          <Text variant="caption" tone="tertiary" style={styles.hintText}>
            Walk up to the car before unlocking. Billing starts the moment it opens.
          </Text>
        </Animated.View>
      )}

      <SlideToConfirm
        label="Slide to open the car"
        confirmedLabel="Car is open"
        symbol="lock.open.fill"
        confirmed={active.unlocked}
        onConfirm={unlock}
      />
    </View>
  );
}

function Control({
  symbol,
  label,
  onPress,
  active,
}: {
  symbol: Parameters<typeof Icon>[0]['name'];
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      haptics="none"
      scaleTo={0.94}
      style={[styles.control, active && styles.controlActive, shadow.card]}
    >
      <Icon name={symbol} size={icon.lg} color={active ? palette.inkInverted : palette.ink} />
      <Text variant="caption" style={{ color: active ? palette.inkInverted : palette.ink }} center>
        {label}
      </Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.canvas,
    paddingHorizontal: gutter,
    paddingTop: space.md,
    gap: space.base,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.base },

  mapStrip: { height: 128, borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'flex-end' },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: palette.veil,
  },
  mapCopy: { flex: 1, gap: 1 },
  car: { width: 92, height: 44 },

  meterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.base },
  meter: { flex: 1, gap: 2 },
  clock: { color: palette.ink },
  endButton: {
    height: control.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: palette.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: { height: border.hairline, backgroundColor: palette.hairline },

  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    height: control.lg,
    paddingHorizontal: space.base,
    borderRadius: radius.md,
    backgroundColor: palette.surfaceSunken,
  },
  paymentLabel: { flex: 1 },

  controls: { flexDirection: 'row', gap: space.sm },
  control: {
    flex: 1,
    height: 78,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.tight,
    paddingHorizontal: space.sm,
  },
  controlActive: { backgroundColor: palette.ink },

  hint: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start', paddingHorizontal: space.xs },
  hintText: { flex: 1 },
});
