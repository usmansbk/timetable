import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Text, Provider as PaperProvider} from 'react-native-paper';
import {usePaperTheme} from '~config/theme';

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
});

export default function App() {
  const theme = usePaperTheme();

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Text>Timetable</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}
