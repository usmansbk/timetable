import {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  InteractionManager,
} from 'react-native';
import EmptyState from '~components/EmptyState';
import {currentUTCDate, formatCalendarDate, formatUTCDate} from '~utils/date';
import calendarGenerator, {AgendaItemT} from '~utils/calendar';
import {useAppSelector} from '~redux/hooks';
import {selectStartOfWeek} from '~redux/settings/slice';
import {EventInput} from '~types';
import AgendaItem from './AgendaItem';
import {ITEM_HEIGHT, MAX_NUM_OF_DAYS_PER_BATCH} from './constants';

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

const modes = {
  PAST: 'PAST',
  UPCOMING: 'UPCOMING',
};

interface Props<T extends EventInput> {
  items: T[];
  onPressItem: (item: EventInput, index: number) => void;
  keyExtractor?: FlashListProps<AgendaItemT>['keyExtractor'];
  listEmptyMessage?: string;
  onRefresh?: RefreshControlProps['onRefresh'];
  refreshing?: RefreshControlProps['refreshing'];
}

interface AgendaListHandle {
  scrollToTop: () => void;
  scrollToDate: (date: string) => void;
}

function AgendaList<T extends EventInput>(
  {
    items,
    listEmptyMessage,
    onPressItem,
    keyExtractor,
    onRefresh,
    refreshing = false,
  }: Props<T>,
  forwardedRef: ForwardedRef<AgendaListHandle>,
) {
  const listRef = useRef<FlashList<AgendaItemT>>(null);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const startOfWeek = useAppSelector(selectStartOfWeek);

  const [mode, setMode] = useState(modes.UPCOMING);

  const [upcoming, setUpcoming] = useState<AgendaItemT[]>([]);
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState(true);

  const [past, setPast] = useState<AgendaItemT[]>([]);
  const [hasMorePast, setHasMorePast] = useState(true);

  const pastCalendar = useMemo(
    () => calendarGenerator(items, {startOfWeek, past: true}),
    [items, startOfWeek],
  );
  const upcomingCalendar = useMemo(
    () => calendarGenerator(items, {startOfWeek}),
    [items, startOfWeek],
  );

  const getUpcomingItems = useCallback(
    (maxNumDays = MAX_NUM_OF_DAYS_PER_BATCH) => {
      const data: AgendaItemT[] = [];
      let hasMore = hasMoreUpcoming;

      for (let i = 0; i < maxNumDays; i += 1) {
        const section = upcomingCalendar.next();
        if (!section.done) {
          data.push(...section.value);
        } else {
          hasMore = !section.done;
          break;
        }
      }

      return {
        data,
        hasMore,
      };
    },
    [upcomingCalendar],
  );

  const getPastItems = useCallback(
    (maxNumDays = MAX_NUM_OF_DAYS_PER_BATCH) => {
      const data: AgendaItemT[] = [];
      let hasMore = hasMorePast;

      for (let i = 0; i < maxNumDays; i += 1) {
        const section = pastCalendar.next();
        if (!section.done) {
          data.push(...section.value);
        } else {
          hasMore = !section.done;
          break;
        }
      }

      return {
        data,
        hasMore,
      };
    },
    [pastCalendar],
  );

  const loadUpcoming = useCallback(() => {
    if (hasMoreUpcoming) {
      const {data, hasMore} = getUpcomingItems();
      if (data.length) {
        setUpcoming(currentData => [...currentData, ...data]);
      }
      setHasMoreUpcoming(hasMore);
    }
  }, [getUpcomingItems, hasMoreUpcoming]);

  const loadPast = useCallback(() => {
    if (hasMorePast) {
      const {data, hasMore} = getPastItems();
      if (data.length) {
        setPast(currentData => [...currentData, ...data]);
      }
      setHasMorePast(hasMore);
    }
  }, [getPastItems, hasMorePast]);

  const onEndReached = useCallback(() => {
    InteractionManager.runAfterInteractions(
      mode === modes.PAST ? loadPast : loadUpcoming,
    );
  }, [loadPast, loadUpcoming, mode]);

  const scrollToDate = useCallback(
    (item: string) => {
      listRef.current?.scrollToItem({
        item,
        viewPosition: 0,
        animated: true,
      });
    },
    [listRef.current],
  );

  const scrollToTop = useCallback(() => {
    scrollToDate(formatUTCDate(currentUTCDate()));
  }, [scrollToDate]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (items.length) {
        const upcomingResult = getUpcomingItems();
        const pastResult = getPastItems();

        setPast(pastResult.data);
        setHasMorePast(pastResult.hasMore);
        setUpcoming(upcomingResult.data);
        setHasMoreUpcoming(upcomingResult.hasMore);
      }
    });
  }, [items, getPastItems, getUpcomingItems]);

  useImperativeHandle(forwardedRef, () => ({
    scrollToTop,
    scrollToDate,
  }));

  const toggleMode = useCallback(() => {
    setMode(currentMode =>
      currentMode === modes.PAST ? modes.UPCOMING : modes.PAST,
    );
    InteractionManager.runAfterInteractions(scrollToTop);
  }, [scrollToTop]);

  const handlePressItem = useCallback(
    (item: EventInput, index: number) => () => onPressItem(item, index),
    [onPressItem],
  );

  const renderItem: ListRenderItem<AgendaItemT> = useCallback(
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
    (item: AgendaItemT, index: number) => {
      if (typeof item === 'string') {
        return mode + item + index;
      }

      return mode + item.id + index;
    },
    [mode],
  );

  const getItemType = useCallback((item: AgendaItemT) => {
    return typeof item === 'string' ? 'sectionHeader' : 'row';
  }, []);

  if (!items.length) {
    return <EmptyState title={listEmptyMessage || t('No Events')} />;
  }

  const isPast = mode === modes.PAST;

  return (
    <FlashList
      ref={listRef}
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
      initialScrollIndex={0}
      keyboardShouldPersistTaps="always"
      estimatedItemSize={ITEM_HEIGHT}
      estimatedFirstItemOffset={ITEM_HEIGHT}
      onEndReached={onEndReached}
      ItemSeparatorComponent={Divider}
      showsVerticalScrollIndicator={false}
      keyExtractor={keyExtractor || _keyExtractor}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
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

export default memo(forwardRef(AgendaList));
