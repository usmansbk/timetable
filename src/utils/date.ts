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

const TIME_FORMAT = 'HH:mmZ';

export type DateType = string | Date | Dayjs;
export const ONE_YEAR = dayjs.duration(1, 'year').asMilliseconds();

export function formatCurrentDate() {
  return dayjs().startOf('day').format();
}

export function formatCurrentTime() {
  return dayjs().format(TIME_FORMAT);
}

export function formatDate(date: Date) {
  return dayjs(date).format();
}

export function formatTime(time: string, is24Hour = false) {
  return dayjs(time, TIME_FORMAT).format(is24Hour ? 'HH:mm' : 'hh:mm A');
}

export function formatDateToTime(date: Date) {
  return dayjs(date).format(TIME_FORMAT);
}

export function formatFromDate(source: Dayjs, compared: Dayjs) {
  return dayjs(source).from(compared);
}

export function formatUTCToLocalDate(date: DateType) {
  return dayjs.utc(date).local().format();
}

export function formatCalendarDate(date: DateType) {
  return dayjs(date).calendar(null, {
    sameDay: '[Today], dddd, D MMMM',
    nextDay: '[Tomorrow], dddd, D MMMM',
    nextWeek: 'dddd, D MMMM',
    lastDay: '[Yesterday], dddd, D MMMM',
    lastWeek: 'dddd, D MMMM',
    sameElse: 'dddd, D MMMM, YYYY',
  });
}

export function formatDay(day: number) {
  return dayjs().day(day).format('dddd');
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

export function nextUTCDate(after: DateType) {
  return dayjs.utc(after).add(1, 'day').toDate();
}

export function previousUTCDate(before: DateType) {
  return dayjs.utc(before).subtract(1, 'day').toDate();
}

export function addMinutes(time: string, minutes: number) {
  return dayjs(time, TIME_FORMAT).add(minutes, 'minutes').format(TIME_FORMAT);
}

export function roundUpCurrentTime(interval = 15) {
  const currenTime = dayjs();
  const roundUp = Math.ceil(currenTime.minute() / interval) * interval;
  return currenTime.minute(roundUp).format(TIME_FORMAT);
}

export function roundUpCurrentDate(interval = 15) {
  const currentDate = dayjs();
  const roundUp = Math.ceil(currentDate.minute() / interval) * interval;

  return currentDate
    .add(Math.abs(roundUp - currentDate.minute()), 'minutes')
    .startOf('day')
    .format();
}

export default dayjs;
