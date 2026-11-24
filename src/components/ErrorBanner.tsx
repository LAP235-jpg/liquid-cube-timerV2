import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { useSolves } from '../hooks/useSolves';
import { GlassCard } from './GlassCard';

/** Aviso discreto para falhas de leitura/gravação no armazenamento. */
export function ErrorBanner() {
  const { error, dismissError } = useSolves();
  const insets = useSafeAreaInsets();
  if (!error) return null;
  return (
    <Animated.View entering={FadeInUp.duration(200)} exiting={FadeOutUp.duration(150)} style={[styles.wrap, { top: insets.top + 8 }]}>
      <GlassCard padding={12} tint={colors.red} radius={20}>
        <View style={styles.row}>
          <Ionicons name="warning-outline" size={20} color={colors.red} />
          <Text style={styles.text}>{error}</Text>
          <Pressable onPress={dismissError} hitSlop={12} accessibilityRole="button" accessibilityLabel="Dispensar aviso">
            <Ionicons name="close" size={22} color={colors.text} />
          </Pressable>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, zIndex: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  text: { flex: 1, color: colors.text, fontSize: 14 },
});
