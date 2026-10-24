import { Pressable, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { AppIcon } from './AppIcon';

export type BottomNavItem = {
  id: string;
  label: string;
  icon: string;
};

export type BottomNavProps = {
  items: BottomNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function BottomNav({ items, activeId, onSelect }: BottomNavProps) {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.shell,
        {
          paddingBottom: Math.max(insets.bottom, theme.spacing[6]),
          backgroundColor: theme.colors.glassNav,
        },
      ]}>
      <View style={styles.row}>
        {items.map(item => {
          const active = item.id === activeId;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => onSelect(item.id)}
              style={styles.tabHit}>
              {active ? (
                <LinearGradient
                  colors={[
                    theme.colors.grassGradientStart,
                    theme.colors.grassGradientEnd,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.tabActive}>
                  <AppIcon name={item.icon} size={22} color="#ffffff" />
                  <Text style={styles.tabLabelActive}>{item.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabIdle}>
                  <AppIcon
                    name={item.icon}
                    size={22}
                    color={theme.colors.outlineVariant}
                  />
                  <Text style={styles.tabLabelIdle}>{item.label}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  shell: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: theme.radii.xxl,
    borderTopRightRadius: theme.radii.xxl,
    ...theme.ambientShadowUp,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: theme.spacing[3],
    paddingHorizontal: theme.spacing[2],
  },
  tabHit: {
    minWidth: 72,
    alignItems: 'center',
  },
  tabActive: {
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[2],
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  tabIdle: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  tabLabelActive: {
    ...theme.typography.label,
    fontSize: 11,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  tabLabelIdle: {
    ...theme.typography.label,
    fontSize: 11,
    color: theme.colors.outlineVariant,
    textTransform: 'uppercase',
  },
}));
