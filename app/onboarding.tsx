import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text, Touchable } from '@/components/ui';
import { cars } from '@/domain/catalog';
import { haptic } from '@/lib/haptics';
import { useSession } from '@/store/useSession';
import { absoluteFill, motion, palette, radius, space } from '@/theme';

const AnimatedScrollView = Animated.ScrollView;

const slides = [
  {
    car: cars[1],
    title: 'Premium cars.\nEnjoy the luxury.',
    body: 'Prestige cars by the hour. All the thrill, none of the ownership.',
  },
  {
    car: cars[0],
    title: 'Parked four\nminutes away.',
    body: 'We lead with what is closest to you, and tell you the walk before you commit.',
  },
  {
    car: cars[2],
    title: 'Unlock it\nfrom your phone.',
    body: 'No desk, no keys, no paperwork. Open the car and drive.',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [index, setIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const completeOnboarding = useSession((state) => state.complete);

  const enterApp = () => {
    completeOnboarding();
    router.replace('/(tabs)/explore');
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const isLast = index === slides.length - 1;

  const advance = () => {
    if (isLast) {
      haptic.success();
      enterApp();
      return;
    }
    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Ambient blooms: the soft off-black circles from the reference board. */}
      <View style={styles.blooms} pointerEvents="none">
        <View style={[styles.bloom, { top: -80, right: -60, width: 260, height: 260 }]} />
        <View style={[styles.bloom, { top: 180, left: -110, width: 220, height: 220 }]} />
      </View>

      <AnimatedScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const next = Math.round(event.nativeEvent.contentOffset.x / width);
          if (next !== index) {
            setIndex(next);
            haptic.select();
          }
        }}
        style={StyleSheet.absoluteFill}
      >
        {slides.map((slide, slideIndex) => (
          <Slide key={slide.car.id} slide={slide} index={slideIndex} scrollX={scrollX} width={width} />
        ))}
      </AnimatedScrollView>

      <LinearGradient
        colors={['transparent', 'rgba(14,15,17,0.75)', palette.night]}
        locations={[0, 0.45, 1]}
        style={styles.scrim}
        pointerEvents="none"
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.lg }]}>
        <View style={styles.copyBlock} pointerEvents="none">
          <Animated.View key={index} entering={FadeIn.duration(280)}>
            <Text variant="display" tone="inverted">
              {slides[index].title}
            </Text>
            <Text variant="body" tone="invertedSoft" style={styles.body}>
              {slides[index].body}
            </Text>
          </Animated.View>
        </View>

        <View style={styles.controls}>
          <View style={styles.dots}>
            {slides.map((slide, dotIndex) => (
              <Dot key={slide.car.id} index={dotIndex} scrollX={scrollX} width={width} />
            ))}
          </View>

          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            onPress={enterApp}
            style={styles.skip}
            hitSlop={12}
          >
            <Text variant="callout" tone="invertedSoft">
              Skip
            </Text>
          </Touchable>
        </View>

        <Button
          label={isLast ? "Let's Go!" : 'Continue'}
          variant="onDark"
          size="lg"
          full
          onPress={advance}
          style={styles.cta}
        />
      </View>
    </View>
  );
}

function Slide({
  slide,
  index,
  scrollX,
  width,
}: {
  slide: (typeof slides)[number];
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}) {
  /** Cars drift slower than the page — cheap parallax, big perceived depth. */
  const carStyle = useAnimatedStyle(() => {
    const offset = scrollX.value - index * width;
    return {
      transform: [
        { translateX: interpolate(offset, [-width, 0, width], [width * 0.4, 0, -width * 0.4], Extrapolation.CLAMP) },
        { scale: interpolate(offset, [-width, 0, width], [0.84, 1, 0.84], Extrapolation.CLAMP) },
      ],
      opacity: interpolate(offset, [-width, 0, width], [0, 1, 0], Extrapolation.CLAMP),
    };
  });

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.View style={[styles.carWrap, carStyle]}>
        <View style={styles.halo} />
        <Image source={slide.car.image} style={styles.car} contentFit="contain" />
      </Animated.View>
    </View>
  );
}

function Dot({
  index,
  scrollX,
  width,
}: {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}) {
  const style = useAnimatedStyle(() => {
    const offset = Math.abs(scrollX.value - index * width);
    const active = interpolate(offset, [0, width], [1, 0], Extrapolation.CLAMP);
    return {
      width: withSpring(8 + active * 18, motion.standard),
      opacity: withTiming(0.3 + active * 0.7),
    };
  });

  return <Animated.View style={[styles.dot, style]} />;
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.night },
  blooms: { ...absoluteFill },
  bloom: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  carWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.18,
  },
  halo: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  car: { width: 340, height: 190 },
  scrim: { position: 'absolute', left: 0, right: 0, bottom: 0, height: height * 0.62 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.xl,
    gap: space.lg,
  },
  copyBlock: { minHeight: 148, justifyContent: 'flex-end' },
  body: { marginTop: space.md, maxWidth: 320 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dots: { flexDirection: 'row', gap: space.tight, alignItems: 'center' },
  dot: { height: 8, borderRadius: radius.pill, backgroundColor: palette.surface },
  skip: { paddingVertical: space.xs, paddingHorizontal: space.sm },
  cta: {},
});
