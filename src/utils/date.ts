import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const UTC_DATE_FORMAT = 'YYYY-MM-DD';
const UTC_TIME_FORMAT = 'HH:mm';

export function formatToUTCdate(date: Date) {
  return dayjs(date).utc().format(UTC_DATE_FORMAT);
}

export function formatToUTCtime(date: Date) {
  return dayjs(date).utc().format(UTC_TIME_FORMAT);
}

export function formatUTCToLocalDate(
  date: string,
  format = 'ddd, DD MMM YYYY',
) {
  return dayjs.utc(date, UTC_DATE_FORMAT).local().format(format);
}

export function formatUTCToLocalTime(date: string, format = 'HH:mm') {
  return dayjs.utc(date, UTC_TIME_FORMAT).local().format(format);
}

export function parseUTCDate(date: string) {
  return dayjs.utc(date, UTC_DATE_FORMAT).toDate();
}

export function parseUTCTime(time: string) {
  return dayjs.utc(time, UTC_TIME_FORMAT).toDate();
}

export default dayjs;
