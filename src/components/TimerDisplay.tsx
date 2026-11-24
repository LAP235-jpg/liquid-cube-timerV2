import { memo, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, timerColors } from '../constants/theme';
import type { Solve } from '../types/Solve';
import type { TimerState } from '../types/Timer';
import { INSPECTION_MS, INSPECTION_PLUS_TWO_LIMIT_MS } from '../utils/inspection';
import { formatCentis } from '../utils/timeFormatter';

interface Props {
  state: TimerState;
  color: string;
  startedAt: number | null;
  inspectionStartedAt: number | null;
  /** Resolução atual (usada quando o estado é STOPPED). */
  solve: Solve | null;
  hideWhileRunning: boolean;
}

interface DisplayModel {
  main: string;
  note: string | null;
  tone: 'normal' | 'overtime' | 'dnf';
}

function compute({ state, startedAt, inspectionStartedAt, solve, hideWhileRunning }: Props, now: number): DisplayModel {
  if (state === 'RUNNING' && startedAt !== null) {
    return { main: hideWhileRunning ? '• • •' : formatCentis(now - startedAt), note: null, tone: 'normal' };
  }
  if ((state === 'INSPECTION' || state === 'READY') && inspectionStartedAt !== null) {
    const elapsed = now - inspectionStartedAt;
    if (elapsed <= INSPECTION_MS) {
      return { main: String(Math.ceil((INSPECTION_MS - elapsed) / 1000)), note: null, tone: 'normal' };
    }
    if (elapsed <= INSPECTION_PLUS_TWO_LIMIT_MS) return { main: '+2', note: 'Tempo de inspeção excedido: +2', tone: 'overtime' };
    return { main: 'DNF', note: 'Inspeção acima de 17 s: DNF', tone: 'dnf' };
  }
  if (state === 'STOPPED' && solve) {
    if (solve.finalMs === null) {
      return { main: 'DNF', note: solve.rawMs > 0 ? `Tempo bruto ${formatCentis(solve.rawMs)}` : 'Inspeção excedida', tone: 'dnf' };
    }
    if (solve.penalty === 'PLUS_TWO') {
      return { main: formatCentis(solve.finalMs), note: `${formatCentis(solve.rawMs)} + 2 s`, tone: 'overtime' };
    }
    return { main: formatCentis(solve.finalMs), note: null, tone: 'normal' };
  }
  return { main: '0.00', note: null, tone: 'normal' };
}

/**
 * O tempo é sempre calculado a partir de Date.now() - início. O setInterval só
 * agenda a repintura: se ele atrasar, o valor exibido continua correto.
 * Apenas este componente re-renderiza durante a contagem.
 */
export const TimerDisplay = memo(function TimerDisplay(props: Props) {
  const { state, startedAt, inspectionStartedAt, solve, hideWhileRunning, color } = props;
  const { width } = useWindowDimensions();
  const [view, setView] = useState<DisplayModel>(() => compute(props, Date.now()));

  useEffect(() => {
    const update = () => {
      const next = compute({ state, startedAt, inspectionStartedAt, solve, hideWhileRunning, color }, Date.now());
      setView((prev) => (prev.main === next.main && prev.note === next.note && prev.tone === next.tone ? prev : next));
    };
    update();
    let id: ReturnType<typeof setInterval> | undefined;
    if (state === 'RUNNING' && !hideWhileRunning) id = setInterval(update, 33);
    else if (inspectionStartedAt !== null && (state === 'INSPECTION' || state === 'READY')) id = setInterval(update, 100);
    return () => {
      if (id) clearInterval(id);
    };
  }, [state, startedAt, inspectionStartedAt, solve, hideWhileRunning, color]);

  const textColor = view.tone === 'dnf' ? timerColors.dnf : view.tone === 'overtime' ? timerColors.overtime : color;
  const isCountdown = view.main.length <= 3 && state !== 'IDLE' && inspectionStartedAt !== null;
  // Tamanho calculado (sem adjustsFontSizeToFit, que pode sumir com o texto em fontes grandes).
  const baseSize = isCountdown ? 120 : 92;
  const fontSize = Math.min(baseSize, Math.floor((width - 80) / (view.main.length * 0.58)));

  return (
    <View style={styles.wrap}>
      <Text
        style={[styles.time, { color: textColor, fontSize, lineHeight: Math.round(fontSize * 1.15) }]}
        numberOfLines={1}
        accessibilityLabel={`Tempo ${view.main}`}
        accessibilityLiveRegion="none"
      >
        {view.main}
      </Text>
      <Text style={[styles.note, { color: textColor, opacity: view.note ? 0.9 : 0 }]} numberOfLines={1}>
        {view.note ?? ' '}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', minHeight: 150, paddingHorizontal: 12 },
  time: {
    textAlign: 'center',
    ...Platform.select({
      android: { fontFamily: 'sans-serif-light' },
      default: { fontWeight: '200' as const },
    }),
    fontVariant: ['tabular-nums'],
  },
  note: { fontSize: 13, fontWeight: '600', color: colors.text, marginTop: 2, letterSpacing: 0.2 },
});
