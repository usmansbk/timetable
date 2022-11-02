import {useCallback, useState} from 'react';
import {StyleSheet, ScrollView, Platform, Linking} from 'react-native';
import {Divider, List} from 'react-native-paper';
import RNOpenNotificaition from 'react-native-open-notification';
import {formatDay} from '~utils/date';
import {useAppSelector} from '~redux/hooks';
import {selectAppTheme, selectStartOfWeek} from '~redux/settings/slice';
import {RootStackScreenProps} from '~types';
import {APP_VERSION, SUPPORT_EMAIL} from '~constants';
import ThemePicker from './ThemePicker';
import DayPicker from './DayPicker';
import DefaultReminders from './DefaultReminders';

export default function Settings({}: RootStackScreenProps<'Settings'>) {
  const theme = useAppSelector(selectAppTheme);
  const startOfWeek = useAppSelector(selectStartOfWeek);

  const [themePickerVisible, setThemePickerVisible] = useState(false);
  const [dayPickerVisible, setDayPickerVisible] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(false);

  const openThemePicker = useCallback(() => setThemePickerVisible(true), []);
  const closeThemePicker = useCallback(() => setThemePickerVisible(false), []);

  const openDayPicker = useCallback(() => setDayPickerVisible(true), []);
  const closeDayPicker = useCallback(() => setDayPickerVisible(false), []);

  const openReminderPicker = useCallback(() => setReminderVisible(true), []);
  const closeReminderPicker = useCallback(() => setReminderVisible(false), []);

  const sendEmailToSupport = useCallback(() => {
    Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=[Timetable v${APP_VERSION}]: ${Platform.OS}, ${Platform.Version}`,
    );
  }, []);

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
      <Divider />
      <List.Section title="Notifications">
        <List.Item title="Default Reminders" onPress={openReminderPicker} />
        {Platform.OS === 'android' && (
          <List.Item
            title="Primary settings"
            onPress={RNOpenNotificaition.open}
          />
        )}
      </List.Section>
      <Divider />
      <List.Section title="More">
        <List.Item
          title="Contact support"
          description="Report a bug or Suggest a feature"
          onPress={sendEmailToSupport}
        />
      </List.Section>
      <ThemePicker visible={themePickerVisible} onDismiss={closeThemePicker} />
      <DayPicker visible={dayPickerVisible} onDismiss={closeDayPicker} />
      <DefaultReminders
        visible={reminderVisible}
        onDismiss={closeReminderPicker}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
