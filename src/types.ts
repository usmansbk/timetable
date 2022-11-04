import {ComponentProps} from 'react';
import type {ColorSchemeName} from 'react-native';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {DrawerScreenProps} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type IconName = ComponentProps<typeof Icon>['name'];

export type AppSchemeName = ColorSchemeName | 'system';

export interface Reminder {
  '0_m': boolean;
  '5_m': boolean;
  '10_m': boolean;
  '15_m': boolean;
  '30_m': boolean;
  '1_h': boolean;
  '2_h': boolean;
  '1_d': boolean;
}

export type ReminderKey = keyof Reminder;

export type DrawerStackParamList = {
  Timetable: undefined;
};

export type RootStackParamList = {
  AppDrawer: NavigatorScreenParams<DrawerStackParamList>;
  Settings: undefined;
  NewSchedule: undefined;
  DuplicateSchedule: {
    id: string;
  };
  EditSchedule: {
    id: string;
  };
  Schedule: {
    id: string;
  };
  Event: {
    id: string;
    date?: string;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AppDrawerScreenProps<T extends keyof DrawerStackParamList> =
  CompositeScreenProps<
    DrawerScreenProps<DrawerStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export interface Recurrence {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  until?: string;
}

export interface EventInput {
  id?: string;
  title: string;
  startDate: string;
  startTime?: string | null;
  endTime?: string | null;
  scheduleId?: string | null;
  repeat?: Recurrence | null;
  description?: string | null;
}

export interface ScheduleInput {
  id?: string;
  title: string;
  events: EventInput[];
}

export interface FieldError<T> {
  name: keyof T;
  message: string;
}
