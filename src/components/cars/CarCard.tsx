import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { glanceSpecs } from './specs';
import { Icon, Monogram, PriceTag, SpecStrip, Text, Touchable } from '@/components/ui';
import { brandsById } from '@/domain/catalog';
import type { Car } from '@/domain/types';
import { distance } from '@/lib/format';
import { control, icon, palette, radius, shadow, space, type Variant } from '@/theme';

const plates = {
  blush: palette.blush,
  sand: palette.sand,
  mist: palette.mist,
  sage: palette.sage,
} as const;

/**
 * Two densities, and the plate is the only thing that changes between them.
 * Everything below it — padding, gaps, type — stays identical, so a featured
 * card reads as the same object seen closer rather than as a second component.
 */
const densities: Record<'list' | 'featured', { plate: number; car: number; title: Variant }> = {
  list: { plate: 152, car: 0.62, title: 'title3' },
  featured: { plate: 188, car: 0.6, title: 'title2' },
};

export type CarCardProps = {
  car: Car;
  onPress: () => void;
  onToggleSave?: () => void;
  saved?: boolean;
  /** Taller plate and a larger title — used for the nearest car. */
  featured?: boolean;
  eyebrow?: string;
  index?: number;
};

export function CarCard({
  car,
  onPress,
  onToggleSave,
  saved,
  featured = false,
  eyebrow,
  index = 0,
}: CarCardProps) {
  const brand = brandsById[car.brandId];
  const density = densities[featured ? 'featured' : 'list'];

  return (
    <Animated.View entering={FadeIn.delay(index * 60).duration(320)}>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={`${car.fullName}, ${car.pricePerHour} dollars per hour, ${car.walkMinutes} minutes away`}
        onPress={onPress}
        haptics="press"
        scaleTo={0.985}
        style={[styles.card, shadow.card]}
      >
        <View style={[styles.plate, { height: density.plate, backgroundColor: plates[car.pigment] }]}>
          <View style={styles.plateHeader}>
            {eyebrow ? (
              <Text variant="overline" tone="secondary">
                {eyebrow}
              </Text>
            ) : (
              <Monogram letters={brand.monogram} size="sm" />
            )}

            {onToggleSave ? (
              <Touchable
                accessibilityRole="button"
                accessibilityLabel={saved ? `Remove ${car.fullName} from saved` : `Save ${car.fullName}`}
                accessibilityState={{ selected: saved }}
                onPress={onToggleSave}
                haptics="select"
                scaleTo={0.86}
                hitSlop={(control.md - control.xs) / 2}
                style={styles.save}
              >
                <Icon
                  name={saved ? 'bookmark.fill' : 'bookmark'}
                  size={icon.sm}
                  color={saved ? palette.ink : palette.inkSecondary}
                />
              </Touchable>
            ) : null}
          </View>

          <Image
            source={car.image}
            style={[styles.car, { height: density.plate * density.car }]}
            contentFit="contain"
            transition={220}
            accessibilityIgnoresInvertColors
          />
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.titles}>
              <Text variant={density.title} numberOfLines={1}>
                {car.fullName}
              </Text>
              <Text variant="caption" tone="tertiary" numberOfLines={1}>
                {car.year} · {distance(car.distanceMeters)} away · {car.pickup}
              </Text>
            </View>
            {/* Nudged down so the price cap-height meets the title's, not its box. */}
            <View style={styles.price}>
              <PriceTag value={car.pricePerHour} size="sm" hideCents />
            </View>
          </View>

          <SpecStrip specs={glanceSpecs(car)} size="sm" />
        </View>
      </Touchable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  plate: {
    paddingHorizontal: space.base,
    paddingTop: space.base,
  },
  plateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: control.xs,
    zIndex: 2,
  },
  save: {
    width: control.xs,
    height: control.xs,
    borderRadius: control.xs / 2,
    backgroundColor: palette.veilSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /**
   * The cutout overhangs the bottom of its plate by one rung. Sitting flush
   * makes it look pasted on; a small overlap reads as depth.
   */
  car: {
    position: 'absolute',
    left: space.base,
    right: space.base,
    bottom: space.sm,
    width: undefined,
  },
  body: {
    paddingHorizontal: space.base,
    paddingTop: space.md,
    paddingBottom: space.base,
    gap: space.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.md,
  },
  titles: { flex: 1, gap: space.xxs },
  price: { paddingTop: space.xxs },
});
