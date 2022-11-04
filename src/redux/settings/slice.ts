import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '~redux/store';
import {DAYS_OF_WEEK} from '~utils/date';
import {AppSchemeName, Reminder, ReminderKey} from '~types';

interface State {
  theme: AppSchemeName;
  startOfWeek: number;
  playSound: boolean;
  vibrate: boolean;
  defaultReminders: Reminder;
}

const initialState: State = {
  theme: 'dark',
  startOfWeek: DAYS_OF_WEEK[0],
  playSound: true,
  vibrate: true,
  defaultReminders: {
    '0_m': true,
    '5_m': true,
    '10_m': true,
    '15_m': false,
    '30_m': true,
    '1_h': false,
    '2_h': false,
    '1_d': false,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<AppSchemeName>) {
      state.theme = action.payload;
    },
    setStartOfWeek(state, action: PayloadAction<number>) {
      state.startOfWeek = action.payload;
    },
    toggleDefaultReminder(state, action: PayloadAction<ReminderKey>) {
      state.defaultReminders[action.payload] =
        !state.defaultReminders[action.payload];
    },
    toggleNotificationSound(state) {
      state.playSound = !state.playSound;
    },
    toggleNotificationVibration(state) {
      state.vibrate = !state.vibrate;
    },
  },
});

const {reducer, actions} = settingsSlice;

export const {
  setTheme,
  setStartOfWeek,
  toggleDefaultReminder,
  toggleNotificationSound,
  toggleNotificationVibration,
} = actions;

export const selectAppTheme = (state: RootState) => state.settings.theme;
export const selectStartOfWeek = (state: RootState) =>
  state.settings.startOfWeek;
export const selectDefaultReminders = (state: RootState) =>
  state.settings.defaultReminders;
export const selectNotificationSound = (state: RootState) =>
  state.settings.playSound;
export const selectNotificationVibration = (state: RootState) =>
  state.settings.vibrate;

export default reducer;
