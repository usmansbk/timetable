import {useCallback} from 'react';
import {View} from 'react-native';
import {Button, Dialog, Portal} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

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
  confirmText,
  dismissText,
}: Props) {
  const {t} = useTranslation();
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
              {dismissText || t('No')}
            </Button>
          </View>
          <View>
            <Button mode="contained" onPress={handleConfirm}>
              {confirmText || t('Yes')}
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
