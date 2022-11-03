import {memo, useCallback, useMemo} from 'react';
import ReminderSelect from '~components/ReminderSelect';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {selectReminderById, setReminder} from '~redux/timetable/slice';
import {selectDefaultReminders} from '~redux/settings/slice';
import {ReminderKey} from '~types';

interface Props {
  eventId: string;
  visible: boolean;
  onDismiss: () => void;
}

function Notification({eventId, visible, onDismiss}: Props) {
  const dispatch = useAppDispatch();
  const defaultReminder = useAppSelector(selectDefaultReminders);
  const reminder = useAppSelector(state => selectReminderById(state, eventId));

  const values = useMemo(
    () => Object.assign({}, defaultReminder, reminder),
    [defaultReminder, reminder],
  );

  const handleChange = useCallback(
    (key: ReminderKey) => {
      dispatch(setReminder({...values, [key]: !values[key], id: eventId}));
    },
    [values, eventId],
  );

  return (
    <ReminderSelect
      visible={visible}
      onDismiss={onDismiss}
      values={values}
      onChange={handleChange}
    />
  );
}

export default memo(Notification);
