import {TextInput, TouchableRipple} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {memo, useState} from 'react';
import {
  formatToLocalDate,
  formatToLocalTime,
  formatToUTCdate,
  formatToUTCtime,
  parseDate,
  parseTime,
} from '~utils/date';

interface Props {
  optional?: boolean;
  value?: string | null;
  label?: string;
  mode: 'date' | 'time';
  onChange: (value: string | null) => void;
}

function DateTimeInput({label, mode, optional, onChange, value}: Props) {
  const [open, setOpen] = useState(false);

  let formattedValue;
  let parsedValue;

  if (value) {
    formattedValue =
      mode === 'date' ? formatToLocalDate(value) : formatToLocalTime(value);
    parsedValue = mode === 'date' ? parseDate(value) : parseTime(value);
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
          right={
            optional && value ? (
              <TextInput.Icon icon="close" onPress={() => onChange(null)} />
            ) : null
          }
        />
      </TouchableRipple>
      {open && (
        <DateTimePicker
          mode={mode}
          value={parsedValue}
          onChange={(e, date) => {
            if (e.type === 'set' && date) {
              onChange(
                mode === 'date' ? formatToUTCdate(date) : formatToUTCtime(date),
              );
            }
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

export default memo(DateTimeInput);
