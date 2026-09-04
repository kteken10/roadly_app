import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { border, palette, radius, shadow, space } from '@/theme';

export type SurfaceTone =
  | 'surface'
  | 'sunken'
  | 'night'
  | 'nightRaised'
  | 'blush'
  | 'sand'
  | 'mist'
  | 'sage'
  | 'veil';

const tones: Record<SurfaceTone, string> = {
  surface: palette.surface,
  sunken: palette.surfaceSunken,
  night: palette.night,
  nightRaised: palette.nightRaised,
  blush: palette.blush,
  sand: palette.sand,
  mist: palette.mist,
  sage: palette.sage,
  veil: palette.veil,
};

/**
 * Padding presets, and the inner radius that keeps a child's corners
 * concentric with this surface's own. Reading them from one table is what
 * stops nested corners from drifting apart by two or three points — the kind
 * of error nobody can name but everybody can see.
 */
const insets = {
  none: 0,
  tight: space.md,
  base: space.base,
  roomy: space.lg,
} as const;

export type SurfacePadding = keyof typeof insets;

export type SurfaceProps = {
  children: ReactNode;
  tone?: SurfaceTone;
  padding?: SurfacePadding;
  radiusSize?: keyof typeof radius;
  elevation?: keyof typeof shadow;
  /** Hairline outline. Use instead of a shadow on tinted or dark surfaces. */
  outlined?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * The one raised surface in the app.
 *
 * Before this existed, twelve files each wrote their own
 * `{ backgroundColor, borderRadius, ...shadow }` triple, and they disagreed:
 * six radii, three paddings, two shadow recipes. A card looked slightly
 * different depending on which screen you found it on, which is precisely what
 * makes an interface feel assembled rather than designed.
 */
export function Surface({
  children,
  tone = 'surface',
  padding = 'base',
  radiusSize = 'xl',
  elevation = 'card',
  outlined = false,
  style,
}: SurfaceProps) {
  const dark = tone === 'night' || tone === 'nightRaised';

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: tones[tone],
          borderRadius: radius[radiusSize],
          padding: insets[padding],
        },
        shadow[elevation],
        outlined && {
          borderWidth: border.hairline,
          borderColor: dark ? palette.nightHairline : palette.hairline,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * Inner radius that stays concentric with a parent surface.
 * `innerRadius('xl', 'base')` → 28 − 16 = 12.
 */
export function innerRadius(outer: keyof typeof radius, padding: SurfacePadding): number {
  return Math.max(radius.xs, radius[outer] - insets[padding]);
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
});
