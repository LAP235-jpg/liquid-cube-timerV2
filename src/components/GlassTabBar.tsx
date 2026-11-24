import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { useSettings } from '../hooks/useSettings';
import { GlassSurface } from './GlassSurface';

export type TabId = 'timer' | 'history' | 'stats';

const TABS: { id: TabId; label: string; icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'timer', label: 'Timer', icon: 'stopwatch-outline', iconActive: 'stopwatch' },
  { id: 'history', label: 'Histórico', icon: 'list-outline', iconActive: 'list' },
  { id: 'stats', label: 'Estatísticas', icon: 'stats-chart-outline', iconActive: 'stats-chart' },
];

export const TAB_BAR_HEIGHT = 68;
export const TAB_BAR_MARGIN = 14;

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function GlassTabBar({ active, onChange }: Props) {
  const insets = useSafeAreaInsets();
  const { settings } = useSettings();
  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 8) + TAB_BAR_MARGIN - 8 }]} pointerEvents="box-none">
      <GlassSurface radius={34} intensity={45}>
        <View style={styles.row}>
          {TABS.map((tab) => {
            const selected = tab.id === active;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tab, selected && styles.tabActive]}
                onPress={() => {
                  if (selected) return;
                  if (settings.haptics) Haptics.selectionAsync().catch(() => undefined);
                  onChange(tab.id);
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={tab.label}
              >
                <Ionicons name={selected ? tab.iconActive : tab.icon} size={22} color={selected ? colors.cyan : colors.textDim} />
                <Text style={[styles.label, { color: selected ? colors.text : colors.textDim }]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, zIndex: 10 },
  row: { flexDirection: 'row', height: TAB_BAR_HEIGHT, padding: 6, gap: 4 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 28, gap: 2 },
  tabActive: { backgroundColor: 'rgba(255,255,255,0.16)' },
  label: { fontSize: 11, fontWeight: '600' },
});
