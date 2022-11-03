import {memo} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Text} from 'react-native-paper';
import {EventInput} from '~types';

interface Props {
  event: EventInput;
}

// TODO: event defails
function EventDetails({event}: Props) {
  const {title} = event;

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall">{title}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
});

export default memo(EventDetails);
