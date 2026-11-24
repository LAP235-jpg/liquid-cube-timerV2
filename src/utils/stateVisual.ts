import { timerColors } from '../constants/theme';
import type { TimerState } from '../types/Timer';

export interface StateVisual {
  label: string;
  color: string;
  hint: string;
}

interface Input {
  state: TimerState;
  holding: boolean;
  inspecting: boolean;
  inspectionEnabled: boolean;
}

/** Texto e cor de cada estado do cronômetro (indicador visual + dica de uso). */
export function getStateVisual({ state, holding, inspecting, inspectionEnabled }: Input): StateVisual {
  const startHint = inspectionEnabled ? 'Segure e solte para iniciar a inspeção' : 'Segure até ficar verde e solte';
  if (holding && state !== 'READY' && state !== 'RUNNING') {
    return { label: 'Segure…', color: timerColors.holding, hint: 'Continue segurando' };
  }
  switch (state) {
    case 'IDLE':
      return { label: 'Aguardando', color: timerColors.idle, hint: startHint };
    case 'INSPECTION':
      return { label: 'Inspeção', color: timerColors.inspection, hint: 'Segure e solte para começar a resolver' };
    case 'READY':
      return {
        label: 'Pronto',
        color: timerColors.ready,
        hint: inspecting || !inspectionEnabled ? 'Solte para começar' : 'Solte para iniciar a inspeção',
      };
    case 'RUNNING':
      return { label: 'Cronometrando', color: timerColors.running, hint: 'Toque para parar' };
    case 'STOPPED':
      return { label: 'Finalizado', color: timerColors.stopped, hint: 'Segure para uma nova resolução' };
  }
}
