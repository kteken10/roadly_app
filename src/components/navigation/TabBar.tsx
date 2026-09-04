import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { SFSymbol } from 'expo-symbols';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text, Touchable } from '@/components/ui';
import { haptic } from '@/lib/haptics';
import { border, icon, motion, palette, radius, shadow, space, TAB_BAR_HEIGHT } from '@/theme';

/** The ink pill behind the active tab. Sized so it clears the label's descenders. */
const INDICATOR = 46;

export type TabItem = {
  name: string;
  label: string;
  symbol: SFSymbol;
  symbolActive: SFSymbol;
};

export type TabBarProps = {
  items: TabItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

/**
 * A floating glass tab bar.
 *
 * A stock tab bar would have been less work, but the reference language is
 * built on floating surfaces over a light canvas, and a full-width opaque bar
 * cuts every screen in half. On iOS 26 this renders as real liquid glass; below
 * that it falls back to a UIBlurEffect, and off-Apple to a solid surface.
 */
export function TabBar({ items, activeIndex, onSelect }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const liquid = isLiquidGlassAvailable();

  return (
    <View
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, space.md) }]}
      pointerEvents="box-none"
    >
      <View style={[styles.bar, shadow.lifted]}>
        <Glass liquid={liquid} />
        <Indicator count={items.length} activeIndex={activeIndex} />

        {items.map((item, index) => (
          <Tab
            key={item.name}
            item={item}
            active={index === activeIndex}
            onPress={() => {
              if (index !== activeIndex) haptic.select();
              onSelect(index);
            }}
          />
        ))}
      </View>
    </View>
  );
}

function Glass({ liquid }: { liquid: boolean }) {
  if (liquid) {
    return (
      <GlassView
        style={StyleSheet.absoluteFill}
        glassEffectStyle="regular"
        tintColor="rgba(255,255,255,0.4)"
      />
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={70} tint="systemChromeMaterialLight" style={StyleSheet.absoluteFill} />
    );
  }

  return <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.surface }]} />;
}

/** The ink pill that slides between tabs — one moving object, not five toggles. */
function Indicator({ count, activeIndex }: { count: number; activeIndex: number }) {
  const target = useDerivedValue(() => withSpring(activeIndex, motion.standard), [activeIndex]);

  const style = useAnimatedStyle(() => ({
    left: `${(target.value * 100) / count}%`,
    width: `${100 / count}%`,
  }));

  return (
    <Animated.View style={[styles.indicatorTrack, style]} pointerEvents="none">
      <View style={styles.indicator} />
    </Animated.View>
  );
}

function Tab({ item, active, onPress }: { item: TabItem; active: boolean; onPress: () => void }) {
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(active ? 1 : 0.94, motion.press) }],
  }));

  return (
    <Touchable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={item.label}
      onPress={onPress}
      haptics="none"
      scaleTo={0.9}
      style={styles.tab}
    >
      <Animated.View style={[styles.tabInner, style]}>
        <Icon
          name={active ? item.symbolActive : item.symbol}
          size={icon.lg}
          color={active ? palette.ink : palette.inkTertiary}
          weight={active ? 'semibold' : 'regular'}
        />
        <Text
          variant="overline"
          style={{ color: active ? palette.ink : palette.inkTertiary, letterSpacing: 0.4 }}
        >
          {item.label}
        </Text>
      </Animated.View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.base,
  },
  bar: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    borderRadius: radius.pill,
    overflow: 'hidden',
    /** A bright hairline is what gives blurred glass its edge; without it the
     *  bar dissolves into light content. */
    borderWidth: border.hairline,
    borderColor: palette.veilSoft,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : palette.surface,
  },
  indicatorTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: INDICATOR,
    height: INDICATOR,
    borderRadius: INDICATOR / 2,
    backgroundColor: palette.scrimSoft,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabInner: { alignItems: 'center', gap: space.xxs },
});
