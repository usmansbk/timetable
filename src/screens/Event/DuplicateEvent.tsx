import {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import EventForm from '~components/EventForm';
import {useAppDispatch} from '~redux/hooks';
import {addEvent} from '~redux/timetable/slice';
import {EventInput} from '~types';

interface Props {
  event: EventInput;
  visible: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
}

function DuplicateEvent({event, visible, onDismiss, onSuccess}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    (values: EventInput) => {
      dispatch(addEvent(values));
      onDismiss();
      onSuccess();
    },
    [onSuccess, onDismiss],
  );

  return (
    <EventForm
      title={t('Copy')}
      defaultValues={event}
      visible={visible}
      onDismiss={onDismiss}
      onSubmit={onSubmit}
    />
  );
}

export default memo(DuplicateEvent);
