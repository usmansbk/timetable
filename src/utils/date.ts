import dayjs, {Dayjs} from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);

export const DAYS_OF_WEEK = [0, 1, 2, 3, 4, 5, 6]; // sun - sat

const UTC_DATE_FORMAT = 'YYYY-MM-DD';
const UTC_TIME_FORMAT = 'HH:mm';

type DateType = string | Date | Dayjs;

export function formatToUTCdate(date?: DateType) {
  return dayjs(date).utc().format(UTC_DATE_FORMAT);
}

export function formatToUTCtime(date: DateType) {
  return dayjs(date).utc().format(UTC_TIME_FORMAT);
}

export function formatUTCtoLocalDate(
  date: DateType,
  format = 'ddd, DD MMM YYYY',
) {
  return dayjs.utc(date).local().format(format);
}

export function formatUTCtoLocalTime(date: string, format = 'HH:mm') {
  return dayjs.utc(date, UTC_TIME_FORMAT).local().format(format);
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

export function setUTCDateTime(utcDate: DateType, utcTime?: string | null) {
  let date = dayjs.utc(utcDate);

  if (utcTime) {
    const time = dayjs.utc(utcTime, UTC_TIME_FORMAT);
    date = date.hour(time.hour()).minute(time.minute());
  }
  return date;
}

export default dayjs;
