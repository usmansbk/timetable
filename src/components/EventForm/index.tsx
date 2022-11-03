import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Appbar,
  HelperText,
  Modal,
  Portal,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTranslation} from 'react-i18next';
import * as yup from 'yup';
import {EventInput} from '~types';
import {formatToUTCdate} from '~utils/date';
import DateTimeInput from '../DateTimeInput';
import Confirm from '../Confirm';
import Select, {SelectOption} from '../Select';
import RepeatInput, {schema as repeatSchema} from './RepeatInput';

interface Props {
  autoFocus?: boolean;
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (input: EventInput) => void;
  onDiscard?: () => void;
  onPressDuplicate?: () => void;
  title?: string;
  defaultValues?: EventInput;
  resetOnSubmit?: boolean;
  schedules?: SelectOption[];
}

function EventForm({
  visible,
  autoFocus,
  onDismiss,
  onSubmit,
  onDiscard,
  onPressDuplicate,
  title,
  defaultValues,
  resetOnSubmit,
  schedules,
}: Props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const openConfirm = useCallback(() => setConfirmVisible(true), []);
  const closeConfirm = useCallback(() => setConfirmVisible(false), []);

  const schema = useMemo(
    () =>
      yup
        .object<Record<keyof EventInput, yup.AnySchema>>({
          id: yup.string().optional(),
          title: yup
            .string()
            .trim()
            .max(80, () => t('Title too long'))
            .required(() => t('Add a Title')),
          startDate: yup.string().required(),
          startTime: yup.string().nullable().optional(),
          endTime: yup.string().nullable().optional(),
          scheduleId: yup.string().nullable().optional(),
          repeat: repeatSchema.nullable().optional(),
          description: yup
            .string()
            .trim()
            .max(700, () => t('Description too long'))
            .nullable()
            .optional(),
        })
        .required(),
    [t],
  );

  const {
    control,
    handleSubmit,
    formState: {errors, touchedFields},
    reset,
  } = useForm<EventInput>({
    resolver: yupResolver(schema),
  });

  const handleReset = useCallback(() => {
    reset(
      Object.assign(
        {
          title: '',
          startDate: formatToUTCdate(new Date()),
          startTime: null,
          endTime: null,
          scheduleId: null,
          repeat: null,
          description: null,
        },
        defaultValues,
      ),
    );
  }, [reset, defaultValues]);

  const _onSubmit = handleSubmit(values => {
    onSubmit(schema.cast(values, {stripUnknown: true}));
    if (resetOnSubmit) {
      handleReset();
    }
  });

  const handleDiscard = useCallback(() => {
    onDiscard?.();
    onDismiss();
  }, [onDiscard, onDismiss]);

  useEffect(() => {
    if (visible) {
      handleReset();
    }
  }, [visible, handleReset]);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} style={styles.container}>
        <Appbar.Header>
          <Appbar.Action icon="close" onPress={onDismiss} />
          <Appbar.Content title={title} />
          {!!onPressDuplicate && (
            <Appbar.Action icon="content-copy" onPress={onPressDuplicate} />
          )}
          {!!onDiscard && (
            <Appbar.Action icon="trash-can-outline" onPress={openConfirm} />
          )}
          <Appbar.Action icon="check" onPress={_onSubmit} />
        </Appbar.Header>
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            backgroundColor: colors.background,
          }}>
          <Controller
            control={control}
            name="title"
            render={({field: {onBlur, onChange, value}}) => (
              <TextInput
                autoFocus={autoFocus}
                label={t('Title') as string}
                placeholder={defaultValues?.title}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.title}
              />
            )}
          />
          {errors.title && !!touchedFields.title && (
            <HelperText type="error" visible>
              {errors.title.message}
            </HelperText>
          )}
          <Controller
            control={control}
            name="startDate"
            render={({field: {onChange, value}}) => (
              <DateTimeInput
                label={t('Date')}
                onChange={onChange}
                value={value}
                mode="date"
                error={!!errors.startDate}
              />
            )}
          />
          <View style={styles.row}>
            <View style={styles.time}>
              <Controller
                control={control}
                name="startTime"
                render={({field: {onChange, value}}) => (
                  <DateTimeInput
                    optional
                    label={t('From')}
                    onChange={onChange}
                    value={value}
                    mode="time"
                  />
                )}
              />
            </View>
            <View style={styles.time}>
              <Controller
                control={control}
                name="endTime"
                render={({field: {onChange, value}}) => (
                  <DateTimeInput
                    optional
                    label={t('To')}
                    onChange={onChange}
                    value={value}
                    mode="time"
                  />
                )}
              />
            </View>
          </View>
          {!!schedules?.length && (
            <Controller
              control={control}
              name="scheduleId"
              render={({field: {onChange, value}}) => (
                <Select
                  optional
                  icon="view-day-outline"
                  label={t('Schedule')}
                  value={value}
                  onChange={onChange}
                  options={schedules}
                />
              )}
            />
          )}
          <Controller
            control={control}
            name="repeat"
            render={({field: {value, onChange}}) => (
              <RepeatInput
                onChange={onChange}
                value={value}
                error={!!errors.repeat}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({field: {onBlur, onChange, value}}) => (
              <TextInput
                left={<TextInput.Icon icon="text" />}
                multiline
                label={t('Description') as string}
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.description}
              />
            )}
          />
          {errors.description && !!touchedFields.description && (
            <HelperText type="error" visible>
              {errors.description.message}
            </HelperText>
          )}
        </ScrollView>
      </Modal>
      <Confirm
        title={t('Delete?')}
        visible={confirmVisible}
        onConfirm={handleDiscard}
        onDismiss={closeConfirm}
      />
    </Portal>
  );
}

export default memo(EventForm);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
  },
  time: {
    flex: 1,
  },
});
