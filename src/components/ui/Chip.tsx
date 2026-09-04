import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import type { SFSymbol } from 'expo-symbols';

import { Icon } from './Icon';
import { Text } from './Text';
import { Touchable } from './Touchable';
import { border, control, icon, motion, palette, radius, space } from '@/theme';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  symbol?: SFSymbol;
  /** Rendered before the label — used for brand monograms. */
  leading?: ReactNode;
  compact?: boolean;
};

/**
 * The selected state animates its background rather than swapping it, so a
 * filter row reads as one continuous control instead of a set of toggles.
 *
 * Side padding differs by content: a chip carrying a leading mark gets less
 * left padding, because the mark's own bounding box already supplies optical
 * space. Without that correction, monogram chips look inset next to plain ones.
 */
export function Chip({ label, selected = false, onPress, symbol, leading, compact }: ChipProps) {
  const surface = useAnimatedStyle(() => ({
    backgroundColor: withTiming(selected ? palette.ink : palette.surface, {
      duration: motion.duration.base,
    }),
    borderColor: withTiming(selected ? palette.ink : palette.hairline, {
      duration: motion.duration.base,
    }),
  }));

  const ink = selected ? palette.inkInverted : palette.ink;

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      haptics="select"
      scaleTo={0.95}
      hitSlop={compact ? (control.md - control.sm) / 2 : undefined}
    >
      <Animated.View
        style={[styles.base, compact && styles.compact, leading ? styles.withLeading : null, surface]}
      >
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        {symbol ? <Icon name={symbol} size={icon.sm} color={ink} /> : null}
        <Text variant="callout" style={{ color: ink }}>
          {label}
        </Text>
      </Animated.View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    height: control.md,
    paddingHorizontal: space.base,
    borderRadius: radius.pill,
    borderWidth: border.thin,
  },
  compact: { height: control.sm, paddingHorizontal: space.md },
  withLeading: { paddingLeft: space.tight },
  leading: { marginRight: -space.xxs },
});
