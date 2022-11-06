import {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Divider,
  Modal,
  Portal,
  Subheading,
  Title,
  useTheme,
} from 'react-native-paper';
import {ScheduleEntity} from '~redux/timetable/slice';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  schedule: ScheduleEntity;
}

function ScheduleInfo({visible, onDismiss, schedule}: Props) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {title, events} = schedule;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.contentContainer,
          {
            backgroundColor: colors.background,
          },
        ]}>
        <Appbar.Header elevated>
          <Appbar.Action icon="close" onPress={onDismiss} />
        </Appbar.Header>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={[styles.heading, styles.content]}>
            <Title style={styles.title}>{title}</Title>
            <Subheading>{t('events_count', {count: events.length})}</Subheading>
          </View>
          <Divider />
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  heading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
});

export default memo(ScheduleInfo);
