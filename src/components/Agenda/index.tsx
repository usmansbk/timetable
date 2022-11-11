import React, {memo, useCallback, useRef, useState} from 'react';
import {InteractionManager, StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatCurrentDate, formatDate, parseDate} from '~utils/date';
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
  const [selectedDate, setSelectedDate] = useState(formatCurrentDate());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const openCalendar = useCallback(() => setDatePickerVisible(true), []);

  const scrollToTop = useCallback(() => {
    ref.current?.resetMode();
    setSelectedDate(formatCurrentDate());
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
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        date={parseDate(selectedDate)}
        onCancel={() => setDatePickerVisible(false)}
        onConfirm={date => {
          setDatePickerVisible(false);
          setSelectedDate(formatDate(date));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default memo(Agenda);
