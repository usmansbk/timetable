import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Timetable from './Timetable';

const Drawer = createDrawerNavigator();

function AppDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Timetable"
      screenOptions={{
        drawerType: 'back',
      }}
      drawerContent={AppDrawerContent}>
      <Drawer.Screen name="Timetable" component={Timetable} />
    </Drawer.Navigator>
  );
}
