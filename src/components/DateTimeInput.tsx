import {memo, useCallback, useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
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

  const onClear = useCallback(() => onChange(null), [onChange]);
  const onConfirm = useCallback(
    (date: Date) => {
      setOpen(false);
      onChange(mode === 'date' ? formatDate(date) : formatDateToTime(date));
    },
    [mode],
  );

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
      <DateTimePickerModal
        isVisible={open}
        is24Hour={is24Hour}
        mode={mode}
        date={parsedValue}
        onCancel={closePicker}
        onConfirm={onConfirm}
      />
    </>
  );
}

export default memo(DateTimeInput);
