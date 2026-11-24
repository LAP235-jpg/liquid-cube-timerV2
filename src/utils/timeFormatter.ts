import type { Solve } from '../types/Solve';
import type { AvgValue } from './averageCalculator';

export const EMPTY_VALUE = '--';

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

/** Formata ms como "12.34" ou "1:02.34". Trunca centésimos (o relógio nunca "adianta"). */
export function formatCentis(ms: number): string {
  const cs = Math.max(0, Math.floor(ms / 10));
  const totalSeconds = Math.floor(cs / 100);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centis = cs % 100;
  return minutes > 0 ? `${minutes}:${pad2(seconds)}.${pad2(centis)}` : `${seconds}.${pad2(centis)}`;
}

export function formatSolveTime(solve: Solve | undefined | null): string {
  if (!solve) return EMPTY_VALUE;
  if (solve.finalMs === null) return 'DNF';
  const text = formatCentis(solve.finalMs);
  return solve.penalty === 'PLUS_TWO' ? `${text}+` : text;
}

/** Médias são arredondadas ao centésimo mais próximo. */
export function formatAverage(avg: AvgValue): string {
  if (avg === null) return EMPTY_VALUE;
  if (avg === 'DNF') return 'DNF';
  return formatCentis(Math.round(avg / 10) * 10);
}

export function formatNullable(ms: number | null): string {
  return ms === null ? EMPTY_VALUE : formatCentis(Math.round(ms / 10) * 10);
}

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${date} · ${time}`;
}
