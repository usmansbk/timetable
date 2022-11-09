import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '~redux/store';
import {User} from '~types';

interface State {
  accessToken: string | null;
  currentUser: User | null;
}

const initialState: State = {
  accessToken: null,
  currentUser: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    resetUserState() {
      return initialState;
    },
  },
});

const {actions, reducer} = usersSlice;

export const {setCurrentUser, setAccessToken, resetUserState} = actions;

export const selectCurrentUser = (state: RootState) => state.users.currentUser;
export const selectAccessToken = (state: RootState) => state.users.accessToken;

export default reducer;
