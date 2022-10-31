import {memo, useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import EmptyState from '~components/EmptyState';
import {useAppSelector} from '~redux/hooks';
import {selectEventById} from '~redux/timetable/timetableSlice';
import {RootStackScreenProps} from '~types';
import EditEvent from './EditEvent';

function Event({route, navigation}: RootStackScreenProps<'Event'>) {
  const {id} = route.params;
  const [editVisible, setEditVisible] = useState(false);
  const event = useAppSelector(state => selectEventById(state, id));

  const openEdit = useCallback(() => setEditVisible(true), []);
  const closeEdit = useCallback(() => setEditVisible(false), []);

  useEffect(() => {
    if (event) {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [event, navigation]);

  if (!event) {
    return <EmptyState title="Event does not exists" />;
  }

  const {title} = event;

  return (
    <>
      <Appbar.Header elevated mode="center-aligned">
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="" />
        <Appbar.Action icon="pencil-outline" onPress={openEdit} />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <Text variant="headlineLarge">{title}</Text>
      </ScrollView>
      <EditEvent event={event} visible={editVisible} onDismiss={closeEdit} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
});

export default memo(Event);
