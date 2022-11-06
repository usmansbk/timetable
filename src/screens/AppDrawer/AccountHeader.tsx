import {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import UserAvatar from '~components/UserAvatar';

interface Props {}

function AccountHeader({}: Props) {
  const {t} = useTranslation();

  const user = {fullName: 'Babakolo Usman Suleiman'};
  const {fullName} = user;

  return (
    <View style={styles.container}>
      {!!user ? (
        <View style={styles.header}>
          <UserAvatar />
          <Text style={styles.name}>{fullName}</Text>
        </View>
      ) : (
        <View style={styles.button}>
          <Button mode="contained" uppercase onPress={() => null}>
            {t('Login')}
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  header: {
    paddingVertical: 16,
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
