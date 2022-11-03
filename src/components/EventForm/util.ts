import {RRule} from 'rrule';
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
