import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';
import {EventInput} from '~types';
import {formatUTCtoLocalTime} from '~utils/date';
import {ITEM_HEIGHT} from './constants';

interface Props {
  item: EventInput;
  onPress: (item: EventInput) => void;
}

function AgendaItem({item, onPress}: Props) {
  const {t} = useTranslation();
  const {title, startTime, endTime} = item;

  let time;
  const from = startTime && formatUTCtoLocalTime(startTime);
  const to = endTime && formatUTCtoLocalTime(endTime);

  if (from && to) {
    time = `${from}-${to}`;
  } else if (from) {
    time = from;
  } else if (to) {
    time = t('event_ends_at', {time: to});
  }

  return (
    <TouchableRipple disabled={!onPress} onPress={() => onPress?.(item)}>
      <View style={styles.container}>
        <Text variant="titleSmall" numberOfLines={1}>
          {title}
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
