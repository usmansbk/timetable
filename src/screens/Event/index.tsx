import {memo, useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Appbar, Menu, Text} from 'react-native-paper';
import Confirm from '~components/Confirm';
import EmptyState from '~components/EmptyState';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {removeEvent, selectEventById} from '~redux/timetable/timetableSlice';
import {RootStackScreenProps} from '~types';
import DuplicateEvent from './DuplicateEvent';
import EditEvent from './EditEvent';

function Event({route, navigation}: RootStackScreenProps<'Event'>) {
  const {id} = route.params;
  const dispatch = useAppDispatch();
  const event = useAppSelector(state => selectEventById(state, id));

  const [editVisible, setEditVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [duplicateVisible, setDuplicateVisible] = useState(false);

  const openDuplicate = useCallback(() => setDuplicateVisible(true), []);
  const closeDuplicate = useCallback(() => setDuplicateVisible(false), []);

  const openConfirm = useCallback(() => setConfirmVisible(true), []);
  const closeConfirm = useCallback(() => setConfirmVisible(false), []);

  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const openEdit = useCallback(() => setEditVisible(true), []);
  const closeEdit = useCallback(() => setEditVisible(false), []);

  const handleMenuPress = useCallback(
    (key: 'edit' | 'delete' | 'duplicate') => () => {
      closeMenu();
      if (key === 'edit') {
        openEdit();
      } else if (key === 'duplicate') {
        openDuplicate();
      } else if (key === 'delete') {
        openConfirm();
      }
    },
    [],
  );

  const handleDelete = useCallback(() => {
    if (event) {
      navigation.pop();
      dispatch(removeEvent(event.id));
    }
  }, [event]);

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
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
          <Menu.Item title="Edit" onPress={handleMenuPress('edit')} />
          <Menu.Item title="Duplicate" onPress={handleMenuPress('duplicate')} />
          <Menu.Item title="Delete" onPress={handleMenuPress('delete')} />
        </Menu>
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <Text variant="headlineLarge">{title}</Text>
      </ScrollView>
      <EditEvent event={event} visible={editVisible} onDismiss={closeEdit} />
      <DuplicateEvent
        event={event}
        visible={duplicateVisible}
        onDismiss={closeDuplicate}
        onSuccess={navigation.popToTop}
      />
      <Confirm
        title={`Delete "${title}"?`}
        visible={confirmVisible}
        onDismiss={closeConfirm}
        onConfirm={handleDelete}
      />
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
