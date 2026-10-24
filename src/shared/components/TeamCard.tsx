import { Image, Text, View, type ImageSourcePropType } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { AppIcon } from './AppIcon';
import { SurfaceCard } from './SurfaceCard';

export type TeamCardProps = {
  teamName: string;
  playerLine: string;
  rankLabel: string;
  logoSource: ImageSourcePropType;
  stackSources: ImageSourcePropType[];
  extraCount?: number;
};

export function TeamCard({
  teamName,
  playerLine,
  rankLabel,
  logoSource,
  stackSources,
  extraCount,
}: TeamCardProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.wrap}>
      <View style={styles.logoFloat}>
        <Image source={logoSource} style={styles.logoImg} resizeMode="contain" />
      </View>
      <SurfaceCard paddedTop style={styles.card}>
        <View style={styles.row}>
          <View style={styles.left}>
            <Text style={styles.title}>{teamName}</Text>
            <View style={styles.metaRow}>
              <AppIcon name="group" size={16} color={theme.colors.primary} />
              <Text style={styles.meta}>{playerLine}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <Text style={styles.rank}>{rankLabel}</Text>
            <View style={styles.stack}>
              {stackSources.slice(0, 2).map((src, i) => (
                <View
                  key={i}
                  style={[styles.stackItem, i > 0 && styles.stackOverlap]}>
                  <Image source={src} style={styles.stackImg} />
                </View>
              ))}
              {extraCount != null && extraCount > 0 ? (
                <View style={[styles.stackItem, styles.stackMore, styles.stackOverlap]}>
                  <Text style={styles.stackMoreText}>+{extraCount}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  wrap: {
    position: 'relative',
    marginTop: theme.spacing[2],
  },
  logoFloat: {
    position: 'absolute',
    top: -theme.spacing[2],
    left: -theme.spacing[2],
    width: 64,
    height: 64,
    zIndex: 2,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.ambientShadow,
    overflow: 'hidden',
  },
  logoImg: {
    width: 40,
    height: 40,
  },
  card: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[4],
  },
  left: {
    flex: 1,
    gap: theme.spacing[1],
  },
  title: {
    ...theme.typography.headline,
    fontSize: theme.typography.titleLg,
    color: theme.colors.onBackground,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  meta: {
    ...theme.typography.label,
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  right: {
    alignItems: 'flex-end',
    gap: theme.spacing[1],
  },
  rank: {
    ...theme.typography.headline,
    fontSize: 32,
    color: theme.colors.primary,
  },
  stack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackOverlap: {
    marginLeft: -8,
  },
  stackItem: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.surfaceContainerLowest,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  stackImg: {
    width: '100%',
    height: '100%',
  },
  stackMore: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryContainer,
    borderColor: theme.colors.surfaceContainerLowest,
  },
  stackMoreText: {
    fontSize: 8,
    fontWeight: '800',
    color: theme.colors.onPrimaryContainer,
  },
}));
