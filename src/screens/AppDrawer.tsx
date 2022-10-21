import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {memo} from 'react';
import {DrawerStackParamList, RootStackScreenProps} from '~types';
import Timetable from './Timetable';

const Drawer = createDrawerNavigator<DrawerStackParamList>();

function AppDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function AppDrawer({}: RootStackScreenProps<'AppDrawer'>) {
  return (
    <Drawer.Navigator
      initialRouteName="Timetable"
      screenOptions={{
        drawerType: 'back',
        freezeOnBlur: true,
      }}
      drawerContent={AppDrawerContent}>
      <Drawer.Screen name="Timetable" component={Timetable} />
    </Drawer.Navigator>
  );
}

export default memo(AppDrawer);
