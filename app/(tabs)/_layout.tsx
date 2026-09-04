import { Tabs, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiveRentalBar } from '@/components/cars/LiveRentalBar';
import { TabBar, type TabItem } from '@/components/navigation/TabBar';
import { palette, TAB_BAR_HEIGHT } from '@/theme';

const items: TabItem[] = [
  { name: 'explore', label: 'Explore', symbol: 'sparkles', symbolActive: 'sparkles' },
  { name: 'nearby', label: 'Nearby', symbol: 'mappin.and.ellipse', symbolActive: 'location.fill' },
  { name: 'trips', label: 'Trips', symbol: 'clock.fill', symbolActive: 'clock.fill' },
  { name: 'account', label: 'Account', symbol: 'person.2.fill', symbolActive: 'person.2.fill' },
];

export default function TabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: palette.canvas },
          animation: 'shift',
        }}
        tabBar={({ state, navigation }) => (
          <TabBar
            items={items}
            activeIndex={state.index}
            onSelect={(index) => {
              const route = state.routes[index];
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) navigation.navigate(route.name);
            }}
          />
        )}
      >
        {items.map((item) => (
          <Tabs.Screen key={item.name} name={item.name} options={{ title: item.label }} />
        ))}
      </Tabs>

      <LiveRentalBar
        onPress={() => router.push('/rental')}
        bottom={Math.max(insets.bottom, 12) + TAB_BAR_HEIGHT + 10}
      />
    </View>
  );
}
