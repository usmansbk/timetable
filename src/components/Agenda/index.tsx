import React, {memo, useCallback, useRef, useState} from 'react';
import {InteractionManager, StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {DatePickerModal} from 'react-native-paper-dates';
import {useTranslation} from 'react-i18next';
import type {SingleChange} from 'react-native-paper-dates/lib/typescript/Date/Calendar';
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
  const {i18n} = useTranslation();
  const ref = useRef<AgendaListHandle>(null);
  const [selectedDate, setSelectedDate] = useState(formatCurrentDate());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const openCalendar = useCallback(() => setDatePickerVisible(true), []);
  const closeCalendar = useCallback(() => setDatePickerVisible(false), []);

  const scrollToTop = useCallback(() => {
    ref.current?.resetMode();
    setSelectedDate(formatCurrentDate());
    InteractionManager.runAfterInteractions(ref.current?.scrollToTop);
  }, []);

  const onChangeDate = useCallback<SingleChange>(({date}) => {
    if (date) {
      setSelectedDate(formatDate(date));
    }
    closeCalendar();
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
      <DatePickerModal
        locale={i18n.language}
        mode="single"
        visible={datePickerVisible}
        onDismiss={closeCalendar}
        date={parseDate(selectedDate)}
        onConfirm={onChangeDate}
        onChange={onChangeDate}
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
