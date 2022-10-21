import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

interface Props {
  title: string;
}

export default function EmptyState({title}: Props) {
  return (
    <View style={styles.container}>
      <Text variant="displaySmall">{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
