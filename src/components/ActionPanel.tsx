import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import type { Penalty, Solve } from '../types/Solve';
import { GlassButton } from './GlassButton';

interface Props {
  solve: Solve;
  onSetPenalty: (penalty: Penalty) => void;
  onDelete: () => void;
  onSave: () => void;
}

/** Painel exibido ao finalizar uma resolução. +2 e DNF alternam (tocar de novo remove). */
export function ActionPanel({ solve, onSetPenalty, onDelete, onSave }: Props) {
  return (
    <Animated.View entering={FadeInDown.duration(180)} exiting={FadeOutDown.duration(120)} style={styles.row}>
      <GlassButton
        label="+2"
        icon="add-circle-outline"
        tone="warning"
        active={solve.penalty === 'PLUS_TWO'}
        onPress={() => onSetPenalty(solve.penalty === 'PLUS_TWO' ? 'NONE' : 'PLUS_TWO')}
        accessibilityLabel={solve.penalty === 'PLUS_TWO' ? 'Remover penalidade mais dois' : 'Adicionar penalidade mais dois'}
      />
      <GlassButton
        label="DNF"
        icon="close-circle-outline"
        tone="danger"
        active={solve.penalty === 'DNF'}
        onPress={() => onSetPenalty(solve.penalty === 'DNF' ? 'NONE' : 'DNF')}
        accessibilityLabel={solve.penalty === 'DNF' ? 'Remover DNF' : 'Marcar como DNF'}
      />
      <GlassButton label="Excluir" icon="trash-outline" onPress={onDelete} />
      <GlassButton label="Salvar" icon="checkmark-circle-outline" tone="accent" onPress={onSave} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', gap: 10 } });
