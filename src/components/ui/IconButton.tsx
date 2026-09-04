import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { SFSymbol } from 'expo-symbols';

import { Icon } from './Icon';
import { Text } from './Text';
import { Touchable } from './Touchable';
import { border, control, icon as iconScale, palette, shadow, space } from '@/theme';

type Tone = 'surface' | 'sunken' | 'night' | 'veil';

const tones: Record<Tone, string> = {
  surface: palette.surface,
  sunken: palette.surfaceSunken,
  night: palette.night,
  veil: palette.veil,
};

const inks: Record<Tone, string> = {
  surface: palette.ink,
  sunken: palette.ink,
  night: palette.inkInverted,
  veil: palette.ink,
};

type Size = 'sm' | 'md';

/**
 * Two sizes only. The glyph is a fixed value from the icon scale rather than a
 * ratio of the button — a ratio produced 18.48pt icons, which land between
 * pixel grid positions and render a half-step blurry.
 */
const sizes: Record<Size, { box: number; glyph: number }> = {
  sm: { box: control.sm, glyph: iconScale.sm },
  md: { box: control.md, glyph: iconScale.lg },
};

export type IconButtonProps = {
  name: SFSymbol;
  /** Spoken label. Required — an icon alone is never self-describing. */
  label: string;
  onPress?: () => void;
  size?: Size;
  tone?: Tone;
  /** Small count rendered as a badge — used by the filter entry point. */
  badge?: number;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  name,
  label,
  onPress,
  size = 'md',
  tone = 'surface',
  badge,
  elevated = true,
  style,
}: IconButtonProps) {
  const metrics = sizes[size];

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      scaleTo={0.92}
      hitSlop={size === 'sm' ? (control.md - control.sm) / 2 : undefined}
      style={[
        styles.base,
        {
          backgroundColor: tones[tone],
          width: metrics.box,
          height: metrics.box,
          borderRadius: metrics.box / 2,
        },
        elevated && shadow.card,
        style,
      ]}
    >
      <Icon name={name} size={metrics.glyph} color={inks[tone]} />

      {typeof badge === 'number' && badge > 0 ? (
        <View style={styles.badge}>
          <Text variant="overline" tone="inverted" style={styles.badgeLabel}>
            {badge > 9 ? '9+' : badge}
          </Text>
        </View>
      ) : null}
    </Touchable>
  );
}

const BADGE = 18;

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: -border.ring,
    right: -border.ring,
    minWidth: BADGE,
    height: BADGE,
    paddingHorizontal: space.xs,
    borderRadius: BADGE / 2,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: border.ring,
    borderColor: palette.surface,
  },
  /** The overline's uppercase tracking would push a single digit off-centre. */
  badgeLabel: { letterSpacing: 0 },
});
