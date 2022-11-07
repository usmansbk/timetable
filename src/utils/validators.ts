import {Recurrence} from '~types';
import {parseDateToUTC} from './date';
import {createDateRule} from './event';

export function validateRecurrence(repeat: Recurrence | null, ctx: any) {
  if (!repeat) {
    return true;
  }

  const {startDate} = ctx.parent;
  const rule = createDateRule({startDate, repeat});
  const next = rule?.after(parseDateToUTC(startDate));
  return !!next;
}
