import {memo} from 'react';
import EventForm from '~components/EventForm';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

function AddNewEvent({visible, onDismiss}: Props) {
  return (
    <EventForm
      autoFocus
      visible={visible}
      onDismiss={onDismiss}
      onSubmit={console.log}
    />
  );
}

export default memo(AddNewEvent);
