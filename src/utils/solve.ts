import { PLUS_TWO_MS, type Penalty, type Solve } from '../types/Solve';

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function computeFinal(rawMs: number, penalty: Penalty): number | null {
  if (penalty === 'DNF') return null;
  return penalty === 'PLUS_TWO' ? rawMs + PLUS_TWO_MS : rawMs;
}

export function createSolve(rawMs: number, penalty: Penalty, createdAt = Date.now()): Solve {
  return {
    id: generateId(),
    rawMs,
    finalMs: computeFinal(rawMs, penalty),
    penalty,
    createdAt,
    status: penalty === 'DNF' ? 'DNF' : 'VALID',
  };
}

/** Retorna uma cópia com outra penalidade; o tempo bruto permanece intacto. */
export function withPenalty(solve: Solve, penalty: Penalty): Solve {
  return {
    ...solve,
    penalty,
    finalMs: computeFinal(solve.rawMs, penalty),
    status: penalty === 'DNF' ? 'DNF' : 'VALID',
  };
}

export function isSolve(value: unknown): value is Solve {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.id === 'string' &&
    typeof s.rawMs === 'number' &&
    (typeof s.finalMs === 'number' || s.finalMs === null) &&
    (s.penalty === 'NONE' || s.penalty === 'PLUS_TWO' || s.penalty === 'DNF') &&
    typeof s.createdAt === 'number' &&
    (s.status === 'VALID' || s.status === 'DNF')
  );
}
