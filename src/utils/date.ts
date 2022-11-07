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

const TIME_FORMAT = 'HH:mm';

export type DateType = string | Date | Dayjs;
export const ONE_YEAR = dayjs.duration(1, 'year').asMilliseconds();

export function formatCurrentDate() {
  return dayjs().startOf('day').format();
}

export function formatLocalDate(date: DateType, format = 'ddd, DD MMM YYYY') {
  return dayjs(date).format(format);
}

export function formatDate(date: Date) {
  return dayjs(date).format();
}

export function formatDateToTime(date: Date) {
  return dayjs(date).format(TIME_FORMAT);
}

export function formatTime(time: string, is24Hour = false) {
  return is24Hour ? time : dayjs(time, TIME_FORMAT).format('hh:mm A');
}

export function formatFromDate(source: Dayjs, compared: Dayjs) {
  return dayjs(source).from(compared);
}

export function formatUTCToLocalDate(date: DateType) {
  return dayjs.utc(date).local().format();
}

export function formatCalendarDate(date: string) {
  return dayjs(date).calendar(null, {
    sameDay: '[Today], dddd, D MMMM',
    nextDay: '[Tomorrow], dddd, D MMMM',
    nextWeek: 'dddd, D MMMM',
    lastDay: '[Yesterday], dddd, D MMMM',
    lastWeek: 'dddd, D MMMM',
    sameElse: 'dddd, D MMMM, YYYY',
  });
}

export function parseDate(date: string) {
  return dayjs(date).toDate();
}

export function parseTime(time: string) {
  return dayjs(time, TIME_FORMAT).toDate();
}

export function parseDateToUTC(date: DateType) {
  return dayjs(date).utc().toDate();
}

export function parseUTCToLocalDate(date: Date) {
  return dayjs.utc(date).local().toDate();
}

export function parseFullDay(date: string, time?: string | null) {
  const d = dayjs(date);

  if (time) {
    const t = dayjs(time, TIME_FORMAT);
    return d.hour(t.hour()).minute(t.minute());
  }

  return d;
}

export function currentUTCDate() {
  return dayjs.utc().startOf('day').toDate();
}

export function currentUTCDateTime() {
  return dayjs.utc().toDate();
}

export function nextUTCDate(date: DateType) {
  return dayjs.utc(date).add(1, 'day').toDate();
}

export function previousUTCDate(date: DateType) {
  return dayjs.utc(date).subtract(1, 'day').toDate();
}

export default dayjs;
