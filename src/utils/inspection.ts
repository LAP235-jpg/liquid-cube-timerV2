import type { Penalty } from '../types/Solve';

export const INSPECTION_MS = 15000;
export const INSPECTION_PLUS_TWO_LIMIT_MS = 17000;

/** Até 15s: sem penalidade. Acima de 15s até 17s: +2. Acima de 17s: DNF. */
export function getInspectionPenalty(inspectionMs: number): Penalty {
  if (inspectionMs > INSPECTION_PLUS_TWO_LIMIT_MS) return 'DNF';
  if (inspectionMs > INSPECTION_MS) return 'PLUS_TWO';
  return 'NONE';
}
