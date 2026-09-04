import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useCallback, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { palette, radius } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {
  /* the splash screen may already be hidden on fast refresh */
});

SplashScreen.setOptions({ duration: 420, fade: true });

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(palette.canvas).catch(() => {});
  }, []);

  const onReady = useCallback(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onReady}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.canvas },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />

          {/* Detail pushes as a native card so the iOS back-swipe works for free. */}
          <Stack.Screen name="car/[id]" options={{ animation: 'slide_from_right' }} />

          {/* Native form sheets — real UISheetPresentationController, not a JS mock. */}
          <Stack.Screen
            name="filters"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.62, 0.94],
              sheetInitialDetentIndex: 0,
              sheetGrabberVisible: true,
              sheetCornerRadius: radius.xxl,
              sheetExpandsWhenScrolledToEdge: true,
            }}
          />
          <Stack.Screen
            name="book/[id]"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.56],
              sheetGrabberVisible: true,
              sheetCornerRadius: radius.xxl,
            }}
          />
          <Stack.Screen
            name="rental"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.72, 0.96],
              sheetInitialDetentIndex: 0,
              sheetGrabberVisible: true,
              sheetCornerRadius: radius.xxl,
              gestureEnabled: true,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
