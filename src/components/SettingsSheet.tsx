import { StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { useSettings } from '../hooks/useSettings';
import type { Settings } from '../types/Settings';
import { GlassButton } from './GlassButton';
import { GlassModal } from './GlassModal';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type BooleanKey = { [K in keyof Settings]: Settings[K] extends boolean ? K : never }[keyof Settings];

const OPTIONS: { key: BooleanKey; title: string; description: string; requiresInspection?: boolean }[] = [
  { key: 'inspectionEnabled', title: 'Inspeção de 15 s', description: 'Contagem regressiva antes de cada resolução, com +2 e DNF.' },
  {
    key: 'autoStartAtZero',
    title: 'Iniciar ao zerar a inspeção',
    description: 'O cronômetro começa sozinho em 0. Desligado: o +2 (15–17 s) e o DNF (>17 s) valem como no oficial.',
    requiresInspection: true,
  },
  { key: 'hideTimeWhileRunning', title: 'Ocultar tempo durante a resolução', description: 'Mostra só o resultado ao parar, sem distração.' },
  { key: 'haptics', title: 'Vibração', description: 'Resposta tátil ao ficar pronto, iniciar e parar.' },
];

export function SettingsSheet({ visible, onClose }: Props) {
  const { settings, updateSettings } = useSettings();
  return (
    <GlassModal visible={visible} onClose={onClose}>
      <Text style={styles.title}>Configurações</Text>
      {OPTIONS.map((option) => {
        const disabled = option.requiresInspection === true && !settings.inspectionEnabled;
        return (
          <View key={option.key} style={[styles.row, disabled && styles.disabled]}>
            <View style={styles.texts}>
              <Text style={styles.rowTitle}>{option.title}</Text>
              <Text style={styles.rowDescription}>{option.description}</Text>
            </View>
            <Switch
              value={settings[option.key]}
              disabled={disabled}
              onValueChange={(value) => updateSettings({ [option.key]: value })}
              trackColor={{ false: 'rgba(255,255,255,0.18)', true: colors.cyan }}
              thumbColor="#FFFFFF"
              accessibilityLabel={option.title}
            />
          </View>
        );
      })}
      <View style={styles.close}>
        <GlassButton label="Fechar" icon="checkmark" tone="accent" onPress={onClose} />
      </View>
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, minHeight: 64 },
  disabled: { opacity: 0.45 },
  texts: { flex: 1 },
  rowTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  rowDescription: { color: colors.textDim, fontSize: 13, lineHeight: 18, marginTop: 2 },
  close: { flexDirection: 'row', marginTop: 12 },
});
