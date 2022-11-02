import {memo, useCallback} from 'react';
import ReminderSelect from '~components/ReminderSelect';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {
  selectDefaultReminders,
  toggleDefaultReminder,
} from '~redux/settings/slice';
import {ReminderKey} from '~types';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

function DefaultReminders({visible, onDismiss}: Props) {
  const dispatch = useAppDispatch();
  const reminders = useAppSelector(selectDefaultReminders);

  const onChange = useCallback((key: ReminderKey) => {
    dispatch(toggleDefaultReminder(key));
  }, []);

  return (
    <ReminderSelect
      onChange={onChange}
      values={reminders}
      visible={visible}
      onDismiss={onDismiss}
    />
  );
}

export default memo(DefaultReminders);
