import {Frequency, RRule} from 'rrule';
import capitalize from 'lodash.capitalize';
import {Language} from 'rrule/dist/esm/nlp/i18n';
import {EventInput, Recurrence} from '~types';
import {currentUTCDate, parseUTCdate, DateType} from '~utils/date';

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
