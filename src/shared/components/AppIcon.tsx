import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export type AppIconProps = {
  name: string;
  size?: number;
  color: string;
  style?: object;
};

export function AppIcon({ name, size = 24, color, style }: AppIconProps) {
  return (
    <MaterialIcons
      name={name as never}
      size={size}
      color={color}
      style={style}
    />
  );
}
