import React, {memo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {EventInput} from '~types';
import {formatDateToUTC} from '~utils/date';
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

  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        {renderRight?.()}
        <Appbar.Content title="" />
        <Appbar.Action
          icon="calendar-today"
          onPress={() => ref.current?.scrollToTop()}
        />
      </Appbar.Header>
      <AgendaList
        ref={ref}
        items={items}
        selectedDate={selectedDate}
        onPressItem={onPressItem}
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
