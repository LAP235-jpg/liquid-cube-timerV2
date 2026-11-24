import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { clearSolves, deleteSolve, loadSolves, saveSolve, updateSolve } from '../services/storage';
import { computeStatistics, type Statistics } from '../services/statistics';
import type { Penalty, Solve } from '../types/Solve';
import { createSolve, withPenalty } from '../utils/solve';

interface SolvesContextValue {
  /** Ordem cronológica: a mais antiga primeiro. */
  solves: Solve[];
  loaded: boolean;
  error: string | null;
  stats: Statistics;
  addSolve: (rawMs: number, penalty: Penalty) => Solve;
  setPenalty: (id: string, penalty: Penalty) => void;
  removeSolve: (id: string) => void;
  clearAll: () => void;
  dismissError: () => void;
}

const SolvesContext = createContext<SolvesContextValue | null>(null);

export function SolvesProvider({ children }: { children: ReactNode }) {
  const [solves, setSolves] = useState<Solve[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<Solve[]>([]);

  const commit = useCallback((next: Solve[]) => {
    ref.current = next;
    setSolves(next);
  }, []);

  const persist = useCallback((task: () => Promise<void>) => {
    task().catch((e: unknown) => setError(e instanceof Error ? e.message : 'Erro ao salvar os dados.'));
  }, []);

  useEffect(() => {
    let active = true;
    loadSolves()
      .then((list) => {
        if (!active) return;
        // Mantém resoluções criadas antes do fim do carregamento, se houver.
        const merged = [...list, ...ref.current.filter((s) => !list.some((l) => l.id === s.id))];
        commit(merged.sort((a, b) => a.createdAt - b.createdAt));
      })
      .catch((e: unknown) => active && setError(e instanceof Error ? e.message : 'Erro ao carregar os dados.'))
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [commit]);

  const addSolve = useCallback(
    (rawMs: number, penalty: Penalty) => {
      const solve = createSolve(rawMs, penalty);
      commit([...ref.current, solve]);
      persist(() => saveSolve(solve));
      return solve;
    },
    [commit, persist],
  );

  const setPenalty = useCallback(
    (id: string, penalty: Penalty) => {
      const current = ref.current.find((s) => s.id === id);
      if (!current || current.penalty === penalty) return;
      const updated = withPenalty(current, penalty);
      commit(ref.current.map((s) => (s.id === id ? updated : s)));
      persist(() => updateSolve(updated));
    },
    [commit, persist],
  );

  const removeSolve = useCallback(
    (id: string) => {
      commit(ref.current.filter((s) => s.id !== id));
      persist(() => deleteSolve(id));
    },
    [commit, persist],
  );

  const clearAll = useCallback(() => {
    commit([]);
    persist(() => clearSolves());
  }, [commit, persist]);

  const dismissError = useCallback(() => setError(null), []);
  const stats = useMemo(() => computeStatistics(solves), [solves]);

  const value = useMemo(
    () => ({ solves, loaded, error, stats, addSolve, setPenalty, removeSolve, clearAll, dismissError }),
    [solves, loaded, error, stats, addSolve, setPenalty, removeSolve, clearAll, dismissError],
  );
  return <SolvesContext.Provider value={value}>{children}</SolvesContext.Provider>;
}

export function useSolves(): SolvesContextValue {
  const ctx = useContext(SolvesContext);
  if (!ctx) throw new Error('useSolves deve ser usado dentro de SolvesProvider');
  return ctx;
}
