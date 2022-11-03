import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: notification => {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  requestPermissions: Platform.OS === 'ios',
});

export default PushNotification;
