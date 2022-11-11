import {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Searchbar} from 'react-native-paper';
import AgendaFlatList from '~components/Agenda/AgendaFlatList';
import {useAppSelector} from '~redux/hooks';
import {selectAllEvents} from '~redux/timetable/slice';
import {EventInput, RootStackScreenProps} from '~types';

function Search({navigation}: RootStackScreenProps<'Search'>) {
  const {t} = useTranslation();
  const events = useAppSelector(selectAllEvents);
  const [searchQuery, setSearchQuery] = useState('');

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
      <Searchbar
        autoFocus
        icon="arrow-left"
        value={searchQuery}
        placeholder={t('Search')}
        onChangeText={setSearchQuery}
        onIconPress={navigation.goBack}
      />

      <AgendaFlatList
        items={events.filter(
          item =>
            searchQuery &&
            item.title
              .toLocaleLowerCase()
              .includes(searchQuery.toLocaleLowerCase()),
        )}
        onPressItem={onPressItem}
      />
    </>
  );
}

export default Search;
