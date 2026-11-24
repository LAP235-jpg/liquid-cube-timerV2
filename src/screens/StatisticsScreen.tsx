import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '../components/GlassCard';
import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN } from '../components/GlassTabBar';
import { ProgressChart } from '../components/ProgressChart';
import { StatisticsCard } from '../components/StatisticsCard';
import { colors } from '../constants/theme';
import { useSolves } from '../hooks/useSolves';
import { formatNullable } from '../utils/timeFormatter';

export function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const { solves, stats } = useSolves();
  const bottomPad = Math.max(insets.bottom, 8) + TAB_BAR_HEIGHT + TAB_BAR_MARGIN + 16;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 8, paddingBottom: bottomPad }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Estatísticas</Text>

      <StatisticsCard label="Melhor resolução (Single PB)" value={formatNullable(stats.bestSingle)} color={colors.mint} />

      <View style={styles.grid}>
        <StatisticsCard style={styles.half} label="Melhor Ao3" value={formatNullable(stats.bestAo3)} />
        <StatisticsCard style={styles.half} label="Melhor Ao5" value={formatNullable(stats.bestAo5)} />
      </View>
      <View style={styles.grid}>
        <StatisticsCard style={styles.half} label="Média geral" value={formatNullable(stats.mean)} />
        <StatisticsCard
          style={styles.half}
          label="Resoluções"
          value={String(stats.total)}
          caption={stats.dnfCount > 0 ? `${stats.dnfCount} DNF` : undefined}
        />
      </View>

      <GlassCard>
        <Text style={styles.cardTitle}>Evolução</Text>
        <ProgressChart solves={solves} />
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  title: { color: colors.text, fontSize: 28, fontWeight: '300', letterSpacing: 0.5, marginBottom: 2 },
  grid: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  cardTitle: { color: colors.textDim, fontSize: 14, fontWeight: '600', marginBottom: 10 },
});
