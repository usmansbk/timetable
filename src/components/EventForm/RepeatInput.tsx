import {memo, useCallback, useMemo, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import DateTimeInput from '~components/DateTimeInput';
import Select from '~components/Select';
import {Recurrence} from '~types';
import {formatRecurrence} from './util';

interface Props {
  value?: Recurrence;
  onChange: (value: Recurrence | null) => void;
  error?: boolean;
}

export const schema = yup.object<Record<keyof Recurrence, yup.AnySchema>>({
  freq: yup.string().required(),
  until: yup.string().optional(),
});

function RepeatInput({onChange, value, error}: Props) {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);

  const openForm = useCallback(() => setOpen(true), []);
  const closeForm = useCallback(() => setOpen(false), []);

  const options = useMemo<{value: Recurrence['freq']; label: string}[]>(
    () => [
      {
        value: 'DAILY',
        label: t('Every day'),
      },
      {
        value: 'WEEKLY',
        label: t('Every week'),
      },
      {
        value: 'MONTHLY',
        label: t('Every month'),
      },
      {
        value: 'YEARLY',
        label: t('Every year'),
      },
    ],
    [t],
  );

  const {
    control,
    handleSubmit,
    formState: {errors, touchedFields},
  } = useForm<Recurrence>({
    resolver: yupResolver(schema),
    reValidateMode: 'onSubmit',
    defaultValues: value,
  });

  const onSubmit = handleSubmit(values => {
    onChange(values);
    closeForm();
  });

  return (
    <View>
      <TouchableRipple onPress={openForm}>
        <TextInput
          value={value && formatRecurrence(value)}
          label={t('Repeat') as string}
          editable={false}
          left={<TextInput.Icon icon="repeat" />}
          right={
            value ? (
              <TextInput.Icon icon="close" onPress={() => onChange(null)} />
            ) : null
          }
          error={error}
        />
      </TouchableRipple>
      <Portal>
        <Dialog visible={open} onDismiss={closeForm}>
          <Dialog.Title>{t('Recurrence')}</Dialog.Title>
          <Dialog.Content>
            <Controller
              control={control}
              name="freq"
              render={({field: {onChange, value}}) => (
                <Select
                  icon="repeat"
                  value={value}
                  onChange={onChange}
                  label={t('Repeat')}
                  options={options}
                  error={touchedFields.freq && !!errors.freq?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="until"
              render={({field: {onChange, value}}) => (
                <DateTimeInput
                  optional
                  mode="date"
                  value={value}
                  label={t('Until')}
                  onChange={onChange}
                />
              )}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <View>
              <Button mode="contained-tonal" onPress={closeForm}>
                {t('Cancel')}
              </Button>
            </View>
            <View>
              <Button mode="contained" onPress={onSubmit}>
                {t('Done')}
              </Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

export default memo(RepeatInput);
