import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, penaltyColor } from '../constants/theme';
import type { Solve } from '../types/Solve';
import { formatCentis, formatDate, formatSolveTime } from '../utils/timeFormatter';
import { GlassCard } from './GlassCard';

interface Props {
  solve: Solve;
  number: number;
  onPress: (solve: Solve) => void;
  onDelete: (solve: Solve) => void;
}

export const SolveItem = memo(function SolveItem({ solve, number, onPress, onDelete }: Props) {
  const color = penaltyColor(solve.penalty);
  const badge = solve.penalty === 'PLUS_TWO' ? '+2' : solve.penalty === 'DNF' ? 'DNF' : null;
  return (
    <View style={styles.wrap}>
      <GlassCard padding={0} radius={22}>
        <View style={styles.row}>
          <Pressable
            style={styles.main}
            onPress={() => onPress(solve)}
            accessibilityRole="button"
            accessibilityLabel={`Resolução ${number}, ${formatSolveTime(solve)}. Ver detalhes`}
          >
            <View style={[styles.bar, { backgroundColor: color }]} />
            <Text style={styles.number}>{number}</Text>
            <View style={styles.texts}>
              <View style={styles.timeRow}>
                <Text style={[styles.time, { color }]}>{formatSolveTime(solve)}</Text>
                {badge ? (
                  <View style={[styles.badge, { borderColor: color }]}>
                    <Text style={[styles.badgeText, { color }]}>{badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.date}>
                {formatDate(solve.createdAt)}
                {solve.penalty === 'PLUS_TWO' ? `  ·  bruto ${formatCentis(solve.rawMs)}` : ''}
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.delete}
            onPress={() => onDelete(solve)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Excluir resolução ${number}`}
          >
            <Ionicons name="trash-outline" size={20} color={colors.textDim} />
          </Pressable>
        </View>
      </GlassCard>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', minHeight: 68, paddingRight: 8 },
  bar: { width: 4, alignSelf: 'stretch', marginVertical: 12, marginLeft: 12, borderRadius: 2 },
  number: { width: 46, textAlign: 'center', color: colors.textDim, fontSize: 15, fontWeight: '600', fontVariant: ['tabular-nums'] },
  texts: { flex: 1, gap: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  time: { fontSize: 26, fontWeight: '300', fontVariant: ['tabular-nums'] },
  badge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  date: { color: colors.textDim, fontSize: 12 },
  delete: { width: 56, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
});
