/** Tempo final em ms; null representa DNF. */
export type TimeValue = number | null;
/** Resultado de média: ms, 'DNF', ou null quando não há resoluções suficientes. */
export type AvgValue = number | 'DNF' | null;

function compare(a: number, b: number): number {
  return a === b ? 0 : a < b ? -1 : 1; // seguro com Infinity (a - b geraria NaN)
}

/**
 * Média de uma janela já com o tamanho correto.
 * trim = quantidade descartada em cada ponta (0 para Ao3, 1 para Ao5).
 */
function windowAverage(window: TimeValue[], trim: number): AvgValue {
  const sorted = window.map((v) => (v === null ? Infinity : v)).sort(compare);
  const kept = sorted.slice(trim, sorted.length - trim);
  if (kept.some((v) => !Number.isFinite(v))) return 'DNF';
  return kept.reduce((sum, v) => sum + v, 0) / kept.length;
}

function trimFor(n: number): number {
  return n >= 5 ? 1 : 0;
}

/** Média das últimas n resoluções (Ao3: média simples; Ao5: descarta melhor e pior). */
export function averageOfLast(values: TimeValue[], n: 3 | 5): AvgValue {
  if (values.length < n) return null;
  return windowAverage(values.slice(-n), trimFor(n));
}

/** Média móvel para cada posição da série (null até haver n resoluções). */
export function rollingAverages(values: TimeValue[], n: 3 | 5): AvgValue[] {
  return values.map((_, i) =>
    i + 1 < n ? null : windowAverage(values.slice(i + 1 - n, i + 1), trimFor(n)),
  );
}

/** Melhor média móvel numérica (ignora DNF). */
export function bestRolling(values: TimeValue[], n: 3 | 5): number | null {
  let best: number | null = null;
  for (const avg of rollingAverages(values, n)) {
    if (typeof avg === 'number' && (best === null || avg < best)) best = avg;
  }
  return best;
}

/** Média aritmética de todas as resoluções válidas (DNFs ficam de fora). */
export function meanOfValid(values: TimeValue[]): number | null {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return null;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

export function bestSingle(values: TimeValue[]): number | null {
  const valid = values.filter((v): v is number => v !== null);
  return valid.length === 0 ? null : Math.min(...valid);
}
