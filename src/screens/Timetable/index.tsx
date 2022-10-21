import {memo, useCallback, useState} from 'react';
import {useDrawerStatus} from '@react-navigation/drawer';
import {BackHandler, StyleSheet, View} from 'react-native';
import {FAB, Portal} from 'react-native-paper';
import {AppDrawerScreenProps} from '~types';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

function Timetable({navigation}: AppDrawerScreenProps<'Timetable'>) {
  const drawerStatus = useDrawerStatus();
  const isFocused = useIsFocused();
  const [state, setState] = useState({open: false});

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (state.open) {
          setState({open: false});
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [state]),
  );

  return (
    <View style={styles.container}>
      <Portal>
        <FAB.Group
          style={styles.fab}
          visible={drawerStatus === 'closed' && isFocused}
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
              onPress: () => navigation.navigate('Settings'),
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
  },
  fab: {
    bottom: 48,
  },
});
