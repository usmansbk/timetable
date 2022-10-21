import {memo, useState} from 'react';
import {useDrawerStatus} from '@react-navigation/drawer';
import {StyleSheet, View} from 'react-native';
import {FAB, Portal} from 'react-native-paper';
import {AppDrawerScreenProps} from '~types';

function Timetable({}: AppDrawerScreenProps<'Timetable'>) {
  const drawerStatus = useDrawerStatus();
  const [state, setState] = useState({open: false});

  return (
    <View style={styles.container}>
      <Portal>
        <FAB.Group
          visible={drawerStatus === 'closed'}
          open={state.open}
          icon={state.open ? 'calendar-today' : 'plus'}
          actions={[
            {
              label: 'Import schedule',
              icon: 'calendar-import',
              onPress: () => null,
            },
            {
              label: 'Create schedule',
              icon: 'calendar-plus',
              onPress: () => null,
            },
          ]}
          onStateChange={setState}
        />
      </Portal>
    </View>
  );
}

export default memo(Timetable);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
