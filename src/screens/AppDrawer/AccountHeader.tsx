import {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import GoogleLoginButton from '~components/GoogleLoginButton';
import UserAvatar from '~components/UserAvatar';

interface Props {}

function AccountHeader({}: Props) {
  const user = null;
  const fullName = 'Usman';

  return (
    <View style={styles.container}>
      {!!user ? (
        <View style={styles.header}>
          <UserAvatar />
          <Text style={styles.name}>{fullName}</Text>
        </View>
      ) : (
        <GoogleLoginButton />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  button: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  name: {
    marginTop: 8,
    textAlign: 'center',
  },
});

export default memo(AccountHeader);
