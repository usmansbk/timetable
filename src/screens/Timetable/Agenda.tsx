import {useNavigation} from '@react-navigation/native';
import {memo, useCallback} from 'react';
import AgendaList from '~components/AgendaList';
import {useAppSelector} from '~redux/hooks';
import {selectAllEvents} from '~redux/timetable/slice';
import {EventInput} from '~types';

function Agenda() {
  const navigation = useNavigation();
  const events = useAppSelector(selectAllEvents);

  const onPressItem = useCallback(
    (item: EventInput) => {
      if (item.id) {
        navigation.navigate('Event', {
          id: item.id,
        });
      }
    },
    [navigation],
  );

  return <AgendaList items={events} onPressItem={onPressItem} />;
}

export default memo(Agenda);
