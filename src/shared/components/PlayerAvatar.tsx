import { Image, View, type ImageSourcePropType, type ViewStyle } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type PlayerAvatarProps = {
  source: ImageSourcePropType;
  size?: number;
  ring?: boolean;
  accentColor?: string;
  style?: ViewStyle;
};

export function PlayerAvatar({
  source,
  size = 48,
  ring,
  accentColor,
  style,
}: PlayerAvatarProps) {
  const { theme } = useUnistyles();
  const borderColor = accentColor ?? (ring ? theme.colors.primary : 'transparent');
  const borderWidth = ring || accentColor ? 2 : 0;

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor,
        },
        style,
      ]}>
      <Image
        source={source}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  wrap: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...theme.ambientShadow,
  },
  image: {
    width: '100%',
    height: '100%',
  },
}));
