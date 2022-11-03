import {Frequency, RRule} from 'rrule';
import capitalize from 'lodash.capitalize';
import {Language} from 'rrule/dist/esm/nlp/i18n';
import {Recurrence} from '~types';
import {parseUTCdate} from '~utils/date';

export function formatRecurrence(input: Recurrence, lng?: Language) {
  const {freq, until} = input;
  const rule = new RRule({
    freq: RRule[freq],
    until: until ? parseUTCdate(until) : null,
  });

  return capitalize(rule.toText(undefined, lng));
}

export function createRecurRule(startDate: string, repeat: Recurrence) {
  if (!repeat) {
    return null;
  }

  const {freq, until} = repeat;

  return new RRule({
    dtstart: parseUTCdate(startDate),
    freq: Frequency[freq],
    until: until ? parseUTCdate(until) : null,
  });
}

export function validateRecurrence(repeat: Recurrence | null, ctx: any) {
  if (!repeat) {
    return true;
  }

  const {startDate} = ctx.parent;
  const rule = createRecurRule(startDate, repeat);
  const next = rule?.after(parseUTCdate(startDate));
  return !!next;
}
