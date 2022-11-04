import {Dictionary} from '@reduxjs/toolkit';
import Notification from '~config/notifications';
import {EventInput, Reminder} from '~types';
import {combineUTCDateTimeToLocal, parseUTCdate} from './date';
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

  const rule = createDateRule(startDate, repeat);
  const utcDate = rule?.after(parseUTCdate(startDate), true);

  if (utcDate) {
    const startAt = combineUTCDateTimeToLocal(utcDate, startTime);

    Object.keys(reminder).forEach(key => {
      Notification.localNotificationSchedule({
        title,
        message: '',
        date: startAt.toDate(),
        allowWhileIdle: true,
        playSound,
        vibrate,
      });
    });
  }
}
