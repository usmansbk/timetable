import {useNavigation} from '@react-navigation/native';
import {memo, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Appbar, Menu} from 'react-native-paper';
import Agenda from '~components/Agenda';
import Confirm from '~components/Confirm';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {
  removeSchedule,
  selectScheduleEventsById,
  ScheduleEntity,
} from '~redux/timetable/slice';
import {EventInput} from '~types';

function ScheduleDetails({schedule}: {schedule: ScheduleEntity}) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const {id, title} = schedule;
  const events = useAppSelector(state => selectScheduleEventsById(state, id));

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
    navigation.goBack();
    dispatch(removeSchedule(id));
  }, [id, navigation]);

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

  const renderLeft = useCallback(
    () => <Appbar.BackAction onPress={navigation.goBack} />,
    [],
  );

  const renderRight = useCallback(
    () => (
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
    ),
    [menuVisible, closeConfirm, openMenu, handleMenuPress],
  );

  return (
    <>
      <Agenda
        title={title}
        items={events as EventInput[]}
        onPressItem={onPressItem}
        renderLeft={renderLeft}
        renderRight={renderRight}
      />
      <Confirm
        visible={confirmVisible}
        onDismiss={closeConfirm}
        onConfirm={handleDelete}
        title={t('confirm_delete_schedule', {title: schedule.title})}
      />
    </>
  );
}

export default memo(ScheduleDetails);
