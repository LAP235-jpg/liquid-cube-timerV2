import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius as radii } from '../constants/theme';
import { GlassSurface } from './GlassSurface';

interface Props {
  children: ReactNode;
  radius?: number;
  padding?: number;
  tint?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function GlassCard({ children, radius = radii.lg, padding = 16, tint, style, contentStyle }: Props) {
  return (
    <GlassSurface radius={radius} tint={tint} style={style}>
      <View style={[styles.content, { padding }, contentStyle]}>{children}</View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({ content: { zIndex: 1 } });
