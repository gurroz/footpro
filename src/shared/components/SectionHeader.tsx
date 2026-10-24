import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type SectionHeaderProps = {
  kicker?: string;
  title: string;
  right?: React.ReactNode;
};

export function SectionHeader({ kicker, title, right }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[6],
    paddingHorizontal: theme.spacing[2],
  },
  textBlock: {
    flexShrink: 1,
    gap: theme.spacing[1],
  },
  kicker: {
    ...theme.typography.label,
    fontSize: 11,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  title: {
    ...theme.typography.headline,
    fontSize: theme.typography.headlineMd,
    color: theme.colors.onSurface,
  },
}));
