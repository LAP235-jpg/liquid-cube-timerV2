import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import type { HapticKind } from '../types/Timer';

export function useHaptics(enabled: boolean): (kind: HapticKind) => void {
  return useCallback(
    (kind: HapticKind) => {
      if (!enabled) return;
      const style =
        kind === 'start' || kind === 'stop'
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light;
      Haptics.impactAsync(style).catch(() => undefined);
    },
    [enabled],
  );
}
