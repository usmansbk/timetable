import {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import EventForm from '~components/EventForm';
import {useAppDispatch} from '~redux/hooks';
import {updateEvent} from '~redux/timetable/slice';
import {EventInput} from '~types';

interface Props {
  event: EventInput;
  visible: boolean;
  onDismiss: () => void;
}

function EditEvent({event, visible, onDismiss}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const onSubmit = useCallback((values: EventInput) => {
    dispatch(updateEvent(values));
    onDismiss();
  }, []);

  return (
    <EventForm
      title={t('Edit')}
      defaultValues={event}
      visible={visible}
      onDismiss={onDismiss}
      onSubmit={onSubmit}
    />
  );
}

export default memo(EditEvent);
