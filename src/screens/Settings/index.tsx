import {StyleSheet, View} from 'react-native';
import {Title} from 'react-native-paper';
import {RootStackScreenProps} from '~types';

export default function Settings({}: RootStackScreenProps<'Settings'>) {
  return (
    <View style={styles.container}>
      <Title>Settings</Title>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
