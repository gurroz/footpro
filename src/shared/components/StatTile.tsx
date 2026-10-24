import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type StatTileProps = {
  label: string;
  value: string;
  /** Emphasize number with primary color */
  emphasize?: boolean;
};

export function StatTile({ label, value, emphasize }: StatTileProps) {
  return (
    <View style={styles.tile}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, emphasize ? styles.valueEmphasized : null]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  tile: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radii.lg,
    padding: theme.spacing[4],
    flex: 1,
    minHeight: 72,
    justifyContent: 'space-between',
    shadowColor: 'rgba(0,0,0,0.02)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    ...theme.typography.label,
    fontSize: theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  value: {
    ...theme.typography.headline,
    fontSize: theme.typography.headlineMd,
    color: theme.colors.onSurface,
  },
  valueEmphasized: {
    color: theme.colors.primary,
  },
}));
