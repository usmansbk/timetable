import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '~redux/store';
import {DAYS_OF_WEEK} from '~utils/date';
import {AppSchemeName, ReminderKey} from '~types';

interface State {
  theme: AppSchemeName;
  startOfWeek: number;
  defaultReminders: {[key: string]: boolean};
}

const initialState: State = {
  theme: 'dark',
  startOfWeek: DAYS_OF_WEEK[0],
  defaultReminders: {
    exact: true,
    '5m': true,
    '10m': true,
    '15m': false,
    '30m': true,
    '1h': false,
    '1d': false,
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
  },
});

const {reducer, actions} = settingsSlice;

export const {setTheme, setStartOfWeek, toggleDefaultReminder} = actions;

export const selectAppTheme = (state: RootState) => state.settings.theme;
export const selectStartOfWeek = (state: RootState) =>
  state.settings.startOfWeek;
export const selectDefaultReminders = (state: RootState) =>
  state.settings.defaultReminders;

export default reducer;
