import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { glanceSpecs } from '@/components/cars/specs';
import { CityMap, RouteOverlay } from '@/components/map/CityMap';
import { Button, Icon, IconButton, PriceTag, SpecStrip, Text, Touchable } from '@/components/ui';
import { brandsById } from '@/domain/catalog';
import { distance } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { useContentBottomInset } from '@/lib/useContentInset';
import { selectCars, useFleet } from '@/store/useFleet';
import { border, control, gutter, icon, palette, radius, shadow, space } from '@/theme';

const YOU = { x: 0.2, y: 0.72 };

/**
 * The map tab.
 *
 * The Flutter build put a static map screenshot *behind* the detail screen,
 * where it was pure decoration. Here the map is its own destination: pins carry
 * price, selecting one lifts a card, and the walking route redraws to it.
 */
export default function Nearby() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const bottomInset = useContentBottomInset();

  const filters = useFleet((state) => state.filters);
  const list = selectCars(filters);
  const [selectedId, setSelectedId] = useState<string | null>(list[0]?.id ?? null);
  const selected = list.find((car) => car.id === selectedId) ?? null;

  return (
    <View style={styles.root}>
      <CityMap seed={0} style={[StyleSheet.absoluteFill, { height }]}>
        {selected ? <RouteOverlay from={YOU} to={selected.mapPosition} /> : null}
      </CityMap>

      {/* You */}
      <View style={[styles.you, { left: `${YOU.x * 100}%`, top: `${YOU.y * 100}%` }]} pointerEvents="none">
        <View style={styles.youHalo} />
        <View style={styles.youDot} />
      </View>

      {list.map((car) => {
        const isSelected = car.id === selectedId;
        return (
          <Animated.View
            key={car.id}
            entering={FadeIn.duration(300)}
            style={[
              styles.pinWrap,
              { left: `${car.mapPosition.x * 100}%`, top: `${car.mapPosition.y * 100}%` },
              isSelected && styles.pinWrapSelected,
            ]}
          >
            <Touchable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${car.fullName}, ${car.pricePerHour} dollars per hour`}
              onPress={() => {
                haptic.select();
                setSelectedId(car.id);
              }}
              haptics="none"
              scaleTo={0.9}
              hitSlop={(control.md - control.xs) / 2}
              style={[styles.pin, isSelected && styles.pinSelected, shadow.card]}
            >
              <Text
                variant="captionStrong"
                style={{ color: isSelected ? palette.inkInverted : palette.ink }}
              >
                ${car.pricePerHour}
              </Text>
            </Touchable>
            <View style={[styles.pinStem, isSelected && styles.pinStemSelected]} />
          </Animated.View>
        );
      })}

      <View style={[styles.chrome, { top: insets.top + space.sm }]} pointerEvents="box-none">
        <View style={styles.chromeCard}>
          <Icon name="mappin.and.ellipse" size={icon.md} color={palette.ink} />
          <Text variant="captionStrong">{list.length} cars nearby</Text>
        </View>
        <IconButton
          name="slider.horizontal.3"
          label="Filters"
          onPress={() => {
            useFleet.getState().syncDraft();
            router.push('/filters');
          }}
        />
      </View>

      {selected ? (
        <Animated.View
          key={selected.id}
          entering={FadeInDown.springify().damping(20)}
          exiting={FadeOutDown.duration(160)}
          style={[styles.sheet, { bottom: bottomInset + space.sm }]}
        >
          <Touchable
            accessibilityRole="button"
            accessibilityLabel={`Open ${selected.fullName}`}
            onPress={() => router.push(`/car/${selected.id}`)}
            haptics="press"
            scaleTo={0.98}
            style={[styles.card, shadow.lifted]}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardCopy}>
                <Text variant="overline" tone="tertiary">
                  {brandsById[selected.brandId].name}
                </Text>
                <Text variant="title3" numberOfLines={1}>
                  {selected.model}
                </Text>
                <Text variant="caption" tone="tertiary" numberOfLines={1}>
                  {distance(selected.distanceMeters)} · {selected.walkMinutes} min walk
                </Text>
              </View>
              <Image source={selected.image} style={styles.cardCar} contentFit="contain" />
            </View>

            <SpecStrip specs={glanceSpecs(selected)} size="sm" />

            <View style={styles.cardFooter}>
              <PriceTag value={selected.pricePerHour} size="sm" hideCents />
              <Button label="Book now" size="sm" onPress={() => router.push(`/book/${selected.id}`)} />
            </View>
          </Touchable>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.mist },

  you: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  youHalo: {
    position: 'absolute',
    width: 46,
    height: control.md,
    borderRadius: 23,
    backgroundColor: 'rgba(14,15,17,0.08)',
  },
  youDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: palette.ink,
    borderWidth: border.ring,
    borderColor: palette.surface,
  },

  pinWrap: { position: 'absolute', alignItems: 'center', marginLeft: -26, marginTop: -34 },
  pinWrapSelected: { zIndex: 2 },
  pin: {
    height: control.xs,
    minWidth: 52,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinSelected: { backgroundColor: palette.ink },
  pinStem: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: space.xs,
    backgroundColor: palette.surface,
    borderWidth: border.ring,
    borderColor: palette.hairlineStrong,
  },
  pinStemSelected: { backgroundColor: palette.ink, borderColor: palette.surface },

  chrome: {
    position: 'absolute',
    left: gutter,
    right: gutter,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chromeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    height: control.md,
    paddingHorizontal: space.base,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    ...shadow.card,
  },

  sheet: { position: 'absolute', left: gutter, right: gutter },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: space.base,
    gap: space.md,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  cardCopy: { flex: 1, gap: 2 },
  cardCar: { width: 118, height: 60 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
