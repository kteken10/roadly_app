import { Platform, type TextStyle } from 'react-native';

/**
 * Plus Jakarta Sans carries the geometric, slightly humanist voice of the
 * reference boards. It is used for everything except the running system
 * chrome, where SF Pro still wins.
 */
export const fontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export type Variant =
  | 'display'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'bodyStrong'
  | 'callout'
  | 'caption'
  | 'captionStrong'
  | 'overline'
  | 'mono';

/**
 * Eleven variants, and they are the only text styles in the app.
 *
 * Two rules hold the scale together. Tracking is a function of optical size:
 * geometric faces open up at display sizes and need pulling in (−1.2 at 34pt),
 * and close up at caption sizes and need letting out (+1.4 at 10pt). Leading is
 * a function of role — 1.18–1.25× for headings, where lines should clump into a
 * block, and ~1.4× for body, where the eye needs a rail to return to.
 *
 * Sizes step 34 / 27 / 21 / 17 / 15 / 13 / 12 / 10 — roughly a minor third, so
 * two adjacent levels stay distinguishable without needing a weight change.
 */
export const type: Record<Variant, TextStyle> = {
  display: {
    fontFamily: fontFamily.extrabold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1.2,
  },
  title1: {
    fontFamily: fontFamily.extrabold,
    fontSize: 27,
    lineHeight: 32,
    letterSpacing: -0.9,
  },
  title2: {
    fontFamily: fontFamily.bold,
    fontSize: 21,
    lineHeight: 26,
    letterSpacing: -0.6,
  },
  title3: {
    fontFamily: fontFamily.bold,
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: -0.4,
  },
  /** Body size, heavier — for row titles that must not read as headings. */
  headline: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  body: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  bodyStrong: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  /** Button and control labels. */
  callout: {
    fontFamily: fontFamily.semibold,
    fontSize: 13,
    lineHeight: 17,
    letterSpacing: -0.1,
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  captionStrong: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
  /** Section eyebrows: "NEAREST CAR", "SAVED FILTERS". */
  overline: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  /** Timers and counters — tabular so digits do not jitter while counting. */
  mono: {
    fontFamily: Platform.select({
      ios: 'SF Mono',
      default: fontFamily.bold,
    }),
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
};

/**
 * The icon size that sits optically level with each text variant. Pairing them
 * here means a row never has to guess, and an icon never floats a pixel off the
 * cap height of the label beside it.
 */
export const iconFor: Record<Variant, number> = {
  display: 24,
  title1: 24,
  title2: 20,
  title3: 16,
  headline: 16,
  body: 16,
  bodyStrong: 16,
  callout: 13,
  caption: 13,
  captionStrong: 13,
  overline: 11,
  mono: 24,
};
