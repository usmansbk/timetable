import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '~types';
import AppDrawer from './AppDrawer';
import Settings from './Settings';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigationBar({back, navigation, options}: NativeStackHeaderProps) {
  return (
    <Appbar elevated>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={options.title} />
    </Appbar>
  );
}

export default function Screens() {
  const {colors, dark} = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle={dark ? 'dark-content' : 'light-content'}
      />
      <Stack.Navigator
        initialRouteName="AppDrawer"
        screenOptions={{
          header: props => <AppNavigationBar {...props} />,
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
            title: 'Settings',
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
