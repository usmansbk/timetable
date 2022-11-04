import {Dictionary} from '@reduxjs/toolkit';
import {ManipulateType} from 'dayjs';
import capitalize from 'lodash.capitalize';
import omit from 'lodash.omit';
import {Platform} from 'react-native';
import Notification, {CHANNEL_ID} from '~config/notifications';
import {EventInput, Recurrence, Reminder, ReminderKey} from '~types';
import dayjs, {
  setUTCDateTime,
  currentUTCTime,
  parseUTCtoLocalDate,
} from './date';
import {createDateRule} from './event';

const ONE_YEAR = dayjs.duration(1, 'year').asMilliseconds();
const REPEAT_INTERVAL = 1;

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
    scheduleNotification(event, omit(reminder, 'id'), {playSound, vibrate});
  });
}

function scheduleNotification(
  event: EventInput,
  reminder: Reminder,
  {playSound, vibrate}: ScheduleNotificationOptions,
) {
  const {id, title, startDate, repeat, startTime} = event;

  const startAt = setUTCDateTime(startDate, startTime);

  Object.keys(reminder).forEach(key => {
    const reminderKey = key as ReminderKey;

    if (reminder[reminderKey]) {
      const [value, unit] = reminderKey.split('_');

      const remindAt = startAt.subtract(
        Number.parseInt(value, 10),
        unit as ManipulateType,
      );

      const rule = createDateRule({startDate: remindAt, repeat});
      const fireDate = rule?.after(currentUTCTime(), true);

      if (fireDate) {
        const date = parseUTCtoLocalDate(fireDate);
        const message = dayjs(startAt).from(remindAt);

        const repeatType = repeat?.freq && (getRepeatType(repeat.freq) as any);

        Notification.localNotificationSchedule({
          channelId: CHANNEL_ID,
          group: id,
          title,
          message: capitalize(message),
          date,
          allowWhileIdle: true,
          playSound,
          vibrate,
          repeatType,
          repeatTime: repeat?.freq === 'YEARLY' ? ONE_YEAR : REPEAT_INTERVAL,
        });
      }
    }
  });
}

const getRepeatType = (freq: Recurrence['freq']) => {
  switch (freq) {
    case 'DAILY': {
      return 'day';
    }
    case 'WEEKLY': {
      return 'week';
    }
    case 'MONTHLY': {
      return 'month';
    }
    case 'YEARLY': {
      return Platform.OS === 'android' ? 'time' : 'year';
    }
    default: {
      return undefined as never;
    }
  }
};
