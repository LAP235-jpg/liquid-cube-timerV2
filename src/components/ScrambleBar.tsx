import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { GlassCard } from './GlassCard';

interface Props {
  scramble: string;
  onRefresh: () => void;
  disabled?: boolean;
}

/** Faixa de vidro com o embaralhamento atual. Tocar sorteia outro. */
export const ScrambleBar = memo(function ScrambleBar({ scramble, onRefresh, disabled }: Props) {
  return (
    <Pressable
      onPress={onRefresh}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Embaralhamento: ${scramble}. Toque para gerar outro`}
    >
      <GlassCard padding={12} radius={20}>
        <View style={styles.row}>
          <Text style={styles.text}>{scramble}</Text>
          <Ionicons name="shuffle" size={20} color={colors.cyan} />
        </View>
      </GlassCard>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  text: { flex: 1, color: colors.text, fontSize: 17, fontWeight: '500', letterSpacing: 1.2, lineHeight: 25, fontVariant: ['tabular-nums'] },
});
