import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { createContext, useContext, type ComponentRef, type ReactNode, type RefObject } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../constants/theme';

/** No Android o BlurView precisa saber qual view ele deve desfocar (o fundo). */
type BlurTargetRef = RefObject<ComponentRef<typeof View> | null>;
export const BlurTargetContext = createContext<BlurTargetRef | null>(null);

interface Props {
  radius: number;
  intensity?: number;
  /** Cor que tinge o vidro (ex.: verde quando "pronto"). */
  tint?: string;
  /** Faz a superfície ocupar todo o espaço do contêiner (ex.: o pad do cronômetro). */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/**
 * Superfície base do Liquid Glass: desfoque + gradiente translúcido +
 * borda com reflexo luminoso. Sombra difusa fica no contêiner externo.
 */
export function GlassSurface({ radius, intensity = 38, tint, fill, style, children }: Props) {
  const blurTarget = useContext(BlurTargetContext);
  const canBlur = Platform.OS !== 'android' || blurTarget !== null;
  return (
    <View style={[styles.shadow, { borderRadius: radius }, style]}>
      <View style={[styles.clip, fill && styles.fill, { borderRadius: radius }]}>
        {canBlur ? (
          <BlurView
            intensity={intensity}
            tint="systemUltraThinMaterialDark"
            blurTarget={Platform.OS === 'android' ? (blurTarget ?? undefined) : undefined}
            blurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          // Sem alvo de desfoque (ex.: dentro de um Modal no Android): vidro mais opaco.
          <View style={[StyleSheet.absoluteFill, styles.fallback]} />
        )}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.05)', 'rgba(124,92,255,0.10)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {tint ? <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: tint, opacity: 0.12 }]} /> : null}
        {/* reflexo superior */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.38)', 'rgba(255,255,255,0)']}
          style={[styles.shine, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]}
        />
        {children}
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.border, { borderRadius: radius }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#020A24',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    backgroundColor: 'rgba(8,20,60,0.25)',
  },
  clip: { overflow: 'hidden' },
  fill: { flex: 1 },
  fallback: { backgroundColor: 'rgba(12,34,92,0.88)' },
  shine: { position: 'absolute', top: 0, left: 0, right: 0, height: '38%' },
  border: { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: colors.glassBorder },
});
