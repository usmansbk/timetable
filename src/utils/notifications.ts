import {Dictionary} from '@reduxjs/toolkit';
import {ManipulateType} from 'dayjs';
import capitalize from 'lodash.capitalize';
import Notification, {CHANNEL_ID} from '~config/notifications';
import {EventInput, Reminder, ReminderKey} from '~types';
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

  const eventDateTime = combineUTCDateTime(startDate, startTime);
  const rule = createDateRule(eventDateTime, repeat);
  const utcDate = rule?.after(currentUTCTime(), true);

  if (utcDate) {
    const startAt = dayjs(parseUTCtoLocalDate(utcDate));

    Object.keys(reminder).forEach(key => {
      const reminderKey = key as ReminderKey;

      if (reminder[reminderKey]) {
        const [value, unit] = key.split('_');
        const fireDate = dayjs(startAt).subtract(
          Number.parseInt(value, 10),
          unit as ManipulateType,
        );
        console.log(fireDate);

        Notification.localNotificationSchedule({
          channelId: CHANNEL_ID,
          title,
          message: capitalize(startAt.from(fireDate)),
          date: fireDate.toDate(),
          allowWhileIdle: true,
          playSound,
          vibrate,
          repeatTime: 1,
        });
      }
    });
  }
}
