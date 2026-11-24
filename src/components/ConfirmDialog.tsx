import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { GlassButton } from './GlassButton';
import { GlassModal } from './GlassModal';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ visible, title, message, confirmLabel, onConfirm, onCancel }: Props) {
  return (
    <GlassModal visible={visible} onClose={onCancel}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.row}>
        <GlassButton label="Cancelar" onPress={onCancel} />
        <GlassButton label={confirmLabel} icon="trash-outline" tone="danger" active onPress={onConfirm} />
      </View>
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  message: { color: colors.textDim, fontSize: 15, lineHeight: 21, marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12 },
});
