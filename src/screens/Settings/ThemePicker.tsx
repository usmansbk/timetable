import {memo, useCallback} from 'react';
import {Dialog, Portal, RadioButton} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {selectAppTheme, setTheme} from '~redux/settings/slice';
import {AppSchemeName} from '~types';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

const themes: {key: AppSchemeName; label: string}[] = [
  {key: 'system', label: 'Auto'},
  {key: 'light', label: 'Light'},
  {key: 'dark', label: 'Dark'},
];

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
            value={theme || ''}
            onValueChange={value => setAppTheme(value as AppSchemeName)}>
            {themes.map(({key, label}) => (
              <RadioButton.Item value={key as string} label={label} />
            ))}
          </RadioButton.Group>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

export default memo(ThemePicker);
