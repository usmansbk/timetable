import {useCallback, useState} from 'react';
import {StyleSheet, ScrollView, Platform, Linking, View} from 'react-native';
import {Divider, List, Text, Switch} from 'react-native-paper';
import RNOpenNotificaition from 'react-native-open-notification';
import {useTranslation} from 'react-i18next';
import {formatDay} from '~utils/date';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {
  selectAppTheme,
  selectIs24HourTimeFormat,
  selectNotificationSound,
  selectNotificationVibration,
  selectStartOfWeek,
  toggle24HourTimeFormat,
  toggleNotificationSound,
  toggleNotificationVibration,
} from '~redux/settings/slice';
import {RootStackScreenProps} from '~types';
import {APP_VERSION, SUPPORT_EMAIL} from '~constants';
import ThemePicker from './ThemePicker';
import DayPicker from './DayPicker';
import DefaultReminders from './DefaultReminders';

export default function Settings({}: RootStackScreenProps<'Settings'>) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectAppTheme);
  const startOfWeek = useAppSelector(selectStartOfWeek);
  const playSound = useAppSelector(selectNotificationSound);
  const vibrate = useAppSelector(selectNotificationVibration);
  const is24Hour = useAppSelector(selectIs24HourTimeFormat);

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

  const onToggleVibrate = useCallback(() => {
    dispatch(toggleNotificationVibration());
  }, []);

  const onToggleSound = useCallback(() => {
    dispatch(toggleNotificationSound());
  }, []);

  const onToggleTimeFormat = useCallback(() => {
    dispatch(toggle24HourTimeFormat());
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <List.Section title={t('Preferences')}>
        <List.Item
          title={t('Theme')}
          onPress={openThemePicker}
          description={t(`theme_${theme}`)}
        />
        <List.Item
          title={t('Start of the week')}
          description={formatDay(startOfWeek)}
          onPress={openDayPicker}
        />
        <List.Item
          title={t('24-hour time')}
          onPress={onToggleTimeFormat}
          right={() => (
            <Switch value={is24Hour} onChange={onToggleTimeFormat} />
          )}
        />
      </List.Section>
      <Divider />
      <List.Section title={t('Notifications')}>
        <List.Item
          title={t('Default Reminders')}
          onPress={openReminderPicker}
        />
        <List.Item
          title={t('Sound')}
          onPress={onToggleSound}
          right={() => <Switch value={playSound} onChange={onToggleSound} />}
        />
        <List.Item
          title="Vibration"
          onPress={onToggleVibrate}
          right={() => <Switch value={vibrate} onChange={onToggleVibrate} />}
        />
        {Platform.OS === 'android' && (
          <List.Item
            title={t('Primary settings')}
            onPress={RNOpenNotificaition.open}
          />
        )}
      </List.Section>
      <Divider />
      <List.Section title={t('More')}>
        <List.Item
          title={t('Contact support')}
          description={t('Report a bug or Suggest a feature')}
          onPress={sendEmailToSupport}
        />
      </List.Section>
      <View style={styles.footer}>
        <Text variant="labelSmall">version {APP_VERSION}</Text>
      </View>
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
  footer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
