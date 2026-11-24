import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { GlassButton } from '../components/GlassButton';
import { GlassCard } from '../components/GlassCard';
import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN } from '../components/GlassTabBar';
import { SolveDetailSheet } from '../components/SolveDetailSheet';
import { SolveItem } from '../components/SolveItem';
import { colors } from '../constants/theme';
import { useSolves } from '../hooks/useSolves';
import type { Solve } from '../types/Solve';

interface Row {
  solve: Solve;
  number: number;
}

export function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { solves, removeSolve, setPenalty, clearAll } = useSolves();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Mais recente primeiro; o número é a posição cronológica (1 = primeira resolução).
  const rows = useMemo<Row[]>(() => {
    const list: Row[] = [];
    for (let i = solves.length - 1; i >= 0; i--) list.push({ solve: solves[i], number: i + 1 });
    return list;
  }, [solves]);

  const selected = useMemo(() => rows.find((r) => r.solve.id === selectedId) ?? null, [rows, selectedId]);

  const openDetails = useCallback((solve: Solve) => setSelectedId(solve.id), []);
  const remove = useCallback(
    (solve: Solve) => {
      removeSolve(solve.id);
      setSelectedId((id) => (id === solve.id ? null : id));
    },
    [removeSolve],
  );

  const bottomPad = Math.max(insets.bottom, 8) + TAB_BAR_HEIGHT + TAB_BAR_MARGIN + 16;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Histórico</Text>
          <Text style={styles.subtitle}>{solves.length === 1 ? '1 resolução' : `${solves.length} resoluções`}</Text>
        </View>
        <GlassButton
          round
          icon="trash-outline"
          tone="danger"
          disabled={solves.length === 0}
          onPress={() => setConfirmClear(true)}
          accessibilityLabel="Excluir todas as resoluções"
        />
      </View>

      <FlatList
        data={rows}
        keyExtractor={(row) => row.solve.id}
        renderItem={({ item }) => <SolveItem solve={item.solve} number={item.number} onPress={openDetails} onDelete={remove} />}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        windowSize={9}
        ListEmptyComponent={
          <GlassCard>
            <Text style={styles.emptyTitle}>Nenhuma resolução ainda</Text>
            <Text style={styles.emptyText}>Faça uma resolução na aba Timer. Ela aparece aqui automaticamente.</Text>
          </GlassCard>
        }
      />

      <SolveDetailSheet
        solve={selected?.solve ?? null}
        number={selected?.number ?? 0}
        onClose={() => setSelectedId(null)}
        onSetPenalty={setPenalty}
        onDelete={remove}
      />
      <ConfirmDialog
        visible={confirmClear}
        title="Excluir todas as resoluções?"
        message={`Isso apaga ${solves.length} ${solves.length === 1 ? 'resolução' : 'resoluções'} e não pode ser desfeito.`}
        confirmLabel="Excluir tudo"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          clearAll();
          setSelectedId(null);
          setConfirmClear(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  title: { color: colors.text, fontSize: 28, fontWeight: '300', letterSpacing: 0.5 },
  subtitle: { color: colors.textDim, fontSize: 14, marginTop: 2 },
  list: { flexGrow: 1 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '600', marginBottom: 6 },
  emptyText: { color: colors.textDim, fontSize: 14, lineHeight: 20 },
});
