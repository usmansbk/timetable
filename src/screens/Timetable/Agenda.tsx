import {memo} from 'react';
import AgendaList from '~components/AgendaList';

function Agenda() {
  return <AgendaList items={[]} onPressItem={console.log} />;
}

export default memo(Agenda);
