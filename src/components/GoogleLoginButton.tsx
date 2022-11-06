import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {CLIENT_ID} from '~constants';

GoogleSignin.configure({
  webClientId: CLIENT_ID,
});

function GoogleLoginButton() {
  const {dark} = useTheme();

  const signin = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (e) {}
  }, []);

  return (
    <GoogleSigninButton
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
