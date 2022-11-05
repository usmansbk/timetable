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
import {formatDateToUTC} from '~utils/date';
import calendarGenerator, {AgendaItemT} from '~utils/calendar';
import {useAppSelector} from '~redux/hooks';
import {selectStartOfWeek} from '~redux/settings/slice';
import {EventInput} from '~types';
import AgendaItem from './AgendaItem';
import {ITEM_HEIGHT, NUM_OF_DAYS_PER_BATCH} from './constants';
import AgendaDayHeader from './AgendaDayHeader';

const modes = {
  PAST: 'PAST',
  UPCOMING: 'UPCOMING',
};

interface Props<T extends EventInput> {
  items: T[];
  onPressItem: (item: EventInput) => void;
  onPressDayHeader?: (date: string) => void;
  keyExtractor?: FlashListProps<AgendaItemT>['keyExtractor'];
  onScroll?: FlashListProps<AgendaItemT>['onScroll'];
  listEmptyMessage?: string;
  onRefresh?: RefreshControlProps['onRefresh'];
  refreshing?: RefreshControlProps['refreshing'];
  selectedDate?: string;
}

interface AgendaListHandle {
  scrollToTop: () => void;
  scrollToDate: (date: string) => void;
  prepareForLayoutAnimationRender: () => void;
}

function AgendaList<T extends EventInput>(
  {
    items,
    listEmptyMessage,
    onPressItem,
    onPressDayHeader,
    onRefresh,
    onScroll,
    refreshing = false,
    selectedDate = formatDateToUTC(),
  }: Props<T>,
  forwardedRef: ForwardedRef<AgendaListHandle>,
) {
  const listRef = useRef<FlashList<AgendaItemT>>(null);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const startOfWeek = useAppSelector(selectStartOfWeek);

  const [mode, setMode] = useState(modes.UPCOMING);

  const [upcoming, setUpcoming] = useState<AgendaItemT[]>([]);
  const [past, setPast] = useState<AgendaItemT[]>([]);

  const pastCalendar = useMemo(
    () => calendarGenerator(items, {startOfWeek, past: true, selectedDate}),
    [items, startOfWeek, selectedDate],
  );
  const upcomingCalendar = useMemo(
    () => calendarGenerator(items, {startOfWeek, selectedDate}),
    [items, startOfWeek, selectedDate],
  );

  const getUpcomingItems = useCallback(
    (numOfDays = NUM_OF_DAYS_PER_BATCH) => {
      const data: AgendaItemT[] = [];

      for (let i = 0; i < numOfDays; i += 1) {
        const section = upcomingCalendar.next();
        if (!section.done) {
          data.push(...section.value);
        }
      }

      return data;
    },
    [upcomingCalendar],
  );

  const getPastItems = useCallback(
    (numOfDays = NUM_OF_DAYS_PER_BATCH) => {
      const data: AgendaItemT[] = [];

      for (let i = 0; i < numOfDays; i += 1) {
        const section = pastCalendar.next();
        if (!section.done) {
          data.push(...section.value);
        }
      }

      return data;
    },
    [pastCalendar],
  );

  const loadUpcoming = useCallback(() => {
    const data = getUpcomingItems();
    if (data.length) {
      setUpcoming(currentData => [...currentData, ...data]);
    }
  }, [getUpcomingItems]);

  const loadPast = useCallback(() => {
    const data = getPastItems();
    if (data.length) {
      setPast(currentData => [...currentData, ...data]);
    }
  }, [getPastItems]);

  const scrollToDate = useCallback((item: string) => {
    listRef.current?.scrollToItem({
      item,
      viewPosition: 0,
      animated: true,
    });
  }, []);

  const scrollToTop = useCallback(() => {
    scrollToDate(selectedDate);
  }, [scrollToDate, selectedDate]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (items.length) {
        const upcomingItems = getUpcomingItems();
        const pastItems = getPastItems();

        setPast(pastItems);
        setUpcoming(upcomingItems);
      }
    });
  }, [items]);

  useImperativeHandle(forwardedRef, () => ({
    scrollToTop,
    scrollToDate,
    prepareForLayoutAnimationRender() {
      listRef.current?.prepareForLayoutAnimationRender();
    },
  }));

  const toggleMode = useCallback(() => {
    setMode(currentMode =>
      currentMode === modes.PAST ? modes.UPCOMING : modes.PAST,
    );
    InteractionManager.runAfterInteractions(scrollToTop);
  }, [scrollToTop]);

  const renderItem: ListRenderItem<AgendaItemT> = useCallback(
    ({item}) => {
      if (typeof item === 'string') {
        return <AgendaDayHeader item={item} onPress={onPressDayHeader} />;
      }

      return <AgendaItem item={item} onPress={onPressItem} />;
    },
    [mode],
  );

  const keyExtractor = useCallback(
    (item: AgendaItemT, index: number) => {
      if (typeof item === 'string') {
        return mode + item + index;
      }

      return mode + item.id + index;
    },
    [mode],
  );

  const getItemType = useCallback(
    (item: AgendaItemT) => (typeof item === 'string' ? 'sectionHeader' : 'row'),
    [],
  );

  const onEndReached = useCallback(() => {
    InteractionManager.runAfterInteractions(
      mode === modes.PAST ? loadPast : loadUpcoming,
    );
  }, [mode]);

  if (!items.length) {
    return <EmptyState title={listEmptyMessage || t('No Events')} />;
  }

  const isPast = mode === modes.PAST;

  return (
    <FlashList
      initialScrollIndex={0}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      ref={listRef}
      inverted={isPast}
      data={isPast ? past : upcoming}
      estimatedItemSize={ITEM_HEIGHT}
      estimatedFirstItemOffset={ITEM_HEIGHT}
      onScroll={onScroll}
      onEndReachedThreshold={1}
      onEndReached={onEndReached}
      getItemType={getItemType}
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
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={Divider}
      ListHeaderComponent={
        <TouchableRipple style={styles.header} onPress={toggleMode}>
          <IconButton
            icon={mode === modes.PAST ? 'chevron-down' : 'chevron-up'}
          />
        </TouchableRipple>
      }
      ListFooterComponent={<View style={styles.footer} />}
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
});

export default memo(forwardRef(AgendaList));
