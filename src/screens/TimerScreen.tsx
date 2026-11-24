import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionPanel } from '../components/ActionPanel';
import { GlassButton } from '../components/GlassButton';
import { GlassCard } from '../components/GlassCard';
import { ScrambleBar } from '../components/ScrambleBar';
import { SettingsSheet } from '../components/SettingsSheet';
import { StatTile } from '../components/StatisticsCard';
import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN } from '../components/GlassTabBar';
import { TimerPad } from '../components/TimerPad';
import { colors, penaltyColor } from '../constants/theme';
import { useHaptics } from '../hooks/useHaptics';
import { useSettings } from '../hooks/useSettings';
import { useScramble } from '../hooks/useScramble';
import { useSolves } from '../hooks/useSolves';
import { useTimer } from '../hooks/useTimer';
import type { Penalty } from '../types/Solve';
import type { TimerResult } from '../types/Timer';
import { getStateVisual } from '../utils/stateVisual';
import { formatAverage, formatSolveTime } from '../utils/timeFormatter';

export function TimerScreen() {
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  const { solves, stats, addSolve, setPenalty, removeSolve } = useSolves();
  const haptic = useHaptics(settings.haptics);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { scramble, next: nextScramble } = useScramble();

  const onFinish = useCallback(
    (result: TimerResult) => {
      setCurrentId(addSolve(result.rawMs, result.penalty).id);
      nextScramble(); // a próxima resolução já tem um novo embaralhamento
    },
    [addSolve, nextScramble],
  );

  const timer = useTimer({
    inspectionEnabled: settings.inspectionEnabled,
    autoStartAtZero: settings.autoStartAtZero,
    onFinish,
    onHaptic: haptic,
  });

  const currentSolve = useMemo(() => {
    if (currentId === null) return null;
    for (let i = solves.length - 1; i >= 0; i--) if (solves[i].id === currentId) return solves[i];
    return null;
  }, [solves, currentId]);

  const stopped = timer.state === 'STOPPED';
  const visual = getStateVisual({
    state: timer.state,
    holding: timer.holding,
    inspecting: timer.inspectionStartedAt !== null,
    inspectionEnabled: settings.inspectionEnabled,
  });

  const setCurrentPenalty = useCallback(
    (penalty: Penalty) => {
      if (currentSolve) setPenalty(currentSolve.id, penalty);
    },
    [currentSolve, setPenalty],
  );

  const deleteCurrent = useCallback(() => {
    if (currentSolve) removeSolve(currentSolve.id);
    setCurrentId(null);
    timer.reset();
  }, [currentSolve, removeSolve, timer]);

  const saveCurrent = useCallback(() => {
    // A resolução já foi gravada automaticamente; aqui apenas se confirma e libera a próxima.
    timer.reset();
  }, [timer]);

  // Durante a resolução, o que não é o cronômetro fica quase invisível.
  const dimStyle = useAnimatedStyle(() => ({ opacity: withTiming(timer.state === 'RUNNING' ? 0.25 : 1, { duration: 200 }) }));

  const bottomPad = Math.max(insets.bottom, 8) + TAB_BAR_HEIGHT + TAB_BAR_MARGIN + 8;
  const lastColor = stats.last ? penaltyColor(stats.last.penalty) : colors.text;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: bottomPad }]}>
      <Animated.View style={[styles.header, dimStyle]}>
        <Text style={styles.title}>Liquid Cube</Text>
        <GlassButton round icon="options-outline" onPress={() => setSettingsOpen(true)} accessibilityLabel="Abrir configurações" />
      </Animated.View>

      <Animated.View style={dimStyle}>
        <ScrambleBar scramble={scramble} onRefresh={nextScramble} disabled={timer.state === 'RUNNING'} />
      </Animated.View>

      <TimerPad
        state={timer.state}
        holding={timer.holding}
        visual={visual}
        startedAt={timer.startedAt}
        inspectionStartedAt={timer.inspectionStartedAt}
        solve={stopped ? currentSolve : null}
        hideWhileRunning={settings.hideTimeWhileRunning}
        onPressDown={timer.pressDown}
        onPressUp={timer.pressUp}
      />

      <View style={styles.bottom}>
        {stopped && currentSolve ? (
          <ActionPanel solve={currentSolve} onSetPenalty={setCurrentPenalty} onDelete={deleteCurrent} onSave={saveCurrent} />
        ) : timer.state === 'INSPECTION' ? (
          <View style={styles.row}>
            <GlassButton label="Cancelar inspeção" icon="close" onPress={timer.reset} />
          </View>
        ) : null}

        <Animated.View style={dimStyle}>
          <GlassCard padding={12} radius={24}>
            <View style={styles.row}>
              <StatTile label="Última" value={formatSolveTime(stats.last)} color={lastColor} compact />
              <StatTile label="Ao3" value={formatAverage(stats.currentAo3)} compact />
              <StatTile label="Ao5" value={formatAverage(stats.currentAo5)} compact />
              <StatTile label="Média" value={formatAverage(stats.mean)} compact />
            </View>
          </GlassCard>
        </Animated.View>
      </View>

      <SettingsSheet visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 16, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.text, fontSize: 28, fontWeight: '300', letterSpacing: 0.5 },
  bottom: { gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
});
