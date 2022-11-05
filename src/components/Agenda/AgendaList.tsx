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
import {Divider, Text, TouchableRipple, useTheme} from 'react-native-paper';
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

export interface AgendaListHandle {
  scrollToTop: () => void;
  scrollToDate: (date: string) => void;
  resetMode: () => void;
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
      const upcomingItems = getUpcomingItems();
      const pastItems = getPastItems();

      setPast(pastItems);
      setUpcoming(upcomingItems);
    });
  }, [getPastItems, getUpcomingItems]);

  useImperativeHandle(forwardedRef, () => ({
    scrollToTop,
    scrollToDate,
    resetMode() {
      setMode(modes.UPCOMING);
    },
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
    [mode, onPressDayHeader, onPressItem],
  );

  if (!items.length) {
    return <EmptyState title={listEmptyMessage || t('No Events')} />;
  }

  const isPast = mode === modes.PAST;
  const data = isPast ? past : upcoming;

  return (
    <FlashList
      initialScrollIndex={0}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      ref={listRef}
      inverted={isPast}
      data={data}
      estimatedItemSize={ITEM_HEIGHT}
      estimatedFirstItemOffset={ITEM_HEIGHT}
      onScroll={onScroll}
      onEndReachedThreshold={1}
      renderItem={renderItem}
      getItemType={item => (typeof item === 'string' ? 'sectionHeader' : 'row')}
      onEndReached={() => {
        InteractionManager.runAfterInteractions(() => {
          if (isPast) {
            const data = getPastItems();
            setPast([...past, ...data]);
          } else {
            const data = getUpcomingItems();
            setUpcoming([...upcoming, ...data]);
          }
        });
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
      ItemSeparatorComponent={Divider}
      ListHeaderComponent={
        <Header
          text={t(isPast ? 'View upcoming' : 'View past')}
          onPress={toggleMode}
        />
      }
      ListFooterComponent={<View style={styles.footer} />}
    />
  );
}

const Header = ({text, onPress}: {text: string; onPress: () => void}) => {
  return (
    <TouchableRipple style={styles.header} onPress={onPress}>
      <Text variant="labelMedium" style={styles.headerText}>
        {text.toUpperCase()}
      </Text>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: ITEM_HEIGHT,
  },
  header: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 10,
  },
});

export default memo(forwardRef(AgendaList));
