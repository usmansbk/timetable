import {StyleSheet, View} from 'react-native';
import {useTheme, TouchableRipple, Text} from 'react-native-paper';
import {formatCalendarDate} from '~utils/date';
import {ITEM_HEIGHT} from './constants';

function AgendaDayHeader({
  item,
  onPress,
}: {
  item: string;
  onPress?: (date: string) => void;
}) {
  const {colors} = useTheme();

  return (
    <TouchableRipple disabled={!onPress} onPress={() => onPress?.(item)}>
      <View
        style={[
          styles.sectionHeader,
          {backgroundColor: colors.surfaceDisabled},
        ]}>
        <Text
          variant="headlineMedium"
          style={[styles.sectionHeaderText, {color: colors.onSurfaceVariant}]}>
          {formatCalendarDate(item).toLocaleUpperCase()}
        </Text>
      </View>
    </TouchableRipple>
  );
}

export default AgendaDayHeader;

const styles = StyleSheet.create({
  sectionHeader: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    fontSize: 12,
  },
});
