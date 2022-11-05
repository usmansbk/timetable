import {memo, useCallback, useEffect} from 'react';
import {InteractionManager} from 'react-native';
import {Appbar} from 'react-native-paper';
import Agenda from '~components/Agenda';
import {useAppSelector} from '~redux/hooks';
import {
  selectDefaultReminders,
  selectNotificationSound,
  selectNotificationVibration,
} from '~redux/settings/slice';
import {selectAllEvents, selectReminderEntities} from '~redux/timetable/slice';
import {EventInput} from '~types';
import {scheduleNotifications} from '~utils/notifications';

interface Props {
  openDrawer: () => void;
  onPressItem: (item: EventInput) => void;
}

function AllEvents({openDrawer, onPressItem}: Props) {
  const events = useAppSelector(selectAllEvents);
  const reminders = useAppSelector(selectReminderEntities);
  const defaultReminder = useAppSelector(selectDefaultReminders);
  const playNotificationSound = useAppSelector(selectNotificationSound);
  const enableVibration = useAppSelector(selectNotificationVibration);

  useEffect(() => {
    if (events.length) {
      InteractionManager.runAfterInteractions(() => {
        scheduleNotifications({
          events,
          reminders,
          defaultReminder,
          playSound: playNotificationSound,
          vibrate: enableVibration,
        });
      });
    }
  }, [
    events,
    reminders,
    defaultReminder,
    playNotificationSound,
    enableVibration,
  ]);

  const renderRight = useCallback(
    () => <Appbar.Action icon="menu" onPress={openDrawer} />,
    [openDrawer],
  );

  return (
    <Agenda
      items={events}
      onPressItem={onPressItem}
      renderRight={renderRight}
    />
  );
}

export default memo(AllEvents);
