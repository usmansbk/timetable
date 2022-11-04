import {TextInput, TouchableRipple} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {memo, useState} from 'react';
import {
  formatUTCtoLocalDate,
  formatUTCtoLocalTime,
  formatToUTCdate,
  formatToUTCtime,
  parseUTCtoLocalDate,
  parseUTCtoLocalTime,
} from '~utils/date';

interface Props {
  optional?: boolean;
  value?: string | null;
  label?: string;
  mode: 'date' | 'time';
  onChange: (value: string | null) => void;
  error?: boolean;
}

function DateTimeInput({label, mode, optional, onChange, value, error}: Props) {
  const [open, setOpen] = useState(false);

  let formattedValue;
  let parsedValue;

  if (value) {
    formattedValue =
      mode === 'date'
        ? formatUTCtoLocalDate(value)
        : formatUTCtoLocalTime(value);
    parsedValue =
      mode === 'date' ? parseUTCtoLocalDate(value) : parseUTCtoLocalTime(value);
  } else {
    formattedValue = '';
    parsedValue = new Date();
  }

  return (
    <>
      <TouchableRipple onPress={() => setOpen(true)}>
        <TextInput
          theme={{
            roundness: 0,
          }}
          value={formattedValue}
          editable={false}
          label={label}
          left={
            <TextInput.Icon
              icon={mode === 'date' ? 'calendar-outline' : 'clock-outline'}
              disabled
            />
          }
          right={
            optional && value ? (
              <TextInput.Icon icon="close" onPress={() => onChange(null)} />
            ) : null
          }
          error={error}
        />
      </TouchableRipple>
      {open && (
        <DateTimePicker
          minimumDate={new Date()}
          mode={mode}
          value={parsedValue}
          onChange={(e, date) => {
            setOpen(false);
            if (e.type === 'set' && date) {
              onChange(
                mode === 'date' ? formatToUTCdate(date) : formatToUTCtime(date),
              );
            }
          }}
        />
      )}
    </>
  );
}

export default memo(DateTimeInput);
