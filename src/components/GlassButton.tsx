import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { colors, radius } from '../constants/theme';
import { useSettings } from '../hooks/useSettings';
import { GlassSurface } from './GlassSurface';

type IconName = keyof typeof Ionicons.glyphMap;
export type GlassTone = 'default' | 'warning' | 'danger' | 'accent';

const TONE_COLOR: Record<GlassTone, string | undefined> = {
  default: undefined,
  warning: colors.orange,
  danger: colors.red,
  accent: colors.cyan,
};

interface Props {
  label?: string;
  icon?: IconName;
  onPress: () => void;
  tone?: GlassTone;
  /** Destaca o botão (ex.: penalidade aplicada). */
  active?: boolean;
  /** Botões redondos de ícone (ex.: configurações). */
  round?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/** Botão de vidro com microinteração (escala + brilho) e área de toque ≥ 52 pt. */
export function GlassButton({
  label,
  icon,
  onPress,
  tone = 'default',
  active = false,
  round = false,
  disabled = false,
  style,
  accessibilityLabel,
}: Props) {
  const { settings } = useSettings();
  const press = useSharedValue(0);
  const color = TONE_COLOR[tone];
  const tint = color ?? undefined;

  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - press.value * 0.06, { damping: 18, stiffness: 320 }) }],
    opacity: withTiming(disabled ? 0.4 : 1 - press.value * 0.1, { duration: 90 }),
  }));

  const handlePress = () => {
    if (settings.haptics) Haptics.selectionAsync().catch(() => undefined);
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled, selected: active }}
      disabled={disabled}
      onPressIn={() => (press.value = 1)}
      onPressOut={() => (press.value = 0)}
      onPress={handlePress}
      style={[round ? styles.round : styles.flex, style]}
    >
      <Animated.View style={animated}>
        <GlassSurface radius={round ? radius.pill : radius.md} tint={active ? (color ?? colors.cyan) : tint} intensity={30}>
          <Animated.View style={[styles.inner, round && styles.innerRound, active && { backgroundColor: 'rgba(255,255,255,0.14)' }]}>
            {icon ? <Ionicons name={icon} size={round ? 22 : 20} color={active ? (color ?? colors.cyan) : (color ?? colors.text)} /> : null}
            {label ? (
              <Text style={[styles.label, { color: active ? (color ?? colors.cyan) : (color ?? colors.text) }]} numberOfLines={1}>
                {label}
              </Text>
            ) : null}
          </Animated.View>
        </GlassSurface>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  round: { width: 52, height: 52 },
  inner: { minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 8 },
  innerRound: { width: 52, height: 52, minHeight: 52, padding: 0 },
  label: { fontSize: 13, fontWeight: '600', letterSpacing: 0.2 },
});
