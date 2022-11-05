import {TextInput, TouchableRipple} from 'react-native-paper';

interface Props {
  value: string;
  label?: string;
  placeholder?: string;
  onPress: () => void;
  onClear?: () => void;
  disabled?: boolean;
  icon?: string;
  rightIcon?: string;
  optional?: boolean;
  error?: boolean;
}

function PickerInput({
  value,
  onPress,
  disabled,
  icon,
  label,
  optional,
  error,
  onClear,
  placeholder,
}: Props) {
  return (
    <TouchableRipple disabled={disabled} onPress={onPress}>
      <TextInput
        theme={{
          roundness: 0,
        }}
        value={value}
        label={label}
        placeholder={placeholder}
        editable={false}
        left={icon ? <TextInput.Icon icon={icon} disabled /> : undefined}
        right={
          optional && value ? (
            <TextInput.Icon icon="close" onPress={onClear} />
          ) : null
        }
        error={error}
      />
    </TouchableRipple>
  );
}

export default PickerInput;
