import {RRuleSet} from 'rrule';
import {EventInput} from '~types';
import dayjs, {currentUTCDate, formatUTCDate, parseUTCdate} from './date';
import {createDateRule} from './event';

export type AgendaItemT = string | EventInput;

interface CalendarOptions {
  startOfWeek: number;
  past?: boolean;
}

function createDateRules(items: EventInput[], {startOfWeek}: CalendarOptions) {
  const rules = new RRuleSet();

  rules.rrule(
    createDateRule({
      startDate: currentUTCDate(),
      startOfWeek,
    }),
  );

  items.forEach(({startDate, repeat}) => {
    rules.rrule(createDateRule({startDate, repeat, startOfWeek}));
  });

  return rules;
}

function matches(item: EventInput, utcDate: Date, startOfWeek: number) {
  const {startDate, repeat} = item;

  const rule = createDateRule({startDate, repeat, startOfWeek});

  const nextDate = rule.after(utcDate, true);

  return !!nextDate && dayjs.utc(utcDate).isSame(nextDate, 'date');
}

function getEventsByDate({
  items,
  date,
  startOfWeek,
}: {
  items: EventInput[];
  date: Date;
  startOfWeek: number;
}) {
  return items
    .filter(item => matches(item, date, startOfWeek))
    .sort((a, b) => {
      if (a.startTime === b.startTime) {
        return 0;
      }

      if (!a.startTime) {
        return -1;
      }

      if (!b.startTime) {
        return 1;
      }

      if (a.startTime > b.startTime) {
        return 1;
      }

      return -1;
    });
}

interface CalendarGeneratorOptions extends CalendarOptions {
  selectedDate: string;
}

export default function* calendarGenerator(
  items: EventInput[],
  options: CalendarGeneratorOptions,
): Generator<AgendaItemT[], AgendaItemT[] | null, AgendaItemT[]> {
  if (!items.length) {
    return null;
  }

  const {startOfWeek, past, selectedDate} = options;

  const rules = createDateRules(items, {startOfWeek});

  const initialDate = parseUTCdate(selectedDate);

  let date = past
    ? rules.before(initialDate, true)
    : rules.after(initialDate, true);

  while (date) {
    const title = formatUTCDate(date);
    const events = getEventsByDate({items, date, startOfWeek});
    const data = events.map(event => ({...event, startDate: title}));
    yield past ? [...data, title] : [title, ...data];

    const nextDate = past ? rules.before(date) : rules.after(date);

    if (nextDate) {
      date = nextDate;
    } else {
      const day = dayjs.utc(date);
      date = past
        ? day.subtract(1, 'day').toDate()
        : day.add(1, 'day').toDate();
    }
  }

  return null as never;
}
