import {memo, useCallback, useMemo, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Button, Checkbox, Dialog, Divider, Portal} from 'react-native-paper';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import DateTimeInput from '~components/DateTimeInput';
import Select from '~components/Select';
import {Recurrence} from '~types';
import {formatRecurrence} from '~utils/event';
import PickerInput from '~components/PickerInput';
import {formatDateMonthPosition} from '~utils/date';
import DayPicker from './DayPicker';

interface Props {
  value?: Recurrence | null;
  onChange: (value: Recurrence | null) => void;
  error?: boolean;
  date: string;
}

export const schema = yup.object<Record<keyof Recurrence, yup.AnySchema>>({
  freq: yup.string().required(),
  until: yup.string().nullable().optional(),
  weekdays: yup.array(yup.number()).nullable().optional(),
  byMonthDayPosition: yup.boolean().nullable().optional(),
});

function RepeatInput({onChange, value, error, date}: Props) {
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
    formState: {errors},
    setValue,
  } = useForm<Recurrence>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: value ?? undefined,
  });

  const onSubmit = handleSubmit(values => {
    onChange(schema.cast(values, {stripUnknown: true}));
    closeForm();
  });

  return (
    <View>
      <PickerInput
        multiline
        value={value ? formatRecurrence(value) : ''}
        label={t('Repeat') as string}
        icon="repeat"
        onClear={() => onChange(null)}
        error={error}
        onPress={openForm}
        optional
      />
      <Portal>
        <Dialog visible={open} onDismiss={closeForm}>
          <Dialog.Title>{t('Recurrence')}</Dialog.Title>
          <Dialog.Content>
            <Controller
              control={control}
              name="freq"
              render={({field: {onChange, value}}) => (
                <>
                  <Select
                    icon="repeat"
                    value={value}
                    onChange={onChange}
                    label={t('Repeat')}
                    options={options}
                    error={!!errors.freq}
                  />
                  {false && value === 'WEEKLY' && (
                    <Controller
                      control={control}
                      name="weekdays"
                      render={({field: {value, onChange}}) => (
                        <DayPicker value={value || []} onChange={onChange} />
                      )}
                    />
                  )}
                  {false && value === 'MONTHLY' && (
                    <Controller
                      control={control}
                      name="byMonthDayPosition"
                      render={({field: {onChange, value}}) => {
                        const {position, formattedDay, day} =
                          formatDateMonthPosition(date);
                        return (
                          <Checkbox.Item
                            label={t('date_month_pos', {
                              count: position,
                              formattedDay,
                              ordinal: true,
                            })}
                            status={value ? 'checked' : 'unchecked'}
                            onPress={() => {
                              onChange(!value);
                            }}
                          />
                        );
                      }}
                    />
                  )}
                </>
              )}
            />
            <Divider />
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
                  error={!!errors.until}
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
