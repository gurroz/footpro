import { Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const fontSans = Platform.select({ ios: 'System', android: 'sans-serif' });

const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
} as const;

const radii = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  pill: 9999,
} as const;

const lightColors = {
  background: '#f5f6ff',
  surface: '#f5f6ff',
  surfaceContainerLow: '#edf0ff',
  surfaceContainerHigh: '#d9e2fd',
  surfaceContainerHighest: '#d3dcf9',
  surfaceContainerLowest: '#ffffff',
  onBackground: '#282f3f',
  onSurface: '#282f3f',
  onSurfaceVariant: '#545b6d',
  outline: '#707789',
  outlineVariant: '#a6adc1',
  primary: '#386631',
  primaryDim: '#2d5927',
  onPrimary: '#d2ffc4',
  primaryContainer: '#b9eeab',
  onPrimaryContainer: '#2d5a27',
  brandTitle: '#2d5a27',
  secondary: '#525c6d',
  secondaryContainer: '#d3ddf2',
  tertiary: '#006947',
  tertiaryContainer: '#69f6b8',
  onTertiaryContainer: '#005a3c',
  error: '#b02500',
  errorDim: '#b92902',
  onError: '#ffefec',
  inverseOnSurface: '#969db0',
  grassGradientStart: '#386631',
  grassGradientEnd: '#b9eeab',
  glassNav: 'rgba(255, 255, 255, 0.85)',
  pitchGrainDot: 'rgba(255, 255, 255, 0.2)',
} as const;

const darkColors = {
  ...lightColors,
  background: '#1a1c1e',
  surface: '#1a1c1e',
  surfaceContainerLow: '#2e3135',
  surfaceContainerHigh: '#3a3f45',
  surfaceContainerHighest: '#454b52',
  surfaceContainerLowest: '#25282c',
  onBackground: '#e2e2e6',
  onSurface: '#e2e2e6',
  onSurfaceVariant: '#8e9199',
  outline: '#8e9199',
  outlineVariant: '#5c6169',
  brandTitle: '#b9eeab',
  primaryContainer: '#3d5a38',
  glassNav: 'rgba(26, 28, 30, 0.88)',
} as const;

const shared = {
  spacing,
  radii,
  ambientShadow: {
    shadowColor: 'rgba(40, 47, 63, 0.06)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  ambientShadowUp: {
    shadowColor: 'rgba(40, 47, 63, 0.06)',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  typography: {
    headline: {
      fontFamily: fontSans,
      fontWeight: '800' as const,
    },
    title: {
      fontFamily: fontSans,
      fontWeight: '700' as const,
    },
    body: {
      fontFamily: fontSans,
      fontWeight: '400' as const,
    },
    label: {
      fontFamily: fontSans,
      fontWeight: '500' as const,
      letterSpacing: 0.8,
    },
    displayLg: 40,
    headlineMd: 28,
    titleLg: 22,
    bodyLg: 16,
    labelSm: 11,
    caption: 10,
  },
};

const lightTheme = {
  colors: lightColors,
  ...shared,
};

const darkTheme = {
  colors: darkColors,
  ...shared,
};

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
};

export type AppThemes = typeof appThemes;
export type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes: appThemes,
  breakpoints,
  settings: {
    adaptiveThemes: true,
  },
});
