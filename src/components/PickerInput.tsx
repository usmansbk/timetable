import {StyleSheet, View} from 'react-native';
import {
  Text,
  TouchableRipple,
  IconButton,
  Divider,
  useTheme,
} from 'react-native-paper';

const MD3_MIN_HEIGHT = 56;
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
  placeholder,
}: Props) {
  const {colors} = useTheme();
  return (
    <>
      <TouchableRipple onPress={onPress} disabled={disabled}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: error
                ? colors.errorContainer
                : colors.background,
            },
          ]}>
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
            {value && <Text variant="bodyLarge">{value}</Text>}
          </View>
          {optional && value ? (
            <IconButton icon="close" onPress={onClear} />
          ) : null}
        </View>
      </TouchableRipple>
      <Divider />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: MD3_MIN_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  body: {
    flex: 1,
  },
});

export default PickerInput;
