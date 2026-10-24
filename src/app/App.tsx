import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { HomeScreen } from '../features/home';

function AppRoot(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const { theme } = useUnistyles();

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <HomeScreen />
      </View>
    </>
  );
}

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppRoot />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
