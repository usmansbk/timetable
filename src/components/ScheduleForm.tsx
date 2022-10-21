import {useCallback, useEffect, useMemo} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {FAB, HelperText, TextInput} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {useFocusEffect} from '@react-navigation/native';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {ScheduleFieldError, ScheduleInput} from '~types';
import EmptyState from './EmptyState';

interface Props {
  autoFocus?: boolean;
  onDiscard: () => void;
  onSubmit: (input: ScheduleInput) => void;
  defaultValues?: ScheduleInput;
  fieldErrors?: ScheduleFieldError[];
}

export default function ScheduleForm({
  autoFocus,
  onDiscard,
  onSubmit,
  defaultValues,
  fieldErrors,
}: Props) {
  const schema = useMemo(
    () =>
      yup
        .object({
          title: yup
            .string()
            .trim()
            .min(3, ({min}) => `Title must be at least ${min} characters`)
            .max(80, 'Title too long')
            .required('Add a Title'),
        })
        .required(),
    [],
  );

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors, touchedFields, isDirty},
  } = useForm<ScheduleInput>({
    defaultValues,
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });

  const handleDiscard = useCallback(() => {
    onDiscard();
  }, [onDiscard]);

  const _onSubmit = handleSubmit(onSubmit);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isDirty) {
          handleDiscard();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [isDirty, handleDiscard]),
  );

  useEffect(() => {
    fieldErrors?.forEach(({name, message}) => {
      setError(name, {message});
    });
  }, [fieldErrors]);

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
            placeholder="Title"
            left={<TextInput.Icon icon="close" onPress={handleDiscard} />}
            right={<TextInput.Icon icon="check" onPress={_onSubmit} />}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {touchedFields.title && !!errors.title && (
        <HelperText visible type="error">
          {errors.title.message}
        </HelperText>
      )}
      <EmptyState title="Add Events" />
      <FAB icon="calendar-today" style={styles.fab} onPress={() => null} />
    </View>
  );
}

ScheduleForm.defaultProps = {
  defaultValues: {
    title: '',
  } as ScheduleInput,
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
