import {SafeAreaView, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

export default function Navigator() {
  const {colors} = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <Text>Timetable</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
