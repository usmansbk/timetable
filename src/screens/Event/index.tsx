import {memo, useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import EmptyState from '~components/EmptyState';
import {useAppSelector} from '~redux/hooks';
import {selectEventById} from '~redux/timetable/timetableSlice';
import {RootStackScreenProps} from '~types';

function Event({route, navigation}: RootStackScreenProps<'Event'>) {
  const {id} = route.params;
  const event = useAppSelector(state => selectEventById(state, id));

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
        <Appbar.Action icon="pencil-outline" />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <Text variant="headlineLarge">{title}</Text>
      </ScrollView>
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
