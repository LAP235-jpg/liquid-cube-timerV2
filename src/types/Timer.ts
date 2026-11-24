import type { Penalty } from './Solve';

export type TimerState = 'IDLE' | 'INSPECTION' | 'READY' | 'RUNNING' | 'STOPPED';

export interface TimerResult {
  rawMs: number;
  penalty: Penalty;
}

export type HapticKind = 'ready' | 'start' | 'stop' | 'select';
