import {memo} from 'react';
import {EventInput} from '~types';
import AgendaList from './AgendaList';

interface Props<T extends EventInput> {
  items: T[];
  onPressItem: (item: EventInput) => void;
}

function Agenda<T extends EventInput>({items, onPressItem}: Props<T>) {
  return <AgendaList items={items} onPressItem={onPressItem} />;
}

export default memo(Agenda);
