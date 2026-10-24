import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type ProgressTrackerProps = {
  stepLabel: string;
  title: string;
  /** 0–1 */
  progress: number;
  description?: string;
};

export function ProgressTracker({
  stepLabel,
  title,
  progress,
  description,
}: ProgressTrackerProps) {
  const { theme } = useUnistyles();
  const pct = Math.min(1, Math.max(0, progress));

  return (
    <View style={styles.block}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.step}>{stepLabel}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.percent}>{Math.round(pct * 100)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fillWrap, { width: `${pct * 100}%` }]}>
          <LinearGradient
            colors={[
              theme.colors.grassGradientStart,
              theme.colors.grassGradientEnd,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
        </View>
      </View>
      {description ? <Text style={styles.desc}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  block: {
    gap: theme.spacing[3],
    marginBottom: theme.spacing[6],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  step: {
    ...theme.typography.label,
    fontSize: 12,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  title: {
    ...theme.typography.headline,
    fontSize: theme.typography.titleLg,
    color: theme.colors.onSurface,
    marginTop: theme.spacing[1],
  },
  percent: {
    ...theme.typography.headline,
    fontSize: 32,
    color: theme.colors.primaryContainer,
    opacity: 0.45,
  },
  track: {
    height: 8,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.surfaceContainerHigh,
    overflow: 'hidden',
  },
  fillWrap: {
    height: '100%',
  },
  fill: {
    flex: 1,
    borderRadius: theme.radii.pill,
  },
  desc: {
    ...theme.typography.body,
    fontSize: theme.typography.bodyLg,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
  },
}));
