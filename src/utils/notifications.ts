import {Dictionary} from '@reduxjs/toolkit';
import Notification from '~config/notifications';
import {EventInput, Reminder} from '~types';
import dayjs, {
  combineUTCDateTime,
  currentUTCTime,
  parseUTCtoLocalDate,
} from './date';
import {createDateRule} from './event';

interface ScheduleNotificationOptions {
  playSound: boolean;
  vibrate: boolean;
}

interface ScheduleAllNotificationsArgs extends ScheduleNotificationOptions {
  events: EventInput[];
  reminders: Dictionary<Reminder>;
  defaultReminder: Reminder;
}

export function scheduleNotifications({
  events,
  reminders,
  defaultReminder,
  playSound,
  vibrate,
}: ScheduleAllNotificationsArgs) {
  Notification.cancelAllLocalNotifications();
  events.forEach(event => {
    const reminder = Object.assign({}, defaultReminder, reminders[event.id!]);
    scheduleNotification(event, reminder, {playSound, vibrate});
  });
}

function scheduleNotification(
  event: EventInput,
  reminder: Reminder,
  {playSound, vibrate}: ScheduleNotificationOptions,
) {
  const {title, startDate, repeat, startTime} = event;

  const startAt = combineUTCDateTime(startDate, startTime);
  const rule = createDateRule(startAt, repeat);
  const utcDate = rule?.after(currentUTCTime(), true);

  if (utcDate) {
    const date = parseUTCtoLocalDate(utcDate);
    const day = dayjs(date);
    Object.keys(reminder).forEach(key => {
      Notification.localNotificationSchedule({
        title,
        message: '',
        date,
        allowWhileIdle: true,
        playSound,
        vibrate,
      });
    });
  }
}
