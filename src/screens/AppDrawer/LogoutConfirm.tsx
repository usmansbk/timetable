import {memo, useCallback, useState} from 'react';
import {ToastAndroid, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, Checkbox, Dialog, Portal} from 'react-native-paper';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useAppDispatch} from '~redux/hooks';
import {clearTimetable} from '~redux/timetable/slice';
import {resetUserState} from '~redux/users/slice';
import {resetSettings} from '~redux/settings/slice';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

function LogoutConfirm({visible, onDismiss}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<'checked' | 'unchecked'>('unchecked');

  const onChangeValue = useCallback(() => {
    setStatus(status === 'checked' ? 'unchecked' : 'checked');
  }, [status]);

  const signOut = useCallback(async () => {
    onDismiss();
    try {
      dispatch(resetUserState());
      if (status === 'checked') {
        dispatch(clearTimetable());
        dispatch(resetSettings());
      }
      await GoogleSignin.signOut();
    } catch (e) {
      ToastAndroid.show((e as Error).message, ToastAndroid.SHORT);
    }
  }, [status, onDismiss]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{t('Log out?')}</Dialog.Title>
        <Dialog.Content>
          <Checkbox.Item
            label={t('Clear Timetable data')}
            status={status}
            onPress={onChangeValue}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <View>
            <Button mode="contained-tonal" onPress={onDismiss}>
              {t('Cancel')}
            </Button>
          </View>
          <View>
            <Button mode="contained" onPress={signOut}>
              {t('Yes')}
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default memo(LogoutConfirm);
