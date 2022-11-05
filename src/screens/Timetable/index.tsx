import {useCallback, useState} from 'react';
import {useDrawerStatus} from '@react-navigation/drawer';
import {BackHandler, StyleSheet, View} from 'react-native';
import {FAB, Portal} from 'react-native-paper';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {AppDrawerScreenProps, EventInput} from '~types';
import AddNewEvent from './AddNewEvent';
import AllEvents from './AllEvents';

function Timetable({navigation}: AppDrawerScreenProps<'Timetable'>) {
  const {t} = useTranslation();
  const drawerStatus = useDrawerStatus();
  const isFocused = useIsFocused();
  const [state, setState] = useState({open: false});
  const [openAddEvent, setOpenAddEvent] = useState(false);
  const closeAddEventForm = useCallback(() => setOpenAddEvent(false), []);

  const onPressItem = useCallback(
    (item: EventInput) => {
      if (item.id) {
        navigation.navigate('Event', {
          id: item.id,
          date: item.startDate,
        });
      }
    },
    [navigation],
  );

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

  const fabVisible = drawerStatus === 'closed' && isFocused && !openAddEvent;

  return (
    <View style={styles.container}>
      <AllEvents openDrawer={navigation.openDrawer} onPressItem={onPressItem} />
      <Portal>
        <FAB.Group
          style={styles.fab}
          visible={fabVisible}
          open={state.open}
          icon={state.open ? 'calendar-edit' : 'plus'}
          actions={[
            {
              label: t('Create schedule'),
              icon: 'calendar-plus',
              onPress: () => navigation.navigate('NewSchedule'),
            },
          ]}
          onStateChange={setState}
          onPress={() => {
            if (state.open) {
              setOpenAddEvent(true);
            }
          }}
        />
      </Portal>
      <AddNewEvent visible={openAddEvent} onDismiss={closeAddEventForm} />
    </View>
  );
}

export default Timetable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    paddingBottom: 48,
  },
});
