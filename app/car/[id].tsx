import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { detailSpecs } from '@/components/cars/specs';
import { CityMap, RouteOverlay } from '@/components/map/CityMap';
import {
  Button,
  Icon,
  IconButton,
  Monogram,
  PriceTag,
  Surface,
  Text,
  Touchable,
} from '@/components/ui';
import { brandsById, carsById, featuresById } from '@/domain/catalog';
import { distance } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { useFleet } from '@/store/useFleet';
import { control, gutter, icon, palette, radius, shadow, space } from '@/theme';

const HERO_HEIGHT = 380;

const pigments = {
  blush: palette.blush,
  sand: palette.sand,
  mist: palette.mist,
  sage: palette.sage,
} as const;

export default function CarDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const saved = useFleet((state) => state.saved);
  const toggleSaved = useFleet((state) => state.toggleSaved);

  const car = carsById[id ?? ''];

  if (!car) {
    return (
      <View style={styles.missing}>
        <Text variant="title3">That car is no longer listed</Text>
        <Button label="Back to the fleet" onPress={() => router.back()} style={styles.missingCta} />
      </View>
    );
  }

  const brand = brandsById[car.brandId];
  const isSaved = saved.includes(car.id);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  /** Rubber-band the hero on overscroll, the way a native photo header behaves. */
  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-200, 0, HERO_HEIGHT], [-100, 0, HERO_HEIGHT * 0.4], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, [-200, 0], [1.25, 1], Extrapolation.CLAMP) },
    ],
  }));

  const carStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-160, 0, 200], [-30, 0, 60], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, [-160, 0], [1.1, 1], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(scrollY.value, [120, 260], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <Animated.View style={[styles.hero, { backgroundColor: pigments[car.pigment] }, heroStyle]}>
        <View style={styles.heroGlow} />
        <Animated.View style={carStyle} entering={FadeIn.duration(340)}>
          <Image
            source={car.image}
            style={styles.heroCar}
            contentFit="contain"
            transition={260}
            accessibilityIgnoresInvertColors
          />
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 132 }}
      >
        <View style={{ height: HERO_HEIGHT - 34 }} pointerEvents="none" />

        <View style={styles.sheet}>
          <Animated.View entering={FadeInDown.delay(80).springify().damping(22)} style={styles.identity}>
            <View style={styles.identityRow}>
              <Monogram letters={brand.monogram} size="lg" />
              <View style={styles.identityCopy}>
                <Text variant="title1">{car.model}</Text>
                <Text variant="caption" tone="tertiary">
                  {brand.name} · {car.year} · {brand.country}
                </Text>
              </View>
            </View>
            <Text variant="body" tone="secondary">
              {car.tagline}
            </Text>
          </Animated.View>

          {/* Specs — the descendant of the Flutter four-column CarItems row. */}
          <Surface radiusSize="lg" padding="none" style={styles.specGrid}>
            {detailSpecs(car).map((spec) => (
              <View key={spec.label} style={styles.specCell}>
                <Text variant="title3">{spec.value}</Text>
                <Text variant="caption" tone="tertiary">
                  {spec.label}
                </Text>
              </View>
            ))}
          </Surface>

          <Section title="Features">
            <View style={styles.features}>
              {car.features.map((featureId) => {
                const feature = featuresById[featureId];
                return (
                  <Surface key={feature.id} radiusSize="md" padding="tight" style={styles.feature}>
                    <Icon name={feature.symbol} size={icon.lg} color={palette.ink} />
                    <View style={styles.featureCopy}>
                      <Text variant="callout" numberOfLines={1}>
                        {feature.label}
                      </Text>
                      <Text variant="caption" tone="tertiary" numberOfLines={1}>
                        {feature.detail}
                      </Text>
                    </View>
                  </Surface>
                );
              })}
            </View>
          </Section>

          <Section title="Where it is parked">
            <Touchable
              accessibilityRole="button"
              accessibilityLabel={`Open map. ${car.pickup}, ${car.walkMinutes} minutes walk`}
              onPress={() => router.navigate('/(tabs)/nearby')}
              scaleTo={0.98}
              style={[styles.mapCard, shadow.card]}
            >
              <CityMap seed={1} style={StyleSheet.absoluteFill}>
                <RouteOverlay from={{ x: 0.24, y: 0.68 }} to={{ x: car.mapPosition.x, y: car.mapPosition.y }} />
              </CityMap>
              <View style={styles.mapFooter}>
                <View style={styles.mapPill}>
                  <Icon name="figure.walk" size={icon.sm} color={palette.inkInverted} />
                  <Text variant="captionStrong" tone="inverted">
                    {car.walkMinutes} min
                  </Text>
                </View>
                <View style={styles.mapCopy}>
                  <Text variant="callout">{car.pickup}</Text>
                  <Text variant="caption" tone="tertiary">
                    {distance(car.distanceMeters)} from you
                  </Text>
                </View>
              </View>
            </Touchable>
          </Section>

          {car.chauffeur ? (
            <Section title="Your chauffeur">
              <View style={[styles.chauffeur, shadow.card]}>
                <Image source={car.chauffeur.avatar} style={styles.chauffeurAvatar} contentFit="cover" />
                <View style={styles.chauffeurCopy}>
                  <Text variant="headline">{car.chauffeur.name}</Text>
                  <Text variant="caption" tone="tertiary">
                    License {car.chauffeur.license}
                  </Text>
                  <View style={styles.chauffeurStats}>
                    <View style={styles.stat}>
                      <Icon name="star.fill" size={icon.sm} color={palette.ink} />
                      <Text variant="captionStrong">{car.chauffeur.rating.toFixed(1)}</Text>
                    </View>
                    <Text variant="caption" tone="tertiary">
                      {car.chauffeur.trips} rides
                    </Text>
                  </View>
                </View>
                <IconButton
                  name="phone.fill"
                  label={`Call ${car.chauffeur.name}`}
                  tone="sunken"
                  elevated={false}
                  onPress={() => haptic.tap()}
                />
              </View>
            </Section>
          ) : null}

          <Section title="Good to know">
            <View style={styles.notes}>
              {[
                { symbol: 'shield.lefthalf.filled' as const, text: 'Insurance and roadside assistance included for the full rental.' },
                { symbol: 'fuelpump.fill' as const, text: 'Return with the same range you found. Refuelling is on us below 10%.' },
                { symbol: 'person.2.fill' as const, text: `Seats ${car.seats}. Additional drivers can be added before you unlock.` },
              ].map((note) => (
                <View key={note.text} style={styles.note}>
                  <Icon name={note.symbol} size={icon.md} color={palette.inkTertiary} />
                  <Text variant="caption" tone="secondary" style={styles.noteText}>
                    {note.text}
                  </Text>
                </View>
              ))}
            </View>
          </Section>
        </View>
      </Animated.ScrollView>

      {/* Floating chrome — sits above the hero, never scrolls away. */}
      <View style={[styles.chrome, { top: insets.top + space.sm }]} pointerEvents="box-none">
        <IconButton
          name="arrow.left"
          label="Back"
          tone="veil"
          onPress={() => router.back()}
        />
        <View style={styles.chromeRight}>
          <IconButton
            name={isSaved ? 'bookmark.fill' : 'bookmark'}
            label={isSaved ? 'Remove from saved' : 'Save this car'}
            tone="veil"
            onPress={() => toggleSaved(car.id)}
          />
          <IconButton name="ellipsis" label="More options" tone="veil" onPress={() => haptic.tap()} />
        </View>
      </View>

      {/* Booking bar — the one thing that is always reachable with a thumb. */}
      <Animated.View
        entering={FadeInDown.delay(160).springify().damping(20)}
        style={[styles.bookBar, { paddingBottom: insets.bottom || space.lg }]}
      >
        <View style={[styles.bookBarInner, shadow.lifted]}>
          <View style={styles.bookPrice}>
            <PriceTag value={car.pricePerHour} size="md" hideCents />
            <Text variant="caption" tone="tertiary">
              Billed by the minute
            </Text>
          </View>
          <Button label="Book now" size="lg" onPress={() => router.push(`/book/${car.id}`)} />
        </View>
      </Animated.View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="overline" tone="tertiary">
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.canvas },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.base },
  missingCta: { alignSelf: 'center' },

  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: palette.inkOnNightSoft,
  },
  heroCar: { width: 330, height: 200 },

  sheet: {
    backgroundColor: palette.canvas,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: gutter,
    paddingTop: space.xl,
    gap: space.xl,
    minHeight: 600,
  },
  identity: { gap: space.md },
  identityRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  identityCopy: { flex: 1, gap: 3 },

  specGrid: { flexDirection: 'row', paddingVertical: space.base },
  specCell: { flex: 1, alignItems: 'center', gap: 3 },

  section: { gap: space.md },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  feature: { flexDirection: 'row', alignItems: 'center', gap: space.sm, width: '48.4%' },
  featureCopy: { flex: 1, gap: 1 },

  mapCard: { height: 190, borderRadius: radius.lg, overflow: 'hidden', justifyContent: 'flex-end' },
  mapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.md,
    backgroundColor: palette.veil,
  },
  mapPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.tight,
    paddingHorizontal: space.md,
    height: control.xs,
    borderRadius: radius.sm,
    backgroundColor: palette.night,
  },
  mapCopy: { flex: 1, gap: 1 },

  chauffeur: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: space.md,
  },
  chauffeurAvatar: { width: 58, height: 58, borderRadius: radius.pill },
  chauffeurCopy: { flex: 1, gap: 2 },
  chauffeurStats: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginTop: 2 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  notes: { gap: space.md },
  note: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  noteText: { flex: 1 },

  chrome: {
    position: 'absolute',
    left: gutter,
    right: gutter,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chromeRight: { flexDirection: 'row', gap: space.sm },

  bookBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: gutter,
  },
  bookBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.base,
    backgroundColor: palette.surface,
    borderRadius: radius.xxl,
    paddingLeft: space.xl,
    paddingRight: space.sm,
    paddingVertical: space.sm,
  },
  bookPrice: { gap: 1 },
});
