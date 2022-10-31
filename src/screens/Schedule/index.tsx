import {memo, useCallback, useState} from 'react';
import {Appbar, Menu} from 'react-native-paper';
import AgendaList from '~components/AgendaList';
import EmptyState from '~components/EmptyState';
import {useAppSelector} from '~redux/hooks';
import {
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
  const schedule = useAppSelector(state => selectScheduleById(state, id));

  const [menuVisible, setOpenMenu] = useState(false);
  const closeMenu = useCallback(() => setOpenMenu(false), []);
  const openMenu = useCallback(() => setOpenMenu(true), []);

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
            onPress={() => null}
            title="Edit"
            leadingIcon="pencil-outline"
          />
          <Menu.Item
            onPress={() => null}
            title="Duplicate"
            leadingIcon="content-copy"
          />
          <Menu.Item
            onPress={() => null}
            title="Delete"
            leadingIcon="delete-outline"
          />
        </Menu>
      </Appbar.Header>
      {schedule ? (
        <Items scheduleId={schedule.id} />
      ) : (
        <EmptyState title="Schedule does not exist" />
      )}
    </>
  );
}
