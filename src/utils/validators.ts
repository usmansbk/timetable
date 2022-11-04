import {Recurrence} from '~types';
import {parseUTCdate} from './date';
import {createDateRule} from './event';

export function validateRecurrence(repeat: Recurrence | null, ctx: any) {
  if (!repeat) {
    return true;
  }

  const {startDate} = ctx.parent;
  const rule = createDateRule(startDate, repeat);
  const next = rule?.after(parseUTCdate(startDate));
  return !!next;
}
