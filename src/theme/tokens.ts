import { StyleSheet } from 'react-native';

/**
 * Roadly design tokens.
 *
 * Every scale here is *closed*: if a value is not in one of these objects, it
 * does not belong in a stylesheet. That constraint is the whole point — an
 * interface reads as one product when its elements share a small vocabulary of
 * sizes, and reads as an assembly of parts when they do not.
 *
 * The palette is deliberately near-monochrome: a paper-white canvas, ink-black
 * for anything actionable, and a small set of desaturated "pigment" tints that
 * carry meaning (a car surface, a map surface, a person surface). Colour is a
 * scarce resource here — that is what makes the product read as premium rather
 * than as a dashboard.
 */

export const palette = {
  /** App canvas. Warm-neutral, never pure #fff, so white cards can lift off it. */
  canvas: '#F4F4F5',
  /** Elevated surface — cards, sheets, tiles. */
  surface: '#FFFFFF',
  /** Recessed surface — inputs, inactive segments, skeletons. */
  surfaceSunken: '#F0F0F2',

  /** Primary ink. Used for text, icons and every primary action. */
  ink: '#0E0F11',
  /** Ink on a dark surface. */
  inkInverted: '#FFFFFF',
  inkSecondary: '#6C6F76',
  inkTertiary: '#A0A3AA',
  inkQuaternary: '#C6C8CD',

  /** Dark surfaces (the "night" cards from the reference boards). */
  night: '#0E0F11',
  nightRaised: '#1A1C1F',
  nightHairline: 'rgba(255,255,255,0.10)',
  /** Secondary and tertiary ink on a dark surface. */
  inkOnNight: 'rgba(255,255,255,0.64)',
  inkOnNightSoft: 'rgba(255,255,255,0.42)',

  hairline: '#E9E9EC',
  hairlineStrong: '#DEDEE2',

  /** Pigments — each one is tied to a semantic surface, never decorative. */
  blush: '#F9EBEB',
  blushDeep: '#F2DCDC',
  sand: '#F3EEE6',
  sandDeep: '#EAE2D5',
  mist: '#E8ECF7',
  mistDeep: '#D8DEF0',
  sage: '#E7F0E9',

  /** Signal colours. `volt` is the last remaining trace of the Flutter identity. */
  volt: '#FFCD04',
  live: '#E5484D',
  positive: '#2F7D57',

  /** Scrims. */
  scrim: 'rgba(14,15,17,0.45)',
  scrimSoft: 'rgba(14,15,17,0.16)',
  /** Translucent white, for chrome floating over imagery. */
  veil: 'rgba(255,255,255,0.86)',
  veilSoft: 'rgba(255,255,255,0.70)',
} as const;

/**
 * Spacing, on a 2/4/6/8/12/16/20/24/32/44/64 ramp. The lower rungs exist so
 * intra-component gaps (a label above a value) never need a raw number.
 */
export const space = {
  none: 0,
  xxs: 2,
  xs: 4,
  tight: 6,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 44,
  huge: 64,
} as const;

/** Horizontal page gutter, identical on every screen. */
export const gutter = 20;

/**
 * Control heights. Five rungs, no exceptions.
 *
 * `md` is 44 because that is Apple's minimum comfortable touch target; anything
 * below `md` is either non-interactive or must carry `hitSlop` to reach 44 in
 * practice.
 */
export const control = {
  /** Badges, tokens, read-only pills. Not tappable on its own. */
  xs: 28,
  /** Compact inline control. Needs hitSlop. */
  sm: 36,
  /** The default. Meets the touch target unaided. */
  md: 44,
  /** Primary action inside a card or row. */
  lg: 52,
  /** Hero CTA, slide-to-confirm, bottom bars. */
  xl: 60,
} as const;

/** Minimum tappable edge, per Apple's Human Interface Guidelines. */
export const TOUCH_TARGET = 44;

/**
 * Icon sizes, each paired to a text variant so glyph and label share an optical
 * weight. `md` and below sit inline with text; `lg` and above stand alone.
 */
export const icon = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

/**
 * Radii, chosen so nested corners stay concentric: an inner radius equals its
 * parent's radius minus the padding between them.
 *
 *   xl (28) − base padding (16) → sm (12)
 *   xxl (36) − lg padding (20)  → md (16)
 */
export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
  pill: 999,
} as const;

/** Three border weights. `hairline` divides, `thin` outlines, `ring` separates. */
export const border = {
  hairline: StyleSheet.hairlineWidth,
  thin: 1,
  /** Only for rings that separate a round image from a coloured backdrop. */
  ring: 2,
} as const;

/**
 * Two elevations only. Anything more and the surfaces start competing.
 * Values are tuned so the shadow reads as ambient occlusion, not as a drop.
 */
export const shadow = {
  none: {},
  card: {
    shadowColor: '#0E0F11',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  lifted: {
    shadowColor: '#0E0F11',
    shadowOpacity: 0.12,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
} as const;

/**
 * Motion. iOS gestures feel right when springs are critically damped and short;
 * these are the only three curves the app is allowed to use.
 */
export const motion = {
  /** Press / release feedback. */
  press: { damping: 22, stiffness: 420, mass: 0.7 },
  /** Element enters, moves or resizes. */
  standard: { damping: 20, stiffness: 190, mass: 0.9 },
  /** Large surfaces: sheets, hero transitions. */
  soft: { damping: 24, stiffness: 120, mass: 1 },
  duration: {
    fast: 140,
    base: 240,
    slow: 420,
  },
} as const;

/**
 * `StyleSheet.absoluteFillObject` lost its type in RN 0.86, and spreading an
 * untyped value into a StyleSheet entry poisons the whole style object.
 */
export const absoluteFill = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const;

/** Height of the floating tab bar, excluding the safe-area inset. */
export const TAB_BAR_HEIGHT = control.xl;
/** Bottom padding every scroll view must reserve so content clears the tab bar. */
export const TAB_BAR_CLEARANCE = TAB_BAR_HEIGHT + space.xl + space.xs;
