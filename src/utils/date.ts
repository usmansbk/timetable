import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const DAYS_OF_WEEK = [0, 1, 2, 3, 4, 5, 6]; // sun - sat

const UTC_DATE_FORMAT = 'YYYY-MM-DD';
const UTC_TIME_FORMAT = 'HH:mm';

export function formatToUTCdate(date?: Date) {
  return dayjs(date).utc().format(UTC_DATE_FORMAT);
}

export function formatToUTCtime(date: Date) {
  return dayjs(date).utc().format(UTC_TIME_FORMAT);
}

export function formatUTCtoLocalDate(
  date: string,
  format = 'ddd, DD MMM YYYY',
) {
  return dayjs.utc(date, UTC_DATE_FORMAT).local().format(format);
}

export function formatUTCtoLocalTime(date: string, format = 'HH:mm') {
  return dayjs.utc(date, UTC_TIME_FORMAT).local().format(format);
}

export function parseUTCdate(date: string) {
  return dayjs.utc(date, UTC_DATE_FORMAT).toDate();
}

export function parseUTCtime(time: string) {
  return dayjs.utc(time, UTC_TIME_FORMAT).toDate();
}

export function parseUTCtoLocaldate(date: string) {
  return dayjs.utc(date, UTC_DATE_FORMAT).local().toDate();
}

export function parseUTCtoLocaltime(time: string) {
  return dayjs.utc(time, UTC_TIME_FORMAT).local().toDate();
}

export function formatDay(day: number, format = 'dddd') {
  return dayjs().day(day).format(format);
}

export function combineUTCDateTimeToLocal(
  utcDate: Date,
  utcTime?: string | null,
) {
  let date = dayjs.utc(utcDate).startOf('day').local();

  if (utcTime) {
    const time = dayjs.utc(utcTime, UTC_TIME_FORMAT).local();
    date = date.hour(time.hour()).minute(time.minute());
  }
  return date;
}

export default dayjs;
