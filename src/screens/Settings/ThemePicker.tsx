import {memo, useCallback} from 'react';
import {View} from 'react-native';
import {Button, Dialog, Portal, RadioButton} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '~redux/hooks';
import {selectAppTheme, setTheme} from '~redux/settings/slice';
import {AppSchemeName} from '~types';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

const themes: AppSchemeName[] = ['system', 'light', 'dark'];

function ThemePicker({visible, onDismiss}: Props) {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectAppTheme);
  const setAppTheme = useCallback(
    (value: AppSchemeName) => dispatch(setTheme(value)),
    [],
  );

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{t('Theme')}</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group
            value={theme as string}
            onValueChange={value => setAppTheme(value as AppSchemeName)}>
            {themes.map(value => (
              <RadioButton.Item
                key={value}
                value={value as string}
                label={t(`theme_${value}`)}
              />
            ))}
          </RadioButton.Group>
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

export default memo(ThemePicker);
