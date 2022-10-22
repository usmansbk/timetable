import {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Title} from 'react-native-paper';
import {EventInput} from '~types';

interface Props {
  item: EventInput;
}

function AgendaItem({item}: Props) {
  const {title} = item;
  return (
    <View style={styles.container}>
      <Title>{title}</Title>
    </View>
  );
}

export default memo(AgendaItem);

const styles = StyleSheet.create({
  container: {
    height: 40,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
});
