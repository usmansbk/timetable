import {useCallback} from 'react';
import {View} from 'react-native';
import {Button, Dialog, Portal} from 'react-native-paper';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title: string;
  confirmText?: string;
  dismissText?: string;
}

export default function Confirm({
  title,
  visible,
  onDismiss,
  onConfirm,
  confirmText = 'Yes',
  dismissText = 'No',
}: Props) {
  const handleConfirm = useCallback(() => {
    onDismiss();
    onConfirm();
  }, [onConfirm, onDismiss]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Actions>
          <View>
            <Button mode="contained-tonal" onPress={onDismiss}>
              {dismissText}
            </Button>
          </View>
          <View>
            <Button mode="contained" onPress={handleConfirm}>
              {confirmText}
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
