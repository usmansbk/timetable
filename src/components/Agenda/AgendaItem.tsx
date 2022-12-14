import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';
import {EventInput} from '~types';
import {formatEventTime} from '~utils/event';
import {ITEM_HEIGHT} from './constants';

interface Props {
  item: EventInput;
  onPress: (item: EventInput) => void;
  is24Hour?: boolean;
}

function AgendaItem({item, onPress, is24Hour}: Props) {
  const {t} = useTranslation();

  const timeFormat = formatEventTime(item, is24Hour);
  const time = timeFormat && t(timeFormat.key, {...timeFormat.options});

  return (
    <TouchableRipple disabled={!onPress} onPress={() => onPress?.(item)}>
      <View style={styles.container}>
        <Text variant="titleSmall" numberOfLines={1}>
          {item.title}
        </Text>
        {!!time && (
          <Text variant="bodySmall" numberOfLines={1}>
            {time}
          </Text>
        )}
      </View>
    </TouchableRipple>
  );
}

export default AgendaItem;

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
});
