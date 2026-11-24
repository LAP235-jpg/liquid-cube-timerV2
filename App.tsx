import { BlurTargetView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState, type ComponentRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBanner } from './src/components/ErrorBanner';
import { BlurTargetContext } from './src/components/GlassSurface';
import { GlassTabBar, type TabId } from './src/components/GlassTabBar';
import { LiquidBackground } from './src/components/LiquidBackground';
import { colors } from './src/constants/theme';
import { SettingsProvider } from './src/hooks/useSettings';
import { SolvesProvider } from './src/hooks/useSolves';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { StatisticsScreen } from './src/screens/StatisticsScreen';
import { TimerScreen } from './src/screens/TimerScreen';

const SCREENS: { id: TabId; Component: () => React.JSX.Element }[] = [
  { id: 'timer', Component: TimerScreen },
  { id: 'history', Component: HistoryScreen },
  { id: 'stats', Component: StatisticsScreen },
];

function Shell() {
  const blurTarget = useRef<ComponentRef<typeof View>>(null);
  const [tab, setTab] = useState<TabId>('timer');
  return (
    <BlurTargetContext.Provider value={blurTarget}>
      <View style={styles.root}>
        <BlurTargetView ref={blurTarget} style={StyleSheet.absoluteFill}>
          <LiquidBackground />
        </BlurTargetView>
        <StatusBar style="light" />
        {/* Todas as telas ficam montadas: o cronômetro não perde o estado ao trocar de aba. */}
        {SCREENS.map(({ id, Component }) => (
          <View key={id} style={[StyleSheet.absoluteFill, id !== tab && styles.hidden]} pointerEvents={id === tab ? 'auto' : 'none'}>
            <Component />
          </View>
        ))}
        <ErrorBanner />
        <GlassTabBar active={tab} onChange={setTab} />
      </View>
    </BlurTargetContext.Provider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <SettingsProvider>
          <SolvesProvider>
            <Shell />
          </SolvesProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgDeep },
  hidden: { display: 'none' },
});
