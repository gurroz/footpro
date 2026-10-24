import { Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { AppIcon } from './AppIcon';

export type GrassFabProps = {
  icon?: string;
  onPress?: () => void;
};

export function GrassFab({ icon = 'add', onPress }: GrassFabProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.hit}>
      <LinearGradient
        colors={[
          theme.colors.grassGradientStart,
          theme.colors.grassGradientEnd,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.grad}>
        <AppIcon name={icon} size={28} color="#ffffff" />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create(_theme => ({
  hit: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  grad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
