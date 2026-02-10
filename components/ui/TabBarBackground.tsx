import { useSafeAreaInsets } from 'react-native-safe-area-context';

// On Android and web the tab bar is opaque white — no custom background needed.
export default undefined;

export function useBottomTabOverflow() {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, 4) + 56;
}
