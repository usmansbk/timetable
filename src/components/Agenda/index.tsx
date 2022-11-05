import React, {memo, useCallback, useRef, useState} from 'react';
import {InteractionManager, StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {EventInput} from '~types';
import {formatDateToUTC, parseUTCtoLocalDate} from '~utils/date';
import AgendaList, {AgendaListHandle} from './AgendaList';

interface Props<T extends EventInput> {
  items: T[];
  onPressItem: (item: EventInput) => void;
  renderRight?: () => React.ReactNode;
}

function Agenda<T extends EventInput>({
  items,
  onPressItem,
  renderRight,
}: Props<T>) {
  const ref = useRef<AgendaListHandle>(null);
  const [selectedDate, setSelectedDate] = useState(formatDateToUTC());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const scrollToTop = useCallback(() => {
    ref.current?.resetMode();
    setSelectedDate(formatDateToUTC());
    InteractionManager.runAfterInteractions(ref.current?.scrollToTop);
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        {renderRight?.()}
        <Appbar.Content title="" />
        <Appbar.Action
          icon="calendar"
          onPress={() => setOpenDatePicker(true)}
        />
        <Appbar.Action icon="calendar-today" onPress={scrollToTop} />
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
