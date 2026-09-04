import { useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { palette } from '@/theme';

/**
 * A deterministic, vector city map.
 *
 * The Flutter build shipped a dark raster screenshot of a map, which pinned the
 * whole detail screen to one colour scheme and one aspect ratio. Drawing the map
 * instead means it tints with the design system, scales to any card without
 * resampling, and costs a few kilobytes rather than a 340×720 PNG.
 *
 * `seed` picks one of the pre-authored street layouts so different surfaces do
 * not show the identical block pattern.
 */

type Layout = {
  /** Major avenues: [x1, y1, x2, y2] in a 0–100 viewBox. */
  avenues: [number, number, number, number][];
  /** Minor streets. */
  streets: [number, number, number, number][];
  /** Park / water blocks: [x, y, w, h, radius]. */
  blocks: [number, number, number, number, number][];
};

const layouts: Layout[] = [
  {
    avenues: [
      [-5, 22, 105, 14],
      [-5, 58, 105, 66],
      [18, -5, 30, 105],
      [72, -5, 62, 105],
      [-5, 88, 105, 96],
    ],
    streets: [
      [-5, 40, 105, 36],
      [-5, 76, 105, 80],
      [46, -5, 50, 105],
      [90, -5, 86, 105],
      [4, -5, 8, 105],
      [-5, 6, 105, 2],
    ],
    blocks: [
      [52, 20, 16, 14, 3],
      [22, 62, 20, 12, 3],
      [76, 68, 18, 16, 3],
    ],
  },
  {
    avenues: [
      [-5, 34, 105, 30],
      [-5, 70, 105, 78],
      [30, -5, 24, 105],
      [64, -5, 74, 105],
    ],
    streets: [
      [-5, 12, 105, 10],
      [-5, 52, 105, 54],
      [-5, 90, 105, 88],
      [48, -5, 44, 105],
      [84, -5, 92, 105],
      [12, -5, 6, 105],
    ],
    blocks: [
      [34, 38, 22, 12, 3],
      [68, 14, 14, 12, 3],
      [8, 74, 16, 14, 3],
    ],
  },
];

export type CityMapProps = {
  seed?: number;
  /** Muted background tint of the map plate. */
  tone?: 'light' | 'night';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export function CityMap({ seed = 0, tone = 'light', style, children }: CityMapProps) {
  const layout = layouts[seed % layouts.length];

  const colors = useMemo(
    () =>
      tone === 'night'
        ? { plate: palette.nightRaised, avenue: 'rgba(255,255,255,0.16)', street: 'rgba(255,255,255,0.07)', block: 'rgba(255,255,255,0.05)' }
        : { plate: palette.mist, avenue: '#FFFFFF', street: 'rgba(255,255,255,0.66)', block: palette.mistDeep },
    [tone],
  );

  return (
    <View style={[styles.base, { backgroundColor: colors.plate }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <Rect x={0} y={0} width={100} height={100} fill={colors.plate} />
        <G>
          {layout.blocks.map(([x, y, w, h, r], index) => (
            <Rect key={`block-${index}`} x={x} y={y} width={w} height={h} rx={r} fill={colors.block} />
          ))}
        </G>
        <G strokeLinecap="round">
          {layout.streets.map(([x1, y1, x2, y2], index) => (
            <Line
              key={`street-${index}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={colors.street}
              strokeWidth={1.6}
            />
          ))}
          {layout.avenues.map(([x1, y1, x2, y2], index) => (
            <Line
              key={`avenue-${index}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={colors.avenue}
              strokeWidth={3.4}
            />
          ))}
        </G>
      </Svg>
      {children}
    </View>
  );
}

export type RouteOverlayProps = {
  /** Start and end in 0–1 space. */
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
};

/**
 * The elbowed walking route with the arrowhead, straight out of the reference
 * boards. Drawn as a single path so it can later be animated with a dash offset.
 */
export function RouteOverlay({ from, to, color = palette.ink }: RouteOverlayProps) {
  const x1 = from.x * 100;
  const y1 = from.y * 100;
  const x2 = to.x * 100;
  const y2 = to.y * 100;
  const midX = x1 + (x2 - x1) * 0.55;

  const angle = Math.atan2(y2 - y1, x2 - midX);
  const head = 4.5;
  const wing = 0.55;

  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100" pointerEvents="none">
      <Circle cx={x1} cy={y1} r={2.4} fill={palette.surface} stroke={color} strokeWidth={1.6} />
      <Path
        d={`M ${x1} ${y1} H ${midX} L ${x2} ${y2}`}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d={`M ${x2} ${y2}
            L ${x2 - head * Math.cos(angle - wing)} ${y2 - head * Math.sin(angle - wing)}
            L ${x2 - head * Math.cos(angle + wing)} ${y2 - head * Math.sin(angle + wing)} Z`}
        fill={color}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
});
