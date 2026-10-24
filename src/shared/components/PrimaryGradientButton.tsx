import { Pressable, Text, type ViewProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { AppIcon } from './AppIcon';

export type PrimaryGradientButtonProps = {
  title: string;
  onPress?: () => void;
  fullWidth?: boolean;
  /** Optional Material icon name rendered after the title (e.g. arrow-forward). */
  endIcon?: string;
  testID?: ViewProps['testID'];
};

export function PrimaryGradientButton({
  title,
  onPress,
  fullWidth,
  endIcon,
  testID,
}: PrimaryGradientButtonProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.pressable, fullWidth && styles.pressableFull]}>
      <LinearGradient
        colors={[
          theme.colors.grassGradientStart,
          theme.colors.grassGradientEnd,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        <Text style={styles.label}>{title}</Text>
        {endIcon ? (
          <AppIcon name={endIcon} size={22} color="#ffffff" />
        ) : null}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create(theme => ({
  pressable: {
    borderRadius: theme.radii.pill,
    overflow: 'hidden',
    ...theme.ambientShadow,
  },
  pressableFull: {
    alignSelf: 'stretch',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[8],
  },
  label: {
    ...theme.typography.headline,
    fontSize: theme.typography.bodyLg,
    color: '#ffffff',
  },
}));
