import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import EmptyState from '~components/EmptyState';
import {useAppSelector} from '~redux/hooks';
import {selectScheduleById} from '~redux/timetable/slice';
import {RootStackScreenProps} from '~types';
import ScheduleDetails from './ScheduleDetails';

export default function Schedule({
  navigation,
  route,
}: RootStackScreenProps<'Schedule'>) {
  const {t} = useTranslation();
  const {id} = route.params;
  const schedule = useAppSelector(state => selectScheduleById(state, id));

  useEffect(() => {
    if (schedule) {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [schedule, navigation]);

  if (!schedule) {
    return <EmptyState title={t('Schedule does not exist')} />;
  }

  return <ScheduleDetails schedule={schedule} />;
}
