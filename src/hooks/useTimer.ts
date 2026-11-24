import { useCallback, useEffect, useRef, useState } from 'react';
import type { Penalty } from '../types/Solve';
import type { HapticKind, TimerResult, TimerState } from '../types/Timer';
import { getInspectionPenalty, INSPECTION_MS } from '../utils/inspection';
import { useInspection } from './useInspection';

/** Tempo que o dedo precisa ficar pressionado para o cronômetro ficar "pronto". */
const HOLD_MS = 200;
/** Bloqueio curto após parar, para evitar que o toque de parada inicie outra resolução. */
const STOP_LOCK_MS = 300;

interface Options {
  inspectionEnabled: boolean;
  autoStartAtZero: boolean;
  onFinish: (result: TimerResult) => void;
  onHaptic?: (kind: HapticKind) => void;
}

export function useTimer(options: Options) {
  const [state, setStateValue] = useState<TimerState>('IDLE');
  const [holding, setHolding] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [inspectionStartedAt, setInspectionStartedAt] = useState<number | null>(null);

  const stateRef = useRef<TimerState>('IDLE');
  const startRef = useRef<number | null>(null);
  const inspectionRef = useRef<number | null>(null);
  const penaltyRef = useRef<Penalty>('NONE');
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreRelease = useRef(false);
  const lockUntil = useRef(0);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const transition = useCallback((next: TimerState) => {
    stateRef.current = next;
    setStateValue(next);
  }, []);

  const clearHold = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  }, []);

  const finish = useCallback(
    (result: TimerResult) => {
      lockUntil.current = Date.now() + STOP_LOCK_MS;
      transition('STOPPED');
      optionsRef.current.onHaptic?.('stop');
      optionsRef.current.onFinish(result);
    },
    [transition],
  );

  const startSolve = useCallback(
    (forcedInspectionMs?: number) => {
      const now = Date.now();
      const inspectionStart = inspectionRef.current;
      const inspectionMs = forcedInspectionMs ?? (inspectionStart !== null ? now - inspectionStart : 0);
      penaltyRef.current = inspectionStart !== null ? getInspectionPenalty(inspectionMs) : 'NONE';
      inspectionRef.current = null;
      setInspectionStartedAt(null);
      startRef.current = now;
      setStartedAt(now);
      transition('RUNNING');
      optionsRef.current.onHaptic?.('start');
    },
    [transition],
  );

  const inspectionTimers = useInspection({
    onZero: () => {
      const s = stateRef.current;
      if (optionsRef.current.autoStartAtZero && (s === 'INSPECTION' || s === 'READY')) {
        inspectionTimers.cancel();
        // Se o dedo ainda estiver na tela, a soltura não deve fazer nada.
        ignoreRelease.current = s === 'READY';
        startSolve(INSPECTION_MS);
      }
    },
    onTimeout: () => {
      const s = stateRef.current;
      if (s !== 'INSPECTION' && s !== 'READY') return;
      clearHold();
      ignoreRelease.current = s === 'READY';
      inspectionRef.current = null;
      setInspectionStartedAt(null);
      setHolding(false);
      finish({ rawMs: 0, penalty: 'DNF' });
    },
  });

  const beginInspection = useCallback(() => {
    const now = Date.now();
    inspectionRef.current = now;
    setInspectionStartedAt(now);
    transition('INSPECTION');
    inspectionTimers.start(now);
  }, [inspectionTimers, transition]);

  const pressDown = useCallback(() => {
    const s = stateRef.current;
    const now = Date.now();

    if (s === 'RUNNING') {
      const raw = now - (startRef.current ?? now);
      startRef.current = null;
      ignoreRelease.current = true;
      finish({ rawMs: raw, penalty: penaltyRef.current });
      return;
    }
    if (now < lockUntil.current) {
      ignoreRelease.current = true;
      return;
    }
    if (s === 'READY') return;

    ignoreRelease.current = false;
    setHolding(true);
    clearHold();
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      const current = stateRef.current;
      if (current === 'IDLE' || current === 'STOPPED' || current === 'INSPECTION') {
        transition('READY');
        optionsRef.current.onHaptic?.('ready');
      }
    }, HOLD_MS);
  }, [clearHold, finish, transition]);

  const pressUp = useCallback(() => {
    setHolding(false);
    clearHold();
    if (ignoreRelease.current) {
      ignoreRelease.current = false;
      return;
    }
    if (stateRef.current !== 'READY') return; // soltou antes de ficar pronto

    if (inspectionRef.current !== null || !optionsRef.current.inspectionEnabled) {
      startSolve();
    } else {
      beginInspection();
    }
  }, [beginInspection, clearHold, startSolve]);

  const reset = useCallback(() => {
    clearHold();
    inspectionTimers.cancel();
    inspectionRef.current = null;
    startRef.current = null;
    penaltyRef.current = 'NONE';
    ignoreRelease.current = false;
    setHolding(false);
    setStartedAt(null);
    setInspectionStartedAt(null);
    transition('IDLE');
  }, [clearHold, inspectionTimers, transition]);

  useEffect(() => clearHold, [clearHold]);

  return { state, holding, startedAt, inspectionStartedAt, pressDown, pressUp, reset };
}
