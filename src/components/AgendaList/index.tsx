import {memo} from 'react';
import {FlatList, FlatListProps, StyleSheet} from 'react-native';
import EmptyState from '~components/EmptyState';
import {EventInput} from '~types';
import AgendaItem from './AgendaItem';

interface Props {
  items: EventInput[];
  ListEmptyComponent?: FlatListProps<EventInput>['ListEmptyComponent'];
}

function AgendaList({items, ListEmptyComponent}: Props) {
  return (
    <FlatList
      contentContainerStyle={styles.contentContainer}
      data={items}
      renderItem={({item}) => <AgendaItem item={item} />}
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
