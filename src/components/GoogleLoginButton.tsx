import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from 'react-native-paper';
import {WEB_CLIENT_ID, IOS_CLIENT_ID} from '~constants';
import {useAppDispatch} from '~redux/hooks';
import {setAccessToken, setCurrentUser} from '~redux/auth/slice';
import {User} from '~types';
import showMessage from '~utils/toast';

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
      const {user, idToken} = await GoogleSignin.signIn();
      dispatch(setCurrentUser(user as User));
      dispatch(setAccessToken(idToken));
    } catch (e) {
      showMessage((e as Error).message);
      setLoading(false);
    }
  }, []);

  return (
    <Button disabled={loading} loading={loading} onPress={signin}>
      {t('Sign in with Google')}
    </Button>
  );
}

export default GoogleLoginButton;
