import {TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-paper';

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
  multiline?: boolean;
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
  multiline,
}: Props) {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <TextInput
        theme={{
          roundness: 0,
        }}
        multiline={multiline}
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
    </TouchableOpacity>
  );
}

export default PickerInput;
