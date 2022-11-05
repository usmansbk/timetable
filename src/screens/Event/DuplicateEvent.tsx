import {memo, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {InteractionManager} from 'react-native';
import EventForm from '~components/EventForm';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {addEvent, selectAllSchedules} from '~redux/timetable/slice';
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
  const schedules = useAppSelector(selectAllSchedules);

  const onSubmit = useCallback(
    (values: EventInput) => {
      onDismiss();
      InteractionManager.runAfterInteractions(() => {
        dispatch(addEvent(values));
        onSuccess();
      });
    },
    [onSuccess, onDismiss],
  );

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
      title={t('Copy')}
      defaultValues={event}
      visible={visible}
      onDismiss={onDismiss}
      onSubmit={onSubmit}
      schedules={scheduleOptions}
    />
  );
}

export default memo(DuplicateEvent);
