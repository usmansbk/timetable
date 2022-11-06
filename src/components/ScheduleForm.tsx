import {useCallback, useEffect, useMemo, useState} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {FAB, HelperText, TextInput} from 'react-native-paper';
import {useForm, Controller, useFieldArray} from 'react-hook-form';
import {useFocusEffect} from '@react-navigation/native';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useTranslation} from 'react-i18next';
import omit from 'lodash.omit';
import {EventInput, FieldError, ScheduleInput} from '~types';
import Confirm from './Confirm';
import EventForm from './EventForm';
import AgendaList from './Agenda/AgendaList';

interface Props {
  autoFocus?: boolean;
  onDiscard: () => void;
  onSubmit: (input: ScheduleInput) => void;
  defaultValues?: ScheduleInput;
  fieldErrors?: FieldError<ScheduleInput>[];
}

export default function ScheduleForm({
  autoFocus,
  onDiscard,
  onSubmit,
  defaultValues,
  fieldErrors,
}: Props) {
  const {t} = useTranslation();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [addEventVisible, setAddEventVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const closeConfirmDialog = useCallback(() => setConfirmVisible(false), []);
  const closeAddEventForm = useCallback(() => {
    setAddEventVisible(false);
    setSelectedDate(null);
  }, []);
  const closeEditEventForm = useCallback(() => setEditIndex(null), []);

  const onPressDuplicate = useCallback(() => setAddEventVisible(true), []);

  const schema = useMemo(
    () =>
      yup
        .object<Record<keyof ScheduleInput, yup.AnySchema>>({
          id: yup.string().optional(),
          title: yup
            .string()
            .trim()
            .max(80, () => t('Title too long'))
            .required(() => t('Add a Title')),
          events: yup
            .array()
            .min(1, () => t('Add Events'))
            .required(),
        })
        .required(),
    [t],
  );

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors, touchedFields, isDirty},
    reset,
  } = useForm<ScheduleInput>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });

  const onSubmitForm = handleSubmit(values =>
    onSubmit(schema.cast(values, {stripUnknown: true})),
  );

  const {fields, append, update, remove} = useFieldArray({
    control,
    name: 'events',
    keyName: 'key',
  });

  const onPressItem = useCallback(
    (item: EventInput & {key?: string}) => {
      const index = fields.findIndex(field => field.key === item.key);
      setEditIndex(index);
    },
    [fields],
  );

  const onPressDate = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const onAddItem = useCallback(
    (input: EventInput) => {
      const values = omit(input, 'id');
      append(values);
      closeAddEventForm();
      closeEditEventForm();
    },
    [append],
  );

  const onRemoveItem = useCallback(() => {
    if (editIndex !== null) {
      remove(editIndex);
      closeEditEventForm();
    }
  }, [remove, editIndex]);

  const onUpdateItem = useCallback(
    (input: EventInput) => {
      if (editIndex !== null) {
        update(editIndex, input);
        closeEditEventForm();
      }
    },
    [update, editIndex],
  );

  const onCancel = useCallback(() => {
    if (isDirty) {
      setConfirmVisible(true);
    } else {
      onDiscard();
    }
  }, [onDiscard, isDirty]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isDirty) {
          setConfirmVisible(true);
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [isDirty]),
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (!!errors.events && Object.keys(errors).length === 1) {
      setAddEventVisible(true);
    }
  }, [errors]);

  useEffect(() => {
    fieldErrors?.forEach(({name, message}) => {
      setError(name, {message});
    });
  }, [fieldErrors]);

  const editItem =
    editIndex !== null
      ? fields[editIndex]
      : selectedDate
      ? {startDate: selectedDate}
      : undefined;

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="title"
        render={({field: {onBlur, onChange, value}}) => (
          <TextInput
            autoFocus={autoFocus}
            theme={{
              roundness: 0,
            }}
            placeholder={t('Add title')}
            left={<TextInput.Icon icon="close" onPress={onCancel} />}
            right={<TextInput.Icon icon="check" onPress={onSubmitForm} />}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={touchedFields.title && !!errors.title}
          />
        )}
      />
      {touchedFields.title && !!errors.title && (
        <HelperText visible type="error">
          {errors.title.message}
        </HelperText>
      )}
      <AgendaList
        items={fields}
        listEmptyMessage={t('Add Events')}
        onPressItem={onPressItem}
        onPressDayHeader={onPressDate}
      />
      <FAB
        icon="calendar"
        style={styles.fab}
        onPress={() => setAddEventVisible(true)}
      />
      <EventForm
        title={t('Edit')}
        visible={editIndex !== null}
        onDismiss={closeEditEventForm}
        onSubmit={onUpdateItem}
        onDiscard={onRemoveItem}
        defaultValues={editItem}
        onPressDuplicate={onPressDuplicate}
      />
      <EventForm
        autoFocus
        title={editIndex !== null ? t('Copy') : undefined}
        resetOnSubmit={!editItem}
        visible={addEventVisible || selectedDate !== null}
        onDismiss={closeAddEventForm}
        onSubmit={onAddItem}
        defaultValues={editItem}
      />
      <Confirm
        visible={confirmVisible}
        onDismiss={closeConfirmDialog}
        title={t('Discard edit?')}
        onConfirm={onDiscard}
      />
    </View>
  );
}

ScheduleForm.defaultProps = {
  defaultValues: {
    title: '',
    events: [],
  } as Partial<ScheduleInput>,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 48,
  },
});
