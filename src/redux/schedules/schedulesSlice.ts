import {createSlice} from '@reduxjs/toolkit';

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState: [],
  reducers: {
    addSchedule(state, action) {},
  },
});

export const {addSchedule} = schedulesSlice.actions;
export default schedulesSlice.reducer;
