import {memo, useCallback, useState} from 'react';
import {Appbar, Menu} from 'react-native-paper';
import AgendaList from '~components/AgendaList';
import Confirm from '~components/Confirm';
import EmptyState from '~components/EmptyState';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {
  removeSchedule,
  selectScheduleById,
  selectScheduleEventsById,
} from '~redux/timetable/timetableSlice';
import {EventInput, RootStackScreenProps} from '~types';

const Items = memo(({scheduleId}: {scheduleId: string}) => {
  const events = useAppSelector(state =>
    selectScheduleEventsById(state, scheduleId),
  );

  return (
    <AgendaList items={events as EventInput[]} onPressItem={console.log} />
  );
});

export default function Schedule({
  navigation,
  route,
}: RootStackScreenProps<'Schedule'>) {
  const {id} = route.params;
  const dispatch = useAppDispatch();
  const schedule = useAppSelector(state => selectScheduleById(state, id));

  const [menuVisible, setOpenMenu] = useState(false);
  const closeMenu = useCallback(() => setOpenMenu(false), []);
  const openMenu = useCallback(() => setOpenMenu(true), []);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const closeConfirm = useCallback(() => setConfirmVisible(false), []);
  const openConfirm = useCallback(() => setConfirmVisible(true), []);

  const handleMenuPress = useCallback(
    (key: 'edit' | 'delete' | 'duplicate') => () => {
      closeMenu();

      if (key === 'edit') {
        navigation.navigate('EditSchedule', {
          id,
        });
      } else if (key === 'duplicate') {
        navigation.navigate('DuplicateSchedule', {
          id,
        });
      } else if (key === 'delete') {
        openConfirm();
      }
    },
    [navigation, id],
  );

  const handleDelete = useCallback(() => {
    navigation.pop();
    dispatch(removeSchedule(id));
  }, [id, navigation]);

  return (
    <>
      <Appbar.Header elevated mode="center-aligned">
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title={schedule?.title} />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
          <Menu.Item
            onPress={handleMenuPress('edit')}
            title="Edit"
            leadingIcon="pencil-outline"
          />
          <Menu.Item
            onPress={handleMenuPress('duplicate')}
            title="Duplicate"
            leadingIcon="content-copy"
          />
          <Menu.Item
            onPress={handleMenuPress('delete')}
            title="Delete"
            leadingIcon="delete-outline"
          />
        </Menu>
      </Appbar.Header>
      {schedule ? (
        <>
          <Items scheduleId={schedule.id} />
          <Confirm
            visible={confirmVisible}
            onDismiss={closeConfirm}
            onConfirm={handleDelete}
            title={`Delete "${schedule.title}"`}
          />
        </>
      ) : (
        <EmptyState title="Schedule does not exist" />
      )}
    </>
  );
}
