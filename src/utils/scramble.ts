const FACES = ['U', 'D', 'L', 'R', 'F', 'B'] as const;
const MODIFIERS = ['', "'", '2'] as const;
/** Faces opostas compartilham o mesmo eixo (U/D, L/R, F/B). */
const AXIS: Record<string, number> = { U: 0, D: 0, L: 1, R: 1, F: 2, B: 2 };

export const SCRAMBLE_LENGTH = 20;

/**
 * Embaralhamento 3x3 por movimentos aleatórios: nunca repete a mesma face em
 * sequência e nunca faz "R L R" (movimentos redundantes no mesmo eixo).
 */
export function generateScramble(length = SCRAMBLE_LENGTH): string {
  const moves: string[] = [];
  let last = '';
  let beforeLast = '';
  while (moves.length < length) {
    const face = FACES[Math.floor(Math.random() * FACES.length)];
    if (face === last) continue;
    if (beforeLast !== '' && AXIS[face] === AXIS[last] && AXIS[last] === AXIS[beforeLast]) continue;
    moves.push(face + MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)]);
    beforeLast = last;
    last = face;
  }
  return moves.join(' ');
}
