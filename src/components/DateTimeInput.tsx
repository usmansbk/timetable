import DateTimePicker from '@react-native-community/datetimepicker';
import {memo, useState} from 'react';
import {
  formatUTCtoLocalDate,
  formatUTCtoLocalTime,
  formatDateToUTC,
  formatTimeToUTC,
  parseUTCtoLocalDate,
  parseUTCtoLocalTime,
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
  const [open, setOpen] = useState(false);

  let formattedValue;
  let parsedValue;

  if (value) {
    formattedValue =
      mode === 'date'
        ? formatUTCtoLocalDate(value)
        : formatUTCtoLocalTime(value, is24Hour);
    parsedValue =
      mode === 'date' ? parseUTCtoLocalDate(value) : parseUTCtoLocalTime(value);
  } else {
    formattedValue = '';
    parsedValue = new Date();
  }

  return (
    <>
      <PickerInput
        onPress={() => setOpen(true)}
        value={formattedValue}
        label={label}
        error={error}
        optional={optional}
        icon={mode === 'date' ? 'calendar-outline' : 'clock-outline'}
        onClear={() => onChange(null)}
      />
      {open && (
        <DateTimePicker
          is24Hour={is24Hour}
          mode={mode}
          value={parsedValue}
          onChange={(e, date) => {
            setOpen(false);
            if (e.type === 'set' && date) {
              onChange(
                mode === 'date' ? formatDateToUTC(date) : formatTimeToUTC(date),
              );
            }
          }}
        />
      )}
    </>
  );
}

export default memo(DateTimeInput);
