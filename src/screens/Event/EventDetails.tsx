import {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, ScrollView, View} from 'react-native';
import {Divider, Text, useTheme} from 'react-native-paper';
import HyperlinkedText from '~components/HyperlinkedText';
import {useAppSelector} from '~redux/hooks';
import {selectIs24HourTimeFormat} from '~redux/settings/slice';
import {selectScheduleById} from '~redux/timetable/slice';
import {EventInput} from '~types';
import {formatUTCtoLocalDate} from '~utils/date';
import {
  formatEventTime,
  formatRecurrence,
  getNextEventDate,
} from '~utils/event';

interface Props {
  event: EventInput;
  date?: string;
}

function Field({
  label,
  value,
  hypertext,
}: {
  value: string;
  label: string;
  hypertext?: boolean;
}) {
  const {colors} = useTheme();
  return (
    <View style={styles.fieldContainer}>
      <Text variant="labelLarge" style={styles.label}>
        {label.toLocaleUpperCase()}
      </Text>
      {hypertext ? (
        <HyperlinkedText selectable variant="bodyMedium" text={value} />
      ) : (
        <Text
          variant="headlineMedium"
          style={[styles.text1, {color: colors.onSurfaceVariant}]}>
          {value}
        </Text>
      )}
    </View>
  );
}

function ScheduleField({id, label}: {id: string; label: string}) {
  const schedule = useAppSelector(state => selectScheduleById(state, id));

  if (!schedule) {
    return null;
  }

  return <Field label={label} value={schedule.title} />;
}

function EventDetails({event, date}: Props) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const is24Hour = useAppSelector(selectIs24HourTimeFormat);
  const {title, description, repeat, scheduleId} = event;

  const startDate = getNextEventDate(event, date) || event.startDate;

  const timeFormat = formatEventTime(event, is24Hour);
  const time = timeFormat && t(timeFormat.key, {...timeFormat.options});

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium">{title}</Text>
      <Text
        variant="headlineMedium"
        style={[styles.text1, {color: colors.onSurfaceVariant}]}>
        {formatUTCtoLocalDate(startDate)}
      </Text>
      {!!time && (
        <Text
          variant="headlineMedium"
          style={[styles.text1, {color: colors.onSurfaceVariant}]}>
          {time}
        </Text>
      )}
      <Divider />
      {!!repeat && (
        <Field label={t('Repeat') as string} value={formatRecurrence(repeat)} />
      )}
      {!!scheduleId && <ScheduleField id={scheduleId} label={t('Schedule')} />}
      {!!description && (
        <Field
          label={t('Description') as string}
          value={description}
          hypertext
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  text1: {
    fontSize: 16,
  },
  label: {
    fontSize: 10,
  },
  fieldContainer: {
    paddingVertical: 8,
  },
});

export default memo(EventDetails);
