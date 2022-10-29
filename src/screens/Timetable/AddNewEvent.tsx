import {memo, useCallback} from 'react';
import EventForm from '~components/EventForm';
import {useAppDispatch} from '~redux/hooks';
import {addEvent} from '~redux/timetable/timetableSlice';
import {EventInput} from '~types';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

function AddNewEvent({visible, onDismiss}: Props) {
  const dispatch = useAppDispatch();

  const onSubmit = useCallback((input: EventInput) => {
    dispatch(addEvent(input));
    onDismiss();
  }, []);

  return (
    <EventForm
      autoFocus
      visible={visible}
      onDismiss={onDismiss}
      onSubmit={onSubmit}
    />
  );
}

export default memo(AddNewEvent);
