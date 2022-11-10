import {memo, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {DatePickerModal, TimePickerModal} from 'react-native-paper-dates';
import type {SingleChange} from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import {
  formatTime,
  parseDate,
  parseTime,
  formatDate,
  formatDateToTime,
  formatCalendarDate,
} from '~utils/date';
import PickerInput from './PickerInput';

interface Props {
  optional?: boolean;
  value?: string | null;
  label?: string;
  mode: 'date' | 'time';
  onChange: (value: string | null) => void;
  error?: boolean;
  is24Hour?: boolean;
}

function DateTimeInput({
  label,
  mode,
  optional,
  onChange,
  value,
  error,
  is24Hour,
}: Props) {
  const {i18n} = useTranslation();
  const [open, setOpen] = useState(false);

  let formattedValue;
  let parsedValue;

  if (value) {
    formattedValue =
      mode === 'date' ? formatCalendarDate(value) : formatTime(value, is24Hour);
    parsedValue = mode === 'date' ? parseDate(value) : parseTime(value);
  } else {
    formattedValue = '';
    parsedValue = new Date();
  }

  const openPicker = useCallback(() => setOpen(true), []);
  const closePicker = useCallback(() => setOpen(false), []);

  const onChangeDate = useCallback<SingleChange>(
    ({date}) => {
      if (date) {
        onChange(mode === 'date' ? formatDate(date) : formatDateToTime(date));
      }
      closePicker();
    },
    [mode],
  );

  const onClear = useCallback(() => onChange(null), [onChange]);

  return (
    <>
      <PickerInput
        onPress={openPicker}
        value={formattedValue}
        label={label}
        error={error}
        optional={optional}
        icon={mode === 'date' ? 'calendar-outline' : 'clock-outline'}
        onClear={onClear}
      />
      {mode === 'date' ? (
        <DatePickerModal
          mode="single"
          locale={i18n.language}
          visible={open}
          onDismiss={closePicker}
          date={parsedValue}
          onChange={onChangeDate}
          onConfirm={onChangeDate}
        />
      ) : (
        <TimePickerModal
          locale={i18n.language}
          hours={parsedValue.getHours()}
          minutes={parsedValue.getMinutes()}
          visible={open}
          onDismiss={closePicker}
          onConfirm={({hours, minutes}) => {
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            onChangeDate({date});
          }}
        />
      )}
    </>
  );
}

export default memo(DateTimeInput);
