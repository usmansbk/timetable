import {
  createSlice,
  createEntityAdapter,
  EntityId,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import {EventInput, ScheduleInput} from '~types';
import type {RootState} from '../store';

interface ScheduleEntity extends Omit<ScheduleInput, 'events' | 'id'> {
  id: EntityId;
  eventIds: EntityId[];
}

interface EventEntity extends Omit<EventInput, 'id'> {
  id: EntityId;
  scheduleId: EntityId;
}

interface TimetableState {
  schedules: EntityState<ScheduleEntity>;
  events: EntityState<EventEntity>;
}

const schedulesAdapter = createEntityAdapter<ScheduleEntity>();
const eventsAdapter = createEntityAdapter<EventEntity>();

const initialState: TimetableState = {
  schedules: schedulesAdapter.getInitialState(),
  events: eventsAdapter.getInitialState(),
};

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    addSchedule: {
      reducer(state, action: PayloadAction<ScheduleInput>) {},
      prepare(payload) {
        return payload;
      },
    },
    removeSchedule(state, action: PayloadAction<EntityId>) {},
    updateSchedule: {
      reducer(state, action: PayloadAction<ScheduleInput>) {},
      prepare(payload) {
        return payload;
      },
    },
    addEvent(state, action: PayloadAction<EventInput>) {},
    removeEvent(state, action: PayloadAction<EntityId>) {},
    updateEvent(state, action: PayloadAction<EventInput>) {},
  },
});

const {actions, reducer} = schedulesSlice;

export const {
  addEvent,
  updateEvent,
  removeEvent,
  addSchedule,
  updateSchedule,
  removeSchedule,
} = actions;

export const {
  selectAll: selectAllSchedules,
  selectById: selectScheduleById,
  selectEntities: selectScheduleEntities,
  selectIds: selectScheduleIds,
  selectTotal: selectTotalScheduels,
} = schedulesAdapter.getSelectors(
  (state: RootState) => state.timetable.schedules,
);

export const {
  selectAll: selectAllEvents,
  selectById: selectEventById,
  selectEntities: selectEventEntities,
  selectIds: selectEventIds,
  selectTotal: selectTotalEvents,
} = eventsAdapter.getSelectors((state: RootState) => state.timetable.events);

export default reducer;
