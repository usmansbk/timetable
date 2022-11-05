import dayjs, {Dayjs} from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(calendar);

export const DAYS_OF_WEEK = [0, 1, 2, 3, 4, 5, 6]; // sun - sat

const UTC_DATE_FORMAT = 'YYYY-MM-DD';
const UTC_TIME_FORMAT = 'HH:mm';

export type DateType = string | Date | Dayjs;

export function formatUTCDate(date: DateType) {
  return dayjs.utc(date).format(UTC_DATE_FORMAT);
}

export function formatDateToUTC(date?: DateType) {
  return dayjs(date).utc().format(UTC_DATE_FORMAT);
}

export function formatTimeToUTC(date: DateType) {
  return dayjs(date).utc().format(UTC_TIME_FORMAT);
}

export function formatUTCtoLocalDate(
  date: DateType,
  format = 'ddd, DD MMM YYYY',
) {
  return dayjs.utc(date).local().format(format);
}

export function formatUTCtoLocalTime(date: string, is24Hour?: boolean) {
  return dayjs
    .utc(date, UTC_TIME_FORMAT)
    .local()
    .format(is24Hour ? 'HH:mm' : 'hh:mm A');
}

export function formatDay(day: number, format = 'dddd') {
  return dayjs().day(day).format(format);
}

export function parseUTCdate(date: DateType) {
  return dayjs.utc(date).toDate();
}

export function parseUTCtime(time: string) {
  return dayjs.utc(time, UTC_TIME_FORMAT).toDate();
}

export function parseUTCtoLocalDate(date: DateType) {
  return dayjs.utc(date).local().toDate();
}

export function parseUTCtoLocalTime(time: string) {
  return dayjs.utc(time, UTC_TIME_FORMAT).local().toDate();
}

export function currentUTCTime() {
  return dayjs.utc().toDate();
}

export function currentUTCDate() {
  return dayjs.utc().startOf('day').toDate();
}

export function setUTCDateTime(utcDate: DateType, utcTime?: string | null) {
  let date = dayjs.utc(utcDate);

  if (utcTime) {
    const time = dayjs.utc(utcTime, UTC_TIME_FORMAT);
    date = date.hour(time.hour()).minute(time.minute());
  }
  return date;
}

export function formatCalendarDate(date: string) {
  return dayjs(parseUTCtoLocalDate(date)).calendar(null, {
    sameDay: '[Today], dddd, D MMMM',
    nextDay: '[Tomorrow], dddd, D MMMM',
    nextWeek: 'dddd, D MMMM',
    lastDay: '[Yesterday], dddd, D MMMM',
    lastWeek: 'dddd, D MMMM',
    sameElse: 'dddd, D MMMM, YYYY',
  });
}

export default dayjs;
