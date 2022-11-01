import {useCallback, useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {List} from 'react-native-paper';
import {RootStackScreenProps} from '~types';
import ThemePicker from './ThemePicker';

export default function Settings({}: RootStackScreenProps<'Settings'>) {
  const [themePickerVisible, setThemePickerVisible] = useState(false);

  const openThemePicker = useCallback(() => setThemePickerVisible(true), []);
  const closeThemePicker = useCallback(() => setThemePickerVisible(false), []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <List.Section title="Preferences">
        <List.Item title="Theme" onPress={openThemePicker} />
      </List.Section>
      <ThemePicker visible={themePickerVisible} onDismiss={closeThemePicker} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
