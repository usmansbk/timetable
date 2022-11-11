import {useCallback} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {formatDay} from '~utils/date';

const days = [0, 1, 2, 3, 4, 5, 6]; // mon - sun

interface DayProps {
  day: number;
  activeBackgroundColor: string;
  borderColor: string;
  active: boolean;
  onPress: () => void;
}

const DAY_SIZE = 32;

function Day({
  day,
  activeBackgroundColor,
  borderColor,
  active,
  onPress,
}: DayProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.dayContainer,
        {
          width: DAY_SIZE,
          height: DAY_SIZE,
          borderRadius: DAY_SIZE / 2,
          backgroundColor: active ? activeBackgroundColor : 'transparent',
          borderWidth: 1,
          borderColor,
        },
      ]}>
      <Text style={{fontSize: DAY_SIZE / 2}}>{formatDay(day + 1)[0]}</Text>
    </TouchableOpacity>
  );
}

interface Props {
  value?: typeof days;
  onChange: (value: number[]) => void;
}

function DayPicker({value = [], onChange}: Props) {
  const {colors} = useTheme();

  const onPressDay = useCallback(
    (day: number) => {
      const newValue = value.includes(day)
        ? value.filter(val => val !== day)
        : value.concat(day);

      onChange(newValue.sort());
    },
    [value, onChange],
  );

  return (
    <View style={styles.container}>
      {days.map(day => (
        <Day
          key={day}
          day={day}
          active={value.includes(day)}
          activeBackgroundColor={colors.primaryContainer}
          borderColor={colors.onBackground}
          onPress={() => onPressDay(day)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  dayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});

export default DayPicker;
