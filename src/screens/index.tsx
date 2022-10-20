import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

export default function Screens() {
  const {colors, dark} = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle={dark ? 'dark-content' : 'light-content'}
      />
      <Text>Timetable</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
