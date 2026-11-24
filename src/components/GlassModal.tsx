import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { BlurTargetContext } from './GlassSurface';
import { GlassCard } from './GlassCard';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Modal de vidro. O Modal nativo roda em outra janela; por isso o alvo de
 * desfoque do Android é zerado aqui e o vidro usa a variante mais opaca.
 */
export function GlassModal({ visible, onClose, children }: Props) {
  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <BlurTargetContext.Provider value={null}>
        <Animated.View entering={FadeIn.duration(160)} exiting={FadeOut.duration(120)} style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fechar" />
          <Animated.View entering={ZoomIn.duration(200)} style={styles.sheet}>
            <GlassCard padding={20}>{children}</GlassCard>
          </Animated.View>
        </Animated.View>
      </BlurTargetContext.Provider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(2,8,28,0.62)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  sheet: { width: '100%', maxWidth: 420 },
});
