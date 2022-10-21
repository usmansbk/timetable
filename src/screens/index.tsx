import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '~types';
import AppDrawer from './AppDrawer';
import Settings from './Settings';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Screens() {
  const {colors, dark} = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle={dark ? 'dark-content' : 'light-content'}
      />
      <Stack.Navigator initialRouteName="AppDrawer">
        <Stack.Screen
          component={AppDrawer}
          name="AppDrawer"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen component={Settings} name="Settings" />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
