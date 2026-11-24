import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, useLongPressGesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { colors, radius } from '../constants/theme';
import type { Solve } from '../types/Solve';
import type { TimerState } from '../types/Timer';
import type { StateVisual } from '../utils/stateVisual';
import { GlassSurface } from './GlassSurface';
import { StateIndicator } from './StateIndicator';
import { TimerDisplay } from './TimerDisplay';

interface Props {
  state: TimerState;
  holding: boolean;
  visual: StateVisual;
  startedAt: number | null;
  inspectionStartedAt: number | null;
  solve: Solve | null;
  hideWhileRunning: boolean;
  onPressDown: () => void;
  onPressUp: () => void;
}

/** Área principal de interação: toda a superfície de vidro é o botão. */
export function TimerPad({
  state,
  holding,
  visual,
  startedAt,
  inspectionStartedAt,
  solve,
  hideWhileRunning,
  onPressDown,
  onPressUp,
}: Props) {
  const handlers = useRef({ onPressDown, onPressUp });
  handlers.current = { onPressDown, onPressUp };
  const pressed = useRef(false);

  const gesture = useLongPressGesture({
    minDuration: 0,
    maxDistance: 10000,
    shouldCancelWhenOutside: false,
    runOnJS: true,
    onBegin: () => {
      if (pressed.current) return;
      pressed.current = true;
      handlers.current.onPressDown();
    },
    onFinalize: () => {
      if (!pressed.current) return;
      pressed.current = false;
      handlers.current.onPressUp();
    },
  });

  const scale = useSharedValue(1);
  const ringColor = useSharedValue<string>(visual.color);
  useEffect(() => {
    scale.value = withSpring(holding ? 0.985 : 1, { damping: 20, stiffness: 260 });
  }, [holding, scale]);
  useEffect(() => {
    ringColor.value = visual.color;
  }, [visual.color, ringColor]);

  const containerStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({ borderColor: withTiming(ringColor.value, { duration: 160 }) }));
  const glowStyle = useAnimatedStyle(() => ({ backgroundColor: withTiming(ringColor.value, { duration: 160 }) }));
  // Película de cor sutil: mais presente em "segure/pronto", quase nula durante a resolução.
  const glowOpacity = state === 'RUNNING' ? 0.03 : state === 'IDLE' && !holding ? 0.04 : 0.16;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, containerStyle]} accessibilityRole="button" accessibilityLabel={`Cronômetro. ${visual.label}. ${visual.hint}`}>
        <GlassSurface radius={radius.lg + 8} intensity={34} fill style={styles.surface}>
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, glowStyle, { opacity: glowOpacity }]} />
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, ringStyle, styles.ring]} />
          <View style={styles.content} pointerEvents="none">
            <StateIndicator label={visual.label} color={visual.color} />
            <TimerDisplay
              state={state}
              color={visual.color}
              startedAt={startedAt}
              inspectionStartedAt={inspectionStartedAt}
              solve={solve}
              hideWhileRunning={hideWhileRunning}
            />
            <Text style={styles.hint}>{visual.hint}</Text>
          </View>
        </GlassSurface>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  surface: { flex: 1 },
  ring: { borderWidth: 2, borderRadius: radius.lg + 8 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 28, paddingHorizontal: 12 },
  hint: { color: colors.textDim, fontSize: 14, fontWeight: '500', textAlign: 'center' },
});
