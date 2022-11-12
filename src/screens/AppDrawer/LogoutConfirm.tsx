import {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useAppDispatch} from '~redux/hooks';
import {clearTimetable} from '~redux/timetable/slice';
import {resetUserState} from '~redux/users/slice';
import {resetSettings} from '~redux/settings/slice';
import showMessage from '~utils/toast';
import Confirm from '~components/Confirm';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

function LogoutConfirm({visible, onDismiss}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const signOut = useCallback(async () => {
    onDismiss();
    try {
      dispatch(resetUserState());
      dispatch(clearTimetable());
      dispatch(resetSettings());
      await GoogleSignin.signOut();
    } catch (e) {
      showMessage((e as Error).message);
    }
  }, [, onDismiss]);

  return (
    <Confirm
      visible={visible}
      title={t('Log out?')}
      onConfirm={signOut}
      onDismiss={onDismiss}
    />
  );
}

export default memo(LogoutConfirm);
