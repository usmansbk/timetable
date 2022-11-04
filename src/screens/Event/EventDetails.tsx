import {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, ScrollView, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useAppSelector} from '~redux/hooks';
import {selectScheduleById} from '~redux/timetable/slice';
import {EventInput} from '~types';
import {formatUTCtoLocalDate, formatUTCtoLocalTime} from '~utils/date';
import {formatRecurrence, getNextEventDate} from '~utils/event';

interface Props {
  event: EventInput;
  date?: string;
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
      left={<TextInput.Icon disabled icon="view-day-outline" />}
    />
  );
}

function EventDetails({event, date}: Props) {
  const {t} = useTranslation();
  const {title, startTime, endTime, description, repeat, scheduleId} = event;

  const startDate = getNextEventDate(event, date) || event.startDate;

  return (
    <ScrollView style={styles.container}>
      <TextInput
        multiline
        label={t('Title') as string}
        editable={false}
        value={title}
        left={<TextInput.Icon disabled icon="format-title" />}
      />
      <TextInput
        label={t('Date') as string}
        editable={false}
        value={formatUTCtoLocalDate(startDate)}
        left={<TextInput.Icon disabled icon="calendar" />}
      />
      <View style={styles.row}>
        {!!startTime && (
          <View style={styles.time}>
            <TextInput
              label={t('From') as string}
              editable={false}
              value={formatUTCtoLocalTime(startTime)}
              left={<TextInput.Icon disabled icon="clock-time-eight-outline" />}
            />
          </View>
        )}
        {!!endTime && (
          <View style={styles.time}>
            <TextInput
              label={t('To') as string}
              editable={false}
              value={formatUTCtoLocalTime(endTime)}
              left={<TextInput.Icon disabled icon="clock-time-four-outline" />}
            />
          </View>
        )}
      </View>
      {!!repeat && (
        <TextInput
          multiline
          label={t('Repeat') as string}
          editable={false}
          value={formatRecurrence(repeat)}
          left={<TextInput.Icon disabled icon="repeat" />}
        />
      )}
      {!!scheduleId && <ScheduleField id={scheduleId} label={t('Schedule')} />}
      {!!description && (
        <TextInput
          multiline
          label={t('Description') as string}
          editable={false}
          value={description}
          left={<TextInput.Icon disabled icon="text" />}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
  },
  time: {
    flex: 1,
  },
});

export default memo(EventDetails);
