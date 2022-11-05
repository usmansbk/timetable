import React, {memo, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {EventInput} from '~types';
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

  return (
    <View style={styles.container}>
      <Appbar.Header>
        {renderRight?.()}
        <Appbar.Content title="" />
        <Appbar.Action
          icon="calendar-today"
          onPress={() => ref.current?.scrollToTop()}
        />
      </Appbar.Header>
      <AgendaList items={items} onPressItem={onPressItem} ref={ref} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default memo(Agenda);
