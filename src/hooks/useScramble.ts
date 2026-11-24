import { useCallback, useState } from 'react';
import { generateScramble } from '../utils/scramble';

/** Mantém o embaralhamento atual; `next()` sorteia outro. */
export function useScramble() {
  const [scramble, setScramble] = useState(() => generateScramble());
  const next = useCallback(() => setScramble(generateScramble()), []);
  return { scramble, next };
}
