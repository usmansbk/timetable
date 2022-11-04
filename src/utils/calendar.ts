import {EventInput} from '~types';

interface CalendarOptions {
  startOfWeek: number;
  past?: boolean;
}

export default function* calendarGenerator(
  items: EventInput[],
  options: CalendarOptions,
) {}
