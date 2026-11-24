import { StyleSheet, Text, View } from 'react-native';
import { colors, penaltyColor } from '../constants/theme';
import type { Penalty, Solve } from '../types/Solve';
import { formatCentis, formatDate, formatSolveTime } from '../utils/timeFormatter';
import { GlassButton } from './GlassButton';
import { GlassModal } from './GlassModal';

interface Props {
  solve: Solve | null;
  number: number;
  onClose: () => void;
  onSetPenalty: (id: string, penalty: Penalty) => void;
  onDelete: (solve: Solve) => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const STATUS_LABEL = { VALID: 'Válida', DNF: 'DNF' } as const;
const PENALTY_LABEL: Record<Penalty, string> = { NONE: 'Sem penalidade', PLUS_TWO: '+2 segundos', DNF: 'DNF' };

export function SolveDetailSheet({ solve, number, onClose, onSetPenalty, onDelete }: Props) {
  return (
    <GlassModal visible={solve !== null} onClose={onClose}>
      {solve ? (
        <>
          <Text style={styles.heading}>Resolução {number}</Text>
          <Text style={[styles.big, { color: penaltyColor(solve.penalty) }]}>{formatSolveTime(solve)}</Text>
          <Row label="Tempo original" value={solve.rawMs > 0 ? formatCentis(solve.rawMs) : '--'} />
          <Row label="Tempo final" value={solve.finalMs === null ? 'DNF' : formatCentis(solve.finalMs)} />
          <Row label="Penalidade" value={PENALTY_LABEL[solve.penalty]} />
          <Row label="Status" value={STATUS_LABEL[solve.status]} />
          <Row label="Data e hora" value={formatDate(solve.createdAt)} />

          <Text style={styles.section}>Alterar penalidade</Text>
          <View style={styles.buttons}>
            <GlassButton label="Nenhuma" active={solve.penalty === 'NONE'} onPress={() => onSetPenalty(solve.id, 'NONE')} />
            <GlassButton label="+2" tone="warning" active={solve.penalty === 'PLUS_TWO'} onPress={() => onSetPenalty(solve.id, 'PLUS_TWO')} />
            <GlassButton label="DNF" tone="danger" active={solve.penalty === 'DNF'} onPress={() => onSetPenalty(solve.id, 'DNF')} />
          </View>
          <View style={[styles.buttons, { marginTop: 10 }]}>
            <GlassButton label="Excluir" icon="trash-outline" tone="danger" onPress={() => onDelete(solve)} />
            <GlassButton label="Fechar" icon="checkmark" tone="accent" onPress={onClose} />
          </View>
        </>
      ) : null}
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.textDim, fontSize: 15, fontWeight: '600' },
  big: { fontSize: 52, fontWeight: '200', fontVariant: ['tabular-nums'], marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 },
  rowLabel: { color: colors.textDim, fontSize: 14 },
  rowValue: { color: colors.text, fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] },
  section: { color: colors.textDim, fontSize: 13, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  buttons: { flexDirection: 'row', gap: 10 },
});
