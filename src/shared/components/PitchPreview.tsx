import { StyleSheet as RNStyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native-unistyles';

export type PitchPreviewProps = {
  caption?: string;
  height?: number;
};

/** Compact “tactical canvas” strip used in dashboards (tonal pitch + grain illusion). */
export function PitchPreview({
  caption = 'Tactical Canvas Live',
  height = 96,
}: PitchPreviewProps) {
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.grain} />
      <View style={styles.markings}>
        <View style={styles.halfLine} />
        <View style={styles.circle} />
      </View>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.25)']}
        style={styles.fade}
      />
      {caption ? (
        <Text style={styles.caption}>{caption}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.tertiary,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  grain: {
    ...RNStyleSheet.absoluteFill,
    opacity: 0.25,
    backgroundColor: theme.colors.pitchGrainDot,
  },
  markings: {
    ...RNStyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halfLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  fade: {
    ...RNStyleSheet.absoluteFill,
  },
  caption: {
    position: 'absolute',
    left: theme.spacing[4],
    bottom: theme.spacing[2],
    ...theme.typography.label,
    fontSize: theme.typography.caption,
    color: 'rgba(255,255,255,0.75)',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontWeight: '700',
  },
}));
