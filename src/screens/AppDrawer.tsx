import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerHeaderProps,
} from '@react-navigation/drawer';
import {memo} from 'react';
import {Appbar, Drawer as PaperDrawer, List} from 'react-native-paper';
import {useAppSelector} from '~redux/hooks';
import {selectAllSchedules} from '~redux/timetable/timetableSlice';
import {DrawerStackParamList, RootStackScreenProps} from '~types';
import Timetable from './Timetable';

const Drawer = createDrawerNavigator<DrawerStackParamList>();

function DrawerNavigationBar({navigation, options}: DrawerHeaderProps) {
  return (
    <Appbar.Header elevated mode="center-aligned">
      <Appbar.Action icon="menu" onPress={navigation.openDrawer} />
      <Appbar.Content title={options.title} />
    </Appbar.Header>
  );
}

function AppDrawerContent(props: DrawerContentComponentProps) {
  const {navigation, state} = props;
  const schedules = useAppSelector(selectAllSchedules);

  return (
    <DrawerContentScrollView {...props}>
      {state.routes.map(({name, key}, index) => (
        <PaperDrawer.Item
          active={index === state.index}
          key={key}
          label={name}
          onPress={() => navigation.navigate(name)}
          icon="view-day"
        />
      ))}
      {schedules.map(({title, id}) => (
        <PaperDrawer.Item
          key={id}
          label={title}
          onPress={() => navigation.navigate('Schedule', {id})}
          icon="view-day-outline"
        />
      ))}
      <PaperDrawer.Item
        icon="cog-outline"
        label="Settings"
        onPress={() => navigation.navigate('Settings')}
      />
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
        header: props => <DrawerNavigationBar {...props} />,
      }}
      drawerContent={AppDrawerContent}>
      <Drawer.Screen
        name="Timetable"
        component={Timetable}
        options={{
          title: 'Timetable',
        }}
      />
    </Drawer.Navigator>
  );
}

export default memo(AppDrawer);
