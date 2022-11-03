import {useNavigation} from '@react-navigation/native';
import {memo, useCallback, useEffect} from 'react';
import AgendaList from '~components/AgendaList';
import PushNotification, {CHANNEL_ID} from '~config/notifications';
import {useAppSelector} from '~redux/hooks';
import {selectAllEvents} from '~redux/timetable/slice';
import {EventInput} from '~types';

function Agenda() {
  const navigation = useNavigation();
  const events = useAppSelector(selectAllEvents);

  const onPressItem = useCallback(
    (item: EventInput) => {
      if (item.id) {
        navigation.navigate('Event', {
          id: item.id,
        });
      }
    },
    [navigation],
  );

  useEffect(() => {
    PushNotification.localNotificationSchedule({
      channelId: CHANNEL_ID,
      title: 'test',
      message: 'hello',
      allowWhileIdle: true,
      date: new Date(Date.now() + 6 * 1000),
      repeatTime: 1,
    });
  }, []);

  return <AgendaList items={events} onPressItem={onPressItem} />;
}

export default memo(Agenda);
