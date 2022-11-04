import {memo, useCallback} from 'react';
import {View} from 'react-native';
import {Button, Checkbox, Dialog, Portal} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {Reminder, ReminderKey} from '~types';
import {DEFAULT_REMINDERS} from '~constants';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  values: Reminder;
  onChange: (key: ReminderKey) => void;
}

const reminders = Object.keys(DEFAULT_REMINDERS);

function ReminderSelect({visible, onDismiss, values, onChange}: Props) {
  const {t} = useTranslation();
  const handleChange = useCallback(
    (key: ReminderKey) => () => {
      onChange(key);
    },
    [onChange],
  );

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Content>
          {reminders.map(key => (
            <Checkbox.Item
              key={key}
              label={t(key)}
              status={values[key as ReminderKey] ? 'checked' : 'unchecked'}
              onPress={handleChange(key as ReminderKey)}
            />
          ))}
        </Dialog.Content>
        <Dialog.Actions>
          <View>
            <Button uppercase onPress={onDismiss}>
              {t('Done')}
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default memo(ReminderSelect);
