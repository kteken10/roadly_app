import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  LinearTransition,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandRow } from '@/components/cars/BrandRow';
import { CarCard } from '@/components/cars/CarCard';
import { LocationBar } from '@/components/home/LocationBar';
import { QuickTiles } from '@/components/home/QuickTiles';
import { SavedFilters, type Preset } from '@/components/home/SavedFilters';
import { Button, IconButton, SectionHeader, Text } from '@/components/ui';
import { account } from '@/domain/catalog';
import { greeting } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { useContentBottomInset } from '@/lib/useContentInset';
import { countActive, selectCars, useFleet } from '@/store/useFleet';
import { gutter, palette, space } from '@/theme';

export default function Explore() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const bottomInset = useContentBottomInset(space.xl);

  const filters = useFleet((state) => state.filters);
  const saved = useFleet((state) => state.saved);
  const toggleSaved = useFleet((state) => state.toggleSaved);
  const setBrandShortcut = useFleet((state) => state.setBrandShortcut);
  const applyPreset = useFleet((state) => state.applyDraft);
  const setDraft = useFleet.setState;

  const list = useMemo(() => selectCars(filters), [filters]);
  const activeFilterCount = countActive(filters);
  const nearest = list[0];
  const rest = list.slice(1);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  /** The sticky filter bar only earns its blur once content is behind it. */
  const stickyBackdrop = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 40], [0, 1], Extrapolation.CLAMP),
  }));

  const handlePreset = (preset: Preset) => {
    setDraft({ draft: preset.filters });
    applyPreset();
  };

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          paddingTop: insets.top + space.sm,
          paddingBottom: bottomInset,
        }}
      >
        {/* 0 — masthead */}
        <View style={styles.masthead}>
          <LocationBar
            unread={2}
            onPressLocation={() => router.navigate('/(tabs)/nearby')}
            onPressNotifications={() => haptic.tap()}
            onPressAccount={() => router.navigate('/(tabs)/account')}
          />

          <View style={styles.greeting}>
            <Text variant="display">
              {greeting()}, {account.firstName}
              <Text variant="display" tone="tertiary">
                .
              </Text>
            </Text>
            <Text variant="body" tone="secondary" style={styles.subtitle}>
              Time to eat the road. Here is what is parked near you right now.
            </Text>
          </View>
        </View>

        {/* 1 — sticky brand + filter bar */}
        <View style={styles.stickyWrap}>
          <Animated.View style={[StyleSheet.absoluteFill, stickyBackdrop]}>
            {Platform.OS === 'ios' ? (
              <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
            ) : (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.canvas }]} />
            )}
          </Animated.View>

          <View style={styles.stickyRow}>
            <View style={styles.brandScroller}>
              <BrandRow
                selected={filters.brands.length === 1 ? filters.brands[0] : null}
                onSelect={setBrandShortcut}
              />
            </View>
            <View style={styles.filterButton}>
              <IconButton
                name="slider.horizontal.3"
                label={`Filters${activeFilterCount ? `, ${activeFilterCount} active` : ''}`}
                badge={activeFilterCount}
                onPress={() => {
                  useFleet.getState().syncDraft();
                  router.push('/filters');
                }}
              />
            </View>
          </View>
        </View>

        {/* 2 — body */}
        <Animated.View layout={LinearTransition.springify().damping(22)} style={styles.body}>
          {nearest ? (
            <CarCard
              car={nearest}
              featured
              eyebrow="Nearest car"
              saved={saved.includes(nearest.id)}
              onToggleSave={() => toggleSaved(nearest.id)}
              onPress={() => router.push(`/car/${nearest.id}`)}
            />
          ) : (
            <EmptyState onReset={() => useFleet.getState().clearFilters()} />
          )}

          {nearest ? (
            <QuickTiles
              nearestWalkMinutes={nearest.walkMinutes}
              onPressMap={() => router.navigate('/(tabs)/nearby')}
              onPressWallet={() => router.navigate('/(tabs)/account')}
            />
          ) : null}

          <SavedFilters onApply={handlePreset} />

          {rest.length > 0 ? (
            <>
              <SectionHeader
                title="The rest of the fleet"
                eyebrow={`${list.length} available`}
                actionLabel="Filters"
                onAction={() => {
                  useFleet.getState().syncDraft();
                  router.push('/filters');
                }}
              />
              {rest.map((car, index) => (
                <CarCard
                  key={car.id}
                  car={car}
                  index={index}
                  saved={saved.includes(car.id)}
                  onToggleSave={() => toggleSaved(car.id)}
                  onPress={() => router.push(`/car/${car.id}`)}
                />
              ))}
            </>
          ) : null}
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <View style={styles.empty}>
      <Text variant="title3" center>
        Nothing matches that
      </Text>
      <Text variant="body" tone="secondary" center style={styles.emptyBody}>
        Your filters are narrower than the fleet. Loosen them and we will look again.
      </Text>
      {/* A bare Text with onPress is a 17pt-tall tap target; the Button is not. */}
      <Button label="Reset filters" variant="secondary" onPress={onReset} style={styles.emptyAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.canvas },
  masthead: { paddingHorizontal: gutter, gap: space.xl, paddingBottom: space.lg },
  greeting: { gap: space.sm },
  subtitle: { maxWidth: 320 },
  stickyWrap: { paddingVertical: space.sm },
  stickyRow: { flexDirection: 'row', alignItems: 'center' },
  brandScroller: { flex: 1 },
  filterButton: { paddingHorizontal: gutter, paddingLeft: space.sm },
  body: { paddingHorizontal: gutter, paddingTop: space.md, gap: space.lg },
  empty: { paddingVertical: space.huge, gap: space.sm, alignItems: 'center' },
  emptyBody: { maxWidth: 280 },
  emptyAction: { marginTop: space.md },
});
