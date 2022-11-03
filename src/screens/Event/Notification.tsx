import {memo} from 'react';
import ReminderSelect from '~components/ReminderSelect';
import {useAppSelector} from '~redux/hooks';
import {selectDefaultReminders} from '~redux/settings/slice';

interface Props {
  eventId: string;
  visible: boolean;
  onDismiss: () => void;
}

function Notification({eventId, visible, onDismiss}: Props) {
  const defaultValues = useAppSelector(selectDefaultReminders);

  return (
    <ReminderSelect
      visible={visible}
      onDismiss={onDismiss}
      values={defaultValues}
      onChange={console.log}
    />
  );
}

export default memo(Notification);
