import {Reminder} from '~types';

export const SUPPORT_EMAIL = 'usmansbk.dev@gmail.com';
export const APP_VERSION = '1.0';

export const DEFAULT_REMINDERS: Reminder = {
  '0_m': true, // At time of event
  '5_m': true, // 5 minutes
  '10_m': true, // 10 minutes
  '15_m': false, // 15 minutes
  '30_m': true, // 30 minutes
  '1_h': false, // 1 hour
  '2_h': false, // 2 hours
  '1_d': false, // 1 day
};
