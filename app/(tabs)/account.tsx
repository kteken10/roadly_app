import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconButton, Surface, Text, Touchable } from '@/components/ui';
import { account, recentTrips } from '@/domain/catalog';
import { money, tripDate } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { useContentBottomInset } from '@/lib/useContentInset';
import { border, gutter, icon, palette, radius, shadow, space } from '@/theme';

const settings = [
  { symbol: 'person.crop.circle.badge.checkmark' as const, label: 'Driving licence', detail: 'Verified' },
  { symbol: 'shield.lefthalf.filled' as const, label: 'Insurance', detail: 'Premium cover' },
  { symbol: 'bell.fill' as const, label: 'Notifications', detail: 'On' },
  { symbol: 'gearshape.fill' as const, label: 'Preferences', detail: '' },
];

export default function Account() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomInset = useContentBottomInset(space.xl);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + space.sm,
          paddingBottom: bottomInset,
          paddingHorizontal: gutter,
        }}
      >
        <View style={styles.chrome}>
          <Text variant="title2">Account</Text>
          <IconButton name="ellipsis" label="More options" onPress={() => haptic.tap()} />
        </View>

        <View style={styles.identity}>
          <Image source={account.avatar} style={styles.avatar} contentFit="cover" />
          <Text variant="title1">
            {account.firstName} {account.lastName}
          </Text>
          <View style={styles.city}>
            <Icon name="mappin.and.ellipse" size={icon.sm} color={palette.inkTertiary} />
            <Text variant="body" tone="tertiary">
              {account.city} · Member since {account.memberSince}
            </Text>
          </View>
        </View>

        <View style={styles.blockHeader}>
          <Text variant="title3">Payment method</Text>
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Add a payment method"
            onPress={() => haptic.tap()}
            hitSlop={10}
            style={styles.addNew}
          >
            <Icon name="checkmark" size={icon.xs} color={palette.inkSecondary} />
            <Text variant="callout" tone="secondary">
              Add new
            </Text>
          </Touchable>
        </View>

        <Animated.View entering={FadeInDown.springify().damping(22)}>
          <Touchable
            accessibilityRole="button"
            accessibilityLabel={`Mastercard ending ${account.card.last4}, balance ${money(account.balance, true)}`}
            onPress={() => haptic.press()}
            scaleTo={0.98}
            style={[styles.card, shadow.lifted]}
          >
            <LinearGradient
              colors={['#1E2126', palette.night]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.cardBrand}>
              <View style={[styles.cardCircle, { backgroundColor: '#EB001B' }]} />
              <View style={[styles.cardCircle, styles.cardCircleOverlap, { backgroundColor: '#F79E1B' }]} />
            </View>

            <View style={styles.cardBottom}>
              <View style={styles.cardHolder}>
                <Text variant="overline" tone="invertedSoft">
                  {account.card.holder}
                </Text>
                <View style={styles.cardNumber}>
                  <Text variant="bodyStrong" tone="inverted">
                    ···· {account.card.last4}
                  </Text>
                </View>
              </View>
              <View style={styles.cardBalance}>
                <Text variant="title2" tone="inverted">
                  {money(Math.floor(account.balance))}
                </Text>
                <Text variant="callout" tone="invertedSoft">
                  .{account.balance.toFixed(2).split('.')[1]}
                </Text>
              </View>
            </View>
          </Touchable>
        </Animated.View>

        <View style={styles.blockHeader}>
          <Text variant="title3">Recent transactions</Text>
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="See all trips"
            onPress={() => router.navigate('/(tabs)/trips')}
            hitSlop={10}
          >
            <Text variant="callout" tone="secondary">
              See all
            </Text>
          </Touchable>
        </View>

        <Surface radiusSize="lg" padding="none" style={styles.transactions}>
          {recentTrips.slice(0, 3).map((trip) => (
            <View key={trip.id} style={styles.transaction}>
              <View style={styles.transactionCopy}>
                <Text variant="bodyStrong">{tripDate(trip.startedAt)}</Text>
                <Text variant="caption" tone="tertiary">
                  {trip.durationMinutes}m rental
                </Text>
              </View>
              <Text variant="bodyStrong" tone={trip.status === 'refunded' ? 'positive' : 'primary'}>
                {trip.status === 'refunded' ? '+' : '−'}
                {money(trip.amount, true)}
              </Text>
            </View>
          ))}
        </Surface>

        <Surface radiusSize="lg" padding="none" style={styles.settings}>
          {settings.map((item, index) => (
            <Touchable
              key={item.label}
              accessibilityRole="button"
              accessibilityLabel={`${item.label}${item.detail ? `, ${item.detail}` : ''}`}
              onPress={() => haptic.tap()}
              scaleTo={0.99}
              style={[styles.setting, index > 0 && styles.settingDivided]}
            >
              <Icon name={item.symbol} size={icon.md} color={palette.ink} />
              <Text variant="body" style={styles.settingLabel}>
                {item.label}
              </Text>
              {item.detail ? (
                <Text variant="caption" tone="tertiary">
                  {item.detail}
                </Text>
              ) : null}
              <Icon name="chevron.right" size={icon.sm} color={palette.inkQuaternary} />
            </Touchable>
          ))}
        </Surface>

        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Replay the onboarding"
          onPress={() => {
            haptic.tap();
            router.push('/onboarding');
          }}
          style={styles.replay}
        >
          <Text variant="caption" tone="tertiary" center>
            Replay the intro
          </Text>
        </Touchable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.canvas },
  chrome: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  identity: { alignItems: 'center', gap: space.sm, paddingVertical: space.lg },
  avatar: { width: 96, height: 96, borderRadius: radius.pill, marginBottom: space.xs },
  city: { flexDirection: 'row', alignItems: 'center', gap: 5 },

  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.xl,
    marginBottom: space.md,
  },
  addNew: { flexDirection: 'row', alignItems: 'center', gap: 5 },

  card: {
    height: 186,
    borderRadius: radius.lg,
    padding: space.lg,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardBrand: { flexDirection: 'row', alignItems: 'center' },
  cardCircle: { width: 30, height: 30, borderRadius: 15 },
  cardCircleOverlap: { marginLeft: -12, opacity: 0.92 },
  cardBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  cardHolder: { gap: 6 },
  cardNumber: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  cardBalance: { flexDirection: 'row', alignItems: 'baseline' },

  transactions: { paddingHorizontal: space.base },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.md,
  },
  transactionCopy: { gap: 1 },

  settings: { marginTop: space.xl, paddingHorizontal: space.base },
  setting: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.base },
  settingDivided: {
    borderTopWidth: border.hairline,
    borderTopColor: palette.hairline,
  },
  settingLabel: { flex: 1 },

  replay: { paddingVertical: space.xl },
});
