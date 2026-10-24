import { Image, Text, View, type ImageSourcePropType } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

export type PlayerRowCardProps = {
  name: string;
  subtitle: string;
  rating: string;
  source: ImageSourcePropType;
  /** 0–3 “form” dots filled */
  formDots?: number;
};

export function PlayerRowCard({
  name,
  subtitle,
  rating,
  source,
  formDots = 0,
}: PlayerRowCardProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.row}>
      <Image source={source} style={styles.photo} />
      <View style={styles.mid}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </View>
      <View style={styles.tail}>
        <Text style={styles.rating}>{rating}</Text>
        <View style={styles.dots}>
          {[0, 1, 2].map(i => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i < formDots
                      ? theme.colors.primary
                      : theme.colors.outlineVariant,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radii.xl,
    padding: theme.spacing[3],
    gap: theme.spacing[4],
    ...theme.ambientShadow,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  mid: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...theme.typography.title,
    fontSize: theme.typography.bodyLg,
    color: theme.colors.onBackground,
  },
  sub: {
    ...theme.typography.label,
    fontSize: 10,
    color: theme.colors.outlineVariant,
    letterSpacing: 0.6,
  },
  tail: {
    alignItems: 'flex-end',
    gap: theme.spacing[1],
  },
  rating: {
    ...theme.typography.headline,
    fontSize: theme.typography.titleLg,
    color: theme.colors.primary,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
}));
