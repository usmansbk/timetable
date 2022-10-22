import {memo, useCallback} from 'react';
import {FlatList, FlatListProps, StyleSheet} from 'react-native';
import EmptyState from '~components/EmptyState';
import {EventInput} from '~types';
import AgendaItem from './AgendaItem';

interface Props<T extends EventInput> {
  items: T[];
  onPressItem: (item: T, index: number) => void;
  ListEmptyComponent?: FlatListProps<T>['ListEmptyComponent'];
}

function AgendaList<T extends EventInput>({
  items,
  ListEmptyComponent,
  onPressItem,
}: Props<T>) {
  const handlePress = useCallback(
    (item: T, index: number) => () => onPressItem(item, index),
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
