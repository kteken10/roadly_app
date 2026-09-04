import { StyleSheet, View } from 'react-native';

import { Icon } from './Icon';
import { Text } from './Text';
import { Touchable } from './Touchable';
import { control, iconFor, palette, space } from '@/theme';

export type SectionHeaderProps = {
  title: string;
  /** Small uppercase line above the title — a count, a status, a category. */
  eyebrow?: string;
  /** Optional trailing affordance, e.g. "See all". */
  actionLabel?: string;
  onAction?: () => void;
};

/**
 * Title and action are baseline-aligned rather than centre-aligned. Centring a
 * 13pt link against a 17pt title leaves the link floating a point high; sharing
 * a baseline is how the pairing is set in print, and it is what the reference
 * boards do.
 */
export function SectionHeader({ title, eyebrow, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        {eyebrow ? (
          <Text variant="overline" tone="tertiary">
            {eyebrow}
          </Text>
        ) : null}
        <Text variant="title3" numberOfLines={1}>
          {title}
        </Text>
      </View>

      {actionLabel ? (
        <Touchable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          scaleTo={0.94}
          hitSlop={(control.md - control.sm) / 2}
          style={styles.action}
        >
          <Text variant="callout" tone="secondary">
            {actionLabel}
          </Text>
          <Icon name="chevron.right" size={iconFor.overline} color={palette.inkTertiary} />
        </Touchable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: space.base,
  },
  titles: { flex: 1, gap: space.xs },
  action: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
});
