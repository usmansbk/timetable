import {memo, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {SectionList, StyleSheet, View} from 'react-native';
import {Divider, Text, TouchableRipple} from 'react-native-paper';
import EmptyState from '~components/EmptyState';
import {useAppSelector} from '~redux/hooks';
import {selectIs24HourTimeFormat} from '~redux/settings/slice';
import {EventInput} from '~types';
import {groupByDate} from '~utils/calendar';
import {formatEventTime, formatRecurrence} from '~utils/event';
import AgendaDayHeader from './AgendaDayHeader';

interface Props<T extends EventInput> {
  items: T[];
  listEmptyMessage: string;
  onPressItem: (item: EventInput) => void;
  onPressDayHeader?: (date: string) => void;
}

function FlatAgendaList<T extends EventInput>({
  items,
  listEmptyMessage,
  onPressItem,
  onPressDayHeader,
}: Props<T>) {
  const is24Hour = useAppSelector(selectIs24HourTimeFormat);

  const sections = useMemo(() => groupByDate(items), [items]);

  return (
    <SectionList
      sections={sections}
      stickySectionHeadersEnabled
      contentContainerStyle={styles.contentContainer}
      renderSectionHeader={({section: {title}}) => (
        <AgendaDayHeader item={title} onPress={onPressDayHeader} />
      )}
      renderItem={({item}) => {
        return (
          <AgendaItem item={item} onPress={onPressItem} is24Hour={is24Hour} />
        );
      }}
      ListEmptyComponent={<EmptyState title={listEmptyMessage} />}
      ItemSeparatorComponent={Divider}
    />
  );
}

interface AgendaItemProps {
  item: EventInput;
  onPress: (item: EventInput) => void;
  is24Hour?: boolean;
}

function AgendaItem({item, onPress, is24Hour}: AgendaItemProps) {
  const {t} = useTranslation();

  const timeFormat = formatEventTime(item, is24Hour);
  const time = timeFormat && t(timeFormat.key, {...timeFormat.options});

  return (
    <TouchableRipple disabled={!onPress} onPress={() => onPress?.(item)}>
      <View style={styles.itemContainer}>
        <Text variant="titleSmall" numberOfLines={1}>
          {item.title}
        </Text>
        {!!time && (
          <Text variant="bodySmall" numberOfLines={1}>
            {time}
          </Text>
        )}
        {!!item.repeat && (
          <Text variant="bodySmall" numberOfLines={1}>
            {formatRecurrence(item.repeat)}
          </Text>
        )}
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  itemContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
});

export default memo(FlatAgendaList);
