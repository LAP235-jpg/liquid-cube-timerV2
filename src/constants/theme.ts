export const colors = {
  bgDeep: '#040E26',
  bgMid: '#0A2566',
  bgBright: '#0E5FB5',
  violet: '#7C5CFF',
  cyan: '#5CE1FF',
  ice: '#BFE9FF',
  white: '#FFFFFF',
  text: 'rgba(255,255,255,0.96)',
  textDim: 'rgba(235,245,255,0.62)',
  glassFill: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.26)',
  glassHighlight: 'rgba(255,255,255,0.5)',
  mint: '#5CF2B0',
  orange: '#FFB056',
  red: '#FF6B7D',
  amber: '#FFD36B',
} as const;

export const radius = { sm: 14, md: 20, lg: 28, pill: 999 } as const;

export const timerColors = {
  idle: '#EAF6FF',
  holding: '#FF7A8A',
  inspection: '#8FDCFF',
  overtime: colors.orange,
  dnf: colors.red,
  ready: colors.mint,
  running: '#FFFFFF',
  stopped: '#C9B8FF',
} as const;

/** Cor de indicação por penalidade: azul/ciano normal, laranja +2, vermelho DNF. */
export function penaltyColor(penalty: 'NONE' | 'PLUS_TWO' | 'DNF'): string {
  if (penalty === 'DNF') return colors.red;
  if (penalty === 'PLUS_TWO') return colors.orange;
  return colors.cyan;
}
