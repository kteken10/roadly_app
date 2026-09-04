import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/theme';

export type ScreenProps = {
  children: ReactNode;
  /** Apply the top safe-area inset as padding. Off for screens with a hero. */
  top?: boolean;
  bottom?: boolean;
  background?: string;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, top = true, bottom = false, background = palette.canvas, style }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: background,
          paddingTop: top ? insets.top : 0,
          paddingBottom: bottom ? insets.bottom : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1 },
});
