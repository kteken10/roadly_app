import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { haptic } from '@/lib/haptics';
import { border, motion, palette, shadow, space } from '@/theme';

/**
 * The thumb is 28 rather than the 44pt touch minimum because a fat thumb hides
 * the histogram it is meant to be read against. The shortfall is repaid with
 * hitSlop, which costs nothing visually.
 */
const THUMB = 28;
const THUMB_SLOP = 10;

export type RangeSliderProps = {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  /** Normalised 0–1 bars drawn behind the track, showing where supply sits. */
  histogram?: number[];
  step?: number;
};

/**
 * Dual-thumb price slider with a supply histogram behind it.
 *
 * Written by hand rather than pulled from a package: the gesture runs entirely
 * on the UI thread, so the thumbs track your finger at display refresh rate
 * even while the results count is recomputing on the JS thread. It also fires a
 * selection haptic on every whole-dollar step, which is the detail that makes
 * it feel like a system control.
 */
export function RangeSlider({ min, max, value, onChange, histogram, step = 1 }: RangeSliderProps) {
  const [width, setWidth] = useState(0);
  const usable = Math.max(width - THUMB, 1);

  const lo = useSharedValue(0);
  const hi = useSharedValue(0);
  const dragging = useSharedValue(0);

  const toX = useCallback(
    (v: number) => ((v - min) / (max - min)) * usable,
    [min, max, usable],
  );

  const commit = useCallback(
    (loX: number, hiX: number) => {
      const toValue = (x: number) => Math.round((min + (x / usable) * (max - min)) / step) * step;
      onChange([toValue(loX), toValue(hiX)]);
    },
    [min, max, usable, step, onChange],
  );

  useEffect(() => {
    if (width === 0 || dragging.value) return;
    lo.value = withSpring(toX(value[0]), motion.standard);
    hi.value = withSpring(toX(value[1]), motion.standard);
  }, [value, width, toX, lo, hi, dragging]);

  const loStart = useSharedValue(0);
  const hiStart = useSharedValue(0);

  const makeGesture = (thumb: 'lo' | 'hi') => {
    const target = thumb === 'lo' ? lo : hi;
    const start = thumb === 'lo' ? loStart : hiStart;

    return Gesture.Pan()
      .minDistance(0)
      .onBegin(() => {
        dragging.value = 1;
        start.value = target.value;
        runOnJS(haptic.tap)();
      })
      .onUpdate((event) => {
        const next =
          thumb === 'lo'
            ? clamp(start.value + event.translationX, 0, hi.value)
            : clamp(start.value + event.translationX, lo.value, usable);

        if (Math.abs(next - target.value) > usable / ((max - min) / step)) {
          runOnJS(haptic.select)();
        }
        target.value = next;
        runOnJS(commit)(lo.value, hi.value);
      })
      .onFinalize(() => {
        dragging.value = 0;
        runOnJS(haptic.tap)();
      });
  };

  const loGesture = makeGesture('lo');
  const hiGesture = makeGesture('hi');

  const loStyle = useAnimatedStyle(() => ({ transform: [{ translateX: lo.value }] }));
  const hiStyle = useAnimatedStyle(() => ({ transform: [{ translateX: hi.value }] }));
  const fillStyle = useAnimatedStyle(() => ({
    left: lo.value + THUMB / 2,
    width: Math.max(hi.value - lo.value, 0),
  }));

  return (
    <View style={styles.root} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {histogram ? (
        <View style={styles.histogram} pointerEvents="none">
          {histogram.map((bar, index) => (
            <View
              key={index}
              style={[styles.bar, { height: 6 + bar * 34 }]}
            />
          ))}
        </View>
      ) : null}

      <View style={styles.track} />
      <Animated.View style={[styles.fill, fillStyle]} />

      <GestureDetector gesture={loGesture}>
        <Animated.View
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="Minimum price per hour"
          accessibilityValue={{ min, max, now: value[0] }}
          style={[styles.thumb, shadow.card, loStyle]}
          hitSlop={THUMB_SLOP}
        />
      </GestureDetector>

      <GestureDetector gesture={hiGesture}>
        <Animated.View
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="Maximum price per hour"
          accessibilityValue={{ min, max, now: value[1] }}
          style={[styles.thumb, shadow.card, hiStyle]}
          hitSlop={THUMB_SLOP}
        />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { height: 60, justifyContent: 'flex-end' },
  histogram: {
    position: 'absolute',
    left: THUMB / 2,
    right: THUMB / 2,
    bottom: THUMB / 2 + space.xs,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bar: { flex: 1, marginHorizontal: 1, borderRadius: 1, backgroundColor: palette.hairlineStrong },
  track: {
    position: 'absolute',
    left: THUMB / 2,
    right: THUMB / 2,
    bottom: THUMB / 2 - 1,
    height: 2,
    borderRadius: 1,
    backgroundColor: palette.hairlineStrong,
  },
  fill: {
    position: 'absolute',
    bottom: THUMB / 2 - 1,
    height: 2,
    borderRadius: 1,
    backgroundColor: palette.ink,
  },
  thumb: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: palette.ink,
    borderWidth: border.ring,
    borderColor: palette.surface,
  },
});
