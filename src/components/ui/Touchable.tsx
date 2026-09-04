import { forwardRef } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { haptic } from '@/lib/haptics';
import { motion } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type TouchableProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** How far the surface sinks on press. Larger surfaces move less. */
  scaleTo?: number;
  /** Slight dim on press, for surfaces that are too big to read a scale change. */
  dimTo?: number;
  haptics?: keyof typeof haptic | 'none';
};

/**
 * The single pressable primitive. Every tappable surface in the app routes
 * through here so press physics and haptic vocabulary stay identical
 * everywhere — the thing that separates a native-feeling app from a web one.
 */
export const Touchable = forwardRef<never, TouchableProps>(function Touchable(
  { style, scaleTo = 0.97, dimTo = 1, haptics = 'tap', onPressIn, disabled, ...rest },
  ref,
) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - (1 - scaleTo) * pressed.value, motion.press) }],
    opacity: withSpring(1 - (1 - dimTo) * pressed.value, motion.press),
  }));

  return (
    <AnimatedPressable
      ref={ref as never}
      {...rest}
      disabled={disabled}
      onPressIn={(event) => {
        pressed.value = 1;
        if (haptics !== 'none' && !disabled) haptic[haptics]();
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.value = 0;
        rest.onPressOut?.(event);
      }}
      style={[style, animatedStyle, disabled && { opacity: 0.4 }]}
    />
  );
});
