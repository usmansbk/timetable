import {useNavigation} from '@react-navigation/native';
import {memo, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Appbar, Menu} from 'react-native-paper';
import AgendaFlatList from '~components/Agenda/AgendaFlatList';
import Confirm from '~components/Confirm';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {
  removeSchedule,
  selectScheduleEventsById,
  ScheduleEntity,
} from '~redux/timetable/slice';
import {EventInput} from '~types';
import ScheduleInfo from './ScheduleInfo';

interface Props {
  schedule: ScheduleEntity;
}

type MenuOptionKey = 'edit' | 'delete' | 'duplicate' | 'more';

function ScheduleDetails({schedule}: Props) {
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

  const [infoVisible, setInfoVisible] = useState(false);
  const closeInfo = useCallback(() => setInfoVisible(false), []);
  const openInfo = useCallback(() => setInfoVisible(true), []);

  const handleMenuPress = useCallback(
    (key: MenuOptionKey) => () => {
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
      } else if (key === 'more') {
        openInfo();
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

  return (
    <>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title={title} />
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
          <Menu.Item onPress={handleMenuPress('more')} title={t('More')} />
        </Menu>
      </Appbar.Header>
      <AgendaFlatList
        items={events as EventInput[]}
        onPressItem={onPressItem}
        listEmptyMessage={t('No Events')}
      />
      <Confirm
        visible={confirmVisible}
        onDismiss={closeConfirm}
        onConfirm={handleDelete}
        title={t('confirm_delete_schedule', {title: schedule.title})}
      />
      <ScheduleInfo
        visible={infoVisible}
        onDismiss={closeInfo}
        schedule={schedule}
      />
    </>
  );
}

export default memo(ScheduleDetails);
