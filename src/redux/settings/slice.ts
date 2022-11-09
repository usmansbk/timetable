import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '~redux/store';
import {DAYS_OF_WEEK} from '~utils/date';
import {AppSchemeName, Reminder, ReminderKey} from '~types';
import {DEFAULT_REMINDERS} from '~constants';

interface State {
  theme: AppSchemeName;
  startOfWeek: number;
  playSound: boolean;
  is24Hour: boolean;
  vibrate: boolean;
  defaultReminders: Reminder;
  defaultEventDurationInMinutes: number;
}

const initialState: State = {
  theme: 'dark',
  startOfWeek: DAYS_OF_WEEK[0],
  playSound: true,
  vibrate: true,
  defaultReminders: DEFAULT_REMINDERS,
  is24Hour: true,
  defaultEventDurationInMinutes: 60,
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
    setDefaultEventDuration(state, action: PayloadAction<number>) {
      state.defaultEventDurationInMinutes = action.payload;
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
    toggle24HourTimeFormat(state) {
      state.is24Hour = !state.is24Hour;
    },
    resetSettings() {
      return initialState;
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
  toggle24HourTimeFormat,
  setDefaultEventDuration,
  resetSettings,
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
export const selectIs24HourTimeFormat = (state: RootState) =>
  state.settings.is24Hour;
export const selectDefaultEventDuration = (state: RootState) =>
  state.settings.defaultEventDurationInMinutes;

export default reducer;
