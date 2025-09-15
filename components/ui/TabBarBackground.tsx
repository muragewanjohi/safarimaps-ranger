import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// This is a shim for web and Android where the tab bar is generally opaque.
export default undefined;

export function useBottomTabOverflow() {
  const insets = useSafeAreaInsets();
  
  if (Platform.OS === 'android') {
    return insets.bottom + 20; // Extra padding for rounded corners
  }
  
  return 20; // Extra padding for rounded corners on other platforms
}
