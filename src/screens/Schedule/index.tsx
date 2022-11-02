import {useNavigation} from '@react-navigation/native';
import {memo, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Appbar, Menu} from 'react-native-paper';
import AgendaList from '~components/AgendaList';
import Confirm from '~components/Confirm';
import EmptyState from '~components/EmptyState';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {
  removeSchedule,
  selectScheduleById,
  selectScheduleEventsById,
} from '~redux/timetable/slice';
import {EventInput, RootStackScreenProps} from '~types';

const Items = memo(({scheduleId}: {scheduleId: string}) => {
  const events = useAppSelector(state =>
    selectScheduleEventsById(state, scheduleId),
  );

  const navigation = useNavigation();

  const onPressItem = useCallback(
    (item: EventInput) => {
      if (item.id) {
        navigation.navigate('Event', {
          id: item.id,
        });
      }
    },
    [navigation],
  );

  return (
    <AgendaList items={events as EventInput[]} onPressItem={onPressItem} />
  );
});

export default function Schedule({
  navigation,
  route,
}: RootStackScreenProps<'Schedule'>) {
  const {t} = useTranslation();
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

  useEffect(() => {
    if (schedule) {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [schedule, navigation]);

  if (!schedule) {
    return <EmptyState title={t('Schedule does not exist')} />;
  }

  return (
    <>
      <Appbar.Header elevated mode="center-aligned">
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title={schedule?.title} />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
          <Menu.Item onPress={handleMenuPress('edit')} title={t('Edit')} />
          <Menu.Item
            onPress={handleMenuPress('duplicate')}
            title={t('Duplicate')}
          />
          <Menu.Item onPress={handleMenuPress('delete')} title={t('Delete')} />
        </Menu>
      </Appbar.Header>
      <Items scheduleId={schedule.id} />
      <Confirm
        visible={confirmVisible}
        onDismiss={closeConfirm}
        onConfirm={handleDelete}
        title={t('confirm_delete_schedule', {title: schedule.title})}
      />
    </>
  );
}
