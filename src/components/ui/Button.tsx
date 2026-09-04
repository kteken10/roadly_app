import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { SFSymbol } from 'expo-symbols';

import { Icon } from './Icon';
import { Text } from './Text';
import { Touchable } from './Touchable';
import { control, icon, palette, radius, shadow, space, type Variant } from '@/theme';

type Tone = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Tone;
  size?: Size;
  symbol?: SFSymbol;
  symbolPosition?: 'leading' | 'trailing';
  loading?: boolean;
  disabled?: boolean;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
};

const surfaces: Record<Tone, ViewStyle> = {
  primary: { backgroundColor: palette.ink },
  secondary: { backgroundColor: palette.surfaceSunken },
  ghost: { backgroundColor: 'transparent' },
  onDark: { backgroundColor: palette.surface },
  danger: { backgroundColor: palette.blushDeep },
};

const inks: Record<Tone, string> = {
  primary: palette.inkInverted,
  secondary: palette.ink,
  ghost: palette.ink,
  onDark: palette.ink,
  danger: palette.live,
};

/**
 * Three sizes drawn straight from the control scale, each with the padding that
 * keeps its label optically centred in the pill: shorter buttons need
 * proportionally more side padding, or the label reads as crammed against the
 * curve.
 */
const sizes: Record<Size, { height: number; paddingHorizontal: number; label: Variant; glyph: number }> = {
  sm: { height: control.sm, paddingHorizontal: space.base, label: 'callout', glyph: icon.sm },
  md: { height: control.md, paddingHorizontal: space.lg, label: 'callout', glyph: icon.md },
  lg: { height: control.lg, paddingHorizontal: space.xl, label: 'bodyStrong', glyph: icon.md },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  symbol,
  symbolPosition = 'leading',
  loading,
  disabled,
  full,
  style,
}: ButtonProps) {
  const metrics = sizes[size];
  const ink = inks[variant];

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={onPress}
      disabled={disabled || loading}
      scaleTo={0.96}
      haptics={variant === 'primary' ? 'press' : 'tap'}
      /** `sm` sits below the 44pt target, so it borrows the difference. */
      hitSlop={size === 'sm' ? (control.md - control.sm) / 2 : undefined}
      style={[
        styles.base,
        surfaces[variant],
        { height: metrics.height, paddingHorizontal: metrics.paddingHorizontal },
        variant === 'primary' && shadow.card,
        full && styles.full,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={ink} size="small" />
      ) : (
        <View style={styles.row}>
          {symbol && symbolPosition === 'leading' ? (
            <Icon name={symbol} size={metrics.glyph} color={ink} />
          ) : null}
          <Text variant={metrics.label} style={{ color: ink }}>
            {label}
          </Text>
          {symbol && symbolPosition === 'trailing' ? (
            <Icon name={symbol} size={metrics.glyph} color={ink} />
          ) : null}
        </View>
      )}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  full: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
});
