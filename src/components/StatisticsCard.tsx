import { memo } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../constants/theme';
import { GlassCard } from './GlassCard';

interface TileProps {
  label: string;
  value: string;
  color?: string;
  compact?: boolean;
}

/** Rótulo + valor, sem moldura (usado dentro de um cartão maior). */
export const StatTile = memo(function StatTile({ label, value, color = colors.text, compact }: TileProps) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={[styles.value, compact && styles.valueCompact, { color }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
});

interface CardProps extends TileProps {
  style?: StyleProp<ViewStyle>;
  caption?: string;
}

/** Cartão de vidro independente para a tela de estatísticas. */
export function StatisticsCard({ label, value, color, caption, style }: CardProps) {
  return (
    <GlassCard style={style} padding={16} contentStyle={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={[styles.cardValue, { color: color ?? colors.text }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
        {value}
      </Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  value: { fontSize: 22, fontWeight: '300', fontVariant: ['tabular-nums'], marginBottom: 2 },
  valueCompact: { fontSize: 20 },
  label: { color: colors.textDim, fontSize: 12, fontWeight: '600', letterSpacing: 0.2 },
  card: { gap: 4, minHeight: 96, justifyContent: 'center' },
  cardLabel: { color: colors.textDim, fontSize: 14, fontWeight: '600' },
  cardValue: { fontSize: 38, fontWeight: '200', fontVariant: ['tabular-nums'] },
  caption: { color: colors.textDim, fontSize: 12 },
});
