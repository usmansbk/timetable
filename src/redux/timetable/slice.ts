import {
  createSlice,
  createEntityAdapter,
  EntityId,
  EntityState,
  PayloadAction,
  createSelector,
  nanoid,
} from '@reduxjs/toolkit';
import {normalize, schema} from 'normalizr';
import {EventInput, ScheduleInput} from '~types';
import type {RootState} from '../store';

const eventSchemaEntity = new schema.Entity('events');
const scheduleSchemaEntity = new schema.Entity('schedules', {
  events: new schema.Array(eventSchemaEntity),
});

interface ScheduleEntity extends Omit<ScheduleInput, 'events'> {
  id: string;
  events: string[];
}

interface EventEntity extends EventInput {
  id: string;
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

const schedulesAdapter = createEntityAdapter<ScheduleEntity>({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});
const eventsAdapter = createEntityAdapter<EventEntity>();

const initialState: TimetableState = {
  schedules: schedulesAdapter.getInitialState(),
  events: eventsAdapter.getInitialState(),
};

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    addSchedule: {
      reducer(state, action: PayloadAction<NormalizedSchedule>) {
        eventsAdapter.addMany(state.events, action.payload.events);
        schedulesAdapter.addMany(state.schedules, action.payload.schedules);
      },
      prepare(payload: ScheduleInput) {
        const id = nanoid();
        const schedule = Object.assign({}, payload, {
          id,
          events: payload.events.map(e =>
            Object.assign({}, e, {
              id: nanoid(),
              scheduleId: id,
            }),
          ),
        });

        const normalized = normalize<any, NormalizedSchedule>(
          schedule,
          scheduleSchemaEntity,
        );

        return {
          payload: normalized.entities,
        };
      },
    },
    removeSchedule(state, action: PayloadAction<EntityId>) {
      const schedule = state.schedules.entities[action.payload];

      if (schedule?.events.length) {
        eventsAdapter.removeMany(state.events, schedule.events);
      }

      schedulesAdapter.removeOne(state.schedules, action.payload);
    },
    updateSchedule: {
      reducer(state, action: PayloadAction<NormalizedSchedule>) {
        schedulesAdapter.upsertMany(state.schedules, action.payload.schedules);
        eventsAdapter.upsertMany(state.events, action.payload.events);
      },
      prepare(payload: ScheduleInput) {
        const schedule = Object.assign({}, payload, {
          events: payload.events.map(e =>
            Object.assign({}, e, {
              id: e.id || nanoid(),
              scheduleId: payload.id,
            }),
          ),
        });

        const normalized = normalize<any, NormalizedSchedule>(
          schedule,
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
        const event = Object.assign({}, payload, {id: nanoid()});

        const normalized = normalize<any, NormalizedEvent>(
          event,
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
          schedule.events = schedule.events.filter(
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

const {actions, reducer} = timetableSlice;

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

export const selectScheduleEventsById = createSelector(
  [selectEventEntities, selectScheduleById],
  (entities, schedule) => {
    return (
      schedule?.events?.map(id => entities[id]).filter(item => !!item) ?? []
    );
  },
);

export default reducer;