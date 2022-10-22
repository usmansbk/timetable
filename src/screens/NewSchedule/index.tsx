import {memo} from 'react';
import ScheduleForm from '~components/ScheduleForm';
import {RootStackScreenProps} from '~types';

function NewSchedule({navigation}: RootStackScreenProps<'NewSchedule'>) {
  return (
    <ScheduleForm
      autoFocus
      onDiscard={navigation.goBack}
      onSubmit={console.log}
    />
  );
}

export default memo(NewSchedule);
