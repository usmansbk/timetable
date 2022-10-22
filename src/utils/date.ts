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

export function formatToLocalDate(date: string) {
  return dayjs.utc(date, UTC_DATE_FORMAT).local().format('ddd, DD MMM YYYY');
}

export function formatToLocalTime(date: string) {
  return dayjs.utc(date, UTC_TIME_FORMAT).local().format('HH:mm');
}

export function parseDate(date: string) {
  return dayjs.utc(date, UTC_DATE_FORMAT).toDate();
}

export function parseTime(date: string) {
  return dayjs.utc(date, UTC_TIME_FORMAT).toDate();
}

export default dayjs;
