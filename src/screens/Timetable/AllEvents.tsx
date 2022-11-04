import {useNavigation} from '@react-navigation/native';
import {memo, useCallback, useEffect} from 'react';
import {InteractionManager} from 'react-native';
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

function AllEvents() {
  const navigation = useNavigation();
  const events = useAppSelector(selectAllEvents);
  const reminders = useAppSelector(selectReminderEntities);
  const defaultReminder = useAppSelector(selectDefaultReminders);
  const playNotificationSound = useAppSelector(selectNotificationSound);
  const enableVibration = useAppSelector(selectNotificationVibration);

  const onPressItem = useCallback(
    (item: EventInput) => {
      if (item.id) {
        navigation.navigate('Event', {
          id: item.id,
          date: item.startDate,
        });
      }
    },
    [navigation],
  );

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

  return <Agenda items={events} onPressItem={onPressItem} />;
}

export default memo(AllEvents);
