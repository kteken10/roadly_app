import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Monogram, Text, Touchable } from '@/components/ui';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { brands, cars, features, priceBounds, priceHistogram } from '@/domain/catalog';
import type { SortKey } from '@/domain/types';
import { money } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { matches, useFleet } from '@/store/useFleet';
import { border, control, gutter, icon, palette, radius, shadow, space } from '@/theme';

const sorts: { key: SortKey; label: string }[] = [
  { key: 'nearest', label: 'Nearest' },
  { key: 'price-asc', label: 'Cheapest' },
  { key: 'price-desc', label: 'Premium' },
  { key: 'power', label: 'Fastest' },
];

export default function Filters() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const draft = useFleet((state) => state.draft);
  const toggleBrand = useFleet((state) => state.toggleDraftBrand);
  const toggleFeature = useFleet((state) => state.toggleDraftFeature);
  const setPriceRange = useFleet((state) => state.setDraftPriceRange);
  const setSort = useFleet((state) => state.setDraftSort);
  const applyDraft = useFleet((state) => state.applyDraft);
  const resetDraft = useFleet((state) => state.resetDraft);

  /** Live count — the sheet answers "how many?" before you commit to it. */
  const count = useMemo(() => cars.filter((car) => matches(car, draft)).length, [draft]);

  const activeTokens = [
    ...draft.brands.map((id) => ({ id, label: brands.find((b) => b.id === id)?.shortName ?? id, clear: () => toggleBrand(id) })),
    ...draft.features.map((id) => ({ id, label: features.find((f) => f.id === id)?.label ?? id, clear: () => toggleFeature(id) })),
    ...(draft.priceRange[0] !== priceBounds[0] || draft.priceRange[1] !== priceBounds[1]
      ? [{
          id: 'price',
          label: `${money(draft.priceRange[0])}–${money(draft.priceRange[1])}`,
          clear: () => setPriceRange(priceBounds),
        }]
      : []),
  ];

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text variant="title2">Filters</Text>
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Reset all filters"
            onPress={() => {
              haptic.warning();
              resetDraft();
            }}
            hitSlop={10}
          >
            <Text variant="callout" tone="secondary">
              Reset all
            </Text>
          </Touchable>
        </View>

        {activeTokens.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tokens}
          >
            {activeTokens.map((token) => (
              <Touchable
                key={token.id}
                accessibilityRole="button"
                accessibilityLabel={`Remove filter ${token.label}`}
                onPress={token.clear}
                haptics="select"
                scaleTo={0.92}
                hitSlop={(control.md - control.xs) / 2}
                style={styles.token}
              >
                <Text variant="caption">{token.label}</Text>
                <Icon name="xmark" size={icon.xs} color={palette.inkSecondary} />
              </Touchable>
            ))}
          </ScrollView>
        ) : null}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: 132 + insets.bottom }]}
      >
        <Section title="Brands">
          <View style={styles.brandGrid}>
            {brands.map((brand) => {
              const selected = draft.brands.includes(brand.id);
              return (
                <Touchable
                  key={brand.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={brand.name}
                  onPress={() => toggleBrand(brand.id)}
                  haptics="select"
                  scaleTo={0.95}
                  style={[styles.brandTile, selected && styles.brandTileSelected]}
                >
                  <Monogram letters={brand.monogram} size="lg" />
                  <Text variant="caption" numberOfLines={1}>
                    {brand.shortName}
                  </Text>
                  {selected ? (
                    <View style={styles.check}>
                      <Icon name="checkmark" size={icon.xs} color={palette.inkInverted} />
                    </View>
                  ) : null}
                </Touchable>
              );
            })}
          </View>
        </Section>

        <Section title="Price per hour">
          <RangeSlider
            min={priceBounds[0]}
            max={priceBounds[1]}
            value={draft.priceRange}
            onChange={setPriceRange}
            histogram={priceHistogram}
            step={5}
          />
          <View style={styles.priceInputs}>
            <View style={styles.priceInput}>
              <Text variant="caption" tone="tertiary">
                Min
              </Text>
              <Text variant="headline">{money(draft.priceRange[0])}</Text>
            </View>
            <View style={styles.priceDash} />
            <View style={styles.priceInput}>
              <Text variant="caption" tone="tertiary">
                Max
              </Text>
              <Text variant="headline">{money(draft.priceRange[1])}</Text>
            </View>
          </View>
        </Section>

        <Section title="Features">
          <View style={styles.featureWrap}>
            {features.map((feature) => {
              const selected = draft.features.includes(feature.id);
              return (
                <Touchable
                  key={feature.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={feature.label}
                  onPress={() => toggleFeature(feature.id)}
                  haptics="select"
                  scaleTo={0.94}
                  style={[styles.featurePill, selected && styles.featurePillSelected]}
                >
                  <Icon
                    name={feature.symbol}
                    size={icon.md}
                    color={selected ? palette.inkInverted : palette.ink}
                  />
                  <Text variant="caption" style={{ color: selected ? palette.inkInverted : palette.ink }}>
                    {feature.label}
                  </Text>
                </Touchable>
              );
            })}
          </View>
        </Section>

        <Section title="Sort by">
          <View style={styles.segment}>
            {sorts.map((sort) => {
              const selected = draft.sort === sort.key;
              return (
                <Touchable
                  key={sort.key}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={sort.label}
                  onPress={() => setSort(sort.key)}
                  haptics="select"
                  scaleTo={0.96}
                  hitSlop={(control.md - control.sm) / 2}
                  style={[styles.segmentItem, selected && styles.segmentItemSelected]}
                >
                  <Text variant="caption" style={{ color: selected ? palette.ink : palette.inkSecondary }}>
                    {sort.label}
                  </Text>
                </Touchable>
              );
            })}
          </View>
        </Section>
      </ScrollView>

      <Animated.View
        layout={LinearTransition}
        style={[styles.footer, { paddingBottom: (insets.bottom || space.lg) + space.sm }]}
      >
        <Button
          label={count === 0 ? 'No cars match' : `Show ${count} ${count === 1 ? 'car' : 'cars'}`}
          size="lg"
          full
          disabled={count === 0}
          onPress={() => {
            haptic.success();
            applyDraft();
            router.back();
          }}
        />
      </Animated.View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="title3">{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.canvas },
  header: {
    paddingTop: space.lg,
    paddingBottom: space.md,
    gap: space.md,
    backgroundColor: palette.surface,
    borderBottomWidth: border.hairline,
    borderBottomColor: palette.hairline,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: gutter,
  },
  tokens: { paddingHorizontal: gutter, gap: space.sm },
  token: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    height: control.xs,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: palette.surfaceSunken,
  },

  scroll: { paddingHorizontal: gutter, paddingTop: space.xl, gap: space.xxl },
  section: { gap: space.md },

  brandGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  brandTile: {
    width: '31.5%',
    aspectRatio: 1.12,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    borderWidth: border.thin,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    ...shadow.card,
  },
  brandTileSelected: { borderColor: palette.ink, backgroundColor: palette.surfaceSunken },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },

  priceInputs: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  priceInput: {
    flex: 1,
    gap: 2,
    paddingHorizontal: space.base,
    paddingVertical: space.md,
    borderRadius: radius.md,
    backgroundColor: palette.surfaceSunken,
  },
  priceDash: { width: 10, height: 1.5, backgroundColor: palette.inkQuaternary },

  featureWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    height: control.md,
    paddingHorizontal: space.base,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    borderWidth: border.hairline,
    borderColor: palette.hairline,
  },
  featurePillSelected: { backgroundColor: palette.ink, borderColor: palette.ink },

  segment: {
    flexDirection: 'row',
    padding: space.xs,
    borderRadius: radius.pill,
    backgroundColor: palette.surfaceSunken,
    gap: 2,
  },
  segmentItem: {
    flex: 1,
    height: control.sm,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemSelected: { backgroundColor: palette.surface, ...shadow.card },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: gutter,
    paddingTop: space.md,
    backgroundColor: palette.canvas,
    borderTopWidth: border.hairline,
    borderTopColor: palette.hairline,
  },
});
