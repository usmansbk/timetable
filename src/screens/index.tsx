import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {useCallback} from 'react';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {RootStackParamList} from '~types';
import AppDrawer from './AppDrawer';
import Settings from './Settings';
import NewSchedule from './NewSchedule';
import Schedule from './Schedule';
import EditSchedule from './EditSchedule';
import DuplicateSchedule from './DuplicateSchedule';
import Event from './Event';
import Search from './Search';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigationBar(props: NativeStackHeaderProps) {
  const {back, navigation, options} = props;
  const {title, headerRight} = options;

  const renderRight = useCallback(
    () =>
      headerRight
        ? headerRight({
            canGoBack: !!back,
            tintColor: options.headerTintColor,
          })
        : null,
    [headerRight, options, back],
  );

  return (
    <Appbar.Header elevated mode="center-aligned">
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
      {renderRight()}
    </Appbar.Header>
  );
}

export default function Screens() {
  const {colors, dark} = useTheme();
  const {t} = useTranslation();

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={dark ? 'light-content' : 'dark-content'}
      />
      <Stack.Navigator
        initialRouteName="AppDrawer"
        screenOptions={{
          header: props => <AppNavigationBar {...props} />,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        <Stack.Screen
          component={AppDrawer}
          name="AppDrawer"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          component={Settings}
          name="Settings"
          options={{
            title: t('Settings'),
          }}
        />
        <Stack.Screen
          component={NewSchedule}
          name="NewSchedule"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          component={EditSchedule}
          name="EditSchedule"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          component={DuplicateSchedule}
          name="DuplicateSchedule"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen component={Schedule} name="Schedule" />
        <Stack.Screen component={Event} name="Event" />
        <Stack.Screen
          component={Search}
          name="Search"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
