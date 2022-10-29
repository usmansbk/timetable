import {
  createSlice,
  createEntityAdapter,
  EntityId,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import {normalize, schema} from 'normalizr';
import {EventInput, ScheduleInput} from '~types';
import type {RootState} from '../store';

const eventSchemaEntity = new schema.Entity('events');
const scheduleSchemaEntity = new schema.Entity('schedules', {
  events: [eventSchemaEntity],
});

interface ScheduleEntity extends Omit<ScheduleInput, 'events' | 'id'> {
  id: EntityId;
  eventIds: EntityId[];
}

interface EventEntity extends Omit<EventInput, 'id' | 'scheduleId'> {
  id: EntityId;
  scheduleId: EntityId;
}

interface TimetableState {
  schedules: EntityState<ScheduleEntity>;
  events: EntityState<EventEntity>;
}

interface NormalizedSchedule {
  events: {[key: EntityId]: EventEntity};
  schedules: {[key: EntityId]: ScheduleEntity};
}

interface NormalizedEvent {
  events: {[key: EntityId]: EventEntity};
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
      reducer(state, action: PayloadAction<NormalizedSchedule>) {
        schedulesAdapter.addMany(state.schedules, action.payload.schedules);
        eventsAdapter.addMany(state.events, action.payload.events);
      },
      prepare(payload: ScheduleInput) {
        const normalized = normalize<any, NormalizedSchedule>(
          payload,
          scheduleSchemaEntity,
        );

        return {
          payload: normalized.entities,
        };
      },
    },
    removeSchedule(state, action: PayloadAction<EntityId>) {
      const schedule = state.schedules.entities[action.payload];

      if (schedule?.eventIds.length) {
        eventsAdapter.removeMany(state.events, schedule.eventIds);
      }

      schedulesAdapter.removeOne(state.schedules, action.payload);
    },
    updateSchedule: {
      reducer(state, action: PayloadAction<NormalizedSchedule>) {
        schedulesAdapter.upsertMany(state.schedules, action.payload.schedules);
        eventsAdapter.upsertMany(state.events, action.payload.events);
      },
      prepare(payload: ScheduleInput) {
        const normalized = normalize<any, NormalizedSchedule>(
          payload,
          scheduleSchemaEntity,
        );

        return {
          payload: normalized.entities,
        };
      },
    },
    addEvent: {
      reducer(state, action: PayloadAction<NormalizedEvent>) {
        eventsAdapter.addMany(state.events, action.payload.events);
      },
      prepare(payload: EventInput) {
        const normalized = normalize<any, NormalizedEvent>(
          payload,
          eventSchemaEntity,
        );

        return {
          payload: normalized.entities,
        };
      },
    },
    removeEvent(state, action: PayloadAction<EntityId>) {
      const event = state.events.entities[action.payload];

      if (event?.scheduleId) {
        const schedule = state.schedules.entities[event.scheduleId];
        if (schedule) {
          schedule.eventIds = schedule.eventIds.filter(
            id => id !== event.scheduleId,
          );
        }
      }

      eventsAdapter.removeOne(state.events, action.payload);
    },
    updateEvent: {
      reducer(state, action: PayloadAction<NormalizedEvent>) {
        eventsAdapter.upsertMany(state.events, action.payload.events);
      },
      prepare(payload: EventInput) {
        const normalized = normalize<any, NormalizedEvent>(
          payload,
          eventSchemaEntity,
        );

        return {
          payload: normalized.entities,
        };
      },
    },
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
