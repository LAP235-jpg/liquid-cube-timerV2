import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors } from '../constants/theme';

const BLOBS = [
  { id: 'cyan', cx: '88%', cy: '12%', r: '55%', color: colors.cyan, opacity: 0.55 },
  { id: 'violet', cx: '6%', cy: '42%', r: '50%', color: colors.violet, opacity: 0.5 },
  { id: 'blue', cx: '78%', cy: '78%', r: '60%', color: '#2F7BFF', opacity: 0.5 },
  { id: 'ice', cx: '25%', cy: '96%', r: '38%', color: colors.ice, opacity: 0.28 },
] as const;

/** Fundo estático (sem animação): gradiente profundo + manchas luminosas suaves. */
export const LiquidBackground = memo(function LiquidBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[colors.bgDeep, colors.bgMid, '#0B3F8C']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          {BLOBS.map((b) => (
            <RadialGradient key={b.id} id={b.id} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={b.color} stopOpacity={b.opacity} />
              <Stop offset="55%" stopColor={b.color} stopOpacity={b.opacity * 0.35} />
              <Stop offset="100%" stopColor={b.color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        {BLOBS.map((b) => (
          <Circle key={b.id} cx={b.cx} cy={b.cy} r={b.r} fill={`url(#${b.id})`} />
        ))}
      </Svg>
    </View>
  );
});
