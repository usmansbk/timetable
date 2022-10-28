import {configureStore} from '@reduxjs/toolkit';
import timetableReducer from './timetable/timetableSlice';

const store = configureStore({
  reducer: {
    timetable: timetableReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
