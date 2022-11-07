import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '~redux/store';
import {User} from '~types';

interface State {
  currentUser: User | null;
}

const initialState: State = {
  currentUser: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
    },
  },
});

const {actions, reducer} = usersSlice;

export const {setCurrentUser} = actions;

export const selectCurrentUser = (state: RootState) => state.users.currentUser;

export default reducer;
