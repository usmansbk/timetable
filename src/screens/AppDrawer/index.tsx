import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerHeaderProps,
} from '@react-navigation/drawer';
import {memo, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Appbar, Drawer as PaperDrawer} from 'react-native-paper';
import AccountHeader from '~screens/AppDrawer/AccountHeader';
import {useAppSelector} from '~redux/hooks';
import {selectAllSchedules} from '~redux/timetable/slice';
import {selectCurrentUser} from '~redux/auth/slice';
import {DrawerStackParamList, RootStackScreenProps} from '~types';
import Timetable from '../Timetable';
import LogoutConfirm from './LogoutConfirm';

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
  const {t} = useTranslation();
  const {navigation, state} = props;
  const [confirmVisible, setConfirmVisible] = useState(false);
  const schedules = useAppSelector(selectAllSchedules);
  const user = useAppSelector(selectCurrentUser);

  const openConfirmLogout = useCallback(() => setConfirmVisible(true), []);
  const closeConfirmLogout = useCallback(() => setConfirmVisible(false), []);

  return (
    <DrawerContentScrollView {...props}>
      <AccountHeader user={user} />
      <PaperDrawer.Section>
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
            icon="calendar-clock-outline"
          />
        ))}
      </PaperDrawer.Section>
      <PaperDrawer.Item
        icon="cog-outline"
        label={t('Settings')}
        onPress={() => navigation.navigate('Settings')}
      />
      {user && (
        <>
          <PaperDrawer.Item
            icon="logout-variant"
            label={t('Log out')}
            onPress={openConfirmLogout}
          />
          <LogoutConfirm
            visible={confirmVisible}
            onDismiss={closeConfirmLogout}
          />
        </>
      )}
    </DrawerContentScrollView>
  );
}

function AppDrawer({}: RootStackScreenProps<'AppDrawer'>) {
  const {t} = useTranslation();
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
          title: t('Timetable'),
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

export default memo(AppDrawer);
