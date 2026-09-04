import { StyleSheet, Text as RNText, View, type StyleProp, type ViewStyle } from 'react-native';

import { fontFamily, palette, radius } from '@/theme';

type Size = 'sm' | 'md' | 'lg';

/**
 * Monograms sit outside the type scale on purpose: the letterform *is* the
 * graphic here, so it is sized to its tile rather than to a text variant.
 * `lineHeight` is pinned to the tile height and `includeFontPadding` disabled,
 * which is what stops one- and two-letter marks from sitting at different
 * optical heights.
 */
const sizes: Record<Size, { box: number; single: number; double: number; radius: number }> = {
  sm: { box: 26, single: 12, double: 9.5, radius: radius.xs },
  md: { box: 32, single: 15, double: 11.5, radius: radius.xs },
  lg: { box: 40, single: 19, double: 14.5, radius: radius.sm },
};

export type MonogramProps = {
  /** One or two letters — "B", "RR". */
  letters: string;
  size?: Size;
  /** On a dark or selected surface. */
  inverted?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Brand marks are typographic on purpose. Mixing real manufacturer logos of
 * wildly different weights and silhouettes was the single ugliest thing in the
 * original filter row; a consistent monogram set reads as a house style and
 * sidesteps the trademark question entirely.
 */
export function Monogram({ letters, size = 'sm', inverted, style }: MonogramProps) {
  const metrics = sizes[size];
  const fontSize = letters.length > 1 ? metrics.double : metrics.single;

  return (
    <View
      style={[
        styles.base,
        {
          width: metrics.box,
          height: metrics.box,
          borderRadius: metrics.radius,
          backgroundColor: inverted ? 'rgba(255,255,255,0.16)' : palette.surfaceSunken,
        },
        style,
      ]}
    >
      <RNText
        allowFontScaling={false}
        style={[
          styles.letters,
          {
            fontSize,
            lineHeight: metrics.box,
            color: inverted ? palette.inkInverted : palette.ink,
          },
        ]}
      >
        {letters.toUpperCase()}
      </RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  letters: {
    fontFamily: fontFamily.extrabold,
    letterSpacing: 0.2,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
