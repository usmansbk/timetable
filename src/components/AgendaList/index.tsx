import {memo, useCallback} from 'react';
import {FlatList, FlatListProps, StyleSheet} from 'react-native';
import EmptyState from '~components/EmptyState';
import {EventInput} from '~types';
import AgendaItem from './AgendaItem';

interface Props {
  items: EventInput[];
  onPressItem: (item: EventInput, index: number) => void;
  ListEmptyComponent?: FlatListProps<EventInput>['ListEmptyComponent'];
}

function AgendaList({items, ListEmptyComponent, onPressItem}: Props) {
  const handlePress = useCallback(
    (item: EventInput, index: number) => () => onPressItem(item, index),
    [],
  );

  return (
    <FlatList
      contentContainerStyle={styles.contentContainer}
      data={items}
      renderItem={({item, index}) => (
        <AgendaItem item={item} onPress={handlePress(item, index)} />
      )}
      ListEmptyComponent={
        ListEmptyComponent || <EmptyState title="No Events" />
      }
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});

export default memo(AgendaList);
