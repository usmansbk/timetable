import {memo} from 'react';
import AgendaList from '~components/AgendaList';
import {useAppSelector} from '~redux/hooks';
import {selectAllEvents} from '~redux/timetable/timetableSlice';

function Agenda() {
  const events = useAppSelector(selectAllEvents);

  return <AgendaList items={events} onPressItem={console.log} />;
}

export default memo(Agenda);
