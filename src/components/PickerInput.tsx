import {StyleSheet, View} from 'react-native';
import {Text, TouchableRipple, IconButton, useTheme} from 'react-native-paper';

const MAXIMIZED_LABEL_FONT_SIZE = 16;
const MINIMIZED_LABEL_FONT_SIZE = 12;

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
}: Props) {
  const {colors} = useTheme();
  return (
    <TouchableRipple
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: error ? colors.errorContainer : colors.background,
      }}>
      <View style={styles.container}>
        {icon ? <IconButton icon={icon} disabled /> : undefined}
        <View style={styles.body}>
          {label && (
            <Text
              variant="labelLarge"
              style={{
                fontSize: value
                  ? MINIMIZED_LABEL_FONT_SIZE
                  : MAXIMIZED_LABEL_FONT_SIZE,
                color: colors.outline,
              }}>
              {label}
            </Text>
          )}
          {value && (
            <Text style={{color: colors.onSurfaceVariant}} variant="bodyLarge">
              {value}
            </Text>
          )}
        </View>
        {optional && value ? (
          <IconButton icon="close" onPress={onClear} />
        ) : null}
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  body: {
    flex: 1,
  },
});

export default PickerInput;
