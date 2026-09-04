import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const enabled = Platform.OS === 'ios';

/**
 * Haptics are a vocabulary, not a garnish. Each helper maps to one meaning so
 * the same physical sensation always means the same thing across the app.
 */
export const haptic = {
  /** Something was selected from a set (chips, segments, slider steps). */
  select: () => enabled && Haptics.selectionAsync(),
  /** A regular tap landed on a control. */
  tap: () => enabled && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  /** A consequential control — a card opening, a sheet committing. */
  press: () => enabled && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  /** Physical, irreversible-feeling actions: unlocking the car, starting the engine. */
  thud: () => enabled && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () => enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () => enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};
