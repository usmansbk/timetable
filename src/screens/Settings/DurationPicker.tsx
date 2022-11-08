import {memo, useCallback} from 'react';
import {View} from 'react-native';
import {Button, Dialog, Portal, RadioButton} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {
  selectDefaultEventDuration,
  setDefaultEventDuration,
} from '~redux/settings/slice';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

const durations = [15, 20, 30, 45, 60, 90, 120];

function DurationPicker({visible, onDismiss}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const value = useAppSelector(selectDefaultEventDuration);
  const setDuration = useCallback(
    (value: number) => dispatch(setDefaultEventDuration(value)),
    [],
  );

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Content>
          <RadioButton.Group
            value={String(value)}
            onValueChange={value => setDuration(Number.parseInt(value, 10))}>
            {durations.map(value => (
              <RadioButton.Item
                key={value}
                value={String(value)}
                label={t('duration', {minutes: value})}
              />
            ))}
          </RadioButton.Group>
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

export default memo(DurationPicker);
