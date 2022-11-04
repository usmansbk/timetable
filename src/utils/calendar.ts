import {EventInput} from '~types';

export type AgendaItemT = string | EventInput;

interface CalendarOptions {
  startOfWeek: number;
  past?: boolean;
}

export default function* calendarGenerator(
  items: EventInput[],
  options: CalendarOptions,
): Generator<AgendaItemT> {}
