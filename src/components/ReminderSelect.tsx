import {memo, useCallback} from 'react';
import {View} from 'react-native';
import {Button, Checkbox, Dialog, Portal} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {ReminderKey} from '~types';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  values: {[key: string]: boolean};
  onChange: (key: ReminderKey) => void;
}

const reminders: {label: string; key: ReminderKey}[] = [
  {
    label: 'Exact time',
    key: 'exact',
  },
  {
    label: '10 minutes before',
    key: '10m',
  },
  {
    label: '15 minutes before',
    key: '15m',
  },
  {
    label: '30 minutes before',
    key: '30m',
  },
  {
    label: '1 hour before',
    key: '1h',
  },
  {
    label: '2 hours before',
    key: '2h',
  },
  {
    label: '1 day before',
    key: '1d',
  },
];

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
          {reminders.map(({key, label}) => (
            <Checkbox.Item
              key={key}
              label={t(label)}
              status={values[key] ? 'checked' : 'unchecked'}
              onPress={handleChange(key)}
            />
          ))}
        </Dialog.Content>
        <Dialog.Actions>
          <View>
            <Button uppercase onPress={onDismiss}>
              {t('Cancel')}
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default memo(ReminderSelect);
