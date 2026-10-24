import { View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type SurfaceCardProps = ViewProps & {
  /** Extra vertical padding for cards that sit under a floated badge */
  paddedTop?: boolean;
};

export function SurfaceCard({
  children,
  style,
  paddedTop,
  ...rest
}: SurfaceCardProps) {
  return (
    <View style={[styles.card, paddedTop && styles.cardPaddedTop, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  card: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radii.pill,
    padding: theme.spacing[6],
    ...theme.ambientShadow,
  },
  cardPaddedTop: {
    paddingTop: theme.spacing[10],
  },
}));
