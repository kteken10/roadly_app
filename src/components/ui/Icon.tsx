import Ionicons from '@expo/vector-icons/Ionicons';
import { SymbolView, type SFSymbol, type SymbolWeight } from 'expo-symbols';
import { Platform, type StyleProp, type ViewStyle } from 'react-native';

import { palette } from '@/theme';

/**
 * SF Symbols are the single biggest "this was built for iOS" signal you get for
 * free, so they are the primary icon source. Everywhere else falls back to a
 * hand-mapped Ionicon of the same optical weight.
 */
const fallbacks: Partial<Record<SFSymbol, keyof typeof Ionicons.glyphMap>> = {
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  'chevron.right': 'chevron-forward',
  'chevron.down': 'chevron-down',
  xmark: 'close',
  'slider.horizontal.3': 'options-outline',
  'line.3.horizontal.decrease': 'funnel-outline',
  magnifyingglass: 'search',
  bell: 'notifications-outline',
  'bell.fill': 'notifications',
  'info.circle': 'information-circle-outline',
  bookmark: 'bookmark-outline',
  'bookmark.fill': 'bookmark',
  heart: 'heart-outline',
  'heart.fill': 'heart',
  'mappin.and.ellipse': 'location-outline',
  'location.fill': 'navigate',
  'figure.walk': 'walk',
  snowflake: 'snow',
  'bolt.fill': 'flash',
  'bolt.car.fill': 'flash',
  'fuelpump.fill': 'speedometer-outline',
  'car.fill': 'car-sport',
  'suitcase.fill': 'briefcase',
  'sun.max.fill': 'sunny',
  'moon.stars.fill': 'moon',
  'waveform.path': 'pulse',
  'person.crop.circle.badge.checkmark': 'person-circle',
  'person.2.fill': 'people',
  'star.fill': 'star',
  'phone.fill': 'call',
  'lock.fill': 'lock-closed',
  'lock.open.fill': 'lock-open',
  'power.circle.fill': 'power',
  'speaker.wave.2.fill': 'volume-high',
  'gauge.with.dots.needle.67percent': 'speedometer',
  'battery.100': 'battery-full',
  'creditcard.fill': 'card',
  'clock.fill': 'time',
  'checkmark': 'checkmark',
  'ellipsis': 'ellipsis-horizontal',
  'gearshape.fill': 'settings',
  'arrow.up.right': 'arrow-forward',
  'shield.lefthalf.filled': 'shield-checkmark',
  'sparkles': 'sparkles',
};

export type IconProps = {
  name: SFSymbol;
  size?: number;
  color?: string;
  weight?: SymbolWeight;
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, size = 18, color = palette.ink, weight = 'semibold', style }: IconProps) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name={name}
        size={size}
        tintColor={color}
        weight={weight}
        resizeMode="scaleAspectFit"
        style={[{ width: size, height: size }, style]}
      />
    );
  }

  return (
    <Ionicons
      name={fallbacks[name] ?? 'ellipse-outline'}
      size={size}
      color={color}
      style={style as never}
    />
  );
}
