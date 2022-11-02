import {useCallback, useState} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {List} from 'react-native-paper';
import {formatDay} from '~utils/date';
import {useAppSelector} from '~redux/hooks';
import {selectAppTheme, selectStartOfWeek} from '~redux/settings/slice';
import {RootStackScreenProps} from '~types';
import ThemePicker from './ThemePicker';
import DayPicker from './DayPicker';

export default function Settings({}: RootStackScreenProps<'Settings'>) {
  const theme = useAppSelector(selectAppTheme);
  const startOfWeek = useAppSelector(selectStartOfWeek);

  const [themePickerVisible, setThemePickerVisible] = useState(false);
  const [dayPickerVisible, setDayPickerVisible] = useState(false);

  const openThemePicker = useCallback(() => setThemePickerVisible(true), []);
  const closeThemePicker = useCallback(() => setThemePickerVisible(false), []);

  const openDayPicker = useCallback(() => setDayPickerVisible(true), []);
  const closeDayPicker = useCallback(() => setDayPickerVisible(false), []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <List.Section title="Preferences">
        <List.Item
          title="Theme"
          onPress={openThemePicker}
          description={theme}
        />
        <List.Item
          title="Start the week on"
          description={formatDay(startOfWeek)}
          onPress={openDayPicker}
        />
      </List.Section>
      <ThemePicker visible={themePickerVisible} onDismiss={closeThemePicker} />
      <DayPicker visible={dayPickerVisible} onDismiss={closeDayPicker} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
