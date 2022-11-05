import {memo, useCallback, useMemo} from 'react';
import {InteractionManager} from 'react-native';
import ScheduleForm from '~components/ScheduleForm';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {
  selectScheduleById,
  selectScheduleEventsById,
  updateSchedule,
} from '~redux/timetable/slice';
import {RootStackScreenProps, ScheduleInput} from '~types';

function EditSchedule({
  navigation,
  route,
}: RootStackScreenProps<'EditSchedule'>) {
  const {id} = route.params;
  const schedule = useAppSelector(state => selectScheduleById(state, id));
  const events = useAppSelector(state => selectScheduleEventsById(state, id));
  const dispatch = useAppDispatch();

  const onSubmit = useCallback((input: ScheduleInput) => {
    navigation.pop();
    InteractionManager.runAfterInteractions(() => {
      dispatch(updateSchedule(input));
    });
  }, []);

  const defaultValues = useMemo(
    () =>
      Object.assign({}, schedule, {
        events,
      }),
    [],
  ) as ScheduleInput;

  return (
    <ScheduleForm
      onDiscard={navigation.goBack}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
    />
  );
}

export default memo(EditSchedule);
