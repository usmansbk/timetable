import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {CLIENT_ID} from '~constants';
import {useAppDispatch} from '~redux/hooks';
import {setCurrentUser} from '~redux/user/slice';
import {User} from '~types';

GoogleSignin.configure({
  webClientId: CLIENT_ID,
});

function GoogleLoginButton() {
  const {dark} = useTheme();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const signin = useCallback(async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const {user} = await GoogleSignin.signIn();
      dispatch(setCurrentUser(user as User));
    } catch (e) {
      setLoading(false);
    }
  }, []);

  return (
    <GoogleSigninButton
      disabled={loading}
      onPress={signin}
      style={styles.button}
      color={
        dark ? GoogleSigninButton.Color.Dark : GoogleSigninButton.Color.Light
      }
    />
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
  },
});

export default GoogleLoginButton;
