import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { Icon, Text, Touchable } from '@/components/ui';
import { carsById } from '@/domain/catalog';
import { clock } from '@/lib/format';
import { useTicker } from '@/lib/useTicker';
import { useRental } from '@/store/useRental';
import { control, icon, palette, radius, shadow, space } from '@/theme';

/**
 * A persistent "you have a car out" affordance, docked above the tab bar.
 *
 * The Flutter build had no notion of an in-progress rental, so a booking simply
 * vanished. This is the thread that makes the app feel like it is running a
 * real service: it is always reachable, it counts, and it pulses.
 */
export function LiveRentalBar({ onPress, bottom }: { onPress: () => void; bottom: number }) {
  const active = useRental((state) => state.active);
  const now = useTicker(Boolean(active));
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!active) return;
    pulse.value = withRepeat(
      withSequence(withTiming(0.35, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1,
      false,
    );
  }, [active, pulse]);

  const dot = useAnimatedStyle(() => ({ opacity: pulse.value }));

  if (!active) return null;

  const car = carsById[active.carId];
  const elapsed = Math.floor((now - active.startedAt) / 1000);

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(20)}
      exiting={FadeOutDown.duration(180)}
      style={[styles.wrap, { bottom }]}
      pointerEvents="box-none"
    >
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={`Rental in progress, ${car.fullName}. Open controls.`}
        onPress={onPress}
        haptics="press"
        scaleTo={0.98}
        style={[styles.bar, shadow.lifted]}
      >
        <View style={styles.live}>
          <Animated.View style={[styles.dot, dot]} />
        </View>
        <View style={styles.copy}>
          <Text variant="captionStrong" tone="inverted" numberOfLines={1}>
            {car.fullName}
          </Text>
          <Text variant="caption" tone="invertedSoft">
            {active.unlocked ? 'Rental running' : 'Free waiting'} · {clock(elapsed)}
          </Text>
        </View>
        <Image source={car.image} style={styles.car} contentFit="contain" />
        <Icon name="chevron.right" size={icon.sm} color={palette.inkOnNight} />
      </Touchable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: space.base, right: space.base },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    height: control.lg,
    paddingLeft: space.base,
    paddingRight: space.base,
    borderRadius: radius.pill,
    backgroundColor: palette.night,
  },
  live: { width: 8, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.volt },
  copy: { flex: 1, gap: 1 },
  car: { width: 62, height: 30, opacity: 0.95 },
});
