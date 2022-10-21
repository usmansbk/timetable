import {Appbar} from 'react-native-paper';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

export default function Header({
  back,
  navigation,
  options,
}: NativeStackHeaderProps) {
  return (
    <Appbar elevated>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={options.title} />
    </Appbar>
  );
}
