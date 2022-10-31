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

export interface EventInput {
  id?: string;
  title: string;
  startDate: string;
  startTime?: string | null;
  endTime?: string | null;
  scheduleId?: string | null;
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
