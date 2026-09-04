import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { SFSymbol } from 'expo-symbols';

import { Icon } from './Icon';
import { Text } from './Text';
import { iconFor, palette, space, type Variant } from '@/theme';

export type Spec = {
  symbol: SFSymbol;
  /** Empty string renders the glyph alone, as a capability marker. */
  value?: string;
};

export type SpecStripProps = {
  specs: Spec[];
  inverted?: boolean;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
};

/**
 * The compact "228 km · 4 min · ❄ · ⚡" line from the reference cards.
 *
 * Glyph size is read from `iconFor` rather than chosen locally, so the icon's
 * optical weight always matches the label beside it. The gap between a glyph
 * and its own value is deliberately tighter than the gap between two specs —
 * that difference is what makes the row parse as pairs instead of a queue.
 */
export function SpecStrip({ specs, inverted, size = 'md', style }: SpecStripProps) {
  const variant: Variant = size === 'sm' ? 'caption' : 'callout';
  const ink = inverted ? palette.inkOnNight : palette.inkSecondary;

  return (
    <View style={[styles.row, style]}>
      {specs.map((spec) => (
        <View key={`${spec.symbol}-${spec.value ?? ''}`} style={styles.item}>
          <Icon name={spec.symbol} size={iconFor[variant]} color={ink} weight="semibold" />
          {spec.value ? (
            <Text variant={variant} style={{ color: ink }} numberOfLines={1}>
              {spec.value}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, flexWrap: 'nowrap' },
  item: { flexDirection: 'row', alignItems: 'center', gap: space.xs + 1 },
});
