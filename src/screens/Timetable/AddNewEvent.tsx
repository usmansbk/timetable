import {memo, useCallback, useMemo} from 'react';
import EventForm from '~components/EventForm';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {addEvent, selectAllSchedules} from '~redux/timetable/timetableSlice';
import {EventInput} from '~types';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

function AddNewEvent({visible, onDismiss}: Props) {
  const dispatch = useAppDispatch();
  const schedules = useAppSelector(selectAllSchedules);

  const onSubmit = useCallback((input: EventInput) => {
    dispatch(addEvent(input));
    onDismiss();
  }, []);

  const scheduleOptions = useMemo(
    () =>
      schedules?.map(({title, id}) => ({
        label: title,
        value: id,
      })),
    [schedules],
  );

  return (
    <EventForm
      autoFocus
      visible={visible}
      onDismiss={onDismiss}
      onSubmit={onSubmit}
      schedules={scheduleOptions}
    />
  );
}

export default memo(AddNewEvent);
