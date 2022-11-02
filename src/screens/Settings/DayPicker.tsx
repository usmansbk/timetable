import {memo, useCallback} from 'react';
import {Dialog, Portal, RadioButton} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {selectStartOfWeek, setStartOfWeek} from '~redux/settings/slice';
import {DAYS_OF_WEEK, formatDay} from '~utils/date';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

function DayPicker({visible, onDismiss}: Props) {
  const dispatch = useAppDispatch();
  const startOfWeek = useAppSelector(selectStartOfWeek);
  const onChange = useCallback((value: string) => {
    dispatch(setStartOfWeek(Number.parseInt(value, 10)));
  }, []);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Start the week on</Dialog.Title>
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
      </Dialog>
    </Portal>
  );
}

export default memo(DayPicker);
