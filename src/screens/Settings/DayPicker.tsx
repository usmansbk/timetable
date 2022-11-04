import {memo, useCallback} from 'react';
import {View} from 'react-native';
import {Button, Dialog, Portal, RadioButton} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {selectStartOfWeek, setStartOfWeek} from '~redux/settings/slice';
import {DAYS_OF_WEEK, formatDay} from '~utils/date';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

function DayPicker({visible, onDismiss}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const startOfWeek = useAppSelector(selectStartOfWeek);
  const onChange = useCallback((value: string) => {
    dispatch(setStartOfWeek(Number.parseInt(value, 10)));
  }, []);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{t('Start the week on')}</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group
            value={String(startOfWeek)}
            onValueChange={onChange}>
            {DAYS_OF_WEEK.map(day => (
              <RadioButton.Item
                label={formatDay(day)}
                key={day}
                value={String(day)}
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

export default memo(DayPicker);
