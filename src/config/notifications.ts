import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

export const CHANNEL_ID = 'timetable';

PushNotification.configure({
  onNotification: notification => {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
});

PushNotification.createChannel(
  {
    channelId: CHANNEL_ID,
    channelName: 'Timetable',
    channelDescription: 'Timetable reminder',
  },
  () => null,
);

export default PushNotification;
