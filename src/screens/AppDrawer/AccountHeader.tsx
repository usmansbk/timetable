import {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import GoogleLoginButton from '~components/GoogleLoginButton';
import UserAvatar from '~components/UserAvatar';
import {User} from '~types';

interface Props {
  user: User | null;
}

function AccountHeader({user}: Props) {
  return (
    <View style={styles.container}>
      {!!user ? (
        <View style={styles.header}>
          <UserAvatar uri={user.photo} name={user.name} />
          <Text style={styles.name}>{user.name}</Text>
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
