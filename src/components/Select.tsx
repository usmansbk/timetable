import {useCallback, useState} from 'react';
import {
  Dialog,
  Portal,
  TextInput,
  TouchableRipple,
  List,
} from 'react-native-paper';
import {IconName} from '~types';

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
}

export default function Select({
  label,
  placeholder,
  value,
  icon,
  options,
  onChange,
  optional,
}: Props) {
  const [open, setOpen] = useState(false);
  const selected = options?.find(option => value === option.value);

  const handleChange = useCallback(
    (newValue: string) => () => {
      onChange(newValue);
      setOpen(false);
    },
    [],
  );

  return (
    <>
      <TouchableRipple onPress={() => setOpen(true)}>
        <TextInput
          theme={{
            roundness: 0,
          }}
          left={icon ? <TextInput.Icon icon={icon} /> : null}
          right={
            optional && value ? (
              <TextInput.Icon icon="close" onPress={() => onChange(null)} />
            ) : null
          }
          editable={false}
          label={label}
          placeholder={placeholder}
          value={selected?.label || ''}
        />
      </TouchableRipple>
      <Portal>
        <Dialog visible={open} onDismiss={() => setOpen(false)}>
          <Dialog.Title>{label}</Dialog.Title>
          <Dialog.Content>
            {options?.map(({label, value}) => (
              <List.Item
                title={label}
                key={value}
                onPress={handleChange(value)}
                right={
                  selected?.value === value
                    ? ({color}) => <List.Icon color={color} icon="check" />
                    : undefined
                }
              />
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
}
