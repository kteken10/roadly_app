import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Surface, Text, Touchable } from '@/components/ui';
import { carsById, recentTrips } from '@/domain/catalog';
import type { Trip } from '@/domain/types';
import { duration, money, tripDate, tripTime } from '@/lib/format';
import { useContentBottomInset } from '@/lib/useContentInset';
import { useFleet } from '@/store/useFleet';
import { border, control, gutter, icon, palette, radius, shadow, space } from '@/theme';

type Tab = 'history' | 'saved';

export default function Trips() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('history');
  const saved = useFleet((state) => state.saved);
  const bottomInset = useContentBottomInset(space.xl);

  /** Group history by month so a long list still has a spine. */
  const sections = useMemo(() => {
    const groups = new Map<string, Trip[]>();
    for (const trip of recentTrips) {
      const key = new Date(trip.startedAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      groups.set(key, [...(groups.get(key) ?? []), trip]);
    }
    return [...groups.entries()].map(([title, data]) => ({ title, data }));
  }, []);

  const spend = recentTrips
    .filter((trip) => trip.status === 'completed')
    .reduce((total, trip) => total + trip.amount, 0);

  return (
    <View style={styles.root}>
      <SectionList
        sections={tab === 'history' ? sections : []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          paddingTop: insets.top + space.sm,
          paddingBottom: bottomInset,
          paddingHorizontal: gutter,
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text variant="display">Your trips</Text>

            <Surface radiusSize="lg" padding="none" style={styles.summary}>
              <View style={styles.summaryCell}>
                <Text variant="title2">{recentTrips.length}</Text>
                <Text variant="caption" tone="tertiary">
                  Rentals
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCell}>
                <Text variant="title2">{money(spend)}</Text>
                <Text variant="caption" tone="tertiary">
                  Spent
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryCell}>
                <Text variant="title2">{saved.length}</Text>
                <Text variant="caption" tone="tertiary">
                  Saved
                </Text>
              </View>
            </Surface>

            <View style={styles.segment}>
              {(['history', 'saved'] as Tab[]).map((key) => (
                <Touchable
                  key={key}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: tab === key }}
                  accessibilityLabel={key === 'history' ? 'History' : 'Saved cars'}
                  onPress={() => setTab(key)}
                  haptics="select"
                  scaleTo={0.97}
                  hitSlop={(control.md - control.sm) / 2}
                  style={[styles.segmentItem, tab === key && styles.segmentItemActive]}
                >
                  <Text
                    variant="callout"
                    style={{ color: tab === key ? palette.ink : palette.inkSecondary }}
                  >
                    {key === 'history' ? 'History' : 'Saved'}
                  </Text>
                </Touchable>
              ))}
            </View>

            {tab === 'saved' ? <SavedList ids={saved} onOpen={(id) => router.push(`/car/${id}`)} /> : null}
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text variant="overline" tone="tertiary" style={styles.sectionHeader}>
            {section.title}
          </Text>
        )}
        renderItem={({ item, index }) => (
          <TripRow trip={item} index={index} onPress={() => router.push(`/car/${item.carId}`)} />
        )}
      />
    </View>
  );
}

function TripRow({ trip, index, onPress }: { trip: Trip; index: number; onPress: () => void }) {
  const car = carsById[trip.carId];
  const refunded = trip.status === 'refunded';

  return (
    <Animated.View entering={FadeIn.delay(index * 50).duration(280)}>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={`${car.fullName}, ${tripDate(trip.startedAt)}, ${money(trip.amount, true)}`}
        onPress={onPress}
        scaleTo={0.985}
        style={[styles.trip, shadow.card]}
      >
        <View style={[styles.tripThumb, { backgroundColor: palette[car.pigment] }]}>
          <Image source={car.image} style={styles.tripCar} contentFit="contain" />
        </View>

        <View style={styles.tripCopy}>
          <Text variant="callout" numberOfLines={1}>
            {car.fullName}
          </Text>
          <Text variant="caption" tone="tertiary">
            {tripDate(trip.startedAt)}, {tripTime(trip.startedAt)} · {duration(trip.durationMinutes)}
          </Text>
        </View>

        <View style={styles.tripAmount}>
          <Text variant="bodyStrong" tone={refunded ? 'positive' : 'primary'}>
            {refunded ? '+' : '−'}
            {money(trip.amount, true)}
          </Text>
          {refunded ? (
            <Text variant="caption" tone="positive">
              Refunded
            </Text>
          ) : null}
        </View>
      </Touchable>
    </Animated.View>
  );
}

function SavedList({ ids, onOpen }: { ids: string[]; onOpen: (id: string) => void }) {
  if (ids.length === 0) {
    return (
      <View style={styles.empty}>
        <Icon name="bookmark" size={icon.xl} color={palette.inkTertiary} />
        <Text variant="body" tone="secondary" center style={styles.emptyText}>
          Nothing saved yet. Tap the bookmark on any car to keep it here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.savedList}>
      {ids.map((id) => {
        const car = carsById[id];
        if (!car) return null;
        return (
          <Touchable
            key={id}
            accessibilityRole="button"
            accessibilityLabel={`Open ${car.fullName}`}
            onPress={() => onOpen(id)}
            scaleTo={0.985}
            style={[styles.trip, shadow.card]}
          >
            <View style={[styles.tripThumb, { backgroundColor: palette[car.pigment] }]}>
              <Image source={car.image} style={styles.tripCar} contentFit="contain" />
            </View>
            <View style={styles.tripCopy}>
              <Text variant="callout" numberOfLines={1}>
                {car.fullName}
              </Text>
              <Text variant="caption" tone="tertiary">
                {car.walkMinutes} min walk · {money(car.pricePerHour)}/h
              </Text>
            </View>
            <Icon name="chevron.right" size={icon.sm} color={palette.inkTertiary} />
          </Touchable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.canvas },
  header: { gap: space.lg, paddingBottom: space.md },

  summary: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.base },
  summaryCell: { flex: 1, alignItems: 'center', gap: 2 },
  summaryDivider: { width: border.hairline, height: 28, backgroundColor: palette.hairline },

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
  segmentItemActive: { backgroundColor: palette.surface, ...shadow.card },

  sectionHeader: { marginTop: space.lg, marginBottom: space.sm },

  trip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    padding: space.sm,
    paddingRight: space.base,
    marginBottom: space.sm,
  },
  tripThumb: {
    width: 64,
    height: control.lg,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripCar: { width: 56, height: 30 },
  tripCopy: { flex: 1, gap: 2 },
  tripAmount: { alignItems: 'flex-end', gap: 1 },

  savedList: { gap: 0 },
  empty: { alignItems: 'center', gap: space.md, paddingVertical: space.xxxl },
  emptyText: { maxWidth: 260 },
});
