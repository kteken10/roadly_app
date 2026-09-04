import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Icon, IconButton, Text, Touchable } from '@/components/ui';
import { account } from '@/domain/catalog';
import { control, icon, palette, radius, shadow, space } from '@/theme';

export type LocationBarProps = {
  onPressLocation: () => void;
  onPressNotifications: () => void;
  onPressAccount: () => void;
  unread?: number;
};

/**
 * Descendant of the Flutter `Header`. Same three jobs — where you are, alerts,
 * you — but the location becomes a real control (it opens the map) instead of
 * static text, and the two round buttons stop fighting for the same weight.
 */
export function LocationBar({
  onPressLocation,
  onPressNotifications,
  onPressAccount,
  unread,
}: LocationBarProps) {
  return (
    <View style={styles.row}>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={`Current location, ${account.neighbourhood}, ${account.city}. Change`}
        onPress={onPressLocation}
        scaleTo={0.97}
        style={styles.location}
      >
        <Text variant="overline" tone="tertiary">
          My location
        </Text>
        <View style={styles.locationValue}>
          <Icon name="mappin.and.ellipse" size={icon.sm} color={palette.ink} />
          <Text variant="bodyStrong" numberOfLines={1}>
            {account.neighbourhood}, {account.city}
          </Text>
          <Icon name="chevron.down" size={icon.xs} color={palette.inkTertiary} />
        </View>
      </Touchable>

      <View style={styles.actions}>
        <IconButton
          name="bell"
          label="Notifications"
          onPress={onPressNotifications}
          badge={unread}
        />
        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Your account"
          onPress={onPressAccount}
          scaleTo={0.92}
          style={[styles.avatarRing, shadow.card]}
        >
          <Image source={account.avatar} style={styles.avatar} contentFit="cover" />
        </Touchable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.base,
  },
  location: { gap: space.xs, flexShrink: 1 },
  locationValue: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  avatarRing: {
    width: 44,
    height: control.md,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    padding: 2,
  },
  avatar: { flex: 1, borderRadius: radius.pill },
});
