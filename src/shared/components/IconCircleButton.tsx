import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { AppIcon } from './AppIcon';

export type IconCircleButtonProps = {
  icon: string;
  onPress?: () => void;
  size?: number;
};

export function IconCircleButton({
  icon,
  onPress,
  size = 40,
}: IconCircleButtonProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.hit, { width: size, height: size, borderRadius: size / 2 }]}>
      <View
        style={[
          styles.inner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.colors.surfaceContainerHighest,
          },
        ]}>
        <AppIcon name={icon} size={22} color={theme.colors.onSurface} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create(_theme => ({
  hit: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    opacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
