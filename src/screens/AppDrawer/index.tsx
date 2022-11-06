import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerHeaderProps,
} from '@react-navigation/drawer';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {memo, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ToastAndroid} from 'react-native';
import {Appbar, Drawer as PaperDrawer} from 'react-native-paper';
import AccountHeader from '~screens/AppDrawer/AccountHeader';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {selectAllSchedules} from '~redux/timetable/slice';
import {selectCurrentUser, setCurrentUser} from '~redux/user/slice';
import {DrawerStackParamList, RootStackScreenProps} from '~types';
import Confirm from '~components/Confirm';
import Timetable from '../Timetable';

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
  const dispatch = useAppDispatch();
  const schedules = useAppSelector(selectAllSchedules);
  const user = useAppSelector(selectCurrentUser);

  const openConfirmLogout = useCallback(() => setConfirmVisible(true), []);
  const closeConfirmLogout = useCallback(() => setConfirmVisible(false), []);

  const signOut = useCallback(async () => {
    try {
      dispatch(setCurrentUser(null));
      await GoogleSignin.signOut();
    } catch (e) {
      ToastAndroid.show((e as Error).message, ToastAndroid.SHORT);
    }
  }, []);

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
            icon="view-day-outline"
          />
        ))}
      </PaperDrawer.Section>
      <PaperDrawer.Item
        icon="cog-outline"
        label={t('Settings')}
        onPress={() => navigation.navigate('Settings')}
      />
      {user && (
        <PaperDrawer.Item
          icon="logout-variant"
          label={t('Log out')}
          onPress={openConfirmLogout}
        />
      )}
      <Confirm
        visible={confirmVisible}
        onDismiss={closeConfirmLogout}
        title={t('Log out?')}
        onConfirm={signOut}
      />
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
