import { StyleSheet, Text as RNText, View } from 'react-native';

import { splitPrice } from '@/lib/format';
import { fontFamily, palette } from '@/theme';

export type PriceTagProps = {
  value: number;
  /** Suffix after the amount — "/h", "/day". */
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean;
  /** Hide the cents when the price is a round number. */
  hideCents?: boolean;
};

/**
 * Money gets its own component because the reference boards set the dollar
 * sign, the integer, the cents and the unit at four different optical sizes —
 * that hierarchy is most of what makes the price feel designed.
 *
 * The four sizes are fixed ratios of the integer: symbol 0.52, cents 0.52,
 * unit 0.40. Deriving them keeps the relationship intact at every scale, which
 * hand-picked numbers did not — the old `sm` had a dollar sign 65% of the
 * integer while `lg` had 50%, so the same component read as two different ones.
 */
const majors = { sm: 20, md: 28, lg: 40 } as const;

export function PriceTag({ value, unit = '/h', size = 'md', inverted, hideCents }: PriceTagProps) {
  const { major, minor } = splitPrice(value);
  const majorSize = majors[size];
  const ink = inverted ? palette.inkInverted : palette.ink;
  const soft = inverted ? palette.inkOnNight : palette.inkTertiary;
  const showCents = !hideCents && minor !== '00';

  return (
    <View
      style={styles.row}
      accessibilityLabel={`${value} dollars per hour`}
      accessible
    >
      <RNText
        allowFontScaling={false}
        style={[styles.symbol, { fontSize: majorSize * 0.52, color: ink }]}
      >
        $
      </RNText>
      <RNText
        allowFontScaling={false}
        style={[
          styles.major,
          { fontSize: majorSize, lineHeight: majorSize * 1.04, color: ink },
        ]}
      >
        {major}
      </RNText>
      {showCents ? (
        <RNText
          allowFontScaling={false}
          style={[styles.minor, { fontSize: majorSize * 0.52, color: ink }]}
        >
          .{minor}
        </RNText>
      ) : null}
      {unit ? (
        <RNText
          allowFontScaling={false}
          style={[styles.unit, { fontSize: majorSize * 0.4, color: soft }]}
        >
          {unit}
        </RNText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline' },
  symbol: { fontFamily: fontFamily.extrabold, letterSpacing: -0.5, includeFontPadding: false },
  major: { fontFamily: fontFamily.extrabold, letterSpacing: -1.4, includeFontPadding: false },
  minor: { fontFamily: fontFamily.extrabold, letterSpacing: -0.6, includeFontPadding: false },
  unit: {
    fontFamily: fontFamily.semibold,
    marginLeft: 3,
    letterSpacing: -0.2,
    includeFontPadding: false,
  },
});
