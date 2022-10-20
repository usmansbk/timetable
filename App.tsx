import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Text, Provider as PaperProvider} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
});

function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Text>Timetable</Text>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default App;
