import {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {FAB, TextInput} from 'react-native-paper';
import EmptyState from './EmptyState';

interface Props {
  autoFocus?: boolean;
  onDiscard: () => void;
  onSubmit: () => void;
}

export default function ScheduleForm({autoFocus, onDiscard, onSubmit}: Props) {
  const handleDiscard = useCallback(() => {
    onDiscard();
  }, [onDiscard]);

  const handleSubmit = () => onSubmit();

  return (
    <View style={styles.container}>
      <TextInput
        autoFocus={autoFocus}
        theme={{
          roundness: 0,
        }}
        placeholder="Title"
        left={<TextInput.Icon icon="close" onPress={handleDiscard} />}
        right={<TextInput.Icon icon="check" onPress={handleSubmit} />}
      />
      <EmptyState title="Add Events" />
      <FAB icon="calendar-today" style={styles.fab} onPress={() => null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 48,
  },
});
