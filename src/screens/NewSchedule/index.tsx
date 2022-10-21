import {memo} from 'react';
import {View} from 'react-native';
import {Title} from 'react-native-paper';

function NewSchedule() {
  return (
    <View>
      <Title>New Schedule</Title>
    </View>
  );
}

export default memo(NewSchedule);
