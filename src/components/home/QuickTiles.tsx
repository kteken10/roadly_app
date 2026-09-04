import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { CityMap, RouteOverlay } from '@/components/map/CityMap';
import { Icon, Text, Touchable } from '@/components/ui';
import { account } from '@/domain/catalog';
import { money } from '@/lib/format';
import { control, icon, palette, radius, shadow, space } from '@/theme';

export type QuickTilesProps = {
  onPressMap: () => void;
  onPressWallet: () => void;
  nearestWalkMinutes: number;
};

/**
 * The paired tiles from the reference board: a live map on the left, your
 * balance on the right. Two very different data types made to share one row by
 * giving them the same footprint and opposite tints.
 */
export function QuickTiles({ onPressMap, onPressWallet, nearestWalkMinutes }: QuickTilesProps) {
  return (
    <View style={styles.row}>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={`Map. Nearest car is ${nearestWalkMinutes} minutes away`}
        onPress={onPressMap}
        scaleTo={0.97}
        style={[styles.tile, shadow.card]}
      >
        <CityMap seed={0} style={StyleSheet.absoluteFill}>
          <RouteOverlay from={{ x: 0.3, y: 0.62 }} to={{ x: 0.74, y: 0.32 }} />
        </CityMap>
        <View style={styles.walkPill}>
          <Icon name="figure.walk" size={icon.sm} color={palette.inkInverted} />
          <Text variant="captionStrong" tone="inverted">
            {nearestWalkMinutes} min
          </Text>
        </View>
      </Touchable>

      <Touchable
        accessibilityRole="button"
        accessibilityLabel={`Wallet balance ${money(account.balance, true)}`}
        onPress={onPressWallet}
        scaleTo={0.97}
        style={[styles.tile, styles.wallet, shadow.card]}
      >
        <Image source={account.avatar} style={styles.avatar} contentFit="cover" />
        <Text variant="caption" tone="secondary" numberOfLines={1}>
          {account.firstName} {account.lastName}
        </Text>
        <View style={styles.balance}>
          <Text variant="title2">{money(Math.floor(account.balance))}</Text>
          <Text variant="callout" tone="tertiary">
            .{account.balance.toFixed(2).split('.')[1]}
          </Text>
        </View>
      </Touchable>
    </View>
  );
}

const TILE_HEIGHT = 148;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.md },
  tile: {
    flex: 1,
    height: TILE_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: palette.mist,
  },
  walkPill: {
    position: 'absolute',
    left: space.md,
    bottom: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.tight,
    paddingHorizontal: space.md,
    height: control.xs,
    borderRadius: radius.sm,
    backgroundColor: palette.night,
  },
  wallet: {
    backgroundColor: palette.sand,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.tight,
    paddingHorizontal: space.md,
  },
  avatar: { width: 48, height: 48, borderRadius: radius.pill },
  balance: { flexDirection: 'row', alignItems: 'baseline' },
});
