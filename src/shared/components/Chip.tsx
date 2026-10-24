import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type ChipProps = {
  label: string;
  variant?: 'primary' | 'neutral' | 'muted';
};

export function Chip({ label, variant = 'primary' }: ChipProps) {
  return (
    <View style={[styles.base, variant === 'primary' && styles.primary, variant === 'neutral' && styles.neutral, variant === 'muted' && styles.muted]}>
      <Text style={[styles.text, variant === 'primary' && styles.textPrimary, variant === 'neutral' && styles.textNeutral, variant === 'muted' && styles.textMuted]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  base: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radii.pill,
    alignSelf: 'flex-start',
  },
  primary: {
    backgroundColor: theme.colors.primaryContainer,
  },
  neutral: {
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  muted: {
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  text: {
    ...theme.typography.label,
    fontSize: theme.typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textPrimary: {
    color: theme.colors.onPrimaryContainer,
  },
  textNeutral: {
    color: theme.colors.onSurface,
  },
  textMuted: {
    color: theme.colors.onSurfaceVariant,
  },
}));
