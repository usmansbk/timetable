import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, ToastAndroid} from 'react-native';
import {Button} from 'react-native-paper';
import {WEB_CLIENT_ID, IOS_CLIENT_ID} from '~constants';
import {useAppDispatch} from '~redux/hooks';
import {setCurrentUser} from '~redux/user/slice';
import {User} from '~types';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
});

function GoogleLoginButton() {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const signin = useCallback(async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const {user} = await GoogleSignin.signIn();
      dispatch(setCurrentUser(user as User));
    } catch (e) {
      ToastAndroid.show((e as Error).message, ToastAndroid.SHORT);
      setLoading(false);
    }
  }, []);

  return (
    <Button disabled={loading} loading={loading} onPress={signin}>
      {t('Login with Google')}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
  },
});

export default GoogleLoginButton;
