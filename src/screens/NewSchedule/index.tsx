import {memo, useCallback} from 'react';
import ScheduleForm from '~components/ScheduleForm';
import {useAppDispatch} from '~redux/hooks';
import {addSchedule} from '~redux/timetable/slice';
import {RootStackScreenProps, ScheduleInput} from '~types';

function NewSchedule({navigation}: RootStackScreenProps<'NewSchedule'>) {
  const dispatch = useAppDispatch();

  const onSubmit = useCallback((input: ScheduleInput) => {
    dispatch(addSchedule(input));
    navigation.pop();
  }, []);

  return (
    <ScheduleForm autoFocus onDiscard={navigation.goBack} onSubmit={onSubmit} />
  );
}

export default memo(NewSchedule);
