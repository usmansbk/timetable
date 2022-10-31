import {memo, useCallback} from 'react';
import EventForm from '~components/EventForm';
import {useAppDispatch} from '~redux/hooks';
import {updateEvent} from '~redux/timetable/timetableSlice';
import {EventInput} from '~types';

interface Props {
  event: EventInput;
  visible: boolean;
  onDismiss: () => void;
}

function EditEvent({event, visible, onDismiss}: Props) {
  const dispatch = useAppDispatch();

  const onSubmit = useCallback((values: EventInput) => {
    dispatch(updateEvent(values));
    onDismiss();
  }, []);

  return (
    <EventForm
      defaultValues={event}
      visible={visible}
      onDismiss={onDismiss}
      onSubmit={onSubmit}
    />
  );
}

export default memo(EditEvent);
