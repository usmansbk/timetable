import {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Title, TouchableRipple} from 'react-native-paper';
import {EventInput} from '~types';

interface Props {
  item: EventInput;
  onPress: () => void;
}

function AgendaItem({item, onPress}: Props) {
  const {title} = item;

  return (
    <TouchableRipple onPress={onPress}>
      <View style={styles.container}>
        <Title>{title}</Title>
      </View>
    </TouchableRipple>
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
