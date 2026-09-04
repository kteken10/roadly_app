import { StyleSheet, View } from 'react-native';

import { Icon, Text, Touchable } from '@/components/ui';
import { cars, priceBounds } from '@/domain/catalog';
import { matches } from '@/store/useFleet';
import type { Filters } from '@/domain/types';
import { border, control, icon, palette, radius, shadow, space } from '@/theme';

export type Preset = {
  id: string;
  label: string;
  summary: { symbol: Parameters<typeof Icon>[0]['name']; text: string }[];
  filters: Filters;
};

export const presets: Preset[] = [
  {
    id: 'quick-escape',
    label: 'Quick escape',
    summary: [
      { symbol: 'figure.walk', text: '< 10 min' },
      { symbol: 'bolt.fill', text: 'Sport' },
    ],
    filters: {
      brands: [],
      priceRange: [priceBounds[0], 130],
      features: ['climate'],
      sort: 'nearest',
    },
  },
  {
    id: 'the-occasion',
    label: 'The occasion',
    summary: [
      { symbol: 'person.crop.circle.badge.checkmark', text: 'Chauffeur' },
      { symbol: 'star.fill', text: '5.0' },
    ],
    filters: {
      brands: [],
      priceRange: priceBounds,
      features: ['chauffeur'],
      sort: 'price-desc',
    },
  },
];

export type SavedFiltersProps = {
  onApply: (preset: Preset) => void;
};

/**
 * The dark "SAVED FILTERS" panel from the reference board, made functional:
 * each row shows the live count for that preset, so the number is a promise the
 * app actually keeps rather than decoration.
 */
export function SavedFilters({ onApply }: SavedFiltersProps) {
  return (
    <View style={[styles.card, shadow.card]}>
      <View style={styles.header}>
        <Text variant="overline" tone="invertedSoft">
          Saved filters
        </Text>
        <Icon name="ellipsis" size={icon.md} color={palette.inkOnNightSoft} />
      </View>

      {presets.map((preset, index) => {
        const count = cars.filter((car) => matches(car, preset.filters)).length;
        return (
          <Touchable
            key={preset.id}
            accessibilityRole="button"
            accessibilityLabel={`${preset.label}, ${count} offers. Apply filter`}
            onPress={() => onApply(preset)}
            haptics="press"
            scaleTo={0.985}
            style={[styles.row, index > 0 && styles.rowDivided]}
          >
            <View style={styles.rowCopy}>
              <Text variant="title3" tone="inverted">
                {count} {count === 1 ? 'offer' : 'offers'}
              </Text>
              <View style={styles.summary}>
                <Text variant="caption" tone="invertedSoft">
                  {preset.label}
                </Text>
                {preset.summary.map((item) => (
                  <View key={item.text} style={styles.summaryItem}>
                    <Icon name={item.symbol} size={icon.xs} color={palette.inkOnNightSoft} />
                    <Text variant="caption" tone="invertedSoft">
                      {item.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.go}>
              <Icon name="arrow.right" size={icon.md} color={palette.night} />
            </View>
          </Touchable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.night,
    borderRadius: radius.xl,
    paddingHorizontal: space.base,
    paddingTop: space.base,
    paddingBottom: space.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.base,
    paddingVertical: space.md,
  },
  rowDivided: {
    borderTopWidth: border.hairline,
    borderTopColor: palette.nightHairline,
  },
  rowCopy: { flex: 1, gap: 5 },
  summary: { flexDirection: 'row', alignItems: 'center', gap: space.md, flexWrap: 'wrap' },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  go: {
    width: control.sm,
    height: control.sm,
    borderRadius: control.sm / 2,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
