import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';

import { palette, type as typeScale, type Variant } from '@/theme';

type Tone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'inverted'
  | 'invertedSoft'
  | 'invertedFaint'
  | 'live'
  | 'positive';

/**
 * Seven ink tones and no others. The three inverted ones exist so text on the
 * night surfaces has the same three-step hierarchy as text on white — without
 * them, dark cards drift toward a flat single-weight grey.
 */
const tones: Record<Tone, string> = {
  primary: palette.ink,
  secondary: palette.inkSecondary,
  tertiary: palette.inkTertiary,
  quaternary: palette.inkQuaternary,
  inverted: palette.inkInverted,
  invertedSoft: palette.inkOnNight,
  invertedFaint: palette.inkOnNightSoft,
  live: palette.live,
  positive: palette.positive,
};

export type TextProps = RNTextProps & {
  variant?: Variant;
  tone?: Tone;
  /** Optical centring helper for single-line labels inside pills. */
  center?: boolean;
};

export function Text({ variant = 'body', tone = 'primary', center, style, ...rest }: TextProps) {
  return (
    <RNText
      {...rest}
      style={[typeScale[variant], { color: tones[tone] }, center && styles.center, style]}
    />
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
});
