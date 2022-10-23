import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ScheduleInput} from '~types';
import type {RootState} from '../store';

const initialState: ScheduleInput[] = [];

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    addSchedule(state, action: PayloadAction<ScheduleInput>) {},
    updateSchedule(state, action: PayloadAction<ScheduleInput>) {},
    deleteSchedule(state, action: PayloadAction<string>) {},
  },
});

export const {addSchedule, updateSchedule, deleteSchedule} =
  schedulesSlice.actions;

export const selectSchedules = (state: RootState) => state.schedules;

export default schedulesSlice.reducer;
