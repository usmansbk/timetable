import {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, ScrollView} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useAppSelector} from '~redux/hooks';
import {selectScheduleById} from '~redux/timetable/slice';
import {EventInput} from '~types';
import {formatUTCtoLocalDate, formatUTCtoLocalTime} from '~utils/date';
import {formatRecurrence} from '~utils/event';

interface Props {
  event: EventInput;
}

function ScheduleField({id, label}: {id: string; label: string}) {
  const schedule = useAppSelector(state => selectScheduleById(state, id));

  if (!schedule) {
    return null;
  }

  return (
    <TextInput
      multiline
      label={label}
      editable={false}
      value={schedule.title}
      left={<TextInput.Icon icon="view-day-outline" />}
    />
  );
}

function EventDetails({event}: Props) {
  const {t} = useTranslation();
  const {
    title,
    startDate,
    startTime,
    endTime,
    description,
    repeat,
    scheduleId,
  } = event;

  return (
    <ScrollView style={styles.container}>
      <TextInput
        multiline
        label={t('Title') as string}
        editable={false}
        value={title}
        left={<TextInput.Icon icon="format-title" />}
      />
      <TextInput
        label={t('Date') as string}
        editable={false}
        value={formatUTCtoLocalDate(startDate)}
        left={<TextInput.Icon icon="calendar" />}
      />
      {!!startTime && (
        <TextInput
          label={t('Start time') as string}
          editable={false}
          value={formatUTCtoLocalTime(startTime)}
          left={<TextInput.Icon icon="clock-time-eight-outline" />}
        />
      )}
      {!!endTime && (
        <TextInput
          label={t('End time') as string}
          editable={false}
          value={formatUTCtoLocalTime(endTime)}
          left={<TextInput.Icon icon="clock-time-four-outline" />}
        />
      )}
      {!!repeat && (
        <TextInput
          multiline
          label={t('Repeat') as string}
          editable={false}
          value={formatRecurrence(repeat)}
          left={<TextInput.Icon icon="repeat" />}
        />
      )}
      {!!scheduleId && <ScheduleField id={scheduleId} label={t('Schedule')} />}
      {!!description && (
        <TextInput
          multiline
          label={t('Description') as string}
          editable={false}
          value={description}
          left={<TextInput.Icon icon="text" />}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default memo(EventDetails);
