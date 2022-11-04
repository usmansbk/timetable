import {memo, useCallback} from 'react';
import {Divider} from 'react-native-paper';
import {FlashList, FlashListProps, ListRenderItem} from '@shopify/flash-list';
import EmptyState from '~components/EmptyState';
import {EventInput} from '~types';
import AgendaItem from './AgendaItem';
import {ITEM_HEIGHT} from './constants';

interface Props<T extends EventInput> {
  items: T[];
  onPressItem: (item: T, index: number) => void;
  keyExtractor?: FlashListProps<T>['keyExtractor'];
  ListEmptyComponent?: FlashListProps<T>['ListEmptyComponent'];
}

function AgendaList<T extends EventInput>({
  items,
  ListEmptyComponent,
  onPressItem,
  keyExtractor,
}: Props<T>) {
  const handlePress = useCallback(
    (item: T, index: number) => () => onPressItem(item, index),
    [],
  );

  const renderItem: ListRenderItem<T> = useCallback(({item, index}) => {
    return <AgendaItem item={item} onPress={handlePress(item, index)} />;
  }, []);

  const _keyExtractor: FlashListProps<T>['keyExtractor'] = useCallback(
    (item: T, index: number) => {
      return item.id || String(index);
    },
    [],
  );

  return (
    <FlashList
      data={items}
      renderItem={renderItem}
      estimatedItemSize={ITEM_HEIGHT}
      ListEmptyComponent={
        ListEmptyComponent || <EmptyState title="No Events" />
      }
      ItemSeparatorComponent={Divider}
      keyExtractor={keyExtractor || _keyExtractor}
    />
  );
}

export default memo(AgendaList);
