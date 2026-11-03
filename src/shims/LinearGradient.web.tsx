import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

type Point = { x: number; y: number };

type LinearGradientProps = {
  colors: string[];
  start?: Point;
  end?: Point;
  locations?: number[];
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * Browser stand-in for react-native-linear-gradient, which has no web build.
 */
export default function LinearGradient({
  colors,
  start = { x: 0.5, y: 0 },
  end = { x: 0.5, y: 1 },
  locations,
  style,
  children,
}: LinearGradientProps) {
  const angle =
    Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI) + 90;
  const stops = colors
    .map((color, index) => {
      const location = locations?.[index];
      return location == null ? color : `${color} ${location * 100}%`;
    })
    .join(', ');

  return (
    <View
      style={[
        style,
        {
          backgroundImage: `linear-gradient(${angle}deg, ${stops})`,
        } as ViewStyle,
      ]}>
      {children}
    </View>
  );
}
