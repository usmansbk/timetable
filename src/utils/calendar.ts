import groupBy from 'lodash.groupby';
import {RRuleSet} from 'rrule';
import {EventInput} from '~types';
import dayjs, {
  formatUTCToLocalDate,
  nextUTCDate,
  parseDateToUTC,
  previousUTCDate,
} from './date';
import {createDateRule} from './event';

export type AgendaItemT = string | EventInput;

interface CalendarOptions {
  startOfWeek: number;
  past?: boolean;
  selectedDate: string;
}

interface DateRulesOptions extends Omit<CalendarOptions, 'selectedDate'> {
  initialDate: Date;
}

function createDateRules(
  items: EventInput[],
  {startOfWeek, initialDate}: DateRulesOptions,
) {
  const rules = new RRuleSet();

  rules.rrule(
    createDateRule({
      startDate: initialDate,
      startOfWeek,
    }),
  );

  items.forEach(({startDate, repeat}) => {
    rules.rrule(
      createDateRule({
        startDate,
        repeat,
        startOfWeek,
      }),
    );
  });

  return rules;
}

function matches(item: EventInput, utcDate: Date, startOfWeek: number) {
  const {startDate, repeat} = item;

  const rule = createDateRule({startDate, repeat, startOfWeek});

  const nextDate = rule.after(utcDate, true);

  return !!nextDate && dayjs.utc(utcDate).isSame(nextDate, 'date');
}

const byTime = (a: EventInput, b: EventInput) => {
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
};

const byDate = (a: EventInput, b: EventInput) => {
  if (a.startDate === b.startDate) {
    return 0;
  }

  if (a.startDate > b.startDate) {
    return 1;
  }

  return -1;
};

function getEventsByDate({
  items,
  date,
  startOfWeek,
}: {
  items: EventInput[];
  date: Date;
  startOfWeek: number;
}) {
  return items.filter(item => matches(item, date, startOfWeek)).sort(byTime);
}

export function groupByDate(items: EventInput[]) {
  return Object.entries(groupBy(items.sort(byDate), 'startDate')).map(
    ([title, data]) => ({
      title,
      data: data.sort(byTime),
    }),
  );
}

export default function* calendarGenerator(
  items: EventInput[],
  options: CalendarOptions,
): Generator<AgendaItemT[], AgendaItemT[] | null, AgendaItemT[]> {
  if (!items.length) {
    return null;
  }

  const {startOfWeek, past, selectedDate} = options;

  const initialDate = parseDateToUTC(selectedDate);

  const rules = createDateRules(items, {
    startOfWeek,
    past,
    initialDate,
  });

  let date = past
    ? rules.before(initialDate, true)
    : rules.after(initialDate, true);

  while (date) {
    const title = formatUTCToLocalDate(date);
    const events = getEventsByDate({items, date, startOfWeek});
    const data = events.map(event => ({...event, startDate: title}));
    yield past ? [...data, title] : [title, ...data];

    const nextDate = past ? rules.before(date) : rules.after(date);

    date = nextDate || (past ? previousUTCDate(date) : nextUTCDate(date));
  }

  return null as never;
}
