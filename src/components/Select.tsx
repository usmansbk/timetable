import {useCallback, useState} from 'react';
import {Dialog, Portal, RadioButton} from 'react-native-paper';
import {IconName} from '~types';
import PickerInput from './PickerInput';

export interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  optional?: boolean;
  label?: string;
  placeholder?: string;
  value?: string | null;
  icon?: IconName;
  options?: SelectOption[];
  onChange: (value: string | null) => void;
  error?: boolean;
}

export default function Select({
  label,
  placeholder,
  value,
  icon,
  options,
  onChange,
  optional,
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = options?.find(option => value === option.value);

  const handleChange = useCallback((newValue: string) => {
    onChange(newValue);
    setOpen(false);
  }, []);

  return (
    <>
      <PickerInput
        icon={icon}
        label={label}
        placeholder={placeholder}
        value={selected?.label || ''}
        error={error}
        optional={optional}
        onPress={() => setOpen(true)}
        onClear={() => onChange(null)}
      />
      <Portal>
        <Dialog visible={open} onDismiss={() => setOpen(false)}>
          <Dialog.Title>{label}</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group value={value || ''} onValueChange={handleChange}>
              {options?.map(({label, value}) => (
                <RadioButton.Item key={value} label={label} value={value} />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
}
