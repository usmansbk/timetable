import {memo, useCallback} from 'react';
import {Dialog, Portal, RadioButton} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {selectAppTheme, setTheme} from '~redux/settings/slice';
import {AppSchemeName} from '~types';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

const themes: AppSchemeName[] = ['system', 'light', 'dark'];

function ThemePicker({visible, onDismiss}: Props) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectAppTheme);
  const setAppTheme = useCallback(
    (value: AppSchemeName) => dispatch(setTheme(value)),
    [],
  );

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Theme</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group
            value={theme as string}
            onValueChange={value => setAppTheme(value as AppSchemeName)}>
            {themes.map(value => (
              <RadioButton.Item
                key={value}
                value={value as string}
                label={value as string}
              />
            ))}
          </RadioButton.Group>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

export default memo(ThemePicker);
