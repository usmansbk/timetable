import type {ColorSchemeName} from 'react-native';
import type {NavigatorScreenParams} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {DrawerScreenProps} from '@react-navigation/drawer';

export type AppSchemeName = ColorSchemeName | 'system';

export type DrawerStackParamList = {
  Timetable: undefined;
};

export type RootStackParamList = {
  AppDrawer: NavigatorScreenParams<DrawerStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AppDrawerScreenProps<T extends keyof DrawerStackParamList> =
  DrawerScreenProps<DrawerStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
