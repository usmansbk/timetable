import {configureStore} from '@reduxjs/toolkit';
import schedulesReducer from './schedules/schedulesSlice';

const store = configureStore({
  reducer: {
    schedules: schedulesReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
