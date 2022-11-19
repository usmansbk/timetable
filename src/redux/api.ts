import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({baseUrl: ''}),
  endpoints: builder => ({
    getTimetable: builder.query({
      query: () => '/timetable',
    }),
    syncTimetable: builder.mutation({
      query: timetable => ({
        url: '/sync',
        method: 'POST',
        body: timetable,
      }),
    }),
  }),
});

export const {useLazyGetTimetableQuery, useSyncTimetableMutation} = apiSlice;
