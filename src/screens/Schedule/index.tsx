import {useLayoutEffect} from 'react';
import {Title} from 'react-native-paper';
import EmptyState from '~components/EmptyState';
import {useAppSelector} from '~redux/hooks';
import {selectScheduleById} from '~redux/timetable/timetableSlice';
import {RootStackScreenProps} from '~types';

export default function Schedule({
  navigation,
  route,
}: RootStackScreenProps<'Schedule'>) {
  const {id} = route.params;
  const schedule = useAppSelector(state => selectScheduleById(state, id));

  useLayoutEffect(() => {
    if (schedule) {
      navigation.setOptions({
        title: schedule.title,
      });
    }
  }, [schedule]);

  if (!schedule) {
    return <EmptyState title="Schedule does not exist" />;
  }

  return <Title>Schedule</Title>;
}
