import { Text, View, type ImageSourcePropType } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { PlayerAvatar } from './PlayerAvatar';

export type PlayerPitchMarkerProps = {
  source: ImageSourcePropType;
  name: string;
  size?: number;
  accentColor?: string;
  ring?: boolean;
};

export function PlayerPitchMarker({
  source,
  name,
  size = 48,
  accentColor,
  ring,
}: PlayerPitchMarkerProps) {
  return (
    <View style={styles.column}>
      <PlayerAvatar
        source={source}
        size={size}
        ring={ring}
        accentColor={accentColor}
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText} numberOfLines={1}>
          {name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  column: {
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
    borderRadius: theme.radii.pill,
  },
  badgeText: {
    ...theme.typography.label,
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
}));
