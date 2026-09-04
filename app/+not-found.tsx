import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { gutter, palette, space } from '@/theme';

export default function NotFound() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <Text variant="display" center>
        Wrong turn.
      </Text>
      <Text variant="body" tone="secondary" center style={styles.body}>
        That screen does not exist. Let us get you back to the fleet.
      </Text>
      <Button label="Back to Explore" size="lg" onPress={() => router.replace('/(tabs)/explore')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.base,
    paddingHorizontal: gutter,
    backgroundColor: palette.canvas,
  },
  body: { maxWidth: 300, marginBottom: space.sm },
});
