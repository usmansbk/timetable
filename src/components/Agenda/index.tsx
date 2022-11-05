import React, {memo, useCallback, useRef, useState} from 'react';
import {InteractionManager, StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {formatDateToUTC, parseUTCtoLocalDate} from '~utils/date';
import {EventInput} from '~types';
import AgendaList, {AgendaListHandle} from './AgendaList';

interface Props<T extends EventInput> {
  title?: string;
  items: T[];
  onPressItem: (item: EventInput) => void;
  renderRight?: () => React.ReactNode;
  renderLeft?: () => React.ReactNode;
}

function Agenda<T extends EventInput>({
  title,
  items,
  onPressItem,
  renderRight,
  renderLeft,
}: Props<T>) {
  const ref = useRef<AgendaListHandle>(null);
  const [selectedDate, setSelectedDate] = useState(formatDateToUTC());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const openCalendar = useCallback(() => setOpenDatePicker(true), []);

  const scrollToTop = useCallback(() => {
    ref.current?.resetMode();
    setSelectedDate(formatDateToUTC());
    InteractionManager.runAfterInteractions(ref.current?.scrollToTop);
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        {renderLeft?.()}
        <Appbar.Content title={title} />
        <Appbar.Action
          disabled={!items.length}
          icon="calendar-month"
          onPress={openCalendar}
        />
        <Appbar.Action
          disabled={!items.length}
          icon="calendar-today"
          onPress={scrollToTop}
        />
        {renderRight?.()}
      </Appbar.Header>
      <AgendaList
        ref={ref}
        items={items}
        selectedDate={selectedDate}
        onPressItem={onPressItem}
      />
      {openDatePicker && (
        <DateTimePicker
          value={parseUTCtoLocalDate(selectedDate)}
          onChange={(e, date) => {
            setOpenDatePicker(false);
            if (e.type === 'set' && date) {
              setSelectedDate(formatDateToUTC(date));
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default memo(Agenda);
