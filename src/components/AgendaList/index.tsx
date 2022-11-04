import {memo, useCallback, useState} from 'react';
import {
  Divider,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {FlashList, FlashListProps, ListRenderItem} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  RefreshControl,
  RefreshControlProps,
} from 'react-native';
import {formatCalendarDate} from '~utils/date';
import EmptyState from '~components/EmptyState';
import {EventInput} from '~types';
import AgendaItem from './AgendaItem';
import {ITEM_HEIGHT} from './constants';

const modes = {
  PAST: 'PAST',
  UPCOMING: 'UPCOMING',
};

interface Props<T extends EventInput> {
  items: T[];
  onPressItem: (item: T, index: number) => void;
  keyExtractor?: FlashListProps<T>['keyExtractor'];
  listEmptyMessage?: string;
  onRefresh?: RefreshControlProps['onRefresh'];
  refreshing?: RefreshControlProps['refreshing'];
}

function DayHeader({item}: {item: string}) {
  const {colors} = useTheme();

  return (
    <View
      style={[styles.sectionHeader, {backgroundColor: colors.surfaceDisabled}]}>
      <Text
        variant="headlineMedium"
        style={[styles.sectionHeaderText, {color: colors.onSurfaceVariant}]}>
        {formatCalendarDate(item).toLocaleUpperCase()}
      </Text>
    </View>
  );
}

function AgendaList<T extends EventInput>({
  items,
  listEmptyMessage,
  onPressItem,
  keyExtractor,
  onRefresh,
  refreshing = false,
}: Props<T>) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [mode, setMode] = useState(modes.UPCOMING);

  const [upcoming, setUpcoming] = useState<T[]>([]);
  const [hasUpcoming, setHasUpcoming] = useState(false);

  const [past, setPast] = useState<T[]>([]);
  const [hasPast, setHasPast] = useState(false);

  const toggleMode = useCallback(() => {
    setMode(currentMode =>
      currentMode === modes.PAST ? modes.UPCOMING : modes.PAST,
    );
  }, []);

  const handlePressItem = useCallback(
    (item: T, index: number) => () => onPressItem(item, index),
    [onPressItem],
  );

  const renderItem: ListRenderItem<T> = useCallback(
    ({item, index}) => {
      if (typeof item === 'string') {
        return <DayHeader item={item} />;
      }

      return <AgendaItem item={item} onPress={handlePressItem(item, index)} />;
    },
    [handlePressItem],
  );

  const renderFooter = useCallback(() => <View style={styles.footer} />, []);

  const renderHeader = useCallback(
    () => (
      <TouchableRipple style={styles.header} onPress={toggleMode}>
        <IconButton
          icon={mode === modes.PAST ? 'chevron-down' : 'chevron-up'}
        />
      </TouchableRipple>
    ),
    [toggleMode, mode],
  );

  const _keyExtractor = useCallback(
    (item: T, index: number) => {
      if (typeof item === 'string') {
        return mode + item + index;
      }

      return mode + item.id + index;
    },
    [mode],
  );

  const getItemType = useCallback((item: T) => {
    return typeof item === 'string' ? 'sectionHeader' : 'row';
  }, []);

  if (!items.length) {
    return <EmptyState title={listEmptyMessage || t('No Events')} />;
  }

  const isPast = mode === modes.PAST;

  return (
    <FlashList
      inverted={isPast}
      getItemType={getItemType}
      data={isPast ? past : upcoming}
      renderItem={renderItem}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            colors={[colors.primary]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      estimatedItemSize={ITEM_HEIGHT}
      ItemSeparatorComponent={Divider}
      showsVerticalScrollIndicator={false}
      keyExtractor={keyExtractor || _keyExtractor}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={
        (isPast ? hasPast : hasUpcoming) ? renderFooter : null
      }
    />
  );
}

const styles = StyleSheet.create({
  footer: {
    height: ITEM_HEIGHT,
  },
  header: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    fontSize: 12,
  },
});

export default memo(AgendaList);
