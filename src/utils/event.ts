import {Frequency, RRule} from 'rrule';
import capitalize from 'lodash.capitalize';
import {Language} from 'rrule/dist/esm/nlp/i18n';
import {EventInput, Recurrence} from '~types';
import {
  currentUTCDate,
  parseUTCdate,
  DateType,
  formatUTCtoLocalTime,
} from '~utils/date';

export function formatRecurrence(input: Recurrence, lng?: Language) {
  const {freq, until} = input;
  const rule = new RRule({
    freq: RRule[freq],
    until: until ? parseUTCdate(until) : null,
  });

  return capitalize(rule.toText(undefined, lng));
}

export function createDateRule({
  startDate,
  repeat,
  startOfWeek,
}: {
  startDate: DateType;
  repeat?: Recurrence | null;
  startOfWeek?: number;
}) {
  const dtstart = parseUTCdate(startDate);
  if (!repeat) {
    return new RRule({
      dtstart,
      freq: Frequency.DAILY,
      until: dtstart,
      wkst: startOfWeek,
    });
  }

  const {freq, until} = repeat;

  return new RRule({
    dtstart,
    freq: Frequency[freq],
    until: until ? parseUTCdate(until) : null,
    wkst: startOfWeek,
  });
}

export function getNextEventDate(event: EventInput, after?: string) {
  const {startDate, repeat} = event;
  const rule = createDateRule({startDate, repeat});

  return rule.after(after ? parseUTCdate(after) : currentUTCDate(), true);
}

export function formatEventTime(event: EventInput, is24Hour?: boolean) {
  const {startTime, endTime} = event;

  if (!(startTime || endTime)) {
    return;
  }

  const from = startTime && formatUTCtoLocalTime(startTime, is24Hour);
  const to = endTime && formatUTCtoLocalTime(endTime, is24Hour);

  if (from && to) {
    return {
      key: 'event_start_end_time',
      options: {
        from,
        to,
      },
    };
  } else if (from) {
    return {
      key: 'event_starts_at',
      options: {
        time: from,
      },
    };
  } else if (to) {
    return {
      key: 'event_ends_at',
      options: {
        time: to,
      },
    };
  }
}
