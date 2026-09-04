import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  clamp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { SFSymbol } from 'expo-symbols';

import { Icon } from './Icon';
import { Text } from './Text';
import { haptic } from '@/lib/haptics';
import { absoluteFill, control, icon, motion, palette, radius, shadow, space } from '@/theme';

/** Knob inset by one spacing rung on each side, so the gap reads as intentional. */
const HEIGHT = control.xl;
const INSET = space.xs;
const KNOB = HEIGHT - INSET * 2;

export type SlideToConfirmProps = {
  label: string;
  confirmedLabel: string;
  symbol: SFSymbol;
  onConfirm: () => void;
  confirmed?: boolean;
};

/**
 * Slide-to-confirm, not tap-to-confirm.
 *
 * Unlocking a car is physical and irreversible-feeling, and a tap target is a
 * poor match for that: it is too easy to fire by accident in a pocket, and it
 * gives the moment no weight. The drag costs the user half a second and buys
 * back both intent and drama.
 */
export function SlideToConfirm({
  label,
  confirmedLabel,
  symbol,
  onConfirm,
  confirmed = false,
}: SlideToConfirmProps) {
  const [width, setWidth] = useState(0);
  const travel = Math.max(width - KNOB - INSET * 2, 1);
  const x = useSharedValue(0);
  const start = useSharedValue(0);

  const fire = () => {
    haptic.thud();
    onConfirm();
  };

  const gesture = Gesture.Pan()
    .enabled(!confirmed)
    .minDistance(0)
    .onBegin(() => {
      start.value = x.value;
    })
    .onUpdate((event) => {
      x.value = clamp(start.value + event.translationX, 0, travel);
    })
    .onEnd(() => {
      if (x.value > travel * 0.82) {
        x.value = withSpring(travel, motion.standard);
        runOnJS(fire)();
      } else {
        x.value = withSpring(0, motion.standard);
      }
    });

  const knobStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const fillStyle = useAnimatedStyle(() => ({ width: x.value + KNOB + INSET * 2 }));
  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(x.value, [0, travel * 0.6], [1, 0], Extrapolation.CLAMP),
  }));

  if (confirmed) {
    return (
      <View style={[styles.track, styles.confirmed]}>
        <Icon name="checkmark" size={icon.md} color={palette.inkInverted} />
        <Text variant="headline" tone="inverted">
          {confirmedLabel}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={styles.track}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityHint="Swipe right to confirm"
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={fire}
    >
      <Animated.View style={[styles.fill, fillStyle]} pointerEvents="none" />

      <Animated.View style={[styles.labelWrap, labelStyle]} pointerEvents="none">
        <Text variant="headline" tone="inverted">
          {label}
        </Text>
        <Icon name="chevron.right" size={icon.sm} color={palette.inkOnNightSoft} />
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.knob, shadow.card, knobStyle]}>
          <Icon name={symbol} size={icon.lg} color={palette.ink} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: palette.night,
    justifyContent: 'center',
    paddingHorizontal: INSET,
    overflow: 'hidden',
  },
  confirmed: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  labelWrap: {
    ...absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
