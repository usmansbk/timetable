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
import {FlashList, FlashListProps} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  RefreshControl,
  RefreshControlProps,
  InteractionManager,
} from 'react-native';
import EmptyState from '~components/EmptyState';
import {
  currentUTCDate,
  formatCalendarDate,
  formatDateToUTC,
  formatUTCDate,
} from '~utils/date';
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
  onPressItem: (item: EventInput) => void;
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
    (numOfDays = MAX_NUM_OF_DAYS_PER_BATCH) => {
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
    (numOfDays = MAX_NUM_OF_DAYS_PER_BATCH) => {
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
    scrollToDate(formatUTCDate(currentUTCDate()));
  }, [scrollToDate]);

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

  const handlePressItem = useCallback(
    (item: EventInput) => () => onPressItem(item),
    [onPressItem],
  );

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
      onEndReached={() => {
        InteractionManager.runAfterInteractions(
          mode === modes.PAST ? loadPast : loadUpcoming,
        );
      }}
      getItemType={item => (typeof item === 'string' ? 'sectionHeader' : 'row')}
      renderItem={({item}) => {
        if (typeof item === 'string') {
          return <DayHeader item={item} />;
        }

        return <AgendaItem item={item} onPress={handlePressItem(item)} />;
      }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            colors={[colors.primary]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      keyExtractor={(item, index) => {
        if (typeof item === 'string') {
          return mode + item + index;
        }

        return mode + item.id + index;
      }}
      ItemSeparatorComponent={Divider}
      ListHeaderComponent={() => (
        <TouchableRipple style={styles.header} onPress={toggleMode}>
          <IconButton
            icon={mode === modes.PAST ? 'chevron-down' : 'chevron-up'}
          />
        </TouchableRipple>
      )}
      ListFooterComponent={() => <View style={styles.footer} />}
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
