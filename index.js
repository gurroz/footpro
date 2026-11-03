/**
 * @format
 */

import { Platform } from 'react-native';
import * as Font from 'expo-font';
import { registerRootComponent } from 'expo';

import './src/shared/theme/unistyles';
import App from './App';

if (Platform.OS === 'web') {
  void Font.loadAsync({
    'Material Icons': require('react-native-vector-icons/Fonts/MaterialIcons.ttf'),
  });
}

registerRootComponent(App);
