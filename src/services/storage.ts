import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SETTINGS, type Settings } from '../types/Settings';
import type { Solve } from '../types/Solve';
import { isSolve } from '../utils/solve';

const KEYS = {
  solves: '@liquidcube/solves:v1',
  settings: '@liquidcube/settings:v1',
} as const;

export class StorageError extends Error {
  readonly cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'StorageError';
    this.cause = cause;
  }
}

/** Fila que serializa leituras/escritas e evita condições de corrida. */
let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task);
  queue = run.catch(() => undefined);
  return run;
}

async function readSolves(): Promise<Solve[]> {
  let raw: string | null;
  try {
    raw = await AsyncStorage.getItem(KEYS.solves);
  } catch (e) {
    throw new StorageError('Não foi possível ler as resoluções salvas.', e);
  }
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isSolve) : [];
  } catch (e) {
    throw new StorageError('Os dados salvos estão corrompidos.', e);
  }
}

async function writeSolves(solves: Solve[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.solves, JSON.stringify(solves));
  } catch (e) {
    throw new StorageError('Não foi possível salvar as resoluções.', e);
  }
}

export const loadSolves = (): Promise<Solve[]> => enqueue(readSolves);

export const saveSolve = (solve: Solve): Promise<void> =>
  enqueue(async () => {
    const solves = await readSolves();
    await writeSolves([...solves.filter((s) => s.id !== solve.id), solve]);
  });

export const updateSolve = (solve: Solve): Promise<void> =>
  enqueue(async () => {
    const solves = await readSolves();
    await writeSolves(solves.map((s) => (s.id === solve.id ? solve : s)));
  });

export const deleteSolve = (id: string): Promise<void> =>
  enqueue(async () => {
    const solves = await readSolves();
    await writeSolves(solves.filter((s) => s.id !== id));
  });

export const clearSolves = (): Promise<void> =>
  enqueue(async () => {
    try {
      await AsyncStorage.removeItem(KEYS.solves);
    } catch (e) {
      throw new StorageError('Não foi possível apagar as resoluções.', e);
    }
  });

export const loadSettings = (): Promise<Settings> =>
  enqueue(async () => {
    try {
      const raw = await AsyncStorage.getItem(KEYS.settings);
      if (raw === null) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(raw) as Partial<Settings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      throw new StorageError('Não foi possível ler as configurações.', e);
    }
  });

export const saveSettings = (settings: Settings): Promise<void> =>
  enqueue(async () => {
    try {
      await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
    } catch (e) {
      throw new StorageError('Não foi possível salvar as configurações.', e);
    }
  });
