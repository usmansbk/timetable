import {configureStore} from '@reduxjs/toolkit';
import schedulesReducer from './schedules/schedulesSlice';

const store = configureStore({
  reducer: {
    schedules: schedulesReducer,
  },
});

export default store;
