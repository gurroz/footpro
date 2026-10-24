import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { AppIcon } from './AppIcon';

export type AppBarProps = {
  title: string;
  variant?: 'menu' | 'back';
  onLeftPress?: () => void;
  rightSlot?: React.ReactNode;
  /** Optional small brand text (e.g. onboarding step screens). */
  trailingLabel?: string;
};

export function AppBar({
  title,
  variant = 'menu',
  onLeftPress,
  rightSlot,
  trailingLabel,
}: AppBarProps) {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.shell,
        { paddingTop: insets.top, backgroundColor: theme.colors.surface },
      ]}>
      <View style={styles.bar}>
      <View style={styles.left}>
        <Pressable
          accessibilityRole="button"
          hitSlop={12}
          onPress={onLeftPress}
          style={styles.iconHit}>
          <AppIcon
            name={variant === 'back' ? 'arrow-back' : 'menu'}
            size={24}
            color={theme.colors.brandTitle}
          />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {trailingLabel ? (
        <Text style={styles.trailing}>{trailingLabel}</Text>
      ) : null}
      {rightSlot ? <View style={styles.right}>{rightSlot}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  shell: {
    zIndex: 50,
  },
  bar: {
    height: 64,
    paddingHorizontal: theme.spacing[6],
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  iconHit: {
    padding: theme.spacing[1],
    borderRadius: theme.radii.pill,
  },
  title: {
    ...theme.typography.title,
    fontSize: theme.typography.titleLg,
    color: theme.colors.onSurface,
    flexShrink: 1,
  },
  trailing: {
    ...theme.typography.label,
    fontSize: theme.typography.caption,
    fontWeight: '800',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
}));
