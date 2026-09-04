import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Surface, Text, Touchable } from '@/components/ui';
import { account, carsById } from '@/domain/catalog';
import { money } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { useRental } from '@/store/useRental';
import { border, control, gutter, icon, palette, radius, space } from '@/theme';

const durations = [
  { hours: 1, label: '1 hour' },
  { hours: 2, label: '2 hours' },
  { hours: 4, label: 'Half day' },
  { hours: 8, label: 'Full day' },
];

export default function BookSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const start = useRental((state) => state.start);
  const [hours, setHours] = useState(2);

  const car = carsById[id ?? ''];
  if (!car) return null;

  const subtotal = car.pricePerHour * hours;
  /** Flat service fee — shown, never buried, because surprise fees kill trust. */
  const serviceFee = 4.9;
  const total = subtotal + serviceFee;

  const confirm = () => {
    haptic.success();
    start(car.id);
    router.dismissAll();
    router.push('/rental');
  };

  return (
    <View style={[styles.root, { paddingBottom: (insets.bottom || space.lg) + space.sm }]}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text variant="overline" tone="tertiary">
            Confirm booking
          </Text>
          <Text variant="title2" numberOfLines={1}>
            {car.fullName}
          </Text>
        </View>
        <Image source={car.image} style={styles.car} contentFit="contain" />
      </View>

      <View style={styles.durations}>
        {durations.map((option) => {
          const selected = option.hours === hours;
          return (
            <Touchable
              key={option.hours}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              onPress={() => setHours(option.hours)}
              haptics="select"
              scaleTo={0.95}
              style={[styles.duration, selected && styles.durationSelected]}
            >
              <Text variant="callout" style={{ color: selected ? palette.inkInverted : palette.ink }}>
                {option.hours}h
              </Text>
              <Text
                variant="caption"
                style={{ color: selected ? palette.inkOnNight : palette.inkTertiary }}
              >
                {money(car.pricePerHour * option.hours)}
              </Text>
            </Touchable>
          );
        })}
      </View>

      <Animated.View key={hours} entering={FadeIn.duration(220)}>
        <Surface radiusSize="lg" style={styles.summary}>
        <Row label={`${money(car.pricePerHour)} × ${hours}h`} value={money(subtotal, true)} />
        <Row label="Service fee" value={money(serviceFee, true)} />
        <View style={styles.divider} />
        <Row label="Total" value={money(total, true)} strong />
        </Surface>
      </Animated.View>

      <Touchable
        accessibilityRole="button"
        accessibilityLabel={`Payment method, Mastercard ending ${account.card.last4}. Change`}
        onPress={() => haptic.tap()}
        scaleTo={0.98}
        style={styles.payment}
      >
        <Icon name="creditcard.fill" size={icon.lg} color={palette.ink} />
        <Text variant="callout" style={styles.paymentLabel}>
          ···· {account.card.last4}
        </Text>
        <Text variant="caption" tone="tertiary">
          Change
        </Text>
        <Icon name="chevron.right" size={icon.xs} color={palette.inkTertiary} />
      </Touchable>

      <Button label="Confirm and reserve" size="lg" full onPress={confirm} />

      <Text variant="caption" tone="tertiary" center style={styles.legal}>
        Free cancellation for 10 minutes. Billing starts when you unlock the car.
      </Text>
    </View>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text variant={strong ? 'headline' : 'body'} tone={strong ? 'primary' : 'secondary'}>
        {label}
      </Text>
      <Text variant={strong ? 'headline' : 'bodyStrong'}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.canvas,
    paddingHorizontal: gutter,
    paddingTop: space.lg,
    gap: space.lg,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  headerCopy: { flex: 1, gap: 3 },
  car: { width: 118, height: 62 },

  durations: { flexDirection: 'row', gap: space.sm },
  duration: {
    flex: 1,
    height: control.xl,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderWidth: border.hairline,
    borderColor: palette.hairline,
  },
  durationSelected: { backgroundColor: palette.ink, borderColor: palette.ink },

  summary: { gap: space.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  divider: { height: border.hairline, backgroundColor: palette.hairline },

  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    height: control.lg,
    paddingHorizontal: space.base,
    borderRadius: radius.md,
    backgroundColor: palette.surfaceSunken,
  },
  paymentLabel: { flex: 1 },

  legal: { paddingHorizontal: space.lg },
});
