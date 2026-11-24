import type { Solve } from '../types/Solve';
import {
  averageOfLast,
  bestRolling,
  bestSingle,
  meanOfValid,
  type AvgValue,
} from '../utils/averageCalculator';

export interface Statistics {
  total: number;
  dnfCount: number;
  last: Solve | null;
  currentAo3: AvgValue;
  currentAo5: AvgValue;
  mean: number | null;
  bestSingle: number | null;
  bestAo3: number | null;
  bestAo5: number | null;
}

/** `solves` deve estar em ordem cronológica (mais antiga primeiro). */
export function computeStatistics(solves: Solve[]): Statistics {
  const times = solves.map((s) => s.finalMs);
  return {
    total: solves.length,
    dnfCount: solves.filter((s) => s.penalty === 'DNF').length,
    last: solves.length > 0 ? solves[solves.length - 1] : null,
    currentAo3: averageOfLast(times, 3),
    currentAo5: averageOfLast(times, 5),
    mean: meanOfValid(times),
    bestSingle: bestSingle(times),
    bestAo3: bestRolling(times, 3),
    bestAo5: bestRolling(times, 5),
  };
}
