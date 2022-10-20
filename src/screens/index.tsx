import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Home';

const Stack = createNativeStackNavigator();

export default function Screens() {
  const {colors, dark} = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle={dark ? 'dark-content' : 'light-content'}
      />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen component={Home} name="Home" />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
