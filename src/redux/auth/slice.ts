import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '~redux/store';
import {User} from '~types';

interface State {
  token: string | null;
  user: User | null;
}

const initialState: State = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    resetUserState() {
      return initialState;
    },
  },
});

const {actions, reducer} = authSlice;

export const {setCurrentUser, setAccessToken, resetUserState} = actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.token;

export default reducer;
