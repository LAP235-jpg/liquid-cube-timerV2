export type Penalty = 'NONE' | 'PLUS_TWO' | 'DNF';
export type SolveStatus = 'VALID' | 'DNF';

export interface Solve {
  id: string;
  /** Tempo bruto medido, em milissegundos. Nunca é alterado por penalidades. */
  rawMs: number;
  /** Tempo final em ms (bruto + penalidade). null quando DNF. */
  finalMs: number | null;
  penalty: Penalty;
  /** Timestamp (ms) de quando a resolução terminou. */
  createdAt: number;
  status: SolveStatus;
}

export const PLUS_TWO_MS = 2000;
