import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

interface Props {
  label: string;
  color: string;
}

export const StateIndicator = memo(function StateIndicator({ label, color }: Props) {
  return (
    <View style={styles.pill} accessibilityRole="text" accessibilityLabel={`Estado: ${label}`}>
      <View style={[styles.dot, { backgroundColor: color, shadowColor: color }]} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.glassBorder,
  },
  dot: { width: 9, height: 9, borderRadius: 5, shadowOpacity: 0.9, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
  text: { color: colors.text, fontSize: 14, fontWeight: '600', letterSpacing: 0.3 },
});
