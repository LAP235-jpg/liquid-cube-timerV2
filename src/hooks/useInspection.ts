import { useCallback, useEffect, useRef } from 'react';
import { INSPECTION_MS, INSPECTION_PLUS_TWO_LIMIT_MS } from '../utils/inspection';

interface Options {
  /** Chamado quando a contagem chega a zero (15 s). */
  onZero: () => void;
  /** Chamado quando passam 17 s: inspeção excedida (DNF). */
  onTimeout: () => void;
}

/**
 * Agenda os dois marcos da inspeção. Os valores exibidos e as penalidades usam
 * timestamps reais (Date.now); os timeouts apenas disparam as transições.
 */
export function useInspection({ onZero, onTimeout }: Options) {
  const zeroTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbacks = useRef({ onZero, onTimeout });
  callbacks.current = { onZero, onTimeout };

  const cancel = useCallback(() => {
    if (zeroTimer.current) clearTimeout(zeroTimer.current);
    if (timeoutTimer.current) clearTimeout(timeoutTimer.current);
    zeroTimer.current = null;
    timeoutTimer.current = null;
  }, []);

  const start = useCallback(
    (startedAt: number) => {
      cancel();
      const elapsed = Date.now() - startedAt;
      zeroTimer.current = setTimeout(() => callbacks.current.onZero(), Math.max(0, INSPECTION_MS - elapsed));
      timeoutTimer.current = setTimeout(
        () => callbacks.current.onTimeout(),
        Math.max(0, INSPECTION_PLUS_TWO_LIMIT_MS - elapsed) + 1,
      );
    },
    [cancel],
  );

  useEffect(() => cancel, [cancel]);

  return { start, cancel };
}
