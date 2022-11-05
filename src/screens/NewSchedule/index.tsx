import {useCallback} from 'react';
import {InteractionManager} from 'react-native';
import ScheduleForm from '~components/ScheduleForm';
import {useAppDispatch} from '~redux/hooks';
import {addSchedule} from '~redux/timetable/slice';
import {RootStackScreenProps, ScheduleInput} from '~types';

function NewSchedule({navigation}: RootStackScreenProps<'NewSchedule'>) {
  const dispatch = useAppDispatch();

  const onSubmit = useCallback((input: ScheduleInput) => {
    navigation.pop();
    InteractionManager.runAfterInteractions(() => {
      dispatch(addSchedule(input));
    });
  }, []);

  return (
    <ScheduleForm autoFocus onDiscard={navigation.goBack} onSubmit={onSubmit} />
  );
}

export default NewSchedule;
