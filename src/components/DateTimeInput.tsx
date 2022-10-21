import {TextInput, TouchableRipple} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useState} from 'react';

interface Props {
  optional?: boolean;
  value?: string | null;
  label?: string;
  mode: 'date' | 'time';
  onChange: (value: string | null) => void;
}

export default function DateTimeInput({
  label,
  mode,
  optional,
  onChange,
  value,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableRipple onPress={() => setOpen(true)}>
        <TextInput
          theme={{
            roundness: 0,
          }}
          value={value || ''}
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
          value={new Date()}
          onChange={(e, date) => {
            if (e.type === 'set' && date) {
              onChange(date.toISOString());
            }
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
