export interface Settings {
  inspectionEnabled: boolean;
  /** Inicia o cronômetro automaticamente quando a inspeção chega a zero. */
  autoStartAtZero: boolean;
  haptics: boolean;
  /** Mostra "• • •" no lugar do tempo enquanto a resolução está em andamento. */
  hideTimeWhileRunning: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  inspectionEnabled: true,
  autoStartAtZero: false,
  haptics: true,
  hideTimeWhileRunning: false,
};
