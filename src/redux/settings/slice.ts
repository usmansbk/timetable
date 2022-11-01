import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '~redux/store';
import {AppSchemeName} from '~types';

interface State {
  theme: AppSchemeName;
}
const initialState: State = {
  theme: 'dark',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<AppSchemeName>) {
      state.theme = action.payload;
    },
  },
});

const {reducer, actions} = settingsSlice;

export const {setTheme} = actions;

export const selectAppTheme = (state: RootState) => state.settings.theme;

export default reducer;
